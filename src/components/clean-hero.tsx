"use client";

import React from "react";
import { ArrowDown, Plus, Layers, DoorOpen, DoorClosed, Sparkles } from "lucide-react";
import { VestiarMonogram } from "@/components/vestiar-monogram";

interface CleanHeroProps {
  onScrollToUpload: () => void;
  onScrollToCloset: () => void;
  onLoadSamples: () => void;
  isEmpty: boolean;
  onToggleDoors?: () => void;
  isDoorsOpen?: boolean;
}

export function CleanHero({
  onScrollToUpload,
  onScrollToCloset,
  onLoadSamples,
  isEmpty,
  onToggleDoors,
  isDoorsOpen = true,
}: CleanHeroProps) {
  return (
    <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 text-center select-none">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col items-center">
        {/* Bespoke Luxury Monogram Crest */}
        <div className="mb-6 flex flex-col items-center">
          <VestiarMonogram size={56} variant="crest" className="mb-3 hover:scale-105 transition-transform" />
          <span className="font-serif tracking-[0.3em] text-[11px] sm:text-xs uppercase font-normal text-[#586B56]">
            Vestiar &bull; Atelier Privé
          </span>
        </div>

        {/* Editorial Architectural Tag */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#CAD2B4] bg-[#EFF2E1]/90 backdrop-blur-md px-4 py-1.5 text-xs text-[#202D1F] mb-5 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#789575] animate-pulse" />
          <span className="font-serif tracking-wider uppercase text-[10px] text-[#586B56]">
            Digital Archive
          </span>
          <span className="text-[#CAD2B4]">&bull;</span>
          <span className="text-xs font-serif italic text-[#485B46]">
            Occasion Styling &amp; Curated Silhouettes
          </span>
        </div>

        {/* Bespoke Roman Luxury Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-[#202D1F] font-normal leading-[1.1] max-w-2xl">
          The sanctuary of <br />
          <span className="italic font-normal text-[#789575]">
            intentional dressing.
          </span>
        </h1>

        {/* Refined Subtext */}
        <p className="mt-5 text-sm sm:text-base text-[#485B46] font-normal max-w-xl mx-auto leading-relaxed">
          An intimate digital salon for cataloging everyday garments. Tonal harmony algorithms, silhouette proportions, and bespoke occasion curation.
        </p>

        {/* Quick CTA Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {/* Wardrobe Motion / Doors Toggle */}
          {onToggleDoors && (
            <button
              onClick={onToggleDoors}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#789575]/40 bg-[#DCE2C6]/60 hover:border-[#789575] text-[#202D1F] px-5 py-2.5 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer group"
              title="Experience the theatrical 3D wardrobe doors animation"
            >
              {isDoorsOpen ? (
                <DoorClosed className="h-4 w-4 text-[#789575] group-hover:scale-110 transition-transform" />
              ) : (
                <DoorOpen className="h-4 w-4 text-[#789575] group-hover:scale-110 transition-transform" />
              )}
              <span>{isDoorsOpen ? "Close Wardrobe Doors" : "Open Wardrobe Doors"}</span>
            </button>
          )}

          {/* Upload Button */}
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#789575] hover:bg-[#668363] text-white px-5 py-2.5 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Garment</span>
          </button>

          {/* Sample / Collection Button */}
          {isEmpty ? (
            <button
              onClick={onLoadSamples}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#CAD2B4] bg-[#EFF2E1] hover:bg-[#DCE2C6] text-[#202D1F] px-5 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#789575]" />
              <span>Load 4 Sample Pieces</span>
            </button>
          ) : (
            <button
              onClick={onScrollToCloset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#CAD2B4] bg-[#EFF2E1] hover:bg-[#DCE2C6] text-[#202D1F] px-5 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="h-4 w-4 text-stone-400" />
              <span>View Collection Archive</span>
              <ArrowDown className="h-3.5 w-3.5 text-stone-400" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CleanHero;
