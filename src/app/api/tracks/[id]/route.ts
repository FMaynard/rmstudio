import { NextResponse } from "next/server";
import { db } from "@/db";
import { tracks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/auth";

const ALLOWED_AUDIO_FORMATS = ["MP3", "FLAC", "WAV"];
const ALLOWED_COVER_FORMATS = ["JPG", "JPEG", "PNG", "BMP", "SVG", "GIF"];

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas o proprietário do RM Studio pode editar as faixas.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(tracks)
      .where(eq(tracks.id, trackId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Faixa não encontrada no PostgreSQL." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const author = String(formData.get("author") ?? existing.author).trim();
    const title = String(formData.get("title") ?? existing.title).trim();
    const genre = String(formData.get("genre") ?? existing.genre).trim();
    const yearRaw = String(formData.get("year") ?? existing.year).trim();
    const year = parseInt(yearRaw, 10);
    const albumName = String(
      formData.get("albumName") ?? existing.albumName ?? ""
    ).trim();
    const equipmentInfo = String(
      formData.get("equipmentInfo") ?? existing.equipmentInfo ?? ""
    ).trim();
    const removeCover = formData.get("removeCover") === "true";

    if (!author || !title || !genre || isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: "Dados inválidos. Verifique Autor, Nome da Faixa, Gênero e Ano." },
        { status: 400 }
      );
    }

    let audioFormat = existing.audioFormat;
    let audioMimeType = existing.audioMimeType;
    let audioFileName = existing.audioFileName;
    let audioFileSize = existing.audioFileSize;
    let audioData = existing.audioData;

    const audioFile = formData.get("audioFile") as File | null;
    if (audioFile && audioFile.size > 0) {
      const ext = audioFile.name.split(".").pop()?.toUpperCase() || "";
      if (!ALLOWED_AUDIO_FORMATS.includes(ext)) {
        return NextResponse.json(
          { error: "Formato de áudio inválido. Use MP3, FLAC ou WAV." },
          { status: 400 }
        );
      }
      audioFormat = ext;
      audioFileName = audioFile.name;
      audioFileSize = audioFile.size;
      audioMimeType =
        audioFile.type ||
        (ext === "MP3"
          ? "audio/mpeg"
          : ext === "FLAC"
            ? "audio/flac"
            : "audio/wav");
      const arrayBuffer = await audioFile.arrayBuffer();
      audioData = Buffer.from(arrayBuffer).toString("base64");
    }

    let coverFormat = existing.coverFormat;
    let coverMimeType = existing.coverMimeType;
    let coverData = existing.coverData;

    if (removeCover) {
      coverFormat = null;
      coverMimeType = null;
      coverData = null;
    }

    const coverFile = formData.get("coverFile") as File | null;
    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop()?.toUpperCase() || "";
      if (!ALLOWED_COVER_FORMATS.includes(ext)) {
        return NextResponse.json(
          {
            error:
              "Formato de capa inválido. Use JPG, JPEG, PNG, BMP, SVG ou GIF.",
          },
          { status: 400 }
        );
      }
      coverFormat = ext;
      coverMimeType =
        coverFile.type ||
        (ext === "SVG"
          ? "image/svg+xml"
          : ext === "JPG" || ext === "JPEG"
            ? "image/jpeg"
            : `image/${ext.toLowerCase()}`);
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      coverData = `data:${coverMimeType};base64,${coverBuffer.toString("base64")}`;
    }

    const [updated] = await db
      .update(tracks)
      .set({
        author,
        title,
        genre,
        year,
        albumName,
        equipmentInfo,
        audioFormat,
        audioMimeType,
        audioFileName,
        audioFileSize,
        audioData,
        coverFormat,
        coverMimeType,
        coverData,
        updatedAt: new Date(),
      })
      .where(eq(tracks.id, trackId))
      .returning({
        id: tracks.id,
        author: tracks.author,
        title: tracks.title,
        genre: tracks.genre,
        year: tracks.year,
        albumName: tracks.albumName,
        catalogNumber: tracks.catalogNumber,
        equipmentInfo: tracks.equipmentInfo,
        audioFormat: tracks.audioFormat,
        audioMimeType: tracks.audioMimeType,
        audioFileName: tracks.audioFileName,
        audioFileSize: tracks.audioFileSize,
        durationSeconds: tracks.durationSeconds,
        sampleRate: tracks.sampleRate,
        coverFormat: tracks.coverFormat,
        coverMimeType: tracks.coverMimeType,
        coverData: tracks.coverData,
        playsCount: tracks.playsCount,
        downloadsCount: tracks.downloadsCount,
        createdAt: tracks.createdAt,
        updatedAt: tracks.updatedAt,
      });

    return NextResponse.json({ track: updated });
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar a faixa no PostgreSQL." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas o proprietário do RM Studio pode excluir faixas.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    await db.delete(tracks).where(eq(tracks.id, trackId));

    return NextResponse.json({ success: true, deletedId: trackId });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json(
      { error: "Erro ao excluir faixa do PostgreSQL." },
      { status: 500 }
    );
  }
}
