"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Disc3,
  Image as ImageIcon,
  FileAudio,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
} from "lucide-react";

export interface TrackItem {
  id: number;
  author: string;
  title: string;
  genre: string;
  year: number;
  albumName: string | null;
  catalogNumber: string | null;
  equipmentInfo: string | null;
  audioFormat: string;
  audioMimeType: string;
  audioFileName: string;
  audioFileSize: number;
  durationSeconds: number;
  sampleRate: string;
  coverFormat: string | null;
  coverMimeType: string | null;
  coverData: string | null;
  playsCount: number;
  downloadsCount: number;
  createdAt: string;
}

interface AdminTrackModalProps {
  isOpen: boolean;
  editingTrack: TrackItem | null;
  onClose: () => void;
  onSaved: (track: TrackItem, isEdit: boolean) => void;
}

const GENRE_SUGGESTIONS = [
  "MPB / Soul",
  "Bossa Nova / Jazz",
  "Soul / Funk",
  "Samba-Rock",
  "Samba-Jazz",
  "Rock Clássico",
  "Jazz Instrumental",
  "Blues / R&B",
  "MPB / Progressivo",
  "Choro / Instrumental",
];

export function AdminTrackModal({
  isOpen,
  editingTrack,
  onClose,
  onSaved,
}: AdminTrackModalProps) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("MPB / Soul");
  const [year, setYear] = useState("1974");
  const [albumName, setAlbumName] = useState(
    "Prensagem Original em Vinil 33⅓ RPM"
  );
  const [equipmentInfo, setEquipmentInfo] = useState(
    "Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze • Pré-Phono Valvulado"
  );
  const [audioFormat, setAudioFormat] = useState<"MP3" | "FLAC" | "WAV">(
    "FLAC"
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTrack) {
      setAuthor(editingTrack.author);
      setTitle(editingTrack.title);
      setGenre(editingTrack.genre);
      setYear(String(editingTrack.year));
      setAlbumName(
        editingTrack.albumName || "Prensagem Original em Vinil 33⅓ RPM"
      );
      setEquipmentInfo(
        editingTrack.equipmentInfo ||
          "Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze"
      );
      setAudioFormat(
        (editingTrack.audioFormat as "MP3" | "FLAC" | "WAV") || "FLAC"
      );
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(editingTrack.coverData);
      setRemoveCover(false);
      setErrorMsg(null);
    } else {
      setAuthor("");
      setTitle("");
      setGenre("MPB / Soul");
      setYear("1975");
      setAlbumName("Prensagem Original em Vinil 33⅓ RPM");
      setEquipmentInfo(
        "Technics SL-1200MK2 • Cápsula Ortofon 2M Bronze • Pré-Phono Valvulado"
      );
      setAudioFormat("FLAC");
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      setRemoveCover(false);
      setErrorMsg(null);
    }
  }, [editingTrack, isOpen]);

  if (!isOpen) return null;

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toUpperCase() || "";
    if (!["MP3", "FLAC", "WAV"].includes(ext)) {
      setErrorMsg(
        "Formato de áudio não suportado. Selecione um arquivo .MP3, .FLAC ou .WAV do seu computador/HD."
      );
      e.target.value = "";
      return;
    }

    setAudioFile(file);
    setAudioFormat(ext as "MP3" | "FLAC" | "WAV");

    // Auto-extract title if empty
    if (!title) {
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(baseName);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toUpperCase() || "";
    if (!["JPG", "JPEG", "PNG", "BMP", "SVG", "GIF"].includes(ext)) {
      setErrorMsg(
        "Formato de capa inválido. Use apenas JPG, JPEG, PNG, BMP, SVG ou GIF."
      );
      e.target.value = "";
      return;
    }

    setCoverFile(file);
    setRemoveCover(false);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFillSample = () => {
    const samples = [
      {
        author: "Marcos Valle",
        title: "Previsão do Tempo (LP Odeon 1973)",
        genre: "MPB / Soul",
        year: "1973",
        album: "LP Odeon SMOFB-3788 • Rip Analógico 24-bit",
      },
      {
        author: "Novos Baianos",
        title: "Mistério do Planeta (Acabou Chorare)",
        genre: "MPB / Samba-Rock",
        year: "1972",
        album: "LP Som Livre 403.6009 • Prensagem Original",
      },
      {
        author: "Baden Powell & Vinicius",
        title: "Canto de Ossanha (Afro-Sambas)",
        genre: "Samba-Jazz",
        year: "1966",
        album: "LP Forma FM-16 • Prensagem Mono Histórica",
      },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    setAuthor(pick.author);
    setTitle(pick.title);
    setGenre(pick.genre);
    setYear(pick.year);
    setAlbumName(pick.album);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!author.trim() || !title.trim() || !genre.trim() || !year.trim()) {
      setErrorMsg(
        "Preencha todos os campos obrigatórios: [Autor], [Nome da Faixa], [Gênero] e [Ano]."
      );
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("author", author.trim());
      formData.append("title", title.trim());
      formData.append("genre", genre.trim());
      formData.append("year", year.trim());
      formData.append("albumName", albumName.trim());
      formData.append("equipmentInfo", equipmentInfo.trim());
      formData.append("audioFormat", audioFormat);

      if (audioFile) {
        formData.append("audioFile", audioFile);
      }
      if (coverFile) {
        formData.append("coverFile", coverFile);
      }
      if (removeCover) {
        formData.append("removeCover", "true");
      }

      const url = editingTrack
        ? `/api/tracks/${editingTrack.id}`
        : "/api/tracks";
      const method = editingTrack ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar faixa no PostgreSQL.");
        setSubmitting(false);
        return;
      }

      onSaved(data.track, Boolean(editingTrack));
      onClose();
    } catch {
      setErrorMsg("Falha de conexão ao salvar no PostgreSQL.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-amber-500/35 bg-[#0b0b0f] shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121218] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Disc3 className="h-5 w-5 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                ACESSO EXCLUSIVO • PROPRIETÁRIO RM STUDIO
              </span>
              <h2 className="text-lg font-bold text-white">
                {editingTrack
                  ? `Editar Faixa #${editingTrack.id} no PostgreSQL`
                  : "Upload de Música de Vinil (Computador / HD)"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {!editingTrack && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
              <span>
                Selecione seu arquivo <strong>MP3, FLAC ou WAV</strong> do HD ou preencha rapidamente para testar:
              </span>
              <button
                type="button"
                onClick={handleFillSample}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 font-semibold text-black hover:bg-amber-400 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Preencher Exemplo de Vinil
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Core Required Fields: [Autor], [Nome da Faixa], [Gênero], [Ano] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                [Autor] Artista / Banda <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Arthur Verocai, Tim Maia..."
                className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                [Nome da Faixa] <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Na Boca do Sol (Lado A)"
                className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                [Gênero] Musical <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                list="rm-genres-list"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: MPB / Soul, Bossa Nova, Jazz..."
                className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
              <datalist id="rm-genres-list">
                {GENRE_SUGGESTIONS.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                [Ano] da Prensagem / Lançamento <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1900}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 1972"
                className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 font-mono text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Audio File Upload Zone (MP3 / FLAC / WAV from Computer / Hard Disk) */}
          <div className="rounded-xl border border-amber-500/30 bg-[#111116] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <FileAudio className="h-4 w-4" />
                Arquivo de Áudio do Computador / HD (MP3 • FLAC • WAV)
              </label>
              <div className="flex items-center gap-1.5">
                {(["MP3", "FLAC", "WAV"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setAudioFormat(fmt)}
                    className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold transition ${
                      audioFormat === fmt
                        ? "bg-amber-500 text-black"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <input
              ref={audioInputRef}
              type="file"
              accept=".mp3,.flac,.wav,audio/mpeg,audio/flac,audio/wav"
              onChange={handleAudioSelect}
              className="hidden"
            />

            <div
              onClick={() => audioInputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-white/15 bg-black/40 p-4 text-center hover:border-amber-500/50 transition"
            >
              {audioFile ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">
                      {audioFile.name}
                    </p>
                    <p className="font-mono text-[11px] text-emerald-300">
                      Formato: {audioFormat} • {(audioFile.size / 1024).toFixed(1)} KB — Pronto para gravar no PostgreSQL
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="mx-auto h-6 w-6 text-amber-400" />
                  <p className="text-xs font-medium text-zinc-200">
                    Clique para selecionar o arquivo{" "}
                    <strong className="text-amber-400">.MP3, .FLAC ou .WAV</strong>{" "}
                    do seu Computador / Hard Disk
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {editingTrack
                      ? `Arquivo atual no PostgreSQL: ${editingTrack.audioFileName} (${editingTrack.audioFormat})`
                      : "Se nenhum arquivo local for selecionado, uma faixa master de vinil em WAV será sintetizada automaticamente no PostgreSQL."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Optional Cover Image Upload Zone (JPG/JPEG/PNG/BMP/SVG/GIF) */}
          <div className="rounded-xl border border-white/10 bg-[#111116] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-200">
                <ImageIcon className="h-4 w-4 text-amber-400" />
                [Capa do Disco] — Opcional (JPG / JPEG / PNG / BMP / SVG / GIF)
              </label>
              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                OPCIONAL
              </span>
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.bmp,.svg,.gif,image/jpeg,image/png,image/bmp,image/svg+xml,image/gif"
              onChange={handleCoverSelect}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {coverPreview && !removeCover ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-amber-500/40 bg-black">
                  <img
                    src={coverPreview}
                    alt="Preview da capa"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                      setRemoveCover(true);
                    }}
                    className="absolute top-1 right-1 rounded bg-black/80 p-1 text-red-400 hover:bg-red-500 hover:text-white transition"
                    title="Remover capa (usar disco de vinil padrão)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-black/50 text-center p-2">
                  <Disc3 className="h-7 w-7 text-zinc-500 mb-1" />
                  <span className="font-mono text-[9px] text-zinc-400">
                    SEM CAPA (VINIL PURO)
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-xs text-zinc-300">
                  Envie a arte da capa nos formatos{" "}
                  <strong className="text-amber-300">
                    JPG, JPEG, PNG, BMP, SVG ou GIF
                  </strong>
                  . Caso prefira deixar sem capa, o site exibirá automaticamente o disco de vinil 33⅓ RPM do RM Studio.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    Escolher Imagem da Capa...
                  </button>
                  {(coverPreview || coverFile) && !removeCover && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                        setRemoveCover(true);
                      }}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                    >
                      Deixar Sem Capa (Opcional)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Vinyl Pressing Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Edição / Selo do Disco (Opcional)
              </label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#15151c] px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Equipamento de Ripagem (Toca-Discos / Cápsula)
              </label>
              <input
                type="text"
                value={equipmentInfo}
                onChange={(e) => setEquipmentInfo(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#15151c] px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition"
            >
              <Upload className="h-4 w-4" />
              {submitting
                ? "Salvando no PostgreSQL..."
                : editingTrack
                  ? "Salvar Alterações no PostgreSQL"
                  : "Fazer Upload para o PostgreSQL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
