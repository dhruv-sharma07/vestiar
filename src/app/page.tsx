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
  DoorOpen,
  DoorClosed,
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
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const currentYear = 2026;

  // Total closet value in INR
  const totalValuation = items.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#E5E8CE] p-2 sm:p-3 md:p-3.5 text-[#202D1F] transition-colors selection:bg-[#789575]/25 selection:text-[#202D1F]">
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
      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#CAD2B4] bg-[#F0F2E3]/95 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
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
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#CAD2B4] bg-[#EFF2E1]/90 backdrop-blur-md px-4 py-1.5 text-xs text-[#202D1F] mb-5 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#789575] animate-pulse" />
                  <span className="font-serif tracking-wider uppercase text-[10px] text-[#586B56]">
                    Digital Atelier
                  </span>
                  <span className="text-[#CAD2B4]">&bull;</span>
                  <span className="text-xs font-serif italic text-[#485B46]">
                    Bespoke Capsule Architecture
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-[#202D1F] font-normal leading-[1.1] max-w-2xl">
                  The sanctuary of <br />
                  <span className="italic font-normal text-[#789575]">
                    intentional dressing.
                  </span>
                </h1>

                <p className="mt-5 text-sm sm:text-base text-[#485B46] font-normal max-w-xl mx-auto leading-relaxed">
                  An intimate digital salon for cataloging everyday garments. Tonal harmony algorithms, silhouette proportions, and bespoke occasion curation.
                </p>

                {/* Primary Route CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  {/* Theatrical Wardrobe Doors Toggle Button */}
                  <button
                    onClick={() => setIsDoorsOpen((prev) => !prev)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#789575]/40 bg-[#DCE2C6]/60 hover:border-[#789575] text-[#202D1F] px-5 py-3 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer group"
                    title="Experience the theatrical 3D wardrobe doors animation"
                  >
                    {isDoorsOpen ? (
                      <DoorClosed className="h-4 w-4 text-[#789575] group-hover:scale-110 transition-transform" />
                    ) : (
                      <DoorOpen className="h-4 w-4 text-[#789575] group-hover:scale-110 transition-transform" />
                    )}
                    <span>{isDoorsOpen ? "Close Wardrobe Doors" : "Enter Wardrobe (Open Doors)"}</span>
                  </button>

                  <Link
                    href="/wardrobe"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#202D1F] hover:bg-[#151E14] text-white px-6 py-3 text-xs sm:text-sm font-medium transition-all shadow-sm group cursor-pointer"
                  >
                    <Shirt className="h-4 w-4" />
                    <span>Enter Closet Archive</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/upload"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#789575] hover:bg-[#668363] text-white px-6 py-3 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload New Garment</span>
                  </Link>

                  {items.length === 0 && (
                    <button
                      onClick={loadSamples}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#CAD2B4] bg-[#EFF2E1] hover:bg-[#DCE2C6] text-[#202D1F] px-5 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
                    >
                      <Layers className="h-4 w-4 text-[#789575]" />
                      <span>Load Sample Wardrobe</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Atelier Salon Dedicated Navigation Cards */}
            <section className="py-8 sm:py-12 border-t border-[#CAD2B4]">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#586B56]">
                  Salon Portals
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#202D1F] mt-1">
                  Atelier Navigation &amp; Workspaces
                </h2>
                <p className="text-xs sm:text-sm text-[#485B46] mt-1">
                  Each salon workspace is separated into dedicated fast pages for distraction-free styling.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Digital Closet Collection */}
                <Link href="/wardrobe" className="group">
                  <TactileCard
                    maxTilt={4}
                    elevation={10}
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#CAD2B4] bg-[#EFF2E1] p-6 sm:p-7 transition-all duration-300 hover:border-[#789575] shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCE2C6] text-[#789575]">
                          <Orbit className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-[#CAD2B4] bg-[#E5E8CE] px-2 py-0.5 text-[10px] font-mono text-[#586B56]">
                          {items.length} Pieces
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#202D1F] group-hover:text-[#789575] transition-colors">
                        Collection Archive &amp; 3D Gallery
                      </h3>
                      <p className="text-xs text-[#586B56] mt-2 leading-relaxed">
                        Explore your curated wardrobe via the WebGL 3D circular cylinder or tactile physics grid. Features Chelsea boots, cashmere mufflers, merino socks, and fine apparel.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#CAD2B4]/60 flex items-center justify-between text-xs font-medium">
                      <span className="text-[#202D1F] font-mono">
                        Valuation: {formatRupees(totalValuation)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#789575] group-hover:translate-x-1 transition-transform">
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
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#CAD2B4] bg-[#EFF2E1] p-6 sm:p-7 transition-all duration-300 hover:border-[#789575] shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCE2C6] text-[#789575]">
                          <Plus className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-[#CAD2B4] bg-[#E5E8CE] px-2 py-0.5 text-[10px] font-mono text-[#586B56]">
                          AI Multimodal
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#202D1F] group-hover:text-[#789575] transition-colors">
                        Digitization Studio
                      </h3>
                      <p className="text-xs text-[#586B56] mt-2 leading-relaxed">
                        Drag and drop photos of shoes, mufflers, socks, and garments. Google Gemini Vision automatically classifies fabric, extracts color hexes, and detects occasions.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#CAD2B4]/60 flex items-center justify-between text-xs font-medium">
                      <span className="text-[#586B56]">
                        Zero manual typing
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#789575] group-hover:translate-x-1 transition-transform">
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
                    className="h-full flex flex-col justify-between rounded-2xl border border-[#CAD2B4] bg-[#EFF2E1] p-6 sm:p-7 transition-all duration-300 hover:border-[#789575] shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCE2C6] text-[#789575]">
                          <Compass className="h-5 w-5" />
                        </div>
                        <span className="rounded-md border border-[#CAD2B4] bg-[#E5E8CE] px-2 py-0.5 text-[10px] font-mono text-[#586B56]">
                          3D Mannequin
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#202D1F] group-hover:text-[#789575] transition-colors">
                        Occasion Styling Salon
                      </h3>
                      <p className="text-xs text-[#586B56] mt-2 leading-relaxed">
                        Curate complete ensembles for Gym, Work, Evening Salon, and Casual Weekends. Features weather temperature matrix and save-to-lookbook capabilities.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#CAD2B4]/60 flex items-center justify-between text-xs font-medium">
                      <span className="text-[#586B56]">
                        Smart Tonal Harmony
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#789575] group-hover:translate-x-1 transition-transform">
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
        <footer className="mt-20 border-t border-[#CAD2B4] bg-[#E0E5C4]/90 py-10 text-xs text-[#485B46]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Link href="/" className="font-serif font-normal tracking-[0.2em] uppercase text-[#202D1F] text-base">
                    Vestiar
                  </Link>
                  <span className="text-[#789575]">:</span>
                  <span className="font-normal text-[#202D1F] font-serif italic">
                    Atelier de Garde-Robe Privée &amp; Occasion Dressing
                  </span>
                </div>
                <p className="text-[11px] text-[#586B56] mt-1 font-light">
                  Haute capsule curation, tonal color harmony, and bespoke silhouette styling.
                </p>
              </div>

              {/* Infrastructure Indicators */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-md border border-[#CAD2B4] bg-[#EFF2E1] px-2.5 py-1 text-[11px] text-[#202D1F]">
                  <Database className="h-3 w-3 text-[#789575]" />
                  <span>
                    Database:{" "}
                    {dbSource === "database" ? (
                      <strong className="text-[#202D1F] font-semibold">PostgreSQL Connected</strong>
                    ) : (
                      <span className="text-[#586B56]">Local State Active</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#CAD2B4] bg-[#EFF2E1] px-2.5 py-1 text-[11px] text-[#202D1F]">
                  <UploadCloud className="h-3 w-3 text-[#789575]" />
                  <span>
                    Storage:{" "}
                    {isCloudinaryActive ? (
                      <strong className="text-[#202D1F] font-semibold">Cloud CDN Active</strong>
                    ) : (
                      <span className="text-[#586B56]">Direct Storage</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#CAD2B4] bg-[#EFF2E1] px-2.5 py-1 text-[11px] text-[#202D1F]">
                  <Cpu className="h-3 w-3 text-[#789575]" />
                  <span>
                    Vision Engine:{" "}
                    <strong className="text-[#202D1F] font-semibold">Gemini Multimodal Active</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Links & Contact */}
            <div className="pt-6 border-t border-[#CAD2B4]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
              <div className="flex items-center gap-5 flex-wrap">
                <span>&copy; {currentYear} VESTIAR Atelier. All rights reserved.</span>
                <Link href="/privacy" className="hover:text-[#202D1F] underline-offset-4 hover:underline transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-[#202D1F] underline-offset-4 hover:underline transition-colors">
                  Terms of Service
                </Link>
              </div>

              <div className="flex items-center gap-4 text-[#485B46]">
                <a
                  href="mailto:concierge@vestiar.com"
                  className="inline-flex items-center gap-1 hover:text-[#789575] transition-colors"
                >
                  <Mail className="h-3 w-3 text-[#789575]" />
                  <span>concierge@vestiar.com</span>
                </a>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-1 hover:text-[#789575] transition-colors"
                >
                  <Phone className="h-3 w-3 text-[#789575]" />
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
