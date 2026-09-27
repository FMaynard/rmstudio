import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RM Studio | Acervo de Discos de Vinil Ripados (MP3 • FLAC • WAV)",
  description:
    "Plataforma de hospedagem e compartilhamento de músicas de discos de vinil ripados pelo RM Studio. Ouça via streaming gratuito ou cadastre-se para baixar em MP3, FLAC e WAV.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#050505] text-[#F4F4F6] antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
