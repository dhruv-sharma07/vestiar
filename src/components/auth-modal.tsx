"use client";

import React, { useState } from "react";
import { X, Mail, ArrowRight, Check, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; avatar: string }) => void;
  triggerReason?: string;
}

export function AuthModal({
  open,
  onClose,
  onLoginSuccess,
  triggerReason,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!open) return null;

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        name: "Dhruv Sharma",
        email: "dhruv@fitiq.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      });
      onClose();
    }, 600);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMagicLinkSent(true);
      setTimeout(() => {
        onLoginSuccess({
          name: email.split("@")[0],
          email,
          avatar: "",
        });
        onClose();
        setMagicLinkSent(false);
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FFFFFF]/95 dark:bg-[#1C1A17]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Refined Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-md border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#524424] dark:bg-[#2A2315] px-2.5 py-1 text-[11px] font-medium text-[#7B6127] dark:text-[#E5C378] mb-4">
          <ShieldCheck className="h-3 w-3 text-[#7B6127]" />
          <span>Account Synchronization</span>
        </div>

        {/* Title & Trigger Context */}
        <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-50">
          Save &amp; Sync Your Wardrobe
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          {triggerReason ||
            "Access your digitized garments across phone and desktop. Never lose your curated outfits."}
        </p>

        {/* 1-Click Continue with Google (Architectural rounded-lg) */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 py-2.5 px-4 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-all shadow-2xs cursor-pointer"
          >
            {/* Google Vector Icon */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-stone-200 dark:border-stone-800" />
            <span className="px-3 text-[10px] uppercase font-semibold tracking-wider text-stone-400 dark:text-stone-500">
              or continue with email
            </span>
            <div className="flex-1 border-t border-stone-200 dark:border-stone-800" />
          </div>

          {/* Email Magic Link Form */}
          {magicLinkSent ? (
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-[#E8EEE7] dark:bg-[#1E2E22] p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2D4A34] dark:text-emerald-300">
                <Check className="h-4 w-4" />
                <span>Verification link sent. Accessing closet...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-2.5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full h-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 pl-9 pr-3 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-[#E0623A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white py-2.5 px-4 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
              >
                <span>Continue with Email</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          {/* Guest Dismiss Button */}
          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-4 cursor-pointer"
            >
              Keep exploring as Guest (One-time trial)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
