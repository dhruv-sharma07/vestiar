"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Heart, Sparkles, Tag, Compass, Layers, Check } from "lucide-react";
import { CuratedItem, formatRupees } from "@/lib/curated-wardrobe";

interface GarmentInspectionModalProps {
  item: CuratedItem | null;
  open: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onStylePiece?: (item: CuratedItem) => void;
}

// Fabric & styling notes generator for luxury tactile feel
function getFabricProfile(category: string, subCategory: string) {
  const cat = category.toLowerCase();
  const sub = (subCategory || "").toLowerCase();

  if (cat === "tops") {
    if (sub.includes("knit") || sub.includes("sweater")) {
      return {
        material: "100% Extra-Fine Merino Wool",
        weave: "12-Gauge Milano Rib Knit",
        weight: "Medium-weight (310 GSM)",
        care: "Dry clean or hand wash cold, dry flat",
        drape: "Fluid drape with structural collar retention",
      };
    }
    return {
      material: "100% Combed Organic Pima Cotton",
      weave: "Compact Single Jersey Weave",
      weight: "Heavyweight (260 GSM)",
      care: "Machine wash delicate, line dry in shade",
      drape: "Architectural boxy silhouette, structured shoulder line",
    };
  }

  if (cat === "bottoms") {
    if (sub.includes("trouser") || sub.includes("pleat")) {
      return {
        material: "98% Tropical Virgin Wool, 2% Elastane",
        weave: "Fine High-Twist Gabardine",
        weight: "Four-Season (280 GSM)",
        care: "Specialist dry clean only",
        drape: "Sharp pressed front crease, relaxed straight leg fall",
      };
    }
    return {
      material: "100% Japanese Selvedge Cotton",
      weave: "13.5 oz Right-Hand Broken Twill",
      weight: "Rigid Structured Denim",
      care: "Wash inside-out rarely, hang dry",
      drape: "Raw tailored fit with natural body molding",
    };
  }

  if (cat === "footwear") {
    return {
      material: "Full-Grain Tuscan Calfskin & Rubber Sole",
      weave: "Goodyear-Welted Construction",
      weight: "Reinforced Heel Counter",
      care: "Natural beeswax polish, cedar shoe trees",
      drape: "Ergonomic arch cradle with memory footbed",
    };
  }

  return {
    material: "Technical Recycled Polyamide & Cotton Blend",
    weave: "DWR Coated Water-Repellent Twill",
    weight: "Substantial Weatherproof Layer",
    care: "Cool gentle machine wash",
    drape: "Relaxed minimalist silhouette with clean dropped shoulder",
  };
}

function getStylingTip(item: CuratedItem) {
  const cat = item.category.toLowerCase();
  const occs = item.occasions.join(", ");

  if (cat === "tops") {
    return `Balanced proportions work best: pair this ${item.colorName.toLowerCase()} piece with wide-leg neutral trousers or pleated shorts for an intentional, relaxed architectural look.`;
  }
  if (cat === "bottoms") {
    return `A foundational wardrobe anchor. Pairs harmoniously with structured knitwear and low-profile leather footwear for effortless transition between ${occs}.`;
  }
  if (cat === "footwear") {
    return `Clean lines anchor full outfits without competing. Complements tailored cuffs or relaxed denim stacks with refined ground presence.`;
  }
  return `An elevated outer layer designed to frame silhouettes cleanly over tonal monochromatic base pieces.`;
}

export function GarmentInspectionModal({
  item,
  open,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onStylePiece,
}: GarmentInspectionModalProps) {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const fabric = getFabricProfile(item.category, item.subCategory);
  const stylingTip = getStylingTip(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/50 dark:bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5] dark:bg-[#141210] p-6 sm:p-8 shadow-2xl z-10 text-[#1C1917] dark:text-[#F5F2EC]">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] dark:border-[#2E2A26] mb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 uppercase tracking-wider">
              Garment Inspection
            </span>
            <span className="text-xs text-stone-400 font-serif">
              {item.brand} &bull; {item.subCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isFavorite
                    ? "border-rose-300 bg-rose-50 text-rose-500 dark:bg-rose-950/40"
                    : "border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-500 hover:text-rose-500"
                }`}
                title={isFavorite ? "Favorited" : "Favorite piece"}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-500 hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close inspection panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Image left, Specs right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left: 3:4 Vertical High-Fidelity Garment Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#EAE6DF] dark:border-[#2E2A26] bg-stone-100 dark:bg-stone-800 shadow-luxury group">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
              priority
            />

            {/* Category tag badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize backdrop-blur-md ${
                  item.pastelTag?.bg || "bg-[#E8EEE7]"
                } ${item.pastelTag?.text || "text-[#2D4A34]"} ${
                  item.pastelTag?.border || "border-[#D1DFD0]"
                }`}
              >
                {item.category}
              </span>
            </div>

            {/* Price badge */}
            <div className="absolute bottom-3 right-3 rounded-lg border border-black/10 dark:border-white/10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3 py-1 text-xs font-semibold font-mono text-[#E0623A] dark:text-[#EDE7DC]">
              {formatRupees(item.price)}
            </div>
          </div>

          {/* Right: Architectural Textile & Styling Dossier */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
                {item.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Cataloged under <strong className="text-stone-700 dark:text-stone-300 font-medium">{item.category}</strong> &bull; Curated Capsule Piece
              </p>
            </div>

            {/* Color Harmony Specs */}
            <div className="rounded-xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] p-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 block mb-2.5">
                Tonal Palette &amp; Pigment
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-7 w-7 rounded-lg border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <div>
                    <span className="text-xs font-medium block">{item.colorName}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{item.colorHex}</span>
                  </div>
                </div>

                <span className="text-[11px] rounded-md border border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5] dark:bg-stone-900 px-2 py-0.5 text-stone-500">
                  Neutral Anchor
                </span>
              </div>
            </div>

            {/* Fabric & Construction Breakdown */}
            <div className="rounded-xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] p-4 space-y-2.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 block">
                Material &amp; Architecture
              </span>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Composition</span>
                  <span className="font-medium">{fabric.material}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Structure</span>
                  <span className="font-medium">{fabric.weave}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Weight Profile</span>
                  <span className="font-medium">{fabric.weight}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Care Directive</span>
                  <span className="font-medium">{fabric.care}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
                <span className="text-stone-400">Silhouetted Fall:</span> {fabric.drape}
              </div>
            </div>

            {/* Occasion Tags */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 block mb-2">
                Occasion Suitability
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.occasions.map((occ) => (
                  <span
                    key={occ}
                    className="rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 px-2.5 py-1 text-xs font-medium capitalize text-stone-700 dark:text-stone-300"
                  >
                    {occ}
                  </span>
                ))}
              </div>
            </div>

            {/* Editorial Styling Advice */}
            <div className="rounded-xl border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#4A3D22] dark:bg-[#251E12] p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#7B6127] dark:text-[#E5C378] mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Editorial Direction</span>
              </div>
              <p className="text-xs text-[#5C491D] dark:text-[#D4BA77] leading-relaxed">
                {stylingTip}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-200 transition-all cursor-pointer"
              >
                Return to Wardrobe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
