"use client";

import React from "react";

/**
 * Living Ambient Canvas:
 * Features rich, slow-drifting atmospheric amber (#E8913C) and teal (#2E6B72) orbs
 * against the deep obsidian canvas (#0A0C0E), giving immediate visible motion and depth.
 */
export function AmbientCanvas() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-[#0A0C0E]"
    >
      {/* Orb 1: Rich Amber / Cognac Glow (Top-Left drifting down-right) */}
      <div
        className="animate-ambient-1 absolute -top-[10%] -left-[10%] h-[60vw] w-[60vw] max-w-[850px] max-h-[850px] rounded-full opacity-25 blur-[100px] transition-opacity"
        style={{
          background:
            "radial-gradient(circle, #E8913C 0%, rgba(232, 145, 60, 0.4) 45%, transparent 75%)",
        }}
      />

      {/* Orb 2: Deep Cyan Teal Glow (Bottom-Right drifting up-left) */}
      <div
        className="animate-ambient-2 absolute top-[35%] -right-[10%] h-[65vw] w-[65vw] max-w-[900px] max-h-[900px] rounded-full opacity-25 blur-[110px] transition-opacity"
        style={{
          background:
            "radial-gradient(circle, #2E6B72 0%, rgba(46, 107, 114, 0.4) 45%, transparent 75%)",
        }}
      />

      {/* Orb 3: Subtle Center Atmospheric Accent */}
      <div
        className="animate-ambient-1 absolute top-[70%] left-[25%] h-[45vw] w-[45vw] max-w-[650px] max-h-[650px] rounded-full opacity-15 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #E8913C 0%, rgba(46, 107, 114, 0.3) 50%, transparent 80%)",
          animationDuration: "35s",
          animationDirection: "reverse",
        }}
      />

      {/* Architectural Fine Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #EDE7DC 1px, transparent 1px), linear-gradient(to bottom, #EDE7DC 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Vignette Edge Shading */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10, 12, 14, 0.8) 100%)",
        }}
      />
    </div>
  );
}
