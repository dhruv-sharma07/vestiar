"use client";

import React from "react";
import { Sparkles, Shirt, Calendar, BarChart3, CloudSun, Plus } from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  onOpenAddItem: () => void;
}

export function Navbar({ onOpenAddItem }: NavbarProps) {
  const { activeTab, setActiveTab, weather, items } = useWardrobeStore();

  const cleanCount = items.filter((i) => i.isClean).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
                FitIQ
              </span>
              <Badge variant="secondary" className="text-[10px] uppercase font-semibold px-1.5 py-0">
                AI Wardrobe
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Intelligent Closet & Occasion Stylist
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
          <button
            onClick={() => setActiveTab("wardrobe")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "wardrobe"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shirt className="h-3.5 w-3.5" />
            My Closet ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("stylist")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "stylist"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Stylist
          </button>
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "planner"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Weekly Plan
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>
        </nav>

        {/* Right Actions: Weather, Add Item, Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Weather Pill */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            <CloudSun className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium text-foreground">{weather.temp}°C</span>
            <span>{weather.condition}</span>
            <span className="text-[10px] opacity-70">({weather.city.split(",")[0]})</span>
          </div>

          {/* Add Item Button */}
          <Button
            onClick={onOpenAddItem}
            size="sm"
            className="gap-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium shadow-sm text-xs h-9 px-3.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Clothes</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="flex md:hidden border-t border-border/40 bg-background/95 backdrop-blur px-2 py-1 justify-around">
        <button
          onClick={() => setActiveTab("wardrobe")}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === "wardrobe" ? "text-violet-600 font-semibold" : "text-muted-foreground"
          }`}
        >
          <Shirt className="h-4 w-4 mb-0.5" />
          Closet
        </button>
        <button
          onClick={() => setActiveTab("stylist")}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === "stylist" ? "text-violet-600 font-semibold" : "text-muted-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 mb-0.5" />
          AI Stylist
        </button>
        <button
          onClick={() => setActiveTab("planner")}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === "planner" ? "text-violet-600 font-semibold" : "text-muted-foreground"
          }`}
        >
          <Calendar className="h-4 w-4 mb-0.5" />
          Plan
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
            activeTab === "analytics" ? "text-violet-600 font-semibold" : "text-muted-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4 mb-0.5" />
          Analytics
        </button>
      </div>
    </header>
  );
}
