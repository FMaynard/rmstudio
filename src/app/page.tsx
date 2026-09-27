import React from "react";
import { db } from "@/db";
import { tracks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/auth";
import { RMStudioClient } from "@/components/RMStudioClient";
import type { TrackItem } from "@/components/AdminTrackModal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const user = await getSessionUser();

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
    })
    .from(tracks)
    .orderBy(desc(tracks.createdAt), desc(tracks.id));

  const serializedTracks: TrackItem[] = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <RMStudioClient initialTracks={serializedTracks} initialUser={user} />
  );
}
