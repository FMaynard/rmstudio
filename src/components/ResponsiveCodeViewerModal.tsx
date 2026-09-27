"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, X, Smartphone, Tablet, Monitor, Database } from "lucide-react";

interface ResponsiveCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RM_STUDIO_HTML_CODE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RM Studio | Discos de Vinil Ripados (MP3 • FLAC • WAV)</title>
  <link rel="stylesheet" href="rm-studio-responsivo.css" />
</head>
<body class="rm-body">
  <!-- Cabeçalho Fixo RM Studio -->
  <header class="rm-header">
    <div class="rm-container rm-header-inner">
      <div class="rm-brand">
        <div class="rm-vinyl-logo" aria-hidden="true"></div>
        <div>
          <span class="rm-badge">ACERVO ANALÓGICO HI-FI</span>
          <h1 class="rm-title">RM Studio</h1>
        </div>
      </div>

      <nav class="rm-actions">
        <button class="rm-btn rm-btn-outline">Visitante: Cadastrar / Entrar</button>
        <button class="rm-btn rm-btn-amber">Proprietário: Upload MP3/FLAC/WAV</button>
      </nav>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="rm-container rm-main">
    <!-- Barra de Busca e Filtros -->
    <section class="rm-toolbar" aria-label="Filtros do Acervo">
      <input
        type="search"
        class="rm-search-input"
        placeholder="Buscar por [Autor], [Nome da Faixa], [Gênero] ou [Ano]..."
      />
      <div class="rm-filter-pills">
        <button class="rm-pill active">Todos</button>
        <button class="rm-pill">MPB / Soul</button>
        <button class="rm-pill">Bossa Nova / Jazz</button>
        <button class="rm-pill">Samba-Rock</button>
      </div>
    </section>

    <!-- Grade Responsiva de Discos Ripados (Celular: 1 col | Tablet: 2-3 cols | PC: 4 cols) -->
    <section class="rm-tracks-grid" aria-label="Grade de Músicas">
      <!-- Card de Faixa 1 (Com Capa JPG/JPEG/PNG/BMP/SVG/GIF) -->
      <article class="rm-track-card">
        <div class="rm-cover-wrapper">
          <img
            src="capa-disco-exemplo.jpg"
            alt="Capa do disco Na Boca do Sol - Arthur Verocai"
            class="rm-cover-img"
          />
          <span class="rm-format-badge">FLAC • CAPA JPG</span>
        </div>
        <div class="rm-card-body">
          <div class="rm-meta-tags">
            <span class="rm-tag-genre">[Gênero] MPB / Soul</span>
            <span class="rm-tag-year">[Ano] 1972</span>
          </div>
          <h2 class="rm-track-name">[Nome da Faixa] Na Boca do Sol</h2>
          <p class="rm-track-author">[Autor] Arthur Verocai &amp; Quarteto</p>

          <div class="rm-card-footer">
            <button class="rm-btn rm-btn-play">▶ Ouvir Streaming</button>
            <button class="rm-btn rm-btn-download">⬇ Baixar Grátis</button>
          </div>
        </div>
      </article>

      <!-- Card de Faixa 2 (Sem Capa Enviada - Fallback Opcional de Disco de Vinil) -->
      <article class="rm-track-card">
        <div class="rm-cover-wrapper rm-cover-fallback">
          <div class="rm-vinyl-disc-fallback">
            <div class="rm-vinyl-center-label">RM STUDIO 33⅓</div>
          </div>
          <span class="rm-format-badge">WAV • CAPA OPCIONAL</span>
        </div>
        <div class="rm-card-body">
          <div class="rm-meta-tags">
            <span class="rm-tag-genre">[Gênero] Samba-Jazz</span>
            <span class="rm-tag-year">[Ano] 1963</span>
          </div>
          <h2 class="rm-track-name">[Nome da Faixa] Mas Que Nada (Mono Rip)</h2>
          <p class="rm-track-author">[Autor] Tamba Trio</p>

          <div class="rm-card-footer">
            <button class="rm-btn rm-btn-play">▶ Ouvir Streaming</button>
            <button class="rm-btn rm-btn-download">⬇ Baixar Grátis</button>
          </div>
        </div>
      </article>
    </section>
  </main>

  <!-- Player de Streaming Fixo no Rodapé -->
  <footer class="rm-player-dock">
    <div class="rm-container rm-player-inner">
      <div class="rm-now-playing">
        <strong>Tocando Agora (Streaming PostgreSQL):</strong>
        <span>Arthur Verocai — Na Boca do Sol (1972) [FLAC 24-bit/96kHz]</span>
      </div>
      <audio controls preload="metadata" class="rm-audio-element">
        <source src="/api/tracks/1/stream" type="audio/wav" />
      </audio>
    </div>
  </footer>
</body>
</html>`;

export const RM_STUDIO_CSS_CODE = `/* ==========================================================================
   RM STUDIO - FOLHA DE ESTILO RESPONSIVA (CELULAR, TABLET E COMPUTADOR)
   Fundo Preto (#050505) • Estética Analógica Hi-Fi • Grade de Vinis
   ========================================================================== */

:root {
  --rm-bg-black: #050505;
  --rm-bg-card: #0d0d10;
  --rm-bg-elevated: #16161b;
  --rm-text-primary: #f4f4f6;
  --rm-text-secondary: #a1a1aa;
  --rm-amber: #f59e0b;
  --rm-copper: #ea580c;
  --rm-emerald: #10b981;
  --rm-border: rgba(255, 255, 255, 0.09);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body.rm-body {
  background-color: var(--rm-bg-black);
  color: var(--rm-text-primary);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  padding-bottom: 110px; /* Espaço para o player de streaming fixo */
}

.rm-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Cabeçalho */
.rm-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(5, 5, 5, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--rm-border);
  padding: 0.875rem 0;
}

.rm-header-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.rm-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rm-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

/* ==========================================================================
   GRADE RESPONSIVA DE MÚSICAS ([Autor], [Nome da Faixa], [Gênero], [Ano], [Capa])
   1. CELULAR (Mobile First - até 639px): 1 Coluna
   ========================================================================== */
.rm-tracks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.rm-track-card {
  background: var(--rm-bg-card);
  border: 1px solid var(--rm-border);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.rm-track-card:hover {
  transform: translateY(-3px);
  border-color: rgba(245, 158, 11, 0.45);
}

.rm-cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #09090b;
  overflow: hidden;
}

.rm-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rm-card-body {
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.rm-meta-tags {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--rm-amber);
}

.rm-track-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--rm-text-primary);
}

.rm-track-author {
  font-size: 0.9rem;
  color: var(--rm-text-secondary);
}

.rm-card-footer {
  margin-top: auto;
  padding-top: 0.875rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

/* ==========================================================================
   2. TABLET (640px até 1023px): 2 a 3 Colunas
   ========================================================================== */
@media (min-width: 640px) {
  .rm-container {
    padding: 0 1.5rem;
  }

  .rm-header-inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .rm-tracks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (min-width: 860px) {
  .rm-tracks-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ==========================================================================
   3. COMPUTADOR / DESKTOP (1200px ou superior): 4 Colunas Amplas
   ========================================================================== */
@media (min-width: 1200px) {
  .rm-container {
    padding: 0 2rem;
  }

  .rm-tracks-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.75rem;
  }
}`;

export const RM_STUDIO_SQL_CODE = `-- ==========================================================================
-- RM STUDIO - ESQUEMA DE BANCO DE DADOS POSTGRESQL
-- Armazenamento de Músicas (MP3/FLAC/WAV) e Capas Opcionais (JPG/JPEG/PNG/BMP/SVG/GIF)
-- ==========================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'visitor', -- 'admin' (Apenas Proprietário RM Studio) | 'visitor' (Visitante Cadastrado)
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,                 -- [Autor]
  title TEXT NOT NULL,                  -- [Nome da Faixa]
  genre TEXT NOT NULL,                  -- [Gênero]
  year INTEGER NOT NULL,                -- [Ano]
  album_name TEXT DEFAULT 'Prensagem Original em Vinil 33⅓ RPM',
  catalog_number TEXT DEFAULT 'RM-LP-001',
  equipment_info TEXT,
  audio_format TEXT NOT NULL,           -- 'MP3' | 'FLAC' | 'WAV'
  audio_mime_type TEXT NOT NULL,
  audio_file_name TEXT NOT NULL,
  audio_file_size INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 180,
  sample_rate TEXT NOT NULL DEFAULT '24-bit / 96kHz',
  audio_data TEXT NOT NULL,             -- Binário do áudio codificado no PostgreSQL
  cover_format TEXT,                    -- Opcional: 'JPG' | 'JPEG' | 'PNG' | 'BMP' | 'SVG' | 'GIF' | NULL
  cover_mime_type TEXT,
  cover_data TEXT,                      -- Opcional: Imagem da capa armazenada no PostgreSQL
  plays_count INTEGER NOT NULL DEFAULT 0,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);`;

export function ResponsiveCodeViewerModal({
  isOpen,
  onClose,
}: ResponsiveCodeViewerModalProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "sql">("html");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode =
    activeTab === "html"
      ? RM_STUDIO_HTML_CODE
      : activeTab === "css"
        ? RM_STUDIO_CSS_CODE
        : RM_STUDIO_SQL_CODE;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0b0b0e] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121217] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Código HTML, CSS Responsivo e PostgreSQL — RM Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Estrutura responsiva completa para Celular (1 col), Tablet (2-3 cols) e Computador (4 cols)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Fechar janela de código"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Responsive Breakpoints Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-b border-white/10 bg-[#08080a] px-5 py-3 text-xs">
          <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <Smartphone className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-200">Celular (&lt; 640px)</span>
              <p className="text-[11px] text-zinc-400">Grade 1 coluna • Player compacto</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <Tablet className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-200">Tablet (640px – 1199px)</span>
              <p className="text-[11px] text-zinc-400">Grade 2 a 3 colunas • Filtros em linha</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <Monitor className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-200">Computador (1200px+)</span>
              <p className="text-[11px] text-zinc-400">Grade 4 colunas • VU Meter Estéreo</p>
            </div>
          </div>
        </div>

        {/* Tabs & Copy Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#101014] px-5 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("html")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "html"
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              HTML5 Responsivo
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "css"
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              CSS3 (@media Celular / Tablet / PC)
            </button>
            <button
              onClick={() => setActiveTab("sql")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "sql"
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              PostgreSQL Schema
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Código Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#050507]">
          <pre className="font-mono text-xs leading-relaxed text-zinc-200 overflow-x-auto">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
