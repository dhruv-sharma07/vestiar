"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VestiarMonogram } from "@/components/vestiar-monogram";

interface WardrobeEntranceProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  autoOpenDelay?: number; // Delay in ms before auto-opening (default 2000ms)
}

export function WardrobeEntrance({
  isOpen,
  onOpen,
  onClose,
  autoOpenDelay = 2000,
}: WardrobeEntranceProps) {
  const [slashTriggered, setSlashTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage the entrance sequence with a stable ref so re-renders don't cancel it
  useEffect(() => {
    if (!isOpen && mounted) {
      setSlashTriggered(false);

      const slashTimer = setTimeout(() => {
        setSlashTriggered(true);
      }, 500);

      const openTimer = setTimeout(() => {
        onOpenRef.current();
      }, autoOpenDelay);

      return () => {
        clearTimeout(slashTimer);
        clearTimeout(openTimer);
      };
    }
  }, [isOpen, autoOpenDelay, mounted]);

  if (!mounted) return null;

  return (
    <div
      onClick={() => {
        if (!isOpen) onOpen();
      }}
      onTouchEnd={() => {
        if (!isOpen) onOpen();
      }}
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isOpen ? "pointer-events-none" : "pointer-events-auto cursor-pointer"
      }`}
      style={{ perspective: "1500px" }}
      aria-label="Atelier Wardrobe Doors"
    >
      {/* Background Dimmer Backdrop during closed state */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.3 } }}
            className="absolute inset-0 bg-[#0E0C0A]/75 dark:bg-black/85 backdrop-blur-md z-10"
          />
        )}
      </AnimatePresence>

      {/* Golden Backlight Radiance Burst when doors part */}
      <motion.div
        animate={
          isOpen
            ? { opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2.2] }
            : { opacity: 0 }
        }
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center"
      >
        <div
          className="w-[85vw] h-[85vw] max-w-[900px] max-h-[900px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(224, 98, 58, 0.4) 0%, rgba(245, 208, 140, 0.25) 45%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* LEFT WARDROBE DOOR */}
      <motion.div
        initial={false}
        animate={
          isOpen
            ? {
                rotateY: -105,
                x: "-12%",
                opacity: 0,
                transition: {
                  duration: 1.35,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 1.1, delay: 0.25 },
                },
              }
            : {
                rotateY: 0,
                x: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: [0.25, 1, 0.5, 1] },
              }
        }
        style={{ transformOrigin: "left center" }}
        className="absolute top-0 bottom-0 left-0 w-1/2 z-20 shadow-2xl flex flex-col justify-between border-r border-[#D9D3C7]/90 dark:border-[#38332E] overflow-hidden"
      >
        {/* Door Surface Material: Fluted Architectural Paneling */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDE8DD] via-[#F8F5EE] to-[#E7E1D4] dark:from-[#171513] dark:via-[#211E1A] dark:to-[#191614]" />

        {/* Fluted Vertical Grooves */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_100%]" />

        {/* Inset Architectural Moldings */}
        <div className="absolute inset-6 sm:inset-10 border border-[#D9D3C7]/80 dark:border-[#3A342E]/70 rounded-xl pointer-events-none" />
        <div className="absolute inset-8 sm:inset-12 border border-[#EAE6DF]/90 dark:border-[#2C2723]/80 rounded-lg pointer-events-none" />

        {/* Top Atelier Inscription */}
        <div className="relative p-8 sm:p-12 z-10 flex items-center gap-3">
          <VestiarMonogram size={30} />
          <div>
            <span className="font-serif tracking-[0.25em] text-[11px] uppercase font-light text-stone-700 dark:text-stone-300 block">
              Vestiar
            </span>
            <span className="text-[9px] tracking-widest text-stone-400 dark:text-stone-500 uppercase font-mono">
              Atelier Privé &bull; Porte Gauche
            </span>
          </div>
        </div>

        {/* Left Polished Brass Pull Handle */}
        <div className="relative self-end mr-3 sm:mr-6 my-auto z-10 flex items-center">
          <div className="h-48 sm:h-64 w-3.5 sm:w-4 rounded-full bg-gradient-to-r from-[#C29B38] via-[#E6C875] to-[#997724] shadow-xl border border-[#FFE7A3]/50 flex items-center justify-center">
            <div className="h-40 sm:h-52 w-1 rounded-full bg-white/45" />
          </div>
        </div>

        {/* Bottom Editorial Number */}
        <div className="relative p-8 sm:p-12 z-10">
          <span className="font-mono text-[10px] tracking-widest text-stone-400 dark:text-stone-500 uppercase">
            N° 2026 // COLLECTION ARCHIVE
          </span>
        </div>
      </motion.div>

      {/* RIGHT WARDROBE DOOR */}
      <motion.div
        initial={false}
        animate={
          isOpen
            ? {
                rotateY: 105,
                x: "12%",
                opacity: 0,
                transition: {
                  duration: 1.35,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 1.1, delay: 0.25 },
                },
              }
            : {
                rotateY: 0,
                x: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: [0.25, 1, 0.5, 1] },
              }
        }
        style={{ transformOrigin: "right center" }}
        className="absolute top-0 bottom-0 right-0 w-1/2 z-20 shadow-2xl flex flex-col justify-between border-l border-[#D9D3C7]/90 dark:border-[#38332E] overflow-hidden"
      >
        {/* Door Surface Material */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#EDE8DD] via-[#F8F5EE] to-[#E7E1D4] dark:from-[#171513] dark:via-[#211E1A] dark:to-[#191614]" />

        {/* Fluted Vertical Grooves */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_100%]" />

        {/* Inset Architectural Moldings */}
        <div className="absolute inset-6 sm:inset-10 border border-[#D9D3C7]/80 dark:border-[#3A342E]/70 rounded-xl pointer-events-none" />
        <div className="absolute inset-8 sm:inset-12 border border-[#EAE6DF]/90 dark:border-[#2C2723]/80 rounded-lg pointer-events-none" />

        {/* Top Subtitle */}
        <div className="relative p-8 sm:p-12 z-10 self-end text-right">
          <span className="font-serif tracking-[0.25em] text-[11px] uppercase font-light text-stone-700 dark:text-stone-300 block">
            Haute Garde-Robe
          </span>
          <span className="text-[9px] tracking-widest text-stone-400 dark:text-stone-500 uppercase font-mono">
            Salon Digital &bull; Porte Droite
          </span>
        </div>

        {/* Right Polished Brass Pull Handle */}
        <div className="relative self-start ml-3 sm:ml-6 my-auto z-10 flex items-center">
          <div className="h-48 sm:h-64 w-3.5 sm:w-4 rounded-full bg-gradient-to-r from-[#997724] via-[#E6C875] to-[#C29B38] shadow-xl border border-[#FFE7A3]/50 flex items-center justify-center">
            <div className="h-40 sm:h-52 w-1 rounded-full bg-white/45" />
          </div>
        </div>

        {/* Bottom Editorial Archive */}
        <div className="relative p-8 sm:p-12 z-10 self-end text-right">
          <span className="font-mono text-[10px] tracking-widest text-stone-400 dark:text-stone-500 uppercase">
            PARIS &bull; MILAN &bull; TOKYO
          </span>
        </div>
      </motion.div>

      {/* CENTRAL BRAND EMBLEM & SLASH SEQUENCE (Autonomous - No Popups, No Buttons) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              transition: { duration: 0.6, ease: "easeOut" },
            }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-4 text-center"
          >
            {/* Ambient Backlight Halo around Name */}
            <div className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-radial from-[#E0623A]/25 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />

            {/* Floating Roman Monogram Crest */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 sm:mb-6"
            >
              <VestiarMonogram size={56} variant="crest" />
            </motion.div>

            {/* Monumental Website Name Container with Razor Slash */}
            <div className="relative inline-block my-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light tracking-[0.28em] text-[#1C1917] dark:text-[#F5F2EC] uppercase drop-shadow-md select-none">
                VESTIAR
              </h1>

              {/* CINEMATIC SLASH EFFECT: Slices through the word VESTIAR at 1.0s */}
              <AnimatePresence>
                {slashTriggered && (
                  <>
                    {/* 1. Diagonal Razor Laser Slash Line */}
                    <motion.div
                      initial={{
                        width: 0,
                        opacity: 0,
                        rotate: -28,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{
                        width: ["0%", "145%", "145%"],
                        opacity: [0, 1, 0.9, 0],
                        scaleY: [1, 2.5, 0.5],
                      }}
                      transition={{
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.25, 1],
                      }}
                      className="absolute top-1/2 left-1/2 h-[3px] rounded-full pointer-events-none z-20"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #FFFFFF 20%, #FFE6A3 45%, #E0623A 75%, transparent 100%)",
                        boxShadow:
                          "0 0 20px 4px rgba(224, 98, 58, 0.95), 0 0 45px 8px rgba(255, 230, 163, 0.8)",
                      }}
                    />

                    {/* 2. Slash Radiance Flare Flash */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{
                        opacity: [0, 0.85, 0],
                        scale: [0.3, 1.8, 2.4],
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none z-10"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255, 240, 200, 0.9) 0%, rgba(224, 98, 58, 0.5) 40%, transparent 70%)",
                        mixBlendMode: "screen",
                      }}
                    />

                    {/* 3. Slash Spark Particles */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-12 pointer-events-none z-25 flex items-center justify-around"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#FFE6A3] animate-ping" />
                      <span className="h-2 w-2 rounded-full bg-[#FFE6A3] shadow-[0_0_12px_#E0623A] animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#FFE6A3] animate-ping" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Evocative Couture Line for the Entrance (No messages or instructions) */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 flex flex-col items-center"
            >
              <p className="font-serif italic text-base sm:text-xl text-[#E0623A] dark:text-[#E8913C] tracking-wide font-light">
                &ldquo;L&apos;art de la silhouette commence dans le silence.&rdquo;
              </p>
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] font-mono uppercase text-stone-500 dark:text-stone-400 mt-2 block">
                Haute Garde-Robe &bull; Atelier Privé
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WardrobeEntrance;
