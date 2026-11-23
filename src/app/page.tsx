"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CleanNavbar } from "@/components/clean-navbar";
import { CleanHero } from "@/components/clean-hero";
import { AuthModal } from "@/components/auth-modal";
import { Interactive3DBackground } from "@/components/interactive-3d-background";
import { WardrobeEntrance } from "@/components/wardrobe-entrance";
import { TactileCard } from "@/components/tactile-card";
import { useWardrobe } from "@/lib/use-wardrobe";
import {
  Shirt,
  Sparkles,
  Plus,
  ArrowRight,
  Database,
  UploadCloud,
  Cpu,
  Mail,
  Phone,
  Layers,
  Orbit,
  Compass,
} from "lucide-react";

export default function Home() {
  const {
    items,
    user,
    isSampleActive,
    dbSource,
    isCloudinaryActive,
    loadSamples,
    login,
    logout,
    formatRupees,
  } = useWardrobe();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [isDoorsOpen, setIsDoorsOpen] = useState(true);
  const currentYear = 2026;

  // Total closet value in INR
  const totalValuation = items.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FBF9F5] dark:bg-[#0A0C0E] p-2 sm:p-3 md:p-3.5 text-[#1C1917] dark:text-[#EDE7DC] transition-colors selection:bg-[#E0623A]/20 selection:text-[#E0623A]">
      {/* Theatrical 3D Wardrobe Doors Entrance Motion (Autonomous 2-Second Sequence with Name Slash) */}
      <WardrobeEntrance
        isOpen={isDoorsOpen}
        onOpen={() => setIsDoorsOpen(true)}
        onClose={() => setIsDoorsOpen(false)}
        autoOpenDelay={2000}
      />

      {/* Interactive 3D Background (Hovers & tilts dynamically as the mouse moves) */}
      <Interactive3DBackground />

      {/* Cushioned Architectural Magazine Frame */}
      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-white/95 dark:bg-[#121519]/90 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
        <div>
          {/* Editorial Minimalist Navbar */}
          <CleanNavbar
            totalPieces={items.length}
            user={user}
            onOpenAuth={() => {
              setAuthReason("Sign in to sync your wardrobe across all your devices.");
              setAuthModalOpen(true);
            }}
            onSignOut={logout}
            onToggleDoors={() => setIsDoorsOpen((prev) => !prev)}
            isDoorsOpen={isDoorsOpen}
          />

          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* 1. Hero Section */}
            <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 text-center select-none">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col items-center">
                {/* Monogram Crest */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#EAE6DF] dark:border-[#2E2A26] bg-white/80 dark:bg-[#1C1A17]/80 backdrop-blur-md px-4 py-1.5 text-xs text-[#1C1917] dark:text-[#F5F2EC] mb-5 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E0623A] animate-pulse" />
                  <span className="font-serif tracking-wider uppercase text-[10px] text-stone-500 dark:text-stone-400">
                    Digital Atelier
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">&bull;</span>
                  <span className="text-xs font-serif italic text-stone-600 dark:text-stone-300">
                    Bespoke Capsule Architecture
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-[#1C1917] dark:text-[#F5F2EC] font-normal leading-[1.1] max-w-2xl">
                  The sanctuary of <br />
                  <span className="italic font-light text-[#E0623A]">
                    intentional dressing.
                  </span>
                </h1>

                <p className="mt-5 text-sm sm:text-base text-stone-600 dark:text-stone-400 font-normal max-w-xl mx-auto leading-relaxed">
                  An intimate digital salon for cataloging everyday garments. Tonal harmony algorithms, silhouette proportions, and bespoke occasion curation.
                </p>

                {/* Primary Route CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/wardrobe"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1C1917] hover:bg-black dark:bg-[#F5F2EC] dark:hover:bg-white text-white dark:text-[#1C1917] px-6 py-3 text-xs sm:text-sm font-medium transition-all shadow-sm group cursor-pointer"
                  >
                    <Shirt className="h-4 w-4" />
                    <span>Enter Closet Archive</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/upload"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#E0623A] hover:bg-[#C8532F] text-white px-6 py-3 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload New Garment</span>
                  </Link>

                  {items.length === 0 && (
                    <button
                      onClick={loadSamples}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#D1DFD0] bg-[#E8EEE7] hover:bg-[#DCE6DA] text-[#2D4A34] dark:border-[#27332A] dark:bg-[#1E2E22] dark:text-[#D3E0D5] px-5 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
                    >
                      <Layers className="h-4 w-4" />
                      <span>Load Sample Wardrobe</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Atelier Salon Dedicated Navigation Cards */}
            <section className="py-8 sm:py-12 border-t border-[#EAE6DF] dark:border-[rgba(237,231,220,0.12)]">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Salon Portals
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] dark:text-[#F5F2EC] mt-1">
                  Atelier Navigation &amp; Workspaces
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Each salon workspace is separated into dedicated fast pages for distraction-free styling.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Digital Closet Collection */}
                <Link href="/wardrobe" className="group">
                  <TactileCard
                    maxTilt={4}
                    elevation={10}
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] p-6 sm:p-7 transition-all duration-300 hover:border-[#E0623A]/50 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6EE] dark:bg-stone-800 text-[#E0623A]">
                          <Orbit className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-[#EAE6DF] dark:border-[#2E2A26] bg-stone-50 dark:bg-stone-900 px-2 py-0.5 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                          {items.length} Pieces
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#1C1917] dark:text-[#F5F2EC] group-hover:text-[#E0623A] transition-colors">
                        Collection Archive &amp; 3D Gallery
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                        Explore your curated wardrobe via the WebGL 3D circular cylinder or tactile physics grid. Features Chelsea boots, cashmere mufflers, merino socks, and fine apparel.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-600 dark:text-stone-400 font-mono">
                        Valuation: {formatRupees(totalValuation)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#E0623A] group-hover:translate-x-1 transition-transform">
                        <span>Open Archive</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </TactileCard>
                </Link>

                {/* Card 2: Garment Digitization Studio */}
                <Link href="/upload" className="group">
                  <TactileCard
                    maxTilt={4}
                    elevation={10}
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] p-6 sm:p-7 transition-all duration-300 hover:border-[#E0623A]/50 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EEE7] dark:bg-[#1E2E22] text-[#2D4A34] dark:text-[#D3E0D5]">
                          <Plus className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                          AI Multimodal
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#1C1917] dark:text-[#F5F2EC] group-hover:text-[#E0623A] transition-colors">
                        Digitization Studio
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                        Drag and drop photos of shoes, mufflers, socks, and garments. Google Gemini Vision automatically classifies fabric, extracts color hexes, and detects occasions.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-500 dark:text-stone-400">
                        Zero manual typing
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#E0623A] group-hover:translate-x-1 transition-transform">
                        <span>Upload Photo</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </TactileCard>
                </Link>

                {/* Card 3: Occasion Styling Salon */}
                <Link href="/style" className="group">
                  <TactileCard
                    maxTilt={4}
                    elevation={10}
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] p-6 sm:p-7 transition-all duration-300 hover:border-[#E0623A]/50 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDF8ED] dark:bg-[#251E12] text-[#7B6127] dark:text-[#E5C378]">
                          <Compass className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                          3D Mannequin
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#1C1917] dark:text-[#F5F2EC] group-hover:text-[#E0623A] transition-colors">
                        Occasion Styling Salon
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                        Curate complete ensembles for Gym, Work, Evening Salon, and Casual Weekends. Features weather temperature matrix and save-to-lookbook capabilities.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-500 dark:text-stone-400">
                        Smart Tonal Harmony
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#E0623A] group-hover:translate-x-1 transition-transform">
                        <span>Pair Outfits</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </TactileCard>
                </Link>
              </div>
            </section>
          </main>
        </div>

        {/* Minimalist Editorial Footer */}
        <footer className="mt-20 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-[#F8F5EE]/90 dark:bg-[#0A0C0E]/80 py-10 text-xs text-stone-600 dark:text-stone-400">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Link href="/" className="font-serif font-light tracking-[0.2em] uppercase text-[#1C1917] dark:text-[#EDE7DC] text-base">
                    Vestiar
                  </Link>
                  <span className="text-[#E0623A]">:</span>
                  <span className="font-normal text-stone-700 dark:text-[#EDE7DC]/80 font-serif italic">
                    Atelier de Garde-Robe Privée &amp; Occasion Dressing
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-[#9EA5A8] mt-1 font-light">
                  Haute capsule curation, tonal color harmony, and bespoke silhouette styling.
                </p>
              </div>

              {/* Infrastructure Indicators */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <Database className="h-3 w-3 text-stone-400" />
                  <span>
                    Database:{" "}
                    {dbSource === "database" ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">PostgreSQL Connected</strong>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400">Local State Active</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <UploadCloud className="h-3 w-3 text-stone-400" />
                  <span>
                    Storage:{" "}
                    {isCloudinaryActive ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Cloud CDN Active</strong>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400">Direct Storage</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <Cpu className="h-3 w-3 text-[#E0623A]" />
                  <span>
                    Vision Engine:{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Gemini Multimodal Active</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Links & Contact */}
            <div className="pt-6 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
              <div className="flex items-center gap-5 flex-wrap">
                <span>&copy; {currentYear} VESTIAR Atelier. All rights reserved.</span>
                <Link href="/privacy" className="hover:text-stone-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-stone-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors">
                  Terms of Service
                </Link>
              </div>

              <div className="flex items-center gap-4 text-stone-600 dark:text-stone-400">
                <a
                  href="mailto:concierge@vestiar.com"
                  className="inline-flex items-center gap-1 hover:text-[#E0623A] transition-colors"
                >
                  <Mail className="h-3 w-3 text-stone-400" />
                  <span>concierge@vestiar.com</span>
                </a>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-1 hover:text-[#E0623A] transition-colors"
                >
                  <Phone className="h-3 w-3 text-stone-400" />
                  <span>+1 (800) 555-0199</span>
                </a>
              </div>
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
