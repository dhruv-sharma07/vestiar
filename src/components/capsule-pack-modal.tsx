"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Plane,
  Luggage,
  CloudSun,
  CloudRain,
  Sun,
  Flame,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { CuratedItem } from "@/lib/curated-wardrobe";

interface CapsulePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CuratedItem[];
}

interface DayOutfit {
  dayNumber: number;
  title: string;
  occasion: string;
  matchScore: number;
  stylingNote: string;
  items: CuratedItem[];
}

interface CapsuleResult {
  tripType: string;
  days: number;
  weather: string;
  totalPieces: number;
  items: CuratedItem[];
  dayOutfits: DayOutfit[];
  weatherAdvice: string;
  luggageSavedKg: number;
}

export function CapsulePackModal({ isOpen, onClose, items }: CapsulePackModalProps) {
  const [tripType, setTripType] = useState("Weekend City Break");
  const [days, setDays] = useState(3);
  const [weather, setWeather] = useState<"warm" | "mild" | "cool" | "rainy">("mild");
  const [isGenerating, setIsGenerating] = useState(false);
  const [capsuleResult, setCapsuleResult] = useState<CapsuleResult | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const WEATHER_TABS = [
    { id: "warm", label: "Warm", icon: Sun },
    { id: "mild", label: "Mild", icon: CloudSun },
    { id: "cool", label: "Cool", icon: Flame },
    { id: "rainy", label: "Rainy", icon: CloudRain },
  ];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/capsule-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          days,
          weather,
          items,
        }),
      });
      const data = await res.json();
      if (data.success && data.capsule) {
        setCapsuleResult(data.capsule);
        setActiveDayIndex(0);
      }
    } catch (e) {
      console.error("Capsule generation error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5] dark:bg-[#1C1A17] p-6 sm:p-8 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] dark:border-[#2E2A26]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EEE7] dark:bg-[#1E2E22] text-[#2D4A34] dark:text-[#D3E0D5]">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
                  Trip Capsule Wardrobe Packer
                </h3>
                <span className="rounded-md border border-[#D1DFD0] bg-[#E8EEE7] dark:border-[#27332A] dark:bg-[#1E2E22] text-[#2D4A34] dark:text-[#D3E0D5] px-2 py-0.5 text-[10px] font-medium">
                  Travel Optimization
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pack fewer garments without repeating combinations. Multi-day capsule allocation.
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

        {/* Configuration Controls */}
        <div className="py-4 border-b border-[#EAE6DF]/60 dark:border-[#2E2A26]/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Trip Vibe (No Emojis) */}
          <div>
            <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
              Destination Style
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 px-3 py-1.5 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden"
            >
              <option value="Weekend City Break">Weekend City Break</option>
              <option value="Work & Client Trip">Work &amp; Client Trip</option>
              <option value="Summer Beach Getaway">Summer Beach Getaway</option>
              <option value="Alpine Mountain Retreat">Alpine Mountain Retreat</option>
            </select>
          </div>

          {/* Trip Duration */}
          <div>
            <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
              Duration: {days} Days
            </label>
            <div className="flex items-center gap-1.5">
              {[2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    days === d
                      ? "bg-[#1C1917] text-white dark:bg-[#F5F2EC] dark:text-[#1C1917] border-transparent"
                      : "border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Expected Weather (Clean Lucide Icons) */}
          <div>
            <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
              Forecast Weather
            </label>
            <div className="flex items-center gap-1">
              {WEATHER_TABS.map((w) => {
                const Icon = w.icon;
                return (
                  <button
                    key={w.id}
                    onClick={() => setWeather(w.id as any)}
                    className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg border transition-all flex items-center justify-center gap-1 ${
                      weather === w.id
                        ? "bg-[#E0623A] text-white border-transparent"
                        : "border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Button Banner */}
        {!capsuleResult && (
          <div className="py-12 text-center my-auto">
            <Luggage className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h4 className="text-base font-serif text-[#1C1917] dark:text-[#F5F2EC]">
              Pack with intention.
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto mb-5">
              Select your trip parameters above to curate the minimum pieces from your closet for {days} days of distinct looks.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || items.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-5 py-2.5 text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{isGenerating ? "Analyzing Wardrobe..." : "Generate Capsule Plan"}</span>
            </button>
          </div>
        )}

        {/* Results View */}
        {capsuleResult && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Quick Metrics Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-[#EAE6DF] dark:border-[#2E2A26]">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8EEE7] text-[#2D4A34] text-xs font-semibold">
                  {capsuleResult.totalPieces}
                </span>
                <div>
                  <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F2EC]">
                    Total Pieces Packed
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Yields {capsuleResult.dayOutfits.length} distinct looks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#7B6127] text-xs font-semibold">
                  <Luggage className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F2EC]">
                    ~{capsuleResult.luggageSavedKg} kg Saved
                  </p>
                  <p className="text-[10px] text-stone-500">Cabin carry-on compliant</p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-[11px] text-stone-500 hover:text-[#E0623A] underline cursor-pointer ml-auto"
              >
                Re-calculate
              </button>
            </div>

            {/* Weather Tip */}
            <div className="p-3 rounded-lg bg-[#FDF8ED]/80 dark:bg-[#251E12]/80 border border-[#E8D9B9] dark:border-[#4A3D22] text-xs text-[#7B6127] dark:text-[#E5C378] flex items-center gap-2">
              <CloudSun className="h-4 w-4 shrink-0" />
              <span>{capsuleResult.weatherAdvice}</span>
            </div>

            {/* Day Selector Tabs */}
            <div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {capsuleResult.dayOutfits.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      activeDayIndex === idx
                        ? "bg-[#1C1917] text-white dark:bg-[#F5F2EC] dark:text-[#1C1917]"
                        : "border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>

              {/* Active Day Outfit Card */}
              {capsuleResult.dayOutfits[activeDayIndex] && (
                <div className="mt-3 p-4 rounded-xl bg-white dark:bg-stone-900 border border-[#EAE6DF] dark:border-[#2E2A26]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-[#1C1917] dark:text-[#F5F2EC]">
                        {capsuleResult.dayOutfits[activeDayIndex].title}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {capsuleResult.dayOutfits[activeDayIndex].stylingNote}
                      </p>
                    </div>
                    <span className="rounded-md border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#4A3D22] dark:bg-[#251E12] px-2 py-0.5 text-[10px] font-medium text-[#7B6127] dark:text-[#E5C378]">
                      {capsuleResult.dayOutfits[activeDayIndex].matchScore}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {capsuleResult.dayOutfits[activeDayIndex].items.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40"
                      >
                        <div className="relative h-24 w-full rounded-md overflow-hidden mb-1.5 bg-stone-100 dark:bg-stone-800">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-[11px] font-medium text-[#1C1917] dark:text-[#F5F2EC] truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-stone-400 capitalize">
                          {item.category} • {item.colorName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Packed Items Checklist */}
            <div className="mt-4 pt-4 border-t border-[#EAE6DF] dark:border-[#2E2A26]">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-2">
                Luggage Packing List ({capsuleResult.items.length} garments):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {capsuleResult.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-stone-900 border border-[#EAE6DF] dark:border-[#2E2A26]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="relative h-9 w-9 rounded-md overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F2EC] truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-stone-400 capitalize">
                        {item.category} • {item.brand}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#EAE6DF] dark:border-[#2E2A26] flex items-center justify-between text-xs text-stone-500">
          <span className="font-serif italic">Vestiar Travel Optimization</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-1.5 font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
