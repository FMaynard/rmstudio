import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("visitor"), // 'admin' (RM Studio Owner) | 'visitor' (Visitante Cadastrado)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(), // [Autor]
  title: text("title").notNull(), // [Nome da Faixa]
  genre: text("genre").notNull(), // [Gênero]
  year: integer("year").notNull(), // [Ano]
  albumName: text("album_name").default("Prensagem Original em Vinil 33⅓ RPM"),
  catalogNumber: text("catalog_number").default("RM-LP-001"),
  equipmentInfo: text("equipment_info").default(
    "Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze • Pré-Phono Valvulado"
  ),
  // Audio storage in PostgreSQL (MP3 / FLAC / WAV)
  audioFormat: text("audio_format").notNull(), // 'MP3' | 'FLAC' | 'WAV'
  audioMimeType: text("audio_mime_type").notNull(),
  audioFileName: text("audio_file_name").notNull(),
  audioFileSize: integer("audio_file_size").notNull(), // bytes
  durationSeconds: integer("duration_seconds").notNull().default(24),
  sampleRate: text("sample_rate").notNull().default("24-bit / 96kHz"),
  audioData: text("audio_data").notNull(), // Base64 encoded binary stored in PostgreSQL

  // Optional Cover Art in PostgreSQL (JPG/JPEG/PNG/BMP/SVG/GIF or null)
  coverFormat: text("cover_format"), // 'JPG' | 'JPEG' | 'PNG' | 'BMP' | 'SVG' | 'GIF' | null
  coverMimeType: text("cover_mime_type"),
  coverData: text("cover_data"), // Data URI or Base64 stored in PostgreSQL (nullable/optional)

  playsCount: integer("plays_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const downloadLogs = pgTable("download_logs", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").notNull(),
  userId: integer("user_id").notNull(),
  userEmail: text("user_email").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;
