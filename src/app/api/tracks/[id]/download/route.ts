import { NextResponse } from "next/server";
import { db } from "@/db";
import { downloadLogs, tracks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Para baixar as músicas gratuitamente para o seu dispositivo, faça seu cadastro gratuito ou entre na sua conta.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [track] = await db
      .select()
      .from(tracks)
      .where(eq(tracks.id, trackId))
      .limit(1);

    if (!track || !track.audioData) {
      return NextResponse.json(
        { error: "Arquivo de áudio não encontrado no PostgreSQL." },
        { status: 404 }
      );
    }

    // Increment downloads count and log download in PostgreSQL
    await db
      .update(tracks)
      .set({ downloadsCount: sql`${tracks.downloadsCount} + 1` })
      .where(eq(tracks.id, trackId));

    await db.insert(downloadLogs).values({
      trackId: track.id,
      userId: user.id,
      userEmail: user.email,
    });

    const buffer = Buffer.from(track.audioData, "base64");
    const safeFilename = `${track.author} - ${track.title} (${track.year}) [RM Studio Vinyl Rip].${track.audioFormat.toLowerCase()}`
      .replace(/[/\\?%*:|"<>]/g, "-");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": track.audioMimeType || "application/octet-stream",
        "Content-Length": String(buffer.byteLength),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error downloading track:", error);
    return NextResponse.json(
      { error: "Erro ao realizar download do PostgreSQL." },
      { status: 500 }
    );
  }
}
