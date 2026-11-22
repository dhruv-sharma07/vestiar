"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CleanNavbar } from "@/components/clean-navbar";
import { CleanHero } from "@/components/clean-hero";
import { CleanOccasionBar } from "@/components/clean-occasion-bar";
import { CleanWardrobeGrid } from "@/components/clean-wardrobe-grid";
import { CleanUploadBox } from "@/components/clean-upload-box";
import { AuthModal } from "@/components/auth-modal";
import { Interactive3DBackground } from "@/components/interactive-3d-background";
import { WardrobeEntrance } from "@/components/wardrobe-entrance";
import { SAMPLE_FOUR_ITEMS, CuratedItem } from "@/lib/curated-wardrobe";
import { Database, UploadCloud, Cpu, Mail, Phone } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState<CuratedItem[]>([]);
  const [isSampleActive, setIsSampleActive] = useState(false);
  const [guestUploadCount, setGuestUploadCount] = useState(0);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState("");
  const [dbSource, setDbSource] = useState<"database" | "local-fallback">("local-fallback");
  const [isCloudinaryActive, setIsCloudinaryActive] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [isDoorsOpen, setIsDoorsOpen] = useState(true);

  // Helper function to resolve pastel badge styling
  const getPastelTag = (category: string) => {
    switch (category) {
      case "tops":
        return {
          bg: "bg-[#E8EEE7]",
          text: "text-[#2D4A34]",
          border: "border-[#D1DFD0]",
        };
      case "bottoms":
        return {
          bg: "bg-[#F3EFEA]",
          text: "text-[#5C5349]",
          border: "border-[#E4DCD2]",
        };
      case "footwear":
        return {
          bg: "bg-[#E8EEE7]",
          text: "text-[#2D4A34]",
          border: "border-[#D1DFD0]",
        };
      default:
        return {
          bg: "bg-[#FDF8ED]",
          text: "text-[#7B6127]",
          border: "border-[#E8D9B9]",
        };
    }
  };

  // Load wardrobe from Backend API with LocalStorage Fallback
  useEffect(() => {
    async function loadWardrobe() {
      try {
        const res = await fetch("/api/wardrobe");
        const data = await res.json();

        if (data.success && data.source === "database") {
          setDbSource("database");
          if (Array.isArray(data.items) && data.items.length > 0) {
            const dbItems: CuratedItem[] = data.items.map((dbItem: any) => ({
              id: dbItem.id,
              name: dbItem.name,
              category: dbItem.category,
              subCategory: dbItem.type || "Apparel",
              colorName: dbItem.colors?.[0] || "Neutral",
              colorHex: dbItem.colorHex || "#27272A",
              brand: dbItem.brand || "Custom",
              price: dbItem.price || 0,
              imageUrl: dbItem.imageUrl,
              pastelTag: getPastelTag(dbItem.category),
              occasions: dbItem.occasions || ["casual"],
            }));
            setItems(dbItems);
            setIsSampleActive(false);
            return;
          }
        }
      } catch (err) {
        console.log("Using local storage fallback:", err);
      }

      // Fallback: Read from browser localStorage
      try {
        const saved = localStorage.getItem("fitiq_closet_items");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
            setIsSampleActive(false);
          }
        }
        const savedUser = localStorage.getItem("fitiq_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {}
    }

    loadWardrobe();

    // Check Cloudinary status
    fetch("/api/upload")
      .then((res) => res.json())
      .then((data) => {
        if (data.isConfigured) {
          setIsCloudinaryActive(true);
        }
      })
      .catch(() => {});
  }, []);

  // Save items to localStorage whenever changed
  const updateItems = (newItems: CuratedItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("fitiq_closet_items", JSON.stringify(newItems));
    } catch (e) {}
  };

  const handleAddItem = async (newItem: CuratedItem) => {
    // Optimistic UI update
    const updated = [newItem, ...items];
    updateItems(updated);
    setIsSampleActive(false);
    setGuestUploadCount((prev) => prev + 1);

    // Sync with real backend API
    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name,
          imageUrl: newItem.imageUrl,
          category: newItem.category,
          subCategory: newItem.subCategory,
          colorName: newItem.colorName,
          colorHex: newItem.colorHex,
          brand: newItem.brand,
          price: newItem.price,
          occasions: newItem.occasions,
          userId: user?.email || "demo-user-1",
          userEmail: user?.email || "guest@fitiq.local",
        }),
      });
      const data = await res.json();
      if (data.source === "database") {
        setDbSource("database");
      }
    } catch (err) {
      console.log("Saved locally (offline mode)");
    }
  };

  const handleRemoveItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    updateItems(updated);

    try {
      await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Deleted locally");
    }
  };

  const handleLoadSamples = () => {
    updateItems(SAMPLE_FOUR_ITEMS);
    setIsSampleActive(true);
    scrollToSection("demo-wardrobe-section");
  };

  const handleClearSamples = () => {
    updateItems([]);
    setIsSampleActive(false);
  };

  const handleTriggerAuth = (reason: string) => {
    setAuthTriggerReason(reason);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    setUser(userData);
    try {
      localStorage.setItem("fitiq_user", JSON.stringify(userData));
    } catch (e) {}
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("fitiq_user");
    } catch (e) {}
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FBF9F5] dark:bg-[#0A0C0E] p-2 sm:p-3 md:p-3.5 text-[#1C1917] dark:text-[#EDE7DC] transition-colors selection:bg-[#E0623A]/20 selection:text-[#E0623A]">
      {/* 0. Theatrical 3D Wardrobe Doors Entrance Motion (Autonomous 2-Second Sequence with Name Slash) */}
      <WardrobeEntrance
        isOpen={isDoorsOpen}
        onOpen={() => setIsDoorsOpen(true)}
        onClose={() => setIsDoorsOpen(false)}
        autoOpenDelay={2000}
      />

      {/* 1. Interactive 3D Background (Hovers & tilts dynamically as the mouse moves) */}
      <Interactive3DBackground />

      {/* 2. Cushioned Architectural Magazine Frame (12px / 0.75rem inset with hairline border) */}
      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-white/95 dark:bg-[#121519]/90 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
        <div>
          {/* Editorial Minimalist Navbar */}
          <CleanNavbar
            totalPieces={items.length}
            user={user}
            onOpenAuth={() =>
              handleTriggerAuth("Sign in to sync your wardrobe across all your devices.")
            }
            onSignOut={handleSignOut}
            onScrollToUpload={() => scrollToSection("upload-section")}
            onScrollToCloset={() => scrollToSection("demo-wardrobe-section")}
            onScrollToStylist={() => scrollToSection("style-me-section")}
            onToggleDoors={() => setIsDoorsOpen((prev) => !prev)}
            isDoorsOpen={isDoorsOpen}
          />

          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* 1. Hero Section */}
            <CleanHero
              onScrollToUpload={() => scrollToSection("upload-section")}
              onScrollToCloset={() => scrollToSection("demo-wardrobe-section")}
              onLoadSamples={handleLoadSamples}
              isEmpty={items.length === 0}
              onToggleDoors={() => setIsDoorsOpen((prev) => !prev)}
              isDoorsOpen={isDoorsOpen}
            />

            {/* 2. "Style Me" Occasion Bar & Paired Combination Card */}
            <CleanOccasionBar
              items={items}
              onLoadSamples={handleLoadSamples}
              userEmail={user?.email}
            />

            {/* 3. Demo Wardrobe Grid (Empty zero-state vs populated with 3D tactile cards) */}
            <CleanWardrobeGrid
              items={items}
              onLoadSamples={handleLoadSamples}
              onClearSamples={handleClearSamples}
              onScrollToUpload={() => scrollToSection("upload-section")}
              onRemoveItem={handleRemoveItem}
              isSampleActive={isSampleActive}
            />

            {/* 4. Quick Add / Upload Box */}
            <CleanUploadBox
              onAddItem={handleAddItem}
              guestUploadCount={guestUploadCount}
              isLoggedIn={!!user}
              onTriggerAuth={handleTriggerAuth}
            />
          </main>
        </div>

        {/* Minimalist Editorial Footer */}
        <footer className="mt-20 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.14)] bg-[#F8F5EE]/90 dark:bg-[#0A0C0E]/80 py-10 text-xs text-stone-600 dark:text-stone-400">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Link href="/" className="font-serif font-light tracking-[0.2em] uppercase text-[#1C1917] dark:text-[#EDE7DC] text-base">
                    Vestiar
                  </Link>
                  <span className="text-[#E0623A]">:</span>
                  <span className="font-normal text-stone-700 dark:text-[#EDE7DC]/80 font-serif italic">Atelier de Garde-Robe Privée &amp; Occasion Dressing</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-[#9EA5A8] mt-1 font-light">
                  Haute capsule curation, tonal color harmony, and bespoke silhouette styling.
                </p>
              </div>

              {/* Infrastructure Sync Status Indicators (Architectural rounded-md) */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <Database className="h-3 w-3 text-stone-400" />
                  <span>
                    Database:{" "}
                    {dbSource === "database" ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">PostgreSQL Connected</strong>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400">Local State Active</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <UploadCloud className="h-3 w-3 text-stone-400" />
                  <span>
                    Storage:{" "}
                    {isCloudinaryActive ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Cloud CDN Active</strong>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400">Direct Storage</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[#E8E3DA] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-2.5 py-1 text-[11px] text-stone-700 dark:text-stone-300">
                  <Cpu className="h-3 w-3 text-[#E0623A]" />
                  <span>
                    Vision Engine:{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Gemini Multimodal Active</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Links & Contact Row */}
            <div className="pt-6 border-t border-[#E8E3DA] dark:border-[rgba(237,231,220,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
              <div className="flex items-center gap-5 flex-wrap">
                <span>&copy; {currentYear} VESTIAR Atelier. All rights reserved.</span>
                <Link href="/privacy" className="hover:text-stone-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-stone-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors">
                  Terms of Service
                </Link>
              </div>

              <div className="flex items-center gap-4 text-stone-600 dark:text-stone-400">
                <a
                  href="mailto:concierge@vestiar.com"
                  className="inline-flex items-center gap-1 hover:text-[#E0623A] transition-colors"
                >
                  <Mail className="h-3 w-3 text-stone-400" />
                  <span>concierge@vestiar.com</span>
                </a>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-1 hover:text-[#E0623A] transition-colors"
                >
                  <Phone className="h-3 w-3 text-stone-400" />
                  <span>+1 (800) 555-0199</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Account Gate & Sign-In Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        triggerReason={authTriggerReason}
      />
    </div>
  );
}
