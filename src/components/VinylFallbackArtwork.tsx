"use client";

import React from "react";

interface VinylFallbackArtworkProps {
  title: string;
  author: string;
  genre: string;
  year: number;
  isPlaying?: boolean;
  className?: string;
}

export function VinylFallbackArtwork({
  title,
  author,
  genre,
  year,
  isPlaying = false,
  className = "",
}: VinylFallbackArtworkProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d0d12] via-[#070709] to-[#050505] ${className}`}
    >
      {/* Subtle Studio Grid / Sleeve Frame */}
      <div className="pointer-events-none absolute inset-2.5 rounded-lg border border-amber-500/20" />
      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-amber-500/80" />
        <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
          RM STUDIO • VINIL S/ CAPA
        </span>
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-[10px] text-amber-500/90">
        {year}
      </div>

      {/* Tactile Vinyl LP Disc SVG */}
      <div
        className={`relative h-4/5 w-4/5 rounded-full shadow-[0_0_35px_rgba(0,0,0,0.95)] ${
          isPlaying ? "animate-vinyl-spin" : ""
        }`}
      >
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full drop-shadow-2xl"
          aria-label={`Disco de vinil de ${title} por ${author}`}
        >
          <defs>
            <radialGradient id="vinylSheen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="45%" stopColor="#09090b" />
              <stop offset="85%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            <linearGradient id="labelGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Outer Vinyl Body */}
          <circle
            cx="150"
            cy="150"
            r="145"
            fill="url(#vinylSheen)"
            stroke="#3f3f46"
            strokeWidth="1.5"
          />

          {/* Concentric Microgrooves */}
          <circle
            cx="150"
            cy="150"
            r="134"
            fill="none"
            stroke="#27272a"
            strokeWidth="0.8"
            strokeDasharray="14 6"
          />
          <circle
            cx="150"
            cy="150"
            r="122"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="110"
            fill="none"
            stroke="#27272a"
            strokeWidth="0.9"
            strokeDasharray="24 8"
          />
          <circle
            cx="150"
            cy="150"
            r="96"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="82"
            fill="none"
            stroke="#27272a"
            strokeWidth="1"
            strokeDasharray="10 5"
          />
          <circle
            cx="150"
            cy="150"
            r="68"
            fill="none"
            stroke="#52525b"
            strokeWidth="0.6"
          />

          {/* Center Stamp Label */}
          <circle cx="150" cy="150" r="52" fill="url(#labelGold)" />
          <circle
            cx="150"
            cy="150"
            r="44"
            fill="none"
            stroke="#09090b"
            strokeWidth="1"
            strokeOpacity="0.45"
          />

          <text
            x="150"
            y="126"
            textAnchor="middle"
            fill="#09090b"
            fontSize="8.5"
            fontWeight="800"
            fontFamily="monospace"
            letterSpacing="1.5"
          >
            RM STUDIO
          </text>
          <text
            x="150"
            y="137"
            textAnchor="middle"
            fill="#18181b"
            fontSize="6.5"
            fontWeight="700"
            fontFamily="monospace"
          >
            33⅓ RPM HI-FI
          </text>

          <text
            x="150"
            y="174"
            textAnchor="middle"
            fill="#09090b"
            fontSize="7"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            {genre.slice(0, 16).toUpperCase()}
          </text>
          <text
            x="150"
            y="185"
            textAnchor="middle"
            fill="#18181b"
            fontSize="6.5"
            fontWeight="600"
            fontFamily="monospace"
          >
            ANO {year}
          </text>

          {/* Center Spindle Hole */}
          <circle
            cx="150"
            cy="150"
            r="8"
            fill="#050505"
            stroke="#27272a"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Bottom Sleeve Label */}
      <div className="pointer-events-none absolute right-3 bottom-3 left-3 rounded bg-black/75 px-2.5 py-1.5 backdrop-blur-sm border border-white/10">
        <p className="truncate text-xs font-semibold text-zinc-100">{title}</p>
        <p className="truncate text-[11px] text-amber-400/90">{author}</p>
      </div>
    </div>
  );
}
