"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Bookmark,
  ShieldCheck,
  FileText,
  Mail,
  Shirt,
  Sparkles,
  DoorOpen,
  DoorClosed,
  Home,
} from "lucide-react";
import { MagnificationDock, DockItemData } from "@/components/magnification-dock";
import { VestiarMonogram } from "@/components/vestiar-monogram";

interface CleanNavbarProps {
  totalPieces: number;
  user: { name: string; email: string; avatar: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onToggleDoors?: () => void;
  isDoorsOpen?: boolean;
}

export function CleanNavbar({
  totalPieces,
  user,
  onOpenAuth,
  onSignOut,
  onToggleDoors,
  isDoorsOpen = true,
}: CleanNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  // macOS-inspired Magnification Dock navigation items with multi-page router links
  const dockItems: DockItemData[] = [
    {
      icon: <Home className="h-4 w-4" />,
      label: "Atelier Salon",
      onClick: () => router.push("/"),
    },
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
      icon: <Shirt className={`h-4 w-4 ${pathname === "/wardrobe" ? "text-[#789575]" : ""}`} />,
      label: `My Closet ${totalPieces > 0 ? `(${totalPieces})` : ""}`,
      onClick: () => router.push("/wardrobe"),
      badge: totalPieces > 0 ? totalPieces : undefined,
    },
    {
      icon: <Sparkles className={`h-4 w-4 ${pathname === "/style" ? "text-[#789575]" : "text-[#789575]"}`} />,
      label: "Occasion Pairing",
      onClick: () => router.push("/style"),
    },
    {
      icon: <Plus className={`h-4 w-4 ${pathname === "/upload" ? "text-[#789575]" : ""}`} />,
      label: "Upload Piece",
      onClick: () => router.push("/upload"),
    },
    {
      icon: <Compass className="h-4 w-4" />,
      label: "Lookbook Salon",
      onClick: () => router.push("/style"),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full rounded-t-2xl md:rounded-t-3xl border-b border-[#CAD2B4] bg-[#E5E8CE]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 sm:h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand: Clicks to / */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer focus-visible:outline-hidden"
            aria-label="Vestiar Atelier Home"
          >
            <VestiarMonogram size={34} className="group-hover:scale-105 transition-transform" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-normal tracking-[0.22em] uppercase text-[#202D1F]">
                Vestiar
              </span>
              <span className="hidden sm:inline-block rounded-md border border-[#CAD2B4] bg-[#EFF2E1] px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase text-[#586B56]">
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
              className="border-[#CAD2B4] bg-[#EFF2E1]/90 shadow-2xs"
            />
          </div>

          {/* Right Actions: Account State, Forest Sage Upload, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Direct Multi-Page Links on Desktop */}
            <nav className="hidden lg:flex items-center gap-1 mr-2 text-xs font-medium">
              <Link
                href="/wardrobe"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === "/wardrobe"
                    ? "bg-[#789575] text-white shadow-2xs font-semibold"
                    : "text-[#586B56] hover:bg-[#DCE2C6] hover:text-[#202D1F]"
                }`}
              >
                Closet
              </Link>
              <Link
                href="/style"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === "/style"
                    ? "bg-[#789575] text-white shadow-2xs font-semibold"
                    : "text-[#586B56] hover:bg-[#DCE2C6] hover:text-[#202D1F]"
                }`}
              >
                Style Salon
              </Link>
            </nav>

            {/* Guest vs Logged In Account Pill */}
            {user ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] pl-1 pr-2.5 py-1 shadow-2xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#789575] text-white text-[11px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[#202D1F] hidden sm:inline max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign Out of Vestiar Atelier"
                  className="text-stone-400 hover:text-[#789575] ml-1 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] px-3 py-1.5 text-xs font-medium text-[#202D1F] hover:border-[#789575] transition-all cursor-pointer shadow-2xs"
                >
                  <User className="h-3.5 w-3.5 text-[#586B56]" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Primary Forest Sage CTA: Direct route to /upload */}
            <Link
              href="/upload"
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#789575] hover:bg-[#668363] text-white px-3.5 py-1.5 text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload Piece</span>
            </Link>

            {/* Mobile Hamburger Toggle (md:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] text-[#202D1F] transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop with dark blur */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="relative w-[85vw] max-w-[300px] h-full border-l border-[#CAD2B4] p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200 bg-[#E5E8CE] text-[#202D1F]"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#CAD2B4]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <VestiarMonogram size={24} />
                  <span className="font-serif text-base font-normal tracking-[0.15em] uppercase text-[#202D1F]">
                    Vestiar Atelier
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[#586B56] hover:text-[#202D1F] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Items (Direct multi-page routing) */}
              <div className="py-6 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm font-medium ${
                    pathname === "/"
                      ? "bg-[#789575] text-white font-semibold"
                      : "hover:bg-[#DCE2C6] text-[#202D1F]"
                  }`}
                >
                  <span>Atelier Salon</span>
                  <Home className="h-4 w-4 text-[#586B56]" />
                </Link>

                <Link
                  href="/wardrobe"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm font-medium ${
                    pathname === "/wardrobe"
                      ? "bg-[#789575] text-white font-semibold"
                      : "hover:bg-[#DCE2C6] text-[#202D1F]"
                  }`}
                >
                  <span>My Closet Collection</span>
                  <span className="text-xs text-[#586B56] font-normal">
                    {totalPieces} pieces
                  </span>
                </Link>

                <Link
                  href="/style"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm font-medium ${
                    pathname === "/style"
                      ? "bg-[#789575] text-white font-semibold"
                      : "hover:bg-[#DCE2C6] text-[#202D1F]"
                  }`}
                >
                  <span>Occasion Pairing Engine</span>
                  <span className="h-2 w-2 rounded-full bg-[#789575]" />
                </Link>

                <Link
                  href="/upload"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm font-medium ${
                    pathname === "/upload"
                      ? "bg-[#789575] text-white font-semibold"
                      : "hover:bg-[#DCE2C6] text-[#202D1F]"
                  }`}
                >
                  <span>Digitization Studio</span>
                  <Plus className="h-3.5 w-3.5 text-[#586B56]" />
                </Link>

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

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EAE6DF] dark:border-[#2E2A26] space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out ({user.name.split(" ")[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-[#1E1B18] py-2.5 text-xs font-medium cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In with Google</span>
                </button>
              )}

              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white py-2.5 text-xs font-medium transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Garment</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
