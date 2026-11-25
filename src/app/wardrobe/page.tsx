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
    <div className="relative min-h-screen overflow-x-clip bg-[#E5E8CE] p-2 sm:p-3 md:p-3.5 text-[#202D1F] transition-colors selection:bg-[#789575]/25 selection:text-[#202D1F]">
      <Interactive3DBackground />

      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#CAD2B4] bg-[#F0F2E3]/95 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
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
                className="inline-flex items-center gap-1.5 text-xs text-[#586B56] hover:text-[#202D1F] transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Atelier Salon</span>
              </Link>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/style"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] px-3.5 py-1.5 text-xs font-medium text-[#202D1F] hover:border-[#789575] transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#789575]" />
                  <span>Occasion Styling</span>
                </Link>

                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#789575] hover:bg-[#668363] text-white px-3.5 py-1.5 text-xs font-medium transition-all shadow-sm cursor-pointer"
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
        <footer className="mt-16 border-t border-[#CAD2B4] bg-[#E0E5C4]/90 py-8 text-xs text-[#485B46]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-serif font-normal tracking-[0.2em] uppercase text-[#202D1F]">
                VESTIAR
              </span>
              <span className="text-[#CAD2B4] mx-2">&bull;</span>
              <span>Collection Archive</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3 text-[#789575]" />
                {dbSource === "database" ? "PostgreSQL Active" : "Local State"}
              </span>
              <span className="text-[#CAD2B4]">&bull;</span>
              <span className="flex items-center gap-1">
                <UploadCloud className="h-3 w-3 text-[#789575]" />
                {isCloudinaryActive ? "Cloudinary CDN Active" : "Direct Media"}
              </span>
              <span className="text-[#CAD2B4]">&bull;</span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-[#789575]" />
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
