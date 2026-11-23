"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Trash2, Shirt, Layers, Eye, Orbit, LayoutGrid } from "lucide-react";
import { useTheme } from "next-themes";
import { CuratedItem, formatRupees } from "@/lib/curated-wardrobe";
import { TactileCard } from "@/components/tactile-card";
import { GarmentInspectionModal } from "@/components/garment-inspection-modal";
import { CircularGallery } from "@/components/circular-gallery";

interface CleanWardrobeGridProps {
  items: CuratedItem[];
  onLoadSamples: () => void;
  onClearSamples: () => void;
  onRemoveItem: (id: string) => void;
  isSampleActive: boolean;
}

export function CleanWardrobeGrid({
  items,
  onLoadSamples,
  onClearSamples,
  onRemoveItem,
  isSampleActive,
}: CleanWardrobeGridProps) {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "tops" | "bottoms" | "footwear" | "outerwear" | "accessories"
  >("all");
  const [viewMode, setViewMode] = useState<"circular" | "grid">("grid");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [inspectedItem, setInspectedItem] = useState<CuratedItem | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const CATEGORIES: {
    id: "all" | "tops" | "bottoms" | "footwear" | "outerwear" | "accessories";
    label: string;
  }[] = [
    { id: "all", label: "All Items" },
    { id: "tops", label: "Tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "footwear", label: "Footwear & Shoes" },
    { id: "outerwear", label: "Outerwear" },
    { id: "accessories", label: "Accessories (Muffler & Socks)" },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const galleryItems = useMemo(() => {
    return filteredItems.map((item) => {
      const label = item.brand ? `${item.brand} • ${item.subCategory || item.name}` : item.name;
      return {
        image: item.imageUrl,
        text: `${label.length > 20 ? label.slice(0, 18) + "…" : label} (${formatRupees(item.price)})`,
      };
    });
  }, [filteredItems]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="demo-wardrobe-section" className="py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Digital Closet Archive
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              My Wardrobe Collection
            </h2>
            {items.length > 0 && (
              <span className="rounded-md border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                {items.length} {items.length === 1 ? "piece" : "pieces"}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visual catalog with editorial photography, fabric dossiers, and Rupee (₹) valuation.
          </p>
        </div>

        {/* Action Controls: View mode switcher, Filter tabs & Sample toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {items.length > 0 ? (
            <>
              {/* View Mode Toggle: 3D Circular WebGL vs Tactile Grid */}
              <div className="flex items-center rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-stone-100/70 dark:bg-stone-800/50 p-0.5">
                <button
                  onClick={() => setViewMode("circular")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    viewMode === "circular"
                      ? "bg-white dark:bg-stone-900 text-[#1C1917] dark:text-[#F5F2EC] shadow-2xs font-semibold"
                      : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                  title="3D Circular WebGL Showcase"
                >
                  <Orbit className="h-3.5 w-3.5 text-[#E0623A]" />
                  <span className="hidden sm:inline">3D Circular</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-stone-900 text-[#1C1917] dark:text-[#F5F2EC] shadow-2xs font-semibold"
                      : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                  title="Curated Catalog Grid"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat.id === "all"
                      ? items.length
                      : items.filter((i) => i.category === cat.id).length;
                  const isSelected = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#1C1917] text-white dark:bg-[#F5F2EC] dark:text-[#1C1917] shadow-xs"
                          : "border border-[#EAE6DF] dark:border-[#2E2A26] bg-white/70 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? "opacity-75" : "text-stone-400 dark:text-stone-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isSampleActive && (
                <button
                  onClick={onClearSamples}
                  className="text-[11px] font-medium text-stone-400 hover:text-[#E0623A] underline underline-offset-4 ml-1 transition-colors cursor-pointer"
                >
                  Clear Demo
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onLoadSamples}
              className="flex items-center gap-1.5 rounded-lg border border-[#D1DFD0] bg-[#E8EEE7] hover:bg-[#DCE6DA] text-[#2D4A34] dark:border-[#27332A] dark:bg-[#1E2E22] dark:text-[#D3E0D5] px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="h-3.5 w-3.5 text-[#2D4A34] dark:text-[#D3E0D5]" />
              <span>Load 4 Sample Clothes</span>
            </button>
          )}
        </div>
      </div>

      {/* Zero State View when closet is empty */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EAE6DF] dark:border-[#2E2A26] bg-white/70 dark:bg-stone-900/40 p-12 sm:p-16 text-center shadow-luxury">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#F4EFEA] dark:bg-stone-800 text-stone-500 mb-4">
            <Shirt className="h-6 w-6 text-stone-600 dark:text-stone-300" />
          </div>

          <h3 className="text-xl font-serif text-[#1C1917] dark:text-[#F5F2EC]">
            Your closet is empty. Add your first item or preview a quick demo
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Upload your first photo to begin organizing, or load curated sample clothes (Shoes, Mufflers, Socks, Tops, Bottoms) to test occasion pairing immediately.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLoadSamples}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-[#D1DFD0] bg-[#E8EEE7] hover:bg-[#DCE6DA] text-[#2D4A34] dark:border-[#27332A] dark:bg-[#1E2E22] dark:text-[#D3E0D5] px-5 py-2.5 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="h-3.5 w-3.5 text-[#2D4A34] dark:text-[#D3E0D5]" />
              <span>Load Sample Clothes</span>
            </button>

            <Link
              href="/upload"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-5 py-2.5 text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload Garment</span>
            </Link>
          </div>
        </div>
      ) : viewMode === "circular" ? (
        /* 3D WebGL Circular Gallery Showcase */
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-[#F8F5EE] dark:bg-[#0D0F12] shadow-luxury overflow-hidden">
          <CircularGallery
            items={galleryItems}
            bend={2.6}
            textColor={resolvedTheme === "dark" ? "#EDE7DC" : "#1C1917"}
            borderRadius={0.06}
            font='500 15px "Plus Jakarta Sans", "Sora", system-ui, sans-serif'
            scrollSpeed={2.2}
            scrollEase={0.04}
            className="w-full h-full"
          />
        </div>
      ) : (
        /* Curated Grid View with 3D Tactile Physics */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 perspective-1000">
          {filteredItems.map((item) => {
            const isFav = favorites[item.id] || false;
            return (
              <TactileCard
                key={item.id}
                maxTilt={3.5}
                elevation={8}
                onClick={() => {
                  setInspectedItem(item);
                  setIsInspectionOpen(true);
                }}
                className="group flex flex-col rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A17] overflow-hidden transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
              >
                {/* High-res Image Container with Next.js Image (3:4 aspect ratio) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />

                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize backdrop-blur-md ${
                        item.pastelTag?.bg || "bg-[#E8EEE7]"
                      } ${item.pastelTag?.text || "text-[#2D4A34]"} ${
                        item.pastelTag?.border || "border-[#D1DFD0]"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Favorite & Delete Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-md backdrop-blur-md transition-all duration-200 cursor-pointer ${
                        isFav
                          ? "bg-white/90 text-rose-500 shadow-xs"
                          : "bg-white/70 text-stone-500 hover:bg-white hover:text-rose-500"
                      }`}
                      title={isFav ? "Saved to favorites" : "Favorite item"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-md bg-white/75 text-stone-400 hover:text-rose-500 backdrop-blur-md transition-all cursor-pointer"
                      title="Remove from closet"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Inspect hint on hover */}
                  <div className="absolute inset-x-0 bottom-0 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[10px] font-medium text-white/95">
                    <Eye className="h-3 w-3" />
                    <span>Inspect Fabric &amp; Notes</span>
                  </div>
                </div>

                {/* Harmonious Dual-Theme Details Section (clean light & dark) */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1 bg-white dark:bg-[#101317] border-t border-[#EAE6DF] dark:border-[rgba(237,231,220,0.1)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm text-stone-900 dark:text-[#EDE7DC] line-clamp-1 group-hover:text-[#E0623A] dark:group-hover:text-[#E8913C] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-[#9EA5A8] mt-0.5">
                        {item.brand} • {item.subCategory}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#E0623A] dark:text-[#EDE7DC] shrink-0 font-mono">
                      {formatRupees(item.price)}
                    </span>
                  </div>

                  {/* Color Dot & Occasions Footer */}
                  <div className="mt-auto pt-3 border-t border-stone-100 dark:border-[rgba(237,231,220,0.1)] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-[#9EA5A8]">
                      <span
                        className="h-2.5 w-2.5 rounded-sm border border-black/10 dark:border-white/10 shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[11px] truncate max-w-[80px]">{item.colorName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.occasions.slice(0, 2).map((occ) => (
                        <span
                          key={occ}
                          className="rounded-md bg-stone-100 dark:bg-[#181C22] border border-stone-200 dark:border-[rgba(237,231,220,0.1)] px-1.5 py-0.5 text-[9px] font-medium text-stone-600 dark:text-[#9EA5A8] capitalize"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TactileCard>
            );
          })}
        </div>
      )}

      {/* Garment Inspection Panel Modal */}
      <GarmentInspectionModal
        item={inspectedItem}
        open={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        isFavorite={inspectedItem ? !!favorites[inspectedItem.id] : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
      />
    </section>
  );
}
