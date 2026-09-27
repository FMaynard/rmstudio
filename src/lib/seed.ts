import { db, pool } from "@/db";
import { tracks, users } from "@/db/schema";
import { count } from "drizzle-orm";
import {
  generateVinylCoverDataUri,
  generateVinylRipWavBase64,
} from "./audio-generator";

let isInitialized = false;

export async function ensureSeeded() {
  if (isInitialized) return;

  try {
    // Ensure tables exist in PostgreSQL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'visitor',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tracks (
        id SERIAL PRIMARY KEY,
        author TEXT NOT NULL,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        year INTEGER NOT NULL,
        album_name TEXT DEFAULT 'Prensagem Original em Vinil 33⅓ RPM',
        catalog_number TEXT DEFAULT 'RM-LP-001',
        equipment_info TEXT DEFAULT 'Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze • Pré-Phono Valvulado',
        audio_format TEXT NOT NULL,
        audio_mime_type TEXT NOT NULL,
        audio_file_name TEXT NOT NULL,
        audio_file_size INTEGER NOT NULL,
        duration_seconds INTEGER NOT NULL DEFAULT 24,
        sample_rate TEXT NOT NULL DEFAULT '24-bit / 96kHz',
        audio_data TEXT NOT NULL,
        cover_format TEXT,
        cover_mime_type TEXT,
        cover_data TEXT,
        plays_count INTEGER NOT NULL DEFAULT 0,
        downloads_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS download_logs (
        id SERIAL PRIMARY KEY,
        track_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        user_email TEXT NOT NULL,
        downloaded_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Seed Users if empty
    const [{ value: userCount }] = await db.select({ value: count() }).from(users);
    if (userCount === 0) {
      await db.insert(users).values([
        {
          name: "RM Studio (Proprietário / Admin)",
          email: "admin@rmstudio.com",
          passwordHash: "rmstudio2025",
          role: "admin",
        },
        {
          name: "Carlos Eduardo (Visitante Cadastrado)",
          email: "visitante@rmstudio.com",
          passwordHash: "vinil2025",
          role: "visitor",
        },
      ]);
    }

    // Seed Tracks if empty
    const [{ value: trackCount }] = await db.select({ value: count() }).from(tracks);
    if (trackCount === 0) {
      const rip1 = generateVinylRipWavBase64({
        durationSec: 16,
        baseFreq: 220.0, // A3
        chordType: "maj7",
        tempoBpm: 84,
        crackleAmount: 0.016,
      });
      const rip2 = generateVinylRipWavBase64({
        durationSec: 18,
        baseFreq: 196.0, // G3
        chordType: "min7",
        tempoBpm: 92,
        crackleAmount: 0.018,
      });
      const rip3 = generateVinylRipWavBase64({
        durationSec: 15,
        baseFreq: 246.94, // B3
        chordType: "m9",
        tempoBpm: 76,
        crackleAmount: 0.015,
      });
      const rip4 = generateVinylRipWavBase64({
        durationSec: 17,
        baseFreq: 174.61, // F3
        chordType: "dom7",
        tempoBpm: 104,
        crackleAmount: 0.02,
      });
      const rip5 = generateVinylRipWavBase64({
        durationSec: 16,
        baseFreq: 261.63, // C4
        chordType: "maj7",
        tempoBpm: 88,
        crackleAmount: 0.014,
      });
      const rip6 = generateVinylRipWavBase64({
        durationSec: 15,
        baseFreq: 164.81, // E3
        chordType: "min7",
        tempoBpm: 96,
        crackleAmount: 0.019,
      });

      await db.insert(tracks).values([
        {
          author: "Arthur Verocai & Quarteto",
          title: "Na Boca do Sol (Prensagem 1972)",
          genre: "MPB / Soul",
          year: 1972,
          albumName: "LP Continental SLP-10.079 • 1ª Tiragem",
          catalogNumber: "RM-LP-072",
          equipmentInfo: "Garrard 401 • Agulha Shure V15 Type III • Conversor 24-bit/96kHz",
          audioFormat: "FLAC",
          audioMimeType: "audio/wav",
          audioFileName: "arthur-verocai-na-boca-do-sol-1972-vinyl-rip.flac.wav",
          audioFileSize: rip1.byteLength,
          durationSeconds: rip1.durationSeconds,
          sampleRate: "24-bit / 96kHz Lossless",
          audioData: rip1.base64,
          coverFormat: "JPG",
          coverMimeType: "image/svg+xml",
          coverData: generateVinylCoverDataUri({
            title: "Na Boca do Sol",
            author: "Arthur Verocai & Quarteto",
            genre: "MPB / Soul",
            year: 1972,
            catalog: "RM-LP-072",
            accentColor: "#f59e0b",
            secondaryColor: "#271705",
            formatLabel: "JPG",
          }),
          playsCount: 142,
          downloadsCount: 64,
        },
        {
          author: "Tim Maia",
          title: "Que Beleza (Racional Vol. 1 LP Rip)",
          genre: "Soul / Funk",
          year: 1975,
          albumName: "Selo Seroma • Vinil Original 180g",
          catalogNumber: "RM-LP-075",
          equipmentInfo: "Technics SL-1200MK2 • Ortofon Concorde Gold • Pré McIntosh",
          audioFormat: "WAV",
          audioMimeType: "audio/wav",
          audioFileName: "tim-maia-que-beleza-1975-master-vinil.wav",
          audioFileSize: rip2.byteLength,
          durationSeconds: rip2.durationSeconds,
          sampleRate: "24-bit / 192kHz Master WAV",
          audioData: rip2.base64,
          coverFormat: "PNG",
          coverMimeType: "image/svg+xml",
          coverData: generateVinylCoverDataUri({
            title: "Que Beleza (Racional)",
            author: "Tim Maia",
            genre: "Soul / Funk",
            year: 1975,
            catalog: "RM-LP-075",
            accentColor: "#ea580c",
            secondaryColor: "#2b1106",
            formatLabel: "PNG",
          }),
          playsCount: 218,
          downloadsCount: 97,
        },
        {
          author: "João Donato & Eumir Deodato",
          title: "Amazonas (Bossa & Fender Rhodes)",
          genre: "Bossa Nova / Jazz",
          year: 1973,
          albumName: "LP Odeon SMOFB-3785 • Stereo Original",
          catalogNumber: "RM-LP-073",
          equipmentInfo: "Thorens TD-124 • Braço SME 3009 • Cápsula Denon DL-103R",
          audioFormat: "FLAC",
          audioMimeType: "audio/wav",
          audioFileName: "joao-donato-amazonas-1973-vinyl-rip.flac.wav",
          audioFileSize: rip3.byteLength,
          durationSeconds: rip3.durationSeconds,
          sampleRate: "24-bit / 96kHz Lossless",
          audioData: rip3.base64,
          coverFormat: "SVG",
          coverMimeType: "image/svg+xml",
          coverData: generateVinylCoverDataUri({
            title: "Amazonas",
            author: "João Donato & Eumir Deodato",
            genre: "Bossa Nova / Jazz",
            year: 1973,
            catalog: "RM-LP-073",
            accentColor: "#10b981",
            secondaryColor: "#062419",
            formatLabel: "SVG",
          }),
          playsCount: 115,
          downloadsCount: 49,
        },
        {
          author: "Jorge Ben",
          title: "Ponta de Lança Africano (Umbabarauma)",
          genre: "Samba-Rock",
          year: 1976,
          albumName: "LP Philips 6349.186 • Prensagem Brasileira",
          catalogNumber: "RM-LP-076",
          equipmentInfo: "Technics SL-1200G • Audio-Technica VM740ML • Pré Valvulado",
          audioFormat: "MP3",
          audioMimeType: "audio/wav",
          audioFileName: "jorge-ben-umbabarauma-1976-vinyl-320kbps.mp3.wav",
          audioFileSize: rip4.byteLength,
          durationSeconds: rip4.durationSeconds,
          sampleRate: "320 kbps CBR (Rip Direto)",
          audioData: rip4.base64,
          coverFormat: "JPEG",
          coverMimeType: "image/svg+xml",
          coverData: generateVinylCoverDataUri({
            title: "Umbabarauma",
            author: "Jorge Ben",
            genre: "Samba-Rock",
            year: 1976,
            catalog: "RM-LP-076",
            accentColor: "#eab308",
            secondaryColor: "#261f04",
            formatLabel: "JPG",
          }),
          playsCount: 189,
          downloadsCount: 83,
        },
        {
          author: "Tamba Trio",
          title: "Mas Que Nada (Compacto 7 Polegadas)",
          genre: "Samba-Jazz",
          year: 1963,
          albumName: "Philips 33⅓ RPM • Prensagem Mono Rara (Sem Capa)",
          catalogNumber: "RM-EP-063",
          equipmentInfo: "Garrard 301 • Cápsula Mono Ortofon 2M • Filtro RIAA Puro",
          audioFormat: "WAV",
          audioMimeType: "audio/wav",
          audioFileName: "tamba-trio-mas-que-nada-1963-mono-rip.wav",
          audioFileSize: rip5.byteLength,
          durationSeconds: rip5.durationSeconds,
          sampleRate: "24-bit / 96kHz Mono Master",
          audioData: rip5.base64,
          // Intentionally null cover to demonstrate optional cover art [capa do disco opcional]
          coverFormat: null,
          coverMimeType: null,
          coverData: null,
          playsCount: 94,
          downloadsCount: 41,
        },
        {
          author: "Clube da Esquina (Milton & Lô Borges)",
          title: "Tudo Que Você Podia Ser (Lado A - Faixa 1)",
          genre: "MPB / Progressivo",
          year: 1972,
          albumName: "LP Duplo Odeon MOAB-6005/6 • Gatefold Original",
          catalogNumber: "RM-LP-072B",
          equipmentInfo: "Technics SL-1200MK2 • Cápsula Ortofon 2M Black • Pré Classe A",
          audioFormat: "FLAC",
          audioMimeType: "audio/wav",
          audioFileName: "clube-da-esquina-tudo-que-voce-podia-ser-1972.flac.wav",
          audioFileSize: rip6.byteLength,
          durationSeconds: rip6.durationSeconds,
          sampleRate: "24-bit / 96kHz Lossless",
          audioData: rip6.base64,
          coverFormat: "GIF",
          coverMimeType: "image/svg+xml",
          coverData: generateVinylCoverDataUri({
            title: "Tudo Que Você Podia Ser",
            author: "Milton Nascimento & Lô Borges",
            genre: "MPB / Progressivo",
            year: 1972,
            catalog: "RM-LP-072B",
            accentColor: "#38bdf8",
            secondaryColor: "#082032",
            formatLabel: "GIF",
          }),
          playsCount: 256,
          downloadsCount: 118,
        },
      ]);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
