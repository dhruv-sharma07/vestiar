"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CleanNavbar } from "@/components/clean-navbar";
import { CleanWardrobeGrid } from "@/components/clean-wardrobe-grid";
import { AuthModal } from "@/components/auth-modal";
import { Interactive3DBackground } from "@/components/interactive-3d-background";
import { useWardrobe } from "@/lib/use-wardrobe";
import { ArrowLeft, Plus, Sparkles, Database, UploadCloud, Cpu } from "lucide-react";

export default function WardrobePage() {
  const {
    items,
    user,
    isSampleActive,
    dbSource,
    isCloudinaryActive,
    removeItem,
    loadSamples,
    clearSamples,
    login,
    logout,
  } = useWardrobe();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState("");

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FBF9F5] dark:bg-[#0A0C0E] p-2 sm:p-3 md:p-3.5 text-[#1C1917] dark:text-[#EDE7DC] transition-colors selection:bg-[#E0623A]/20 selection:text-[#E0623A]">
      <Interactive3DBackground />

      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-white/95 dark:bg-[#121519]/90 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
        <div>
          <CleanNavbar
            totalPieces={items.length}
            user={user}
            onOpenAuth={() => {
              setAuthReason("Sign in with Google to sync your collection across devices.");
              setAuthModalOpen(true);
            }}
            onSignOut={logout}
          />

          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Top Navigation Bar & Action CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Atelier Salon</span>
              </Link>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/style"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white/80 dark:bg-stone-900/60 px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-stone-400 transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#E0623A]" />
                  <span>Occasion Styling</span>
                </Link>

                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-3.5 py-1.5 text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Garment</span>
                </Link>
              </div>
            </div>

            {/* Clean Wardrobe Grid with 3D Circular WebGL and Tactile Grid */}
            <CleanWardrobeGrid
              items={items}
              onLoadSamples={loadSamples}
              onClearSamples={clearSamples}
              onRemoveItem={removeItem}
              isSampleActive={isSampleActive}
            />
          </main>
        </div>

        {/* Footer with Database & Storage Status */}
        <footer className="mt-16 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-[#F8F5EE]/90 dark:bg-[#0A0C0E]/80 py-8 text-xs text-stone-600 dark:text-stone-400">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-serif font-light tracking-[0.2em] uppercase text-[#1C1917] dark:text-[#EDE7DC]">
                VESTIAR
              </span>
              <span className="text-stone-400 mx-2">&bull;</span>
              <span>Collection Archive</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3 text-stone-400" />
                {dbSource === "database" ? "PostgreSQL Active" : "Local State"}
              </span>
              <span className="text-stone-300 dark:text-stone-700">&bull;</span>
              <span className="flex items-center gap-1">
                <UploadCloud className="h-3 w-3 text-stone-400" />
                {isCloudinaryActive ? "Cloudinary CDN Active" : "Direct Media"}
              </span>
              <span className="text-stone-300 dark:text-stone-700">&bull;</span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-[#E0623A]" />
                Gemini Vision Active
              </span>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={login}
        triggerReason={authReason}
      />
    </div>
  );
}
