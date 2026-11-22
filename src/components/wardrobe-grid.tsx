"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  Heart,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  RotateCcw,
  Tag,
  Filter,
} from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { ClothingCategory, Occasion, ClothingItem } from "@/types/wardrobe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WardrobeGridProps {
  onOpenAddItem: () => void;
}

export function WardrobeGrid({ onOpenAddItem }: WardrobeGridProps) {
  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedOccasion,
    setSelectedOccasion,
    showOnlyClean,
    setShowOnlyClean,
    toggleFavorite,
    toggleCleanStatus,
    removeItem,
    recordWear,
    setActiveTab,
  } = useWardrobeStore();

  const CATEGORIES: { label: string; value: ClothingCategory; emoji: string }[] = [
    { label: "All Items", value: "all", emoji: "✨" },
    { label: "Tops & Shirts", value: "top", emoji: "👕" },
    { label: "Bottoms & Pants", value: "bottom", emoji: "👖" },
    { label: "Shoes & Boots", value: "shoes", emoji: "👟" },
    { label: "Outerwear & Blazers", value: "outerwear", emoji: "🧥" },
    { label: "Indian & Ethnic", value: "ethnic", emoji: "👘" },
    { label: "Accessories", value: "accessories", emoji: "🕶️" },
  ];

  const OCCASIONS: { label: string; value: Occasion | "all"; emoji: string }[] = [
    { label: "All Occasions", value: "all", emoji: "🌐" },
    { label: "Gym & Workout", value: "gym", emoji: "🏋️" },
    { label: "Office & Work", value: "office", emoji: "💼" },
    { label: "Party & Night", value: "party", emoji: "🎉" },
    { label: "Wedding & Festive", value: "wedding", emoji: "💒" },
    { label: "Casual Everyday", value: "casual", emoji: "☕" },
    { label: "Date Night", value: "date", emoji: "🍷" },
  ];

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Occasion filter
      if (
        selectedOccasion !== "all" &&
        !item.occasions.includes(selectedOccasion)
      ) {
        return false;
      }
      // Clean only filter
      if (showOnlyClean && !item.isClean) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesColor = item.color.toLowerCase().includes(query);
        const matchesSub = item.subCategory.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesColor && !matchesSub) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategory, selectedOccasion, showOnlyClean, searchQuery]);

  // Closet stats
  const totalItems = items.length;
  const cleanItems = items.filter((i) => i.isClean).length;
  const totalValue = items.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const favoriteCount = items.filter((i) => i.isFavorite).length;

  return (
    <div className="space-y-6">
      {/* Header Banner & Closet Summary */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-transparent p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Smart Wardrobe Catalog
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Digitized collection of your clothes. Tagged with fabrics, colors, occasions & wear frequency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveTab("stylist")}
              className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium text-xs shadow-md shadow-violet-500/20"
            >
              <Sparkles className="h-4 w-4" />
              Generate Outfits Now
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border/40">
          <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur-sm">
            <p className="text-[11px] font-medium text-muted-foreground">Total Wardrobe</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalItems} Pieces</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur-sm">
            <p className="text-[11px] font-medium text-muted-foreground">Clean & Ready</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {cleanItems} / {totalItems}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur-sm">
            <p className="text-[11px] font-medium text-muted-foreground">Closet Value</p>
            <p className="text-xl font-bold text-foreground mt-0.5">${totalValue}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur-sm">
            <p className="text-[11px] font-medium text-muted-foreground">Favorites</p>
            <p className="text-xl font-bold text-amber-500 mt-0.5">{favoriteCount} Items</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, brand, color (e.g. Navy, Chinos, Nike, Silk)..."
              className="pl-9 h-10 text-xs rounded-xl border-border/70 bg-background"
            />
          </div>

          {/* Clean Only Toggle */}
          <button
            onClick={() => setShowOnlyClean(!showOnlyClean)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 h-10 text-xs font-medium border transition-all ${
              showOnlyClean
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Clean Only ({cleanItems})
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat.value
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Occasion Secondary Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Occasion:
          </span>
          {OCCASIONS.map((occ) => (
            <button
              key={occ.value}
              onClick={() => setSelectedOccasion(occ.value)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                selectedOccasion === occ.value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "border border-border/50 bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{occ.emoji}</span>
              <span>{occ.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clothing Items */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-semibold text-foreground">No clothing items match this filter</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try resetting your search query or add a new piece to your closet!
          </p>
          <Button
            onClick={onOpenAddItem}
            size="sm"
            className="mt-4 gap-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-violet-500/40"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className="backdrop-blur-md bg-background/80 text-[10px] font-semibold border-border/40 capitalize"
                  >
                    {item.category}
                  </Badge>
                  {item.isClean ? (
                    <Badge className="bg-emerald-500/90 text-white text-[10px] font-semibold border-none">
                      Clean
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] font-semibold">
                      In Laundry
                    </Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                    item.isFavorite
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-background/70 text-foreground/70 hover:bg-background hover:text-rose-500"
                  }`}
                  title={item.isFavorite ? "Remove favorite" : "Mark as favorite"}
                >
                  <Heart className={`h-4 w-4 ${item.isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Item Details */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      {item.brand} • {item.subCategory}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-foreground shrink-0">${item.price}</span>
                </div>

                {/* Color and Fabric Tags */}
                <div className="flex items-center gap-2 mt-2.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="capitalize">{item.color}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{item.fabric}</span>
                  <span>•</span>
                  <span className="capitalize">{item.style}</span>
                </div>

                {/* Occasion Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize"
                    >
                      {occ}
                    </span>
                  ))}
                </div>

                {/* Footer Actions: Times Worn, Toggle Clean, Record Wear */}
                <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">
                    Worn: <strong className="text-foreground">{item.timesWorn}x</strong>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCleanStatus(item.id)}
                      className={`text-[10px] rounded px-2 py-0.5 font-medium border transition-colors ${
                        item.isClean
                          ? "border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                          : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                      title="Toggle laundry status"
                    >
                      {item.isClean ? "Mark Laundry" : "Mark Clean"}
                    </button>

                    <button
                      onClick={() => recordWear(item.id)}
                      className="text-[10px] rounded px-2 py-0.5 font-medium border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Log that you wore this piece today"
                    >
                      +Wore
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-rose-500 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
