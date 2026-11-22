"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Check,
  Heart,
  RotateCw,
  Bookmark,
  Plane,
  CloudSun,
  CloudRain,
  Sun,
  Flame,
  Dumbbell,
  Briefcase,
  GlassWater,
  Coffee,
  Layers,
  Compass,
  User,
  LayoutGrid,
} from "lucide-react";
import { CuratedItem } from "@/lib/curated-wardrobe";
import { LookbookModal, SavedOutfit } from "./lookbook-modal";
import { CapsulePackModal } from "./capsule-pack-modal";
import { TactileCard } from "./tactile-card";
import { Card3D } from "./card-3d";
import { GarmentInspectionModal } from "./garment-inspection-modal";
import { AnatomicalMannequin } from "./anatomical-mannequin";

interface CleanOccasionBarProps {
  items: CuratedItem[];
  onLoadSamples: () => void;
  userEmail?: string;
}

export function CleanOccasionBar({
  items,
  onLoadSamples,
  userEmail = "guest@fitiq.local",
}: CleanOccasionBarProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<
    "gym" | "work" | "party" | "casual"
  >("gym");
  const [weatherCondition, setWeatherCondition] = useState<
    "mild" | "crisp" | "rainy" | "warm"
  >("mild");
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [isWornLogged, setIsWornLogged] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);
  const [inspectedPiece, setInspectedPiece] = useState<CuratedItem | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"mannequin" | "grid">("mannequin");
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [aiOutfit, setAiOutfit] = useState<{
    occasion: "gym" | "work" | "party" | "casual";
    title: string;
    tagline: string;
    matchScore: number;
    stylistNote: string;
    palette: string[];
    items: CuratedItem[];
  } | null>(null);
  const [aiSource, setAiSource] = useState<string>("heuristic-stylist");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Minimal vector stroke icons instead of emojis
  const OCCASIONS: {
    id: "gym" | "work" | "party" | "casual";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "gym", label: "Gym & Athletic", icon: Dumbbell },
    { id: "work", label: "Work & Studio", icon: Briefcase },
    { id: "party", label: "Evening & Dinner", icon: GlassWater },
    { id: "casual", label: "Weekend Casual", icon: Coffee },
  ];

  const WEATHER_OPTIONS = [
    { id: "mild", label: "22°C Mild", icon: Sun },
    { id: "crisp", label: "15°C Crisp", icon: CloudSun },
    { id: "rainy", label: "Rainy", icon: CloudRain },
    { id: "warm", label: "28°C Warm", icon: Flame },
  ];

  // Fetch saved outfits from PostgreSQL / localStorage fallback
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await fetch(`/api/outfits?userId=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.success && data.outfits && data.outfits.length > 0) {
          const mapped: SavedOutfit[] = data.outfits.map((o: any) => ({
            id: o.id,
            title: o.title || "Curated Look",
            occasion: o.occasion,
            matchScore: o.matchScore || 95,
            aiReasoning: o.aiReasoning || "",
            createdAt: o.createdAt,
            items: (o.outfitItems || [])
              .map((oi: any) => oi.clothingItem)
              .filter(Boolean),
          }));
          setSavedOutfits(mapped);
        } else {
          const local = localStorage.getItem("fitiq_saved_outfits");
          if (local) {
            setSavedOutfits(JSON.parse(local));
          }
        }
      } catch (e) {
        const local = localStorage.getItem("fitiq_saved_outfits");
        if (local) {
          setSavedOutfits(JSON.parse(local));
        }
      }
    };
    fetchOutfits();
  }, [userEmail]);

  // Generate dynamic paired outfit considering occasion, weather, and shuffle rotation
  const getPairedOutfit = () => {
    if (items.length === 0) return null;

    let tops = items.filter((i) => i.category === "tops" && i.occasions.includes(selectedOccasion));
    if (tops.length === 0) tops = items.filter((i) => i.category === "tops");

    let bottoms = items.filter((i) => i.category === "bottoms" && i.occasions.includes(selectedOccasion));
    if (bottoms.length === 0) bottoms = items.filter((i) => i.category === "bottoms");

    let shoes = items.filter((i) => i.category === "footwear" && i.occasions.includes(selectedOccasion));
    if (shoes.length === 0) shoes = items.filter((i) => i.category === "footwear");

    let outerwearList = items.filter((i) => i.category === "outerwear");

    const top = tops[shuffleIndex % (tops.length || 1)] || items[0];
    const bottom = bottoms[shuffleIndex % (bottoms.length || 1)] || (items.length > 1 ? items[1] : undefined);
    const shoe = shoes[shuffleIndex % (shoes.length || 1)] || (items.length > 2 ? items[2] : undefined);

    const shouldAddOuterwear = weatherCondition === "crisp" || weatherCondition === "rainy" || selectedOccasion === "work";
    const outer = shouldAddOuterwear && outerwearList.length > 0 ? outerwearList[0] : undefined;

    const paired = [top, bottom, shoe, outer].filter(Boolean) as CuratedItem[];

    const METADATA = {
      gym: {
        title: weatherCondition === "crisp" ? "Layered Athletic Training Set" : "Lightweight High-Mobility Set",
        tagline: "Engineered for training, breathable movement, and cool comfort.",
        stylistNote:
          weatherCondition === "crisp"
            ? "Light outer layer over Supima cotton keeps core body warm during morning warmup, with ergonomic bottoms for full range of motion."
            : "Breathable airy upper paired with flexible ergonomic bottoms. Neutral trainers ground the athletic silhouette with effortless balance.",
        score: 98,
      },
      work: {
        title: "Refined Modern Tailored Smart-Casual",
        tagline: "Polished for studio sessions, meetings, and presentations.",
        stylistNote:
          "Clean, structured silhouette with high-contrast proportions. Minimalist footwear anchors the look with quiet luxury understatement.",
        score: 96,
      },
      party: {
        title: "Understated Evening Monochrome",
        tagline: "Relaxed European nightlife tailoring with subtle texture.",
        stylistNote:
          "Soft drape layering anchored by refined footwear. Unbutton collar slightly for an effortless, confident twilight aesthetic.",
        score: 95,
      },
      casual: {
        title: weatherCondition === "rainy" ? "Protected Urban Transition Look" : "Weekend Gallery Stroll & Espresso",
        tagline: "Understated neutrals with architectural utility layers.",
        stylistNote:
          weatherCondition === "rainy"
            ? "Utility overshirt acts as weather shield over chalk white essentials, grounded by relaxed trousers and pristine court sneakers."
            : "Chalk white essentials elevated by subtle earthy tones, grounded by relaxed trousers and pristine calfskin court sneakers.",
        score: 97,
      },
    }[selectedOccasion];

    return {
      occasion: selectedOccasion,
      title: METADATA.title,
      tagline: METADATA.tagline,
      matchScore: METADATA.score,
      stylistNote: METADATA.stylistNote,
      palette: paired.map((p) => p.colorHex).slice(0, 4),
      items: paired,
    };
  };

  // Call Multimodal Stylist API
  useEffect(() => {
    if (items.length === 0) return;

    let isMounted = true;
    const fetchAiOutfit = async () => {
      setIsGeneratingAi(true);
      try {
        const res = await fetch("/api/ai/generate-outfit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            occasion: selectedOccasion,
            weather: weatherCondition,
            userEmail,
            items,
          }),
        });
        const data = await res.json();
        if (isMounted && data.success && data.outfit) {
          setAiOutfit({
            occasion: selectedOccasion,
            title: data.outfit.title,
            tagline: data.outfit.tagline,
            matchScore: data.outfit.matchScore,
            stylistNote: data.outfit.stylistExplanation || data.outfit.weatherTip,
            palette: data.outfit.palette || [],
            items: data.outfit.items || [],
          });
          if (data.source) {
            setAiSource(data.source);
          }
        }
      } catch (err) {
        console.warn("Stylist API fallback:", err);
      } finally {
        if (isMounted) setIsGeneratingAi(false);
      }
    };

    fetchAiOutfit();
    return () => {
      isMounted = false;
    };
  }, [selectedOccasion, weatherCondition, shuffleIndex, items, userEmail]);

  const fallbackOutfit = getPairedOutfit();
  const currentOutfit = aiOutfit && aiOutfit.occasion === selectedOccasion ? aiOutfit : fallbackOutfit;

  const handleSelectOccasion = (occ: "gym" | "work" | "party" | "casual") => {
    setSelectedOccasion(occ);
    setShuffleIndex(0);
    setIsWornLogged(false);
  };

  const handleShuffle = () => {
    setShuffleIndex((prev) => prev + 1);
    setIsWornLogged(false);
  };

  const handleSaveOutfit = async () => {
    if (!currentOutfit) return;

    const newSaved: SavedOutfit = {
      id: `outfit-${Date.now()}`,
      title: currentOutfit.title,
      occasion: currentOutfit.occasion,
      matchScore: currentOutfit.matchScore,
      aiReasoning: currentOutfit.stylistNote,
      createdAt: new Date().toISOString(),
      items: currentOutfit.items,
    };

    const updated = [newSaved, ...savedOutfits];
    setSavedOutfits(updated);
    try {
      localStorage.setItem("fitiq_saved_outfits", JSON.stringify(updated));
    } catch (e) {}

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2200);

    try {
      await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: currentOutfit.occasion,
          title: currentOutfit.title,
          aiReasoning: currentOutfit.stylistNote,
          matchScore: currentOutfit.matchScore,
          itemIds: currentOutfit.items.map((i: CuratedItem) => i.id),
          isLiked: true,
          userEmail,
        }),
      });
    } catch (e) {
      console.log("Saved outfit locally");
    }
  };

  const handleDeleteSavedOutfit = async (id: string) => {
    const updated = savedOutfits.filter((o) => o.id !== id);
    setSavedOutfits(updated);
    try {
      localStorage.setItem("fitiq_saved_outfits", JSON.stringify(updated));
      await fetch(`/api/outfits/${id}`, { method: "DELETE" });
    } catch (e) {}
  };

  const handleLogWear = () => {
    setIsWornLogged(true);
    setTimeout(() => setIsWornLogged(false), 2500);
  };

  const isCurrentOutfitSaved = savedOutfits.some(
    (o) =>
      o.occasion === selectedOccasion &&
      o.items.length === currentOutfit?.items.length &&
      o.items.every((it, i) => it.id === currentOutfit?.items[i]?.id)
  );

  return (
    <section id="style-me-section" className="py-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-[#9EA5A8]">
              Occasion Pairing
            </span>
            <span className="text-stone-300 dark:text-[rgba(237,231,220,0.3)]">:</span>
            <span className="text-[11px] font-medium text-[#E0623A] dark:text-[#E8913C]">
              Editorial Direction
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] dark:text-[#EDE7DC] mt-1">
            Outfit for the occasion
          </h2>
        </div>

        {/* Feature Action Buttons: Lookbook & Trip Capsule */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            onClick={() => setIsLookbookOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-white dark:bg-[#101317] px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-[#EDE7DC] hover:border-[#E0623A] dark:hover:border-[#E8913C] transition-all cursor-pointer shadow-2xs"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#E0623A] dark:text-[#E8913C]" />
            <span>Lookbook</span>
            {savedOutfits.length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-md bg-[#E0623A] dark:bg-[#E8913C] text-white dark:text-[#0A0C0E] text-[10px] px-1 font-semibold">
                {savedOutfits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCapsuleOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-white dark:bg-[#101317] px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-[#EDE7DC] hover:border-[#E0623A] dark:hover:border-[#E8913C] transition-all cursor-pointer shadow-2xs"
          >
            <Plane className="h-3.5 w-3.5 text-[#2E6B72]" />
            <span>Trip Capsule</span>
          </button>
        </div>
      </div>

      {/* Occasion & Weather Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        {/* Clean Occasion Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            const isSelected = selectedOccasion === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => handleSelectOccasion(occ.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#E0623A] dark:bg-[#E8913C] text-white dark:text-[#0A0C0E] font-semibold shadow-xs"
                    : "border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-white dark:bg-[#101317] text-stone-700 dark:text-[#9EA5A8] hover:border-[#E0623A] dark:hover:border-[#E8913C] hover:text-[#1C1917] dark:hover:text-[#EDE7DC]"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{occ.label}</span>
              </button>
            );
          })}
        </div>

        {/* Weather Conditions Selector */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-stone-100/90 dark:bg-[#101317] p-1 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)]">
          {WEATHER_OPTIONS.map((w) => {
            const Icon = w.icon;
            const isSelected = weatherCondition === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setWeatherCondition(w.id as any)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#E0623A]/15 dark:bg-[#E8913C]/20 border border-[#E0623A]/40 dark:border-[rgba(232,145,60,0.4)] text-[#E0623A] dark:text-[#E8913C] font-semibold shadow-2xs"
                    : "text-stone-600 dark:text-[#9EA5A8] hover:text-stone-900 dark:hover:text-[#EDE7DC]"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{w.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outfit Card or Zero-State */}
      {!currentOutfit || items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EAE6DF] dark:border-[#2E2A26] bg-white/70 dark:bg-stone-900/40 p-8 sm:p-12 text-center shadow-luxury">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF8ED] dark:bg-[#251E12] text-[#7B6127] mb-3">
            <Compass className="h-5 w-5 text-[#7B6127]" />
          </div>
          <h3 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
            Add clothes to unlock occasion pairing
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Once garments are cataloged, harmonious tops, bottoms, and footwear are paired automatically for every event.
          </p>
          <button
            onClick={onLoadSamples}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#D1DFD0] bg-[#E8EEE7] hover:bg-[#DCE6DA] text-[#2D4A34] dark:border-[#27332A] dark:bg-[#1E2E22] dark:text-[#D3E0D5] px-5 py-2.5 text-xs font-medium transition-all cursor-pointer shadow-xs"
          >
            <Layers className="h-3.5 w-3.5 text-[#2D4A34] dark:text-[#D3E0D5]" />
            <span>Load 4 Sample Clothes to Test</span>
          </button>
        </div>
      ) : (
        /* Aesthetic Outfit Combination Card with Tactile 3D Physics */
        <TactileCard maxTilt={1.6} elevation={4}>
          <div className="relative rounded-2xl border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-white dark:bg-[#101317] p-6 sm:p-8 shadow-luxury transition-all duration-300">
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#1C1917] dark:text-[#EDE7DC] font-normal">
                    {currentOutfit.title}
                  </h3>
                  <span className="rounded-md border border-[#E0623A]/30 dark:border-[#E8913C]/30 bg-[#E0623A]/10 dark:bg-[#E8913C]/10 px-2 py-0.5 text-[11px] font-medium text-[#E0623A] dark:text-[#E8913C]">
                    {currentOutfit.matchScore}% Match
                  </span>
                  <span className="rounded-md border border-[#2E6B72]/30 bg-[#2E6B72]/10 px-2 py-0.5 text-[10px] font-medium text-[#2E6B72] dark:text-[#EDE7DC] flex items-center gap-1">
                    {isGeneratingAi && <span className="h-1.5 w-1.5 rounded-full bg-[#E0623A] animate-ping" />}
                    <span>{isGeneratingAi ? "Styling..." : "Editorial Direction"}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-[#9EA5A8] mt-1">
                  {currentOutfit.tagline}
                </p>
              </div>

            {/* Controls: View Mode Toggle, Palette & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* View Mode Toggle: 3D Mannequin Fit vs Grid */}
              <div className="flex items-center rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-stone-100/80 dark:bg-[#0A0C0E]/70 p-1">
                <button
                  onClick={() => setDisplayMode("mannequin")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    displayMode === "mannequin"
                      ? "bg-[#E0623A] dark:bg-[#E8913C] text-white dark:text-[#0A0C0E] font-semibold shadow-xs"
                      : "text-stone-600 dark:text-[#9EA5A8] hover:text-stone-900 dark:hover:text-[#EDE7DC]"
                  }`}
                  title="Anatomical 3D Mannequin View"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>3D Fit</span>
                </button>
                <button
                  onClick={() => setDisplayMode("grid")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    displayMode === "grid"
                      ? "bg-[#E0623A] dark:bg-[#E8913C] text-white dark:text-[#0A0C0E] font-semibold shadow-xs"
                      : "text-stone-600 dark:text-[#9EA5A8] hover:text-stone-900 dark:hover:text-[#EDE7DC]"
                  }`}
                  title="Editorial Grid View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </button>
              </div>

              {/* Palette swatches */}
              <div className="flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-stone-100/80 dark:bg-[#0A0C0E]/60 px-3 py-1.5">
                <span className="text-[10px] uppercase tracking-wider font-medium text-stone-500 dark:text-[#9EA5A8] mr-1">
                  Palette
                </span>
                <div className="flex items-center -space-x-1">
                  {currentOutfit.palette.map((hex: string, i: number) => (
                    <span
                      key={i}
                      className="h-3.5 w-3.5 rounded-sm border border-white dark:border-[#0A0C0E] shadow-2xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Shuffle variation button */}
              <button
                onClick={handleShuffle}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-stone-100/80 dark:bg-[#0A0C0E]/60 text-stone-600 dark:text-[#9EA5A8] hover:text-[#E0623A] dark:hover:text-[#EDE7DC] hover:border-[#E0623A] transition-all cursor-pointer"
                title="Shuffle alternative combination"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>

              {/* Save / Favorite outfit button */}
              <button
                onClick={handleSaveOutfit}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isCurrentOutfitSaved || isSavedToast
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400"
                    : "border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-stone-100/80 dark:bg-[#0A0C0E]/60 text-stone-600 dark:text-[#9EA5A8] hover:text-rose-500 hover:border-rose-400"
                }`}
                title={isCurrentOutfitSaved ? "Saved in Lookbook" : "Save outfit to Lookbook"}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    isCurrentOutfitSaved || isSavedToast ? "fill-current text-rose-500 dark:text-rose-400" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Confirmation Toast Popup */}
          {isSavedToast && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-lg bg-[#0A0C0E] border border-[#E8913C]/40 text-[#EDE7DC] px-3.5 py-2 text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved to Lookbook</span>
            </div>
          )}

          {/* Conditional View: 3D Anatomical Mannequin Fit vs Grid */}
          {displayMode === "mannequin" ? (
            <AnatomicalMannequin
              items={currentOutfit.items}
              onInspect={(item) => {
                setInspectedPiece(item);
                setIsInspectionOpen(true);
              }}
              occasionTitle={currentOutfit.title}
              palette={currentOutfit.palette}
            />
          ) : (
            /* Visual Paired Items Grid with 3D Tactile Physics */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 my-6 sm:my-8 perspective-1000">
              {currentOutfit.items.map((item: CuratedItem) => (
                <TactileCard
                  key={item.id}
                  maxTilt={3.6}
                  elevation={8}
                  onClick={() => {
                    setInspectedPiece(item);
                    setIsInspectionOpen(true);
                  }}
                  className="group flex flex-col rounded-xl border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] bg-stone-50/80 dark:bg-[#0A0C0E]/60 p-3 transition-all duration-300 hover:shadow-luxury hover:border-[#E0623A] dark:hover:border-[#E8913C] cursor-pointer"
                >
                  {/* Image Container with Next.js Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-[#0A0C0E] mb-3">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 rounded-md border border-[#E0623A]/30 dark:border-[#E8913C]/30 bg-white/90 dark:bg-[#0A0C0E]/80 text-[#E0623A] dark:text-[#E8913C] px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider backdrop-blur-md z-10 shadow-2xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Item Info */}
                  <div className="px-1">
                    <h4 className="font-serif text-xs sm:text-sm text-[#1C1917] dark:text-[#EDE7DC] line-clamp-1 group-hover:text-[#E0623A] dark:group-hover:text-[#E8913C] transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-[#9EA5A8] mt-1 font-mono">
                      <span>{item.brand}</span>
                      <span className="text-stone-800 dark:text-[#EDE7DC] font-medium">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </TactileCard>
              ))}
            </div>
          )}

          {/* Stylist Pairing Note & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-[#EAE6DF] dark:border-[rgba(237,231,220,0.13)] gap-4">
            <div className="flex items-start sm:items-center gap-2.5 max-w-xl">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E0623A]/15 dark:bg-[#E8913C]/15 border border-[#E0623A]/30 dark:border-[#E8913C]/30 text-[#E0623A] dark:text-[#E8913C] text-[10px] font-mono font-semibold">
                S
              </span>
              <p className="text-xs text-stone-600 dark:text-[#9EA5A8] leading-relaxed">
                <strong className="text-[#1C1917] dark:text-[#EDE7DC]">Stylist Direction: </strong>
                {currentOutfit.stylistNote}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleLogWear}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                  isWornLogged
                    ? "bg-[#2E6B72] text-white"
                    : "bg-[#E0623A] hover:bg-[#c9522c] dark:bg-[#E8913C] dark:hover:bg-[#d8802d] text-white dark:text-[#0A0C0E] font-semibold shadow-xs"
                }`}
              >
                {isWornLogged ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Logged for Today</span>
                  </>
                ) : (
                  <span>Record as Worn</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </TactileCard>
    )}

      {/* Modals */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        savedOutfits={savedOutfits}
        onDeleteOutfit={handleDeleteSavedOutfit}
        onApplyOutfit={(outfit) => {
          setSelectedOccasion(outfit.occasion as any);
        }}
      />

      <CapsulePackModal
        isOpen={isCapsuleOpen}
        onClose={() => setIsCapsuleOpen(false)}
        items={items}
      />

      {/* Garment Inspection Modal for Occasion Pieces */}
      <GarmentInspectionModal
        item={inspectedPiece}
        open={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
      />
    </section>
  );
}
