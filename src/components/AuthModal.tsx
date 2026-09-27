"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  LogIn,
  ShieldCheck,
  Download,
  X,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "visitor-register" | "visitor-login" | "admin-login";
  pendingDownloadTitle?: string | null;
  onClose: () => void;
  onAuthenticated: (user: SessionUser) => void;
}

export function AuthModal({
  isOpen,
  initialMode,
  pendingDownloadTitle,
  onClose,
  onAuthenticated,
}: AuthModalProps) {
  const [mode, setMode] = useState<
    "visitor-register" | "visitor-login" | "admin-login"
  >(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    if (initialMode === "admin-login") {
      setEmail("admin@rmstudio.com");
      setPassword("rmstudio2025");
    } else if (initialMode === "visitor-login") {
      setEmail("visitante@rmstudio.com");
      setPassword("vinil2025");
    } else {
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint =
        mode === "visitor-register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "visitor-register"
          ? { name, email, password }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Não foi possível autenticar.");
        setLoading(false);
        return;
      }

      onAuthenticated(data.user);
      onClose();
    } catch {
      setErrorMsg("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (
    quickEmail: string,
    quickPassword: string
  ) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: quickEmail, password: quickPassword }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onAuthenticated(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || "Erro ao autenticar.");
      }
    } catch {
      setErrorMsg("Falha na requisição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0f] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121218] px-6 py-4">
          <div className="flex items-center gap-2.5">
            {mode === "admin-login" ? (
              <ShieldCheck className="h-5 w-5 text-amber-400" />
            ) : (
              <Download className="h-5 w-5 text-emerald-400" />
            )}
            <h3 className="text-base font-bold text-white">
              {mode === "admin-login"
                ? "Proprietário RM Studio (Apenas Eu)"
                : mode === "visitor-register"
                  ? "Cadastro Gratuito de Visitante"
                  : "Login de Visitante Cadastrado"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-3 border-b border-white/10 bg-[#08080b] p-1.5 gap-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("visitor-register");
              setEmail("");
              setPassword("");
              setErrorMsg(null);
            }}
            className={`rounded-lg py-2 font-semibold transition ${
              mode === "visitor-register"
                ? "bg-emerald-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Criar Conta Grátis
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("visitor-login");
              setEmail("visitante@rmstudio.com");
              setPassword("vinil2025");
              setErrorMsg(null);
            }}
            className={`rounded-lg py-2 font-semibold transition ${
              mode === "visitor-login"
                ? "bg-emerald-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Entrar (Visitante)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("admin-login");
              setEmail("admin@rmstudio.com");
              setPassword("rmstudio2025");
              setErrorMsg(null);
            }}
            className={`rounded-lg py-2 font-semibold transition ${
              mode === "admin-login"
                ? "bg-amber-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sou Proprietário
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {pendingDownloadTitle && mode !== "admin-login" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              <p className="font-semibold text-emerald-300">
                Download Gratuito Liberado para Cadastrados!
              </p>
              <p className="mt-0.5 text-zinc-300">
                Cadastre-se gratuitamente ou entre na sua conta para baixar{" "}
                <strong className="text-white">&ldquo;{pendingDownloadTitle}&rdquo;</strong>{" "}
                diretamente para o seu dispositivo.
              </p>
            </div>
          )}

          {mode === "admin-login" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 space-y-2">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                Acesso Exclusivo do Proprietário RM Studio
              </p>
              <p className="text-zinc-300">
                Apenas o proprietário possui permissão para fazer upload de arquivos MP3/FLAC/WAV do computador/HD, gerenciar, editar ou excluir faixas do PostgreSQL.
              </p>
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin("admin@rmstudio.com", "rmstudio2025")
                }
                className="w-full rounded-lg bg-amber-500/25 border border-amber-500/50 py-1.5 font-mono text-[11px] font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition"
              >
                ⚡ Entrar Agora como Proprietário (admin@rmstudio.com)
              </button>
            </div>
          )}

          {mode !== "admin-login" && (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs">
              <span className="text-zinc-400">Quer testar o download imediato?</span>
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin("visitante@rmstudio.com", "vinil2025")
                }
                className="font-semibold text-emerald-400 hover:underline"
              >
                Entrar com Conta Visitante Demo →
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === "visitor-register" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                Seu Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Paula Silva"
                className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                mode === "admin-login"
                  ? "admin@rmstudio.com"
                  : "seuemail@exemplo.com"
              }
              className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-[#15151c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black shadow-lg transition ${
              mode === "admin-login"
                ? "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
                : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20"
            }`}
          >
            {mode === "visitor-register" ? (
              <>
                <UserPlus className="h-4 w-4" />
                {loading
                  ? "Criando Cadastro..."
                  : "Cadastrar Grátis e Liberar Downloads"}
              </>
            ) : mode === "admin-login" ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                {loading
                  ? "Autenticando Proprietário..."
                  : "Acessar Painel do Proprietário RM Studio"}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {loading ? "Entrando..." : "Entrar e Baixar Músicas Grátis"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
