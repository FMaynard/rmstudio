"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Disc3,
  Play,
  Pause,
  Download,
  Upload,
  Edit3,
  Trash2,
  Search,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  ShieldCheck,
  UserCheck,
  UserPlus,
  LogOut,
  Code2,
  Database,
  Sparkles,
  Radio,
  Music,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import {
  AdminTrackModal,
  type TrackItem,
} from "@/components/AdminTrackModal";
import { AuthModal } from "@/components/AuthModal";
import { VinylFallbackArtwork } from "@/components/VinylFallbackArtwork";
import { ResponsiveCodeViewerModal } from "@/components/ResponsiveCodeViewerModal";

interface RMStudioClientProps {
  initialTracks: TrackItem[];
  initialUser: SessionUser | null;
}

export function RMStudioClient({
  initialTracks,
  initialUser,
}: RMStudioClientProps) {
  const [tracks, setTracks] = useState<TrackItem[]>(initialTracks);
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("TODOS");
  const [selectedFormat, setSelectedFormat] = useState<string>("TODOS");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Audio Streaming Player state
  const [currentTrack, setCurrentTrack] = useState<TrackItem | null>(
    initialTracks[0] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<
    "visitor-register" | "visitor-login" | "admin-login"
  >("visitor-register");
  const [pendingDownloadTrack, setPendingDownloadTrack] =
    useState<TrackItem | null>(null);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrackItem | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated VU meter bounce when playing
  const [vuLevels, setVuLevels] = useState<{ left: number; right: number }>({
    left: 12,
    right: 14,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  useEffect(() => {
    if (!isPlaying) {
      setVuLevels({ left: 8, right: 10 });
      return;
    }
    const interval = setInterval(() => {
      setVuLevels({
        left: Math.floor(48 + Math.random() * 46),
        right: Math.floor(45 + Math.random() * 48),
      });
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Unique genres from tracks
  const genres = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach((t) => {
      if (t.genre) set.add(t.genre);
    });
    return ["TODOS", ...Array.from(set)];
  }, [tracks]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesGenre =
        selectedGenre === "TODOS" || track.genre === selectedGenre;
      const matchesFormat =
        selectedFormat === "TODOS" ||
        track.audioFormat.toUpperCase() === selectedFormat;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesGenre && matchesFormat;

      const matchesSearch =
        track.author.toLowerCase().includes(q) ||
        track.title.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q) ||
        String(track.year).includes(q) ||
        (track.albumName || "").toLowerCase().includes(q);

      return matchesGenre && matchesFormat && matchesSearch;
    });
  }, [tracks, selectedGenre, selectedFormat, searchQuery]);

  // Handle Play/Pause Track via PostgreSQL Streaming Route
  const handlePlayTrack = (track: TrackItem) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);

    // Optimistically bump play count in UI
    setTracks((prev) =>
      prev.map((t) =>
        t.id === track.id ? { ...t, playsCount: t.playsCount + 1 } : t
      )
    );

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleSkip = (direction: "prev" | "next") => {
    if (!currentTrack || filteredTracks.length === 0) return;
    const idx = filteredTracks.findIndex((t) => t.id === currentTrack.id);
    const nextIdx =
      direction === "next"
        ? (idx + 1) % filteredTracks.length
        : (idx - 1 + filteredTracks.length) % filteredTracks.length;
    handlePlayTrack(filteredTracks[nextIdx]);
  };

  // Handle Free Download (Only for Registered Visitors or Owner)
  const handleDownloadTrack = (track: TrackItem) => {
    if (!user) {
      setPendingDownloadTrack(track);
      setAuthModalMode("visitor-register");
      setAuthModalOpen(true);
      return;
    }

    // Trigger real file download from PostgreSQL endpoint
    const downloadUrl = `/api/tracks/${track.id}/download`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `${track.author} - ${track.title} (${track.year}).${track.audioFormat.toLowerCase()}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update download counter in UI
    setTracks((prev) =>
      prev.map((t) =>
        t.id === track.id ? { ...t, downloadsCount: t.downloadsCount + 1 } : t
      )
    );
    showToast(
      `Download gratuito iniciado: "${track.title}" (${track.audioFormat}) direto do PostgreSQL!`
    );
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    showToast("Sessão encerrada. Você está navegando como Visitante (Streaming).");
  };

  // Handle Delete Track (Admin Only)
  const handleDeleteTrack = async (trackId: number) => {
    try {
      const res = await fetch(`/api/tracks/${trackId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTracks((prev) => prev.filter((t) => t.id !== trackId));
        setDeleteConfirmId(null);
        if (currentTrack?.id === trackId) {
          audioRef.current?.pause();
          setIsPlaying(false);
        }
        showToast("Faixa excluída permanentemente do PostgreSQL.");
      } else {
        const err = await res.json();
        showToast(err.error || "Erro ao excluir faixa.");
      }
    } catch {
      showToast("Erro de comunicação ao excluir faixa.");
    }
  };

  const formatDuration = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "650 KB";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F4F6] pb-36">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-[#121218]/95 px-4 py-3 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          TOP NAVIGATION BAR (FUNDO PRETO OBSIDIANA #050505)
          ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070709]">
                <Disc3
                  className={`h-6 w-6 text-amber-400 ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "4s" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  ACERVO DE VINIL • POSTGRESQL
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
                  <Database className="h-2.5 w-2.5" /> ONLINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                RM Studio
              </h1>
            </div>
          </div>

          {/* Right Controls: HTML/CSS Code Button + Auth / Owner Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setCodeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#111116] px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-amber-500/50 hover:text-amber-300 transition"
              title="Visualizar código HTML e CSS responsivo para celular, tablet e computador"
            >
              <Code2 className="h-4 w-4 text-amber-400" />
              <span className="hidden md:inline">Código HTML &amp; CSS Responsivo</span>
              <span className="md:hidden">HTML/CSS</span>
            </button>

            {user ? (
              <div className="flex flex-wrap items-center gap-2">
                {user.role === "admin" ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingTrack(null);
                        setAdminModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
                    >
                      <Upload className="h-4 w-4" />
                      <span>+ Upload MP3 / FLAC / WAV</span>
                    </button>
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold text-amber-300 hidden sm:inline">
                        Proprietário RM Studio
                      </span>
                      <button
                        onClick={handleLogout}
                        className="ml-1 rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                        title="Sair da conta de proprietário"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs">
                    <UserCheck className="h-4 w-4 text-emerald-400" />
                    <div className="text-left">
                      <span className="font-semibold text-emerald-300">
                        {user.name.split(" ")[0]}
                      </span>
                      <span className="ml-1.5 hidden md:inline rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-200">
                        Download Grátis Liberado
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAuthModalMode("admin-login");
                        setAuthModalOpen(true);
                      }}
                      className="ml-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                      title="Alternar para acesso exclusivo do proprietário RM Studio"
                    >
                      Admin
                    </button>
                    <button
                      onClick={handleLogout}
                      className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                      title="Sair da conta"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPendingDownloadTrack(null);
                    setAuthModalMode("visitor-register");
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-black transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Cadastrar p/ Baixar Grátis</span>
                </button>

                <button
                  onClick={() => {
                    setPendingDownloadTrack(null);
                    setAuthModalMode("admin-login");
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Acesso Proprietário (RM Studio)</span>
                  <span className="sm:hidden">Proprietário</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN CONTAINER
          ===================================================================== */}
      <main className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8 space-y-8">
        {/* ===================================================================
            HERO / ANALOG TURNTABLE & VU METER STUDIO DECK
            =================================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e0e13] via-[#09090c] to-[#050505] p-5 sm:p-7 shadow-2xl">
          <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: RM Studio Pitch & Access Permissions */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                <Radio className="h-3.5 w-3.5 text-amber-400" />
                <span>DISCOS DE VINIL RIPADOS POR MIM • RM STUDIO</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                O calor autêntico do{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">
                   Disco de Vinil
                </span>{" "}
                preservado em alta definição.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
                Bem-vindo ao acervo oficial do <strong>RM Studio</strong>. Todas as faixas foram ripadas diretamente dos meus discos de vinil e armazenadas em banco de dados <strong>PostgreSQL</strong> nos formatos{" "}
                <span className="font-mono text-amber-300">MP3, FLAC e WAV</span>.
                Ouça livremente via <strong>streaming</strong> ou faça seu{" "}
                <strong>cadastro gratuito de visitante</strong> para baixá-las para o seu dispositivo.
              </p>

              {/* Permission Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Play className="h-3.5 w-3.5 text-amber-400" />
                    <span>1. Visitantes</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Podem explorar a grade e ouvir todas as faixas via <strong>streaming imediato</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>2. Visitantes Cadastrados</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    Podem ouvir via streaming e <strong>baixar gratuitamente</strong> os arquivos para seus dispositivos.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>3. Apenas Eu (RM Studio)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    Permissão exclusiva para <strong>upload de MP3/FLAC/WAV</strong> do computador/HD, editar e excluir.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Turntable & Analog Stereo VU Meter Deck */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#070709] p-4 sm:p-5 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isPlaying
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold tracking-wider text-zinc-300 uppercase">
                    {isPlaying
                      ? "TOCA-DISCOS RM STUDIO • EM REPRODUÇÃO"
                      : "TOCA-DISCOS RM STUDIO • PRONTO (33⅓ RPM)"}
                  </span>
                </div>
                <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  {currentTrack?.audioFormat || "FLAC"} •{" "}
                  {currentTrack?.sampleRate || "24-bit/96kHz"}
                </span>
              </div>

              {currentTrack && (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Spinning Vinyl Disc Preview */}
                  <div className="relative h-28 w-28 shrink-0">
                    <div
                      className={`h-full w-full rounded-full border-2 border-zinc-700 vinyl-grooves flex items-center justify-center shadow-2xl ${
                        isPlaying
                          ? "animate-vinyl-spin"
                          : "animate-vinyl-spin-paused"
                      }`}
                    >
                      <div className="h-11 w-11 rounded-full bg-amber-500 flex flex-col items-center justify-center border-2 border-black text-center">
                        <span className="font-mono text-[6px] font-black text-black leading-none">
                          RM STUDIO
                        </span>
                        <div className="my-0.5 h-2 w-2 rounded-full bg-black" />
                        <span className="font-mono text-[6px] font-bold text-black leading-none">
                          {currentTrack.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Track Info & Stereo VU Meters */}
                  <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 uppercase">
                        {currentTrack.genre} • ANO {currentTrack.year}
                      </span>
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {currentTrack.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {currentTrack.author}
                      </p>
                    </div>

                    {/* Stereo L / R Analog VU Meters */}
                    <div className="space-y-1.5 rounded-xl border border-white/10 bg-black/70 p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-400 w-6">
                          CH L
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-150"
                            style={{ width: `${vuLevels.left}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-amber-400 w-9 text-right">
                          -1.8dB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-400 w-6">
                          CH R
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-150"
                            style={{ width: `${vuLevels.right}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-amber-400 w-9 text-right">
                          -1.5dB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <button
                        onClick={() => handlePlayTrack(currentTrack)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5" /> Pausar Streaming
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" /> Ouvir Agora
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadTrack(currentTrack)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-black transition"
                      >
                        <Download className="h-3.5 w-3.5" /> Baixar Grátis
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            OWNER EXCLUSIVE CONSOLE BAR (WHEN ADMIN IS LOGGED IN)
            =================================================================== */}
        {user?.role === "admin" && (
          <section className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-[#121218] to-[#0d0d12] p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-black font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Painel de Controle Exclusivo — Proprietário RM Studio
                    </h3>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      PERMISSÃO TOTAL
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Gerencie suas faixas ripadas no PostgreSQL: faça upload de arquivos{" "}
                    <strong>MP3, FLAC ou WAV</strong> do seu computador/hard disk, envie capas opcionais (JPG/JPEG/PNG/BMP/SVG/GIF), edite ou exclua faixas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex rounded-xl border border-white/15 bg-black/60 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === "grid"
                        ? "bg-amber-500 text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Grade de Discos
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === "table"
                        ? "bg-amber-500 text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                    Tabela Gerencial
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEditingTrack(null);
                    setAdminModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:bg-amber-400 transition"
                >
                  <Upload className="h-4 w-4" />
                  Novo Upload do Computador / HD
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================================
            SEARCH & FILTER BAR
            =================================================================== */}
        <section
          aria-label="Filtros e Busca do Acervo"
          className="rounded-2xl border border-white/10 bg-[#0c0c10] p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar no acervo por [Autor], [Nome da Faixa], [Gênero] ou [Ano]..."
                className="w-full rounded-xl border border-white/15 bg-[#050507] py-2.5 pr-4 pl-10 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Audio Format Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
                Formato:
              </span>
              {["TODOS", "FLAC", "WAV", "MP3"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                    selectedFormat === fmt
                      ? "bg-amber-500 text-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-zinc-400 shrink-0">
              [Gênero]:
            </span>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  selectedGenre === g
                    ? "bg-white text-black"
                    : "border border-white/10 bg-[#14141a] text-zinc-300 hover:border-amber-500/40 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION HEADER: GRADE DE MÚSICAS DO RM STUDIO
            =================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-amber-400" />
              Grade do Acervo de Vinis Ripados ({filteredTracks.length}{" "}
              {filteredTracks.length === 1 ? "faixa" : "faixas"})
            </h2>
            <p className="text-xs text-zinc-400">
              Exibindo <strong className="text-zinc-200">[Autor]</strong>,{" "}
              <strong className="text-zinc-200">[Nome da Faixa]</strong>,{" "}
              <strong className="text-zinc-200">[Gênero]</strong>,{" "}
              <strong className="text-zinc-200">[Ano]</strong> e{" "}
              <strong className="text-zinc-200">[capa do disco]</strong> (JPG/JPEG/PNG/BMP/SVG/GIF opcional) armazenados no PostgreSQL
            </p>
          </div>

          {!user && (
            <button
              onClick={() => {
                setAuthModalMode("admin-login");
                setAuthModalOpen(true);
              }}
              className="text-xs font-medium text-amber-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              É o proprietário do RM Studio? Clique para fazer Upload / Editar
            </button>
          )}
        </div>

        {/* ===================================================================
            ADMIN TABLE VIEW (OPTIONAL WHEN OWNER SELECTS TABLE MODE)
            =================================================================== */}
        {viewMode === "table" && user?.role === "admin" ? (
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#0c0c10]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#14141b] font-mono text-[11px] uppercase text-zinc-400">
                  <th className="py-3.5 px-4">[Capa do Disco]</th>
                  <th className="py-3.5 px-4">[Nome da Faixa]</th>
                  <th className="py-3.5 px-4">[Autor]</th>
                  <th className="py-3.5 px-4">[Gênero]</th>
                  <th className="py-3.5 px-4">[Ano]</th>
                  <th className="py-3.5 px-4">Áudio PostgreSQL</th>
                  <th className="py-3.5 px-4 text-right">Gerenciar (Proprietário)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTracks.map((track) => (
                  <tr
                    key={track.id}
                    className="hover:bg-white/[0.02] transition"
                  >
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/15 bg-black">
                        {track.coverData ? (
                          <img
                            src={track.coverData}
                            alt={track.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-[9px] font-mono text-amber-400 text-center">
                            S/ CAPA
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {track.title}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{track.author}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-amber-300 border border-white/10">
                        {track.genre}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {track.year}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300">
                        {track.audioFormat}
                      </span>{" "}
                      <span className="text-zinc-400">
                        ({formatBytes(track.audioFileSize)})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="rounded-lg bg-white/10 px-2.5 py-1.5 text-white hover:bg-amber-500 hover:text-black transition"
                        >
                          {currentTrack?.id === track.id && isPlaying
                            ? "Pausar"
                            : "Ouvir"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingTrack(track);
                            setAdminModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteTrack(track.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/15 px-2.5 py-1.5 font-semibold text-red-300 hover:bg-red-500 hover:text-white transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* =================================================================
             RESPONSIVE VINYL ALBUM GRID (1 COL MOBILE, 2-3 TABLET, 4 DESKTOP)
             ================================================================= */
          <section className="rm-studio-grid" aria-label="Grade de Músicas RM Studio">
            {filteredTracks.map((track) => {
              const isThisPlaying =
                currentTrack?.id === track.id && isPlaying;

              return (
                <article
                  key={track.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#0d0d10] transition-all duration-200 hover:-translate-y-1 ${
                    isThisPlaying
                      ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.18)]"
                      : "border-white/10 hover:border-amber-500/45"
                  }`}
                >
                  {/* 1. [capa do disco] (Opcional nos formatos JPG/JPEG/PNG/BMP/SVG/GIF) */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#070709]">
                    {track.coverData ? (
                      <img
                        src={track.coverData}
                        alt={`Capa do disco ${track.title} - ${track.author}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <VinylFallbackArtwork
                        title={track.title}
                        author={track.author}
                        genre={track.genre}
                        year={track.year}
                        isPlaying={isThisPlaying}
                        className="h-full w-full"
                      />
                    )}

                    {/* Top Badges: Audio Format & Cover Image Format */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="rounded-md bg-black/85 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-400 border border-amber-500/40 backdrop-blur-md">
                        {track.audioFormat} • {formatBytes(track.audioFileSize)}
                      </span>
                      <span className="rounded-md bg-black/80 px-2 py-1 font-mono text-[10px] font-medium text-zinc-300 border border-white/15 backdrop-blur-md">
                        {track.coverFormat
                          ? `CAPA ${track.coverFormat}`
                          : "CAPA OPCIONAL (S/ IMG)"}
                      </span>
                    </div>

                    {/* Center Play Overlay Button on Cover */}
                    <button
                      onClick={() => handlePlayTrack(track)}
                      aria-label={
                        isThisPlaying
                          ? `Pausar ${track.title}`
                          : `Ouvir ${track.title} via streaming`
                      }
                      className={`absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity ${
                        isThisPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-2xl shadow-amber-500/50 transform transition group-hover:scale-105">
                        {isThisPlaying ? (
                          <Pause className="h-6 w-6 fill-current" />
                        ) : (
                          <Play className="h-6 w-6 fill-current ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* 2. Structured Metadata Grid: [Autor], [Nome da Faixa], [Gênero], [Ano] */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-4">
                    <div className="space-y-2.5">
                      {/* [Gênero] & [Ano] Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/25">
                          {track.genre}
                        </span>
                        <span className="font-mono text-xs font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          Ano: {track.year}
                        </span>
                      </div>

                      {/* Explicit Field Labels for [Nome da Faixa] and [Autor] */}
                      <div className="space-y-1 pt-0.5">
                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                            [Nome da Faixa]
                          </span>
                          <h3
                            className="text-base font-bold text-white line-clamp-1"
                            title={track.title}
                          >
                            {track.title}
                          </h3>
                        </div>

                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                            [Autor]
                          </span>
                          <p
                            className="text-sm font-medium text-zinc-200 line-clamp-1"
                            title={track.author}
                          >
                            {track.author}
                          </p>
                        </div>
                      </div>

                      {/* Pressing & Stats Sub-row */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] text-zinc-400">
                        <span>▶ {track.playsCount} plays</span>
                        <span>⬇ {track.downloadsCount} downloads</span>
                      </div>
                    </div>

                    {/* 3. Action Buttons: Streaming (Everyone) & Free Download (Registered Visitors) */}
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                            isThisPlaying
                              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                              : "bg-white/10 text-white hover:bg-amber-500 hover:text-black"
                          }`}
                        >
                          {isThisPlaying ? (
                            <>
                              <Pause className="h-3.5 w-3.5" />
                              <span>Pausar</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5" />
                              <span>Streaming</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDownloadTrack(track)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                            user
                              ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/15"
                              : "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-black"
                          }`}
                          title={
                            user
                              ? `Baixar gratuitamente ${track.title} (${track.audioFormat})`
                              : "Cadastre-se gratuitamente para baixar esta faixa para o seu dispositivo"
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{user ? "Baixar Grátis" : "Baixar (Grátis)"}</span>
                        </button>
                      </div>

                      {/* 4. Exclusive Owner Controls (Edit / Delete Track in PostgreSQL) */}
                      {user?.role === "admin" && (
                        <div className="flex items-center justify-between gap-2 border-t border-amber-500/20 pt-2">
                          <button
                            onClick={() => {
                              setEditingTrack(track);
                              setAdminModalOpen(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                          >
                            <Edit3 className="h-3 w-3" />
                            Editar Faixa
                          </button>

                          {deleteConfirmId === track.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteTrack(track.id)}
                                className="rounded-lg bg-red-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-red-600"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded-lg bg-white/10 px-2 py-1.5 text-[11px] text-zinc-300"
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(track.id)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 hover:bg-red-500 hover:text-white transition"
                            >
                              <Trash2 className="h-3 w-3" />
                              Excluir
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {/* =====================================================================
          PERSISTENT BOTTOM HI-FI STREAMING PLAYER DOCK
          ===================================================================== */}
      <footer className="fixed right-0 bottom-0 left-0 z-40 border-t border-amber-500/25 bg-[#08080b]/95 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
        {/* Hidden HTML5 Audio Element streaming directly from PostgreSQL */}
        <audio
          ref={audioRef}
          src={
            currentTrack ? `/api/tracks/${currentTrack.id}/stream` : undefined
          }
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(
                audioRef.current.duration ||
                  currentTrack?.durationSeconds ||
                  16
              );
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
          }}
        />

        <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Currently Streaming Track Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[250px] max-w-xs">
            <div
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-full border border-amber-500/40 bg-black flex items-center justify-center ${
                isPlaying ? "animate-vinyl-spin" : ""
              }`}
            >
              {currentTrack?.coverData ? (
                <img
                  src={currentTrack.coverData}
                  alt={currentTrack.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Disc3 className="h-6 w-6 text-amber-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                  {currentTrack?.audioFormat || "FLAC"} STREAMING
                </span>
              </div>
              <p className="truncate text-xs sm:text-sm font-bold text-white">
                {currentTrack?.title || "Selecione um disco para ouvir"}
              </p>
              <p className="truncate text-[11px] text-zinc-400">
                {currentTrack
                  ? `${currentTrack.author} • ${currentTrack.year}`
                  : "RM Studio"}
              </p>
            </div>
          </div>

          {/* Center Transport & Progress Scrubber */}
          <div className="flex flex-1 flex-col items-center w-full max-w-xl gap-1.5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSkip("prev")}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                title="Faixa Anterior"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => currentTrack && handlePlayTrack(currentTrack)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition"
                title={isPlaying ? "Pausar" : "Reproduzir Streaming"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => handleSkip("next")}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                title="Próxima Faixa"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="flex w-full items-center gap-2.5">
              <span className="font-mono text-[11px] text-zinc-400 w-9 text-right">
                {formatDuration(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || currentTrack?.durationSeconds || 16}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-amber-500"
              />
              <span className="font-mono text-[11px] text-zinc-400 w-9">
                {formatDuration(duration || currentTrack?.durationSeconds || 16)}
              </span>
            </div>
          </div>

          {/* Right Volume & Quick Free Download */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMute = !isMuted;
                  setIsMuted(nextMute);
                  if (audioRef.current) {
                    audioRef.current.muted = nextMute;
                  }
                }}
                className="text-zinc-400 hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-amber-400" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (audioRef.current) {
                    audioRef.current.volume = val;
                    audioRef.current.muted = val === 0;
                  }
                }}
                className="h-1.5 w-20 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-amber-500"
              />
            </div>

            {currentTrack && (
              <button
                onClick={() => handleDownloadTrack(currentTrack)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Baixar {currentTrack.audioFormat}</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODALS (AUTH, ADMIN UPLOAD/EDIT, AND RESPONSIVE HTML/CSS CODE VIEWER)
          ===================================================================== */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        pendingDownloadTitle={pendingDownloadTrack?.title}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingDownloadTrack(null);
        }}
        onAuthenticated={(authenticatedUser) => {
          setUser(authenticatedUser);
          showToast(
            authenticatedUser.role === "admin"
              ? "Bem-vindo ao RM Studio! Permissão de Proprietário ativada (Upload MP3/FLAC/WAV, Edição e Exclusão)."
              : `Bem-vindo(a), ${authenticatedUser.name}! Downloads gratuitos liberados para o seu dispositivo.`
          );

          // If visitor registered/logged in to download a specific track, trigger it automatically!
          if (pendingDownloadTrack) {
            const trackToDownload = pendingDownloadTrack;
            setPendingDownloadTrack(null);
            setTimeout(() => {
              const link = document.createElement("a");
              link.href = `/api/tracks/${trackToDownload.id}/download`;
              link.setAttribute(
                "download",
                `${trackToDownload.author} - ${trackToDownload.title}.${trackToDownload.audioFormat.toLowerCase()}`
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 300);
          }
        }}
      />

      <AdminTrackModal
        isOpen={adminModalOpen}
        editingTrack={editingTrack}
        onClose={() => {
          setAdminModalOpen(false);
          setEditingTrack(null);
        }}
        onSaved={(savedTrack, isEdit) => {
          if (isEdit) {
            setTracks((prev) =>
              prev.map((t) => (t.id === savedTrack.id ? savedTrack : t))
            );
            if (currentTrack?.id === savedTrack.id) {
              setCurrentTrack(savedTrack);
            }
            showToast(
              `Faixa "${savedTrack.title}" atualizada com sucesso no PostgreSQL!`
            );
          } else {
            setTracks((prev) => [savedTrack, ...prev]);
            showToast(
              `Upload concluído! "${savedTrack.title}" (${savedTrack.audioFormat}) salvo no PostgreSQL.`
            );
          }
        }}
      />

      <ResponsiveCodeViewerModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      />
    </div>
  );
}
