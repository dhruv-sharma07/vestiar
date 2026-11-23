"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CleanNavbar } from "@/components/clean-navbar";
import { CleanOccasionBar } from "@/components/clean-occasion-bar";
import { AuthModal } from "@/components/auth-modal";
import { Interactive3DBackground } from "@/components/interactive-3d-background";
import { useWardrobe } from "@/lib/use-wardrobe";
import { ArrowLeft, Plus, Shirt } from "lucide-react";

export default function StylePage() {
  const { items, user, loadSamples, login, logout } = useWardrobe();
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
              setAuthReason("Sign in to save curated occasion outfits to your permanent lookbook.");
              setAuthModalOpen(true);
            }}
            onSignOut={logout}
          />

          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Top Navigation Bar */}
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
                  href="/wardrobe"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white/80 dark:bg-stone-900/60 px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-stone-400 transition-all shadow-2xs"
                >
                  <Shirt className="h-3.5 w-3.5 text-[#E0623A]" />
                  <span>My Closet Archive ({items.length})</span>
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

            {/* Clean Occasion Styling Bar with Mannequin & Weather Matrix */}
            <CleanOccasionBar
              items={items}
              onLoadSamples={loadSamples}
              userEmail={user?.email}
            />
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-[#F8F5EE]/90 dark:bg-[#0A0C0E]/80 py-8 text-xs text-stone-600 dark:text-stone-400">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-light tracking-[0.2em] uppercase text-[#1C1917] dark:text-[#EDE7DC]">
                VESTIAR
              </span>
              <span className="text-stone-400">&bull;</span>
              <span>Occasion Styling &amp; Curated Lookbook Salon</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/wardrobe" className="hover:underline text-[#E0623A]">View Closet &rarr;</Link>
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
