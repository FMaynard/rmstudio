import { NextResponse } from "next/server";
import { db } from "@/db";
import { tracks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/auth";
import { generateVinylRipWavBase64 } from "@/lib/audio-generator";

const ALLOWED_AUDIO_FORMATS = ["MP3", "FLAC", "WAV"];
const ALLOWED_COVER_FORMATS = ["JPG", "JPEG", "PNG", "BMP", "SVG", "GIF"];

export async function GET() {
  await ensureSeeded();
  try {
    const rows = await db
      .select({
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
      })
      .from(tracks)
      .orderBy(desc(tracks.createdAt), desc(tracks.id));

    return NextResponse.json({ tracks: rows });
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json(
      { error: "Erro ao carregar o acervo de vinis do PostgreSQL." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas o proprietário do RM Studio tem permissão para fazer upload de músicas.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const author = String(formData.get("author") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const genre = String(formData.get("genre") || "").trim();
    const yearRaw = String(formData.get("year") || "").trim();
    const year = parseInt(yearRaw, 10);
    const albumName =
      String(formData.get("albumName") || "").trim() ||
      "Prensagem Original em Vinil 33⅓ RPM";
    const catalogNumber =
      String(formData.get("catalogNumber") || "").trim() ||
      `RM-LP-${Math.floor(100 + Math.random() * 899)}`;
    const equipmentInfo =
      String(formData.get("equipmentInfo") || "").trim() ||
      "Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze • Pré-Phono Valvulado";
    const sampleRate =
      String(formData.get("sampleRate") || "").trim() || "24-bit / 96kHz";
    const durationSecondsInput = parseInt(
      String(formData.get("durationSeconds") || "0"),
      10
    );

    if (!author || !title || !genre || isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json(
        {
          error:
            "Preencha corretamente [Autor], [Nome da Faixa], [Gênero] e [Ano] válido.",
        },
        { status: 400 }
      );
    }

    // Process Audio File from Computer / Hard Disk (MP3, FLAC, WAV)
    const audioFile = formData.get("audioFile") as File | null;
    const requestedAudioFormat = String(
      formData.get("audioFormat") || "FLAC"
    ).toUpperCase();

    let audioFormat = ALLOWED_AUDIO_FORMATS.includes(requestedAudioFormat)
      ? requestedAudioFormat
      : "FLAC";
    let audioMimeType = "audio/wav";
    let audioFileName = `${author.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.${audioFormat.toLowerCase()}`;
    let audioFileSize = 0;
    let audioDataBase64 = "";
    let durationSeconds =
      durationSecondsInput > 0 ? durationSecondsInput : 16;

    if (audioFile && audioFile.size > 0) {
      const ext =
        audioFile.name.split(".").pop()?.toUpperCase() || requestedAudioFormat;
      if (!ALLOWED_AUDIO_FORMATS.includes(ext)) {
        return NextResponse.json(
          {
            error:
              "Formato de áudio inválido. Apenas arquivos MP3, FLAC ou WAV são permitidos.",
          },
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
      audioDataBase64 = Buffer.from(arrayBuffer).toString("base64");
    } else {
      // Fallback synthesized vinyl rip if owner clicked quick-demo upload without selecting a local file
      const synth = generateVinylRipWavBase64({
        durationSec: 16,
        baseFreq: 196 + (year % 7) * 15,
        chordType: "maj7",
        tempoBpm: 88,
        crackleAmount: 0.017,
      });
      audioDataBase64 = synth.base64;
      audioFileSize = synth.byteLength;
      durationSeconds = synth.durationSeconds;
      audioMimeType = "audio/wav";
    }

    // Process Optional Cover File (JPG/JPEG/PNG/BMP/SVG/GIF)
    const coverFile = formData.get("coverFile") as File | null;
    let coverFormat: string | null = null;
    let coverMimeType: string | null = null;
    let coverData: string | null = null;

    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop()?.toUpperCase() || "";
      if (!ALLOWED_COVER_FORMATS.includes(ext)) {
        return NextResponse.json(
          {
            error:
              "Formato de capa inválido. Use apenas JPG, JPEG, PNG, BMP, SVG ou GIF (ou deixe sem capa).",
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

    const [created] = await db
      .insert(tracks)
      .values({
        author,
        title,
        genre,
        year,
        albumName,
        catalogNumber,
        equipmentInfo,
        audioFormat,
        audioMimeType,
        audioFileName,
        audioFileSize,
        durationSeconds,
        sampleRate,
        audioData: audioDataBase64,
        coverFormat,
        coverMimeType,
        coverData,
      })
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

    return NextResponse.json({ track: created }, { status: 201 });
  } catch (error) {
    console.error("Error uploading track:", error);
    return NextResponse.json(
      { error: "Erro ao salvar música no banco de dados PostgreSQL." },
      { status: 500 }
    );
  }
}
