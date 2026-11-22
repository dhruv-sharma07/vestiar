"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Heart, Trash2, Calendar, Compass, ExternalLink, Check } from "lucide-react";
import { CuratedItem } from "@/lib/curated-wardrobe";

export interface SavedOutfit {
  id: string;
  title: string;
  occasion: string;
  matchScore: number;
  aiReasoning: string;
  createdAt: string;
  items: CuratedItem[];
}

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: SavedOutfit[];
  onDeleteOutfit: (id: string) => void;
  onApplyOutfit: (outfit: SavedOutfit) => void;
}

export function LookbookModal({
  isOpen,
  onClose,
  savedOutfits,
  onDeleteOutfit,
  onApplyOutfit,
}: LookbookModalProps) {
  const [filterOccasion, setFilterOccasion] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered =
    filterOccasion === "all"
      ? savedOutfits
      : savedOutfits.filter((o) => o.occasion.toLowerCase() === filterOccasion.toLowerCase());

  const handleCopyLook = (outfit: SavedOutfit) => {
    setCopiedId(outfit.id);
    navigator.clipboard?.writeText(
      `VESTIAR Silhouette: ${outfit.title} (${outfit.occasion.toUpperCase()}) - ${outfit.items.map((i) => i.name).join(", ")}`
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5] dark:bg-[#1C1A17] p-6 sm:p-8 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] dark:border-[#2E2A26]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF8ED] dark:bg-[#251E12] text-[#7B6127]">
              <Heart className="h-5 w-5 fill-[#E0623A] text-[#E0623A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
                  Wardrobe Lookbook
                </h3>
                <span className="rounded-md bg-[#E8EEE7] dark:bg-[#1E2E22] text-[#2D4A34] dark:text-[#D3E0D5] px-2 py-0.5 text-[11px] font-medium">
                  {savedOutfits.length} saved
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Your curated outfits and favorite styling combinations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-500 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Tabs (Architectural rounded-md) */}
        <div className="flex items-center gap-1.5 py-3 border-b border-[#EAE6DF]/60 dark:border-[#2E2A26]/60 overflow-x-auto">
          {["all", "gym", "work", "party", "casual"].map((occ) => (
            <button
              key={occ}
              onClick={() => setFilterOccasion(occ)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                filterOccasion === occ
                  ? "bg-[#1C1917] text-white dark:bg-[#F5F2EC] dark:text-[#1C1917]"
                  : "border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Outfits List / Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF8ED] dark:bg-[#251E12] text-[#7B6127] mb-3">
                <Compass className="h-5 w-5 text-[#7B6127]" />
              </div>
              <h4 className="text-base font-serif text-[#1C1917] dark:text-[#F5F2EC]">
                No saved looks in this category
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                Select the heart icon in the Occasion Pairing engine to save your favorite combinations here.
              </p>
            </div>
          ) : (
            filtered.map((outfit) => (
              <div
                key={outfit.id}
                className="group rounded-xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 p-4 transition-all hover:shadow-md hover:border-stone-400 dark:hover:border-stone-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#1C1917] dark:text-[#F5F2EC]">
                        {outfit.title}
                      </h4>
                      <span className="rounded-md border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#4A3D22] dark:bg-[#251E12] px-2 py-0.5 text-[10px] font-medium text-[#7B6127] dark:text-[#E5C378]">
                        {outfit.matchScore}% Match
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider">
                        : {outfit.occasion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(outfit.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions (Architectural rounded-lg) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLook(outfit)}
                      className="flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-[#1C1917] dark:hover:text-white px-2.5 py-1 rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] transition-colors"
                      title="Copy outfit details"
                    >
                      {copiedId === outfit.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onApplyOutfit(outfit);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-white bg-[#E0623A] hover:bg-[#C8532F] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Wear Today
                    </button>

                    <button
                      onClick={() => onDeleteOutfit(outfit.id)}
                      className="p-1 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove look"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Thumbnails with Next.js Image */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  {outfit.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/50"
                    >
                      <div className="relative h-14 w-14 rounded-md overflow-hidden mb-1 bg-stone-100 dark:bg-stone-800">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300 truncate w-full">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-stone-400 capitalize">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EAE6DF] dark:border-[#2E2A26] flex items-center justify-between text-xs text-stone-500">
          <span>Synced with PostgreSQL database</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-1.5 font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
