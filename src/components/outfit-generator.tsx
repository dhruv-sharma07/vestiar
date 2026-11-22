"use client";

import React, { useEffect } from "react";
import {
  Sparkles,
  CloudSun,
  Flame,
  Check,
  Heart,
  CalendarPlus,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { Occasion, ClothingItem } from "@/types/wardrobe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OutfitGenerator() {
  const {
    weather,
    setWeather,
    selectedStylistOccasion,
    setSelectedStylistOccasion,
    generatedOutfits,
    isGenerating,
    generateOutfitsForOccasion,
    toggleOutfitLike,
    recordWear,
    setActiveTab,
  } = useWardrobeStore();

  const OCCASIONS: {
    id: Occasion;
    title: string;
    description: string;
    emoji: string;
    badge: string;
  }[] = [
    {
      id: "gym",
      title: "Gym & Workout",
      description: "High-stretch, breathable moisture-wicking pairs",
      emoji: "🏋️",
      badge: "Performance",
    },
    {
      id: "office",
      title: "Professional & Corporate",
      description: "Crisp shirts, structured chinos & tailored blazers",
      emoji: "💼",
      badge: "Formal",
    },
    {
      id: "party",
      title: "Party & Night Out",
      description: "Chic camp shirts, raw denim & statement boots",
      emoji: "🎉",
      badge: "Nightlife",
    },
    {
      id: "wedding",
      title: "Indian Wedding & Festive",
      description: "Chikankari kurtas, silk bundi vests & churidars",
      emoji: "💒",
      badge: "Ethnic Heritage",
    },
    {
      id: "casual",
      title: "Casual & Everyday",
      description: "Comfortable oversized hoodies, cargos & sneakers",
      emoji: "☕",
      badge: "Effortless",
    },
    {
      id: "date",
      title: "Romantic Date Night",
      description: "Smart layered silhouettes with understated elegance",
      emoji: "🍷",
      badge: "Sophisticated",
    },
    {
      id: "travel",
      title: "Airport & Travel",
      description: "Lightweight, wrinkle-resistant capsule combos",
      emoji: "✈️",
      badge: "Versatile",
    },
  ];

  // Auto-generate on first load if empty
  useEffect(() => {
    if (generatedOutfits.length === 0) {
      generateOutfitsForOccasion(selectedStylistOccasion);
    }
  }, []);

  const handleOccasionClick = (occ: Occasion) => {
    setSelectedStylistOccasion(occ);
    generateOutfitsForOccasion(occ);
  };

  const handleWoreOutfit = (items: ClothingItem[]) => {
    items.forEach((item) => recordWear(item.id));
    alert("Outfit logged as worn today! Wear counts have been updated across your wardrobe analytics.");
  };

  return (
    <div className="space-y-8">
      {/* Hero Occasion Picker */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none">
                AI Occasion Engine
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Gemini Multi-Modal Style Matcher
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2">
              Where are you heading today?
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Choose your destination. The AI pairs your clean clothes by analyzing formality, color theory, temperature & fabric breathability.
            </p>
          </div>

          {/* Real-time Weather Controller */}
          <div className="rounded-xl border border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <CloudSun className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-foreground">Weather Simulation:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { label: "Hot 32°C", temp: 32, condition: "Hot" as const },
                { label: "Mild 24°C", temp: 24, condition: "Sunny" as const },
                { label: "Rainy 20°C", temp: 20, condition: "Rainy" as const },
                { label: "Chilly 14°C", temp: 14, condition: "Cold" as const },
              ].map((w) => (
                <button
                  key={w.label}
                  onClick={() => {
                    setWeather({ temp: w.temp, condition: w.condition });
                    generateOutfitsForOccasion(selectedStylistOccasion);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    weather.temp === w.temp
                      ? "bg-foreground text-background font-semibold"
                      : "border border-border/70 bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Occasion Cards Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-6">
          {OCCASIONS.map((occ) => {
            const isSelected = selectedStylistOccasion === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => handleOccasionClick(occ.id)}
                className={`relative flex flex-col items-center text-center rounded-xl p-3 border transition-all duration-200 ${
                  isSelected
                    ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-[1.02]"
                    : "border-border/60 bg-card/70 hover:border-violet-500/40 hover:bg-muted/40 text-foreground"
                }`}
              >
                <span className="text-2xl mb-1.5">{occ.emoji}</span>
                <span className={`text-xs font-bold line-clamp-1 ${isSelected ? "text-white" : "text-foreground"}`}>
                  {occ.title.split("&")[0]}
                </span>
                <span
                  className={`text-[9px] mt-0.5 uppercase tracking-wider font-semibold ${
                    isSelected ? "text-violet-100" : "text-muted-foreground"
                  }`}
                >
                  {occ.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generation State & Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Curated Outfits for:</span>
            <span className="text-violet-600 dark:text-violet-400 capitalize underline decoration-wavy decoration-violet-500/40">
              {selectedStylistOccasion}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synchronized with {weather.temp}°C {weather.condition} forecast in {weather.city}
          </p>
        </div>

        <Button
          onClick={() => generateOutfitsForOccasion(selectedStylistOccasion)}
          disabled={isGenerating}
          size="sm"
          className="gap-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs h-8 px-4 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Styling..." : "Regenerate Looks"}
        </Button>
      </div>

      {/* Generated Outfit Cards */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 p-16 text-center bg-violet-500/5">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-foreground">AI Stylist is pairing your clothes...</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Filtering clean garments, running color harmony algorithms & balancing silhouette proportions.
          </p>
        </div>
      ) : generatedOutfits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-semibold text-foreground">No clean matching outfits found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Some of your clothes might be marked &quot;In Laundry&quot;. Switch to Closet view to mark them clean!
          </p>
          <Button
            onClick={() => setActiveTab("wardrobe")}
            size="sm"
            className="mt-4 text-xs rounded-full bg-foreground text-background"
          >
            Go to Closet
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {generatedOutfits.map((outfit, index) => (
            <div
              key={outfit.id}
              className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Outfit Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 bg-muted/20 px-5 py-3.5 gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/10 text-violet-600 dark:text-violet-400 font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-foreground">{outfit.title}</h3>
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        {outfit.score}% Match Score
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{outfit.weatherFit}</span>
                  </div>
                </div>

                {/* Color Palette Preview Swatches */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">
                    Color Harmony:
                  </span>
                  <div className="flex items-center -space-x-1">
                    {outfit.colorPalette.map((hex, i) => (
                      <span
                        key={i}
                        className="h-4 w-4 rounded-full border border-background shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => toggleOutfitLike(outfit.id)}
                    className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      outfit.isLiked
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-border/60 hover:border-rose-500/40 text-muted-foreground hover:text-rose-500"
                    }`}
                    title="Like this outfit pairing"
                  >
                    <Heart className={`h-4 w-4 ${outfit.isLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Outfit Visual Item Cards (Side by side grid) */}
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {outfit.items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col rounded-xl border border-border/60 bg-background overflow-hidden p-2 text-center hover:border-violet-500/40 transition-all"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted mb-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-white capitalize">
                          {item.category}
                        </span>
                      </div>
                      <p className="font-semibold text-xs text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.brand} • {item.color}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Stylist Reasoning & Tips */}
                <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-violet-600/10 p-2 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          Stylist AI Reasoning:
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {outfit.styleReasoning}
                        </p>
                      </div>

                      {/* Styling Tips */}
                      {outfit.tips.length > 0 && (
                        <div className="pt-2 border-t border-violet-500/15">
                          <span className="text-[11px] font-semibold text-foreground block mb-1">
                            Execution Tips:
                          </span>
                          <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                            {outfit.tips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {outfit.items.length} garments paired together
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleWoreOutfit(outfit.items)}
                      size="sm"
                      className="gap-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-medium h-8 px-4"
                    >
                      <Check className="h-3.5 w-3.5" />
                      I Wore This Today
                    </Button>
                    <Button
                      onClick={() => setActiveTab("planner")}
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-full text-xs font-medium h-8 px-3.5"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" />
                      Plan on Calendar
                    </Button>
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
