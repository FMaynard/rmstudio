import { NextResponse } from "next/server";
import { db } from "@/db";
import { tracks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  try {
    const { id } = await context.params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [track] = await db
      .select({
        id: tracks.id,
        audioData: tracks.audioData,
        audioMimeType: tracks.audioMimeType,
        audioFileName: tracks.audioFileName,
      })
      .from(tracks)
      .where(eq(tracks.id, trackId))
      .limit(1);

    if (!track || !track.audioData) {
      return NextResponse.json(
        { error: "Áudio não encontrado no PostgreSQL." },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(track.audioData, "base64");
    const totalLength = buffer.byteLength;
    const rangeHeader = request.headers.get("range");

    // Increment play count on initial stream start
    if (!rangeHeader || rangeHeader.startsWith("bytes=0-")) {
      await db
        .update(tracks)
        .set({ playsCount: sql`${tracks.playsCount} + 1` })
        .where(eq(tracks.id, trackId));
    }

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;
      const chunkStart = Math.max(0, Math.min(start, totalLength - 1));
      const chunkEnd = Math.max(chunkStart, Math.min(end, totalLength - 1));
      const chunk = buffer.subarray(chunkStart, chunkEnd + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${totalLength}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunk.byteLength),
          "Content-Type": track.audioMimeType || "audio/wav",
          "Cache-Control": "no-store",
        },
      });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": String(totalLength),
        "Content-Type": track.audioMimeType || "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error streaming track:", error);
    return NextResponse.json(
      { error: "Erro ao transmitir áudio do PostgreSQL." },
      { status: 500 }
    );
  }
}
