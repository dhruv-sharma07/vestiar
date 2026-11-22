"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Sparkles, Check, ChevronRight, Plus } from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DayPlan {
  day: string;
  date: string;
  occasion: string;
  outfitName: string;
  items: string[];
  isToday?: boolean;
}

const DEFAULT_SCHEDULE: DayPlan[] = [
  {
    day: "Monday",
    date: "Nov 24",
    occasion: "Office Presentation",
    outfitName: "Executive Italian Oxford & Navy Chinos",
    items: ["White Oxford Shirt", "Slim Navy Chinos", "Cognac Loafers"],
  },
  {
    day: "Tuesday",
    date: "Nov 25",
    occasion: "Gym Workout",
    outfitName: "AeroMotion Tech Fit",
    items: ["Performance Tech Tee", "AeroMotion 7'' Shorts", "Pegasus Runners"],
  },
  {
    day: "Wednesday",
    date: "Nov 26",
    occasion: "Client Lunch & Work",
    outfitName: "Navy Milano Blazer & Chinos",
    items: ["Milano Blazer", "White Oxford Shirt", "Seiko Watch"],
  },
  {
    day: "Thursday",
    date: "Nov 27",
    occasion: "Evening Date Night",
    outfitName: "Resort Noir & Suede Chelsea Boots",
    items: ["Camp Collar Noir Shirt", "Selvedge Denim", "Chelsea Boots"],
  },
  {
    day: "Friday",
    date: "Nov 28",
    occasion: "Casual Friday & Gym",
    outfitName: "Heavyweight Sage Tee & Cargos",
    items: ["Sage Oversized Tee", "Utility Cargos", "White Court Sneakers"],
  },
  {
    day: "Saturday",
    date: "Nov 29",
    occasion: "Wedding Festivities",
    outfitName: "Emerald Chikankari & Gold Bundi",
    items: ["Emerald Kurta", "Raw Silk Bundi", "Ivory Churidar"],
  },
  {
    day: "Sunday",
    date: "Nov 30",
    occasion: "Brunch & Rest",
    outfitName: "Relaxed Linen & Court Sneakers",
    items: ["Camp Shirt", "White Court Sneakers", "Tortoise Shades"],
  },
];

export function CalendarView() {
  const { setActiveTab } = useWardrobeStore();
  const [schedule, setSchedule] = useState<DayPlan[]>(DEFAULT_SCHEDULE);

  return (
    <div className="space-y-6">
      {/* Calendar Planner Header */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none">
                Weekly Scheduler
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                No-Repeat Workweek Guarantee
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2">
              Weekly Outfit Calendar
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Eliminate morning decision fatigue. Pre-assign outfits for every event, meeting, or workout session this week.
            </p>
          </div>

          <Button
            onClick={() => setActiveTab("stylist")}
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs px-4 self-start sm:self-auto gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Schedule Week with AI
          </Button>
        </div>
      </div>

      {/* 7-Day Plan List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.map((plan, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-violet-500/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-3">
              <div>
                <span className="text-xs font-bold text-foreground block">{plan.day}</span>
                <span className="text-[11px] text-muted-foreground">{plan.date}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {plan.occasion}
              </Badge>
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2">
                {plan.outfitName}
              </p>

              <div className="space-y-1">
                {plan.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="h-3 w-3" /> Ready in closet
              </span>
              <button
                onClick={() => setActiveTab("stylist")}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                Change <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
