"use client";

import React from "react";
import {
  TrendingUp,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Leaf,
  DollarSign,
  BarChart,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AnalyticsView() {
  const { items, setActiveTab } = useWardrobeStore();

  const totalItems = items.length;
  const totalValue = items.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalWears = items.reduce((acc, curr) => acc + (curr.timesWorn || 0), 0);
  const avgCostPerWear = totalWears > 0 ? (totalValue / totalWears).toFixed(1) : "0";

  // Category breakdown
  const categoryCounts = {
    top: items.filter((i) => i.category === "top").length,
    bottom: items.filter((i) => i.category === "bottom").length,
    shoes: items.filter((i) => i.category === "shoes").length,
    outerwear: items.filter((i) => i.category === "outerwear").length,
    ethnic: items.filter((i) => i.category === "ethnic").length,
    accessories: items.filter((i) => i.category === "accessories").length,
  };

  // Best ROI Items (Highest wears per dollar)
  const sortedByROI = [...items].sort((a, b) => {
    const cpwA = a.timesWorn > 0 ? a.price / a.timesWorn : 999;
    const cpwB = b.timesWorn > 0 ? b.price / b.timesWorn : 999;
    return cpwA - cpwB;
  });

  const bestROI = sortedByROI.slice(0, 3);
  const underutilized = [...items].filter((i) => i.timesWorn <= 4).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Analytics Overview Header */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none">
                Wardrobe Intelligence
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">ROI & Sustainability</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2">
              Wardrobe Analytics & Gaps
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Track your cost-per-wear, discover unused items, and identify gaps in your closet to unlock more outfit combinations.
            </p>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              Avg. Cost Per Wear
            </span>
            <p className="text-2xl font-black text-foreground mt-1">${avgCostPerWear}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Target: &lt; $3.50 per wear
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
              Total Logged Wears
            </span>
            <p className="text-2xl font-black text-foreground mt-1">{totalWears} Wears</p>
            <span className="text-[10px] text-muted-foreground">Across {totalItems} pieces</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-500" />
              Sustainability Score
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">86/100</p>
            <span className="text-[10px] text-muted-foreground">High rewear efficiency</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              Closet Net Value
            </span>
            <p className="text-2xl font-black text-foreground mt-1">${totalValue}</p>
            <span className="text-[10px] text-muted-foreground">Replacement estimate</span>
          </div>
        </div>
      </div>

      {/* Wardrobe Gaps & Smart Shopping AI Recommendations */}
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">AI Wardrobe Gap Detection</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Based on mathematical permutation analysis of your tops vs bottoms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  1. High Top-to-Bottom Ratio
                </span>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  You own <strong>{categoryCounts.top} tops</strong> but only{" "}
                  <strong>{categoryCounts.bottom} bottoms</strong>. Adding a neutral bottom (like
                  charcoal chinos or olive fatigues) will instantly unlock{" "}
                  <strong>+6 new outfit combinations</strong> without buying more shirts.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0 font-semibold">
                High Impact
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  2. Footwear Versatility Gap
                </span>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your white leather sneakers are worn across 34 events (heavy rotation). Consider a
                  minimalist dark leather or suede Chelsea boot to extend the life of your everyday court
                  sneakers.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0 font-semibold">
                Longevity
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Top Value ROI vs Underutilized Clothes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Loved / Best ROI */}
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Top Value Pieces (Lowest Cost-Per-Wear)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Garments that have paid for themselves many times over.
          </p>

          <div className="space-y-3">
            {bestROI.map((item) => {
              const cpw = (item.price / Math.max(item.timesWorn, 1)).toFixed(2);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-2.5"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Worn {item.timesWorn} times • Original: ${item.price}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ${cpw}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">/ wear</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Needs Attention / Underutilized */}
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Underutilized Garments
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Items worn fewer than 5 times. Ask the AI Stylist to build an outfit around them!
          </p>

          <div className="space-y-3">
            {underutilized.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-2.5"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Only worn {item.timesWorn} times • {item.category}
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab("stylist")}
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-7 px-2.5 rounded-lg shrink-0 gap-1"
                >
                  <Sparkles className="h-3 w-3 text-violet-500" />
                  Style It
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
