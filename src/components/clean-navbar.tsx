"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Bookmark,
  Plane,
  ShieldCheck,
  FileText,
  Mail,
  Shirt,
  Sparkles,
  DoorOpen,
  DoorClosed,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagnificationDock, DockItemData } from "@/components/magnification-dock";
import { VestiarMonogram } from "@/components/vestiar-monogram";

interface CleanNavbarProps {
  onScrollToUpload: () => void;
  onScrollToCloset: () => void;
  onScrollToStylist: () => void;
  totalPieces: number;
  user: { name: string; email: string; avatar: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onToggleDoors?: () => void;
  isDoorsOpen?: boolean;
}

export function CleanNavbar({
  onScrollToUpload,
  onScrollToCloset,
  onScrollToStylist,
  totalPieces,
  user,
  onOpenAuth,
  onSignOut,
  onToggleDoors,
  isDoorsOpen = true,
}: CleanNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleMobileNav = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  // macOS-inspired Magnification Dock navigation items
  const dockItems: DockItemData[] = [
    ...(onToggleDoors
      ? [
          {
            icon: isDoorsOpen ? (
              <DoorClosed className="h-4 w-4 text-[#D4AF37]" />
            ) : (
              <DoorOpen className="h-4 w-4 text-[#D4AF37]" />
            ),
            label: isDoorsOpen ? "Close Wardrobe" : "Open Wardrobe",
            onClick: onToggleDoors,
          },
        ]
      : []),
    {
      icon: <Shirt className="h-4 w-4" />,
      label: `My Closet ${totalPieces > 0 ? `(${totalPieces})` : ""}`,
      onClick: onScrollToCloset,
      badge: totalPieces > 0 ? totalPieces : undefined,
    },
    {
      icon: <Sparkles className="h-4 w-4 text-[#E0623A]" />,
      label: "Occasion Pairing",
      onClick: onScrollToStylist,
    },
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Add Garment",
      onClick: onScrollToUpload,
    },
    {
      icon: <Compass className="h-4 w-4" />,
      label: "Style Engine",
      onClick: onScrollToStylist,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full rounded-t-2xl md:rounded-t-3xl border-b border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5]/95 dark:bg-[#141210]/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 sm:h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand: Clicks to / */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer focus-visible:outline-hidden"
            aria-label="Vestiar Atelier Home"
          >
            <VestiarMonogram size={34} className="group-hover:scale-105 transition-transform" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-light tracking-[0.22em] uppercase text-[#1C1917] dark:text-[#F5F2EC]">
                Vestiar
              </span>
              <span className="hidden sm:inline-block rounded-md border border-[#D9D3C7]/80 dark:border-[#2E2A26] bg-[#FBF9F5] dark:bg-[#1E1B18] px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400">
                Atelier Privé
              </span>
            </div>
          </Link>

          {/* Center macOS Magnification Dock Navigation (Desktop) */}
          <div className="hidden md:flex items-center justify-center">
            <MagnificationDock
              items={dockItems}
              panelHeight={44}
              dockHeight={56}
              baseItemSize={36}
              magnification={48}
              distance={110}
              tooltipPosition="bottom"
              className="border-[#EAE6DF] dark:border-[#2E2A26] bg-white/70 dark:bg-[#1C1A17]/70 shadow-xs"
            />
          </div>

          {/* Right Actions: Account State, Terracotta Upload, Theme, Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Guest vs Logged In Account Pill */}
          {user ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] pl-1 pr-2.5 py-1 shadow-2xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E0623A] dark:bg-[#E8913C] text-white dark:text-[#0A0C0E] text-[11px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-stone-800 dark:text-[#EDE7DC] hidden sm:inline max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="text-stone-400 hover:text-[#E0623A] dark:text-[#9EA5A8] dark:hover:text-[#E8913C] ml-1 transition-colors cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {totalPieces > 0 && (
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-[#EDE7DC] hover:border-[#E0623A] transition-all cursor-pointer shadow-2xs"
                >
                  <Bookmark className="h-3.5 w-3.5 text-[#E0623A] dark:text-[#E8913C]" />
                  <span>Save Closet</span>
                </button>
              )}
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] dark:border-[rgba(237,231,220,0.15)] bg-white dark:bg-[#101317] px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-[#EDE7DC] hover:border-[#E0623A] transition-all cursor-pointer shadow-2xs"
              >
                <User className="h-3.5 w-3.5 text-stone-500" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Primary Terracotta CTA (Architectural rounded-lg) */}
          <button
            onClick={onScrollToUpload}
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-3.5 py-1.5 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Piece</span>
          </button>

          <ThemeToggle />

          {/* Mobile Hamburger Toggle (md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white/80 dark:bg-stone-900 text-stone-700 dark:text-stone-200 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>

    {/* Slide-over Mobile Navigation Drawer rendered outside header to avoid backdrop-blur containment */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 md:hidden flex justify-end">
        {/* Backdrop with dark blur */}
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel (Solid Opaque Surface) */}
        <div 
          className="relative w-[85vw] max-w-[300px] h-full border-l border-[#EAE6DF] dark:border-[#2E2A26] p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] dark:border-[#2E2A26]">
              <div className="flex items-center gap-2">
                <VestiarMonogram size={24} />
                <span className="font-serif text-base font-light tracking-[0.15em] uppercase">Vestiar Atelier</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="py-6 space-y-2">
              <button
                onClick={() => handleMobileNav(onScrollToCloset)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-left text-sm font-medium text-stone-800 dark:text-stone-200"
              >
                <span>My Closet Collection</span>
                <span className="text-xs text-stone-400 font-normal">
                  {totalPieces} pieces
                </span>
              </button>

              <button
                onClick={() => handleMobileNav(onScrollToStylist)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-left text-sm font-medium text-stone-800 dark:text-stone-200"
              >
                <span>Occasion Pairing Engine</span>
                <span className="h-2 w-2 rounded-full bg-[#E0623A]" />
              </button>

              <button
                onClick={() => handleMobileNav(onScrollToUpload)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-left text-sm font-medium text-stone-800 dark:text-stone-200"
              >
                <span>Quick Add Garment</span>
                <Plus className="h-3.5 w-3.5 text-stone-400" />
              </button>

              <div className="pt-4 border-t border-[#EAE6DF] dark:border-[#2E2A26] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 block px-2.5 mb-2">
                  Legal &amp; Policy
                </span>
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs text-stone-600 dark:text-stone-400"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs text-stone-600 dark:text-stone-400"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Terms of Service</span>
                </Link>
                <a
                  href="mailto:concierge@vestiar.com"
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs text-stone-600 dark:text-stone-400"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>concierge@vestiar.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Primary Button in Drawer */}
          <div className="pt-4 border-t border-[#EAE6DF] dark:border-[#2E2A26]">
            <button
              onClick={() => handleMobileNav(onScrollToUpload)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white py-2.5 text-xs font-medium transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Upload New Garment</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
