"use client";

import React from "react";

interface VestiarMonogramProps {
  className?: string;
  size?: number;
  variant?: "badge" | "minimal" | "crest";
}

/**
 * Bespoke luxury architectural monogram for VESTIAR.
 * Geometric Roman 'V' with interlocking hairline pillars,
 * beveled apex, and subtle champagne gold/terracotta accents.
 */
export function VestiarMonogram({
  className = "",
  size = 36,
  variant = "badge",
}: VestiarMonogramProps) {
  if (variant === "minimal") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-hidden="true"
      >
        <path
          d="M8 8L20 32L32 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 8L20 22L27 8"
          stroke="#E0623A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />
        <circle cx="20" cy="32" r="1.5" fill="#E0623A" />
      </svg>
    );
  }

  if (variant === "crest") {
    return (
      <div
        className={`relative flex items-center justify-center rounded-2xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-gradient-to-b from-white to-[#FBF9F5] dark:from-[#1C1A17] dark:to-[#141210] shadow-luxury p-3 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle outer diamond facet */}
          <rect
            x="24"
            y="2"
            width="28"
            height="28"
            rx="4"
            transform="rotate(45 24 2)"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          {/* Main Roman V silhouette */}
          <path
            d="M11 12L24 38L37 12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Interior tailored pillar */}
          <path
            d="M16 12L24 28L32 12"
            stroke="#E0623A"
            strokeWidth="1.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Atelier apex pin */}
          <circle cx="24" cy="38" r="2" fill="#E0623A" />
        </svg>
      </div>
    );
  }

  // Default "badge" variant
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-[#1C1917] text-[#FAF9F5] dark:bg-[#F5F2EC] dark:text-[#1C1917] shadow-xs overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%]"
      >
        {/* Roman V Primary Stroke */}
        <path
          d="M9 10L20 32L31 10"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Hairline Tailored Accent */}
        <path
          d="M14 10L20 22L26 10"
          stroke="#E0623A"
          strokeWidth="1.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Apex Accent Point */}
        <circle cx="20" cy="32" r="1.5" fill="#E0623A" />
      </svg>
    </div>
  );
}

export default VestiarMonogram;
