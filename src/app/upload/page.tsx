"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CleanNavbar } from "@/components/clean-navbar";
import { CleanUploadBox } from "@/components/clean-upload-box";
import { AuthModal } from "@/components/auth-modal";
import { Interactive3DBackground } from "@/components/interactive-3d-background";
import { useWardrobe } from "@/lib/use-wardrobe";
import { ArrowLeft, Sparkles, Shirt, CheckCircle, ExternalLink } from "lucide-react";

export default function UploadPage() {
  const { items, user, addItem, login, logout, formatRupees } = useWardrobe();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);

  const handleAddItem = (newItem: any) => {
    addItem(newItem);
    setLastUploadedName(newItem.name);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#E5E8CE] p-2 sm:p-3 md:p-3.5 text-[#202D1F] transition-colors selection:bg-[#789575]/25 selection:text-[#202D1F]">
      <Interactive3DBackground />

      <div className="relative min-h-[calc(100vh-1.5rem)] rounded-2xl md:rounded-3xl border border-[#CAD2B4] bg-[#F0F2E3]/95 backdrop-blur-xl shadow-luxury flex flex-col justify-between">
        <div>
          <CleanNavbar
            totalPieces={items.length}
            user={user}
            onOpenAuth={() => {
              setAuthReason("Sign in to sync your garments across all devices.");
              setAuthModalOpen(true);
            }}
            onSignOut={logout}
          />

          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#586B56] hover:text-[#202D1F] transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Atelier Salon</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href="/wardrobe"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] px-3 py-1.5 text-xs font-medium text-[#202D1F] hover:border-[#789575] transition-all shadow-2xs"
                >
                  <Shirt className="h-3.5 w-3.5 text-[#789575]" />
                  <span>View Closet ({items.length})</span>
                </Link>
                <Link
                  href="/style"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD2B4] bg-[#EFF2E1] px-3 py-1.5 text-xs font-medium text-[#202D1F] hover:border-[#789575] transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#789575]" />
                  <span>Style Salon</span>
                </Link>
              </div>
            </div>

            {/* Success Banner if uploaded */}
            {lastUploadedName && (
              <div className="mb-6 rounded-xl border border-emerald-300 bg-[#EFF2E1] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#202D1F] animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#789575] shrink-0" />
                  <span>
                    <strong>{lastUploadedName}</strong> was cataloged and saved to your wardrobe collection!
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/wardrobe"
                    className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 text-[#789575] hover:text-[#202D1F]"
                  >
                    <span>Inspect in Closet</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Garment Digitization Studio Component */}
            <CleanUploadBox
              onAddItem={handleAddItem}
              guestUploadCount={items.length}
              isLoggedIn={!!user}
              onTriggerAuth={(reason) => {
                setAuthReason(reason);
                setAuthModalOpen(true);
              }}
            />
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#CAD2B4] bg-[#E0E5C4]/90 py-8 text-xs text-[#485B46]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-normal tracking-[0.2em] uppercase text-[#202D1F]">
                VESTIAR
              </span>
              <span className="text-[#CAD2B4]">&bull;</span>
              <span>Garment Digitization Studio</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/wardrobe" className="hover:underline text-[#789575]">Closet Archive &rarr;</Link>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={login}
        triggerReason={authReason}
      />
    </div>
  );
}
