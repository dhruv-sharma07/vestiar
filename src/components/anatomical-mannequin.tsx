"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { CuratedItem, formatRupees } from "@/lib/curated-wardrobe";
import { Maximize2, Sparkles, Tag, ChevronRight } from "lucide-react";

interface AnatomicalMannequinProps {
  items: CuratedItem[];
  onInspect: (item: CuratedItem) => void;
  occasionTitle?: string;
  palette?: string[];
}

interface AnatomicalSlot {
  id: "head" | "outer" | "top" | "bottom" | "shoes";
  name: string;
  bodyPart: string;
  zDepth: number;
  item?: CuratedItem;
}

export function AnatomicalMannequin({
  items,
  onInspect,
  occasionTitle = "Curated Ensemble",
  palette = [],
}: AnatomicalMannequinProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  // Classify and sort items into anatomical body slots
  const slots: AnatomicalSlot[] = useMemo(() => {
    let headItem: CuratedItem | undefined;
    let outerItem: CuratedItem | undefined;
    let topItem: CuratedItem | undefined;
    let bottomItem: CuratedItem | undefined;
    let shoeItem: CuratedItem | undefined;

    // Categorize by subcategory keywords first, then category
    items.forEach((item) => {
      const name = (item.name + " " + (item.subCategory || "")).toLowerCase();
      const cat = (item.category || "").toLowerCase();

      if (
        name.includes("muffler") ||
        name.includes("scarf") ||
        name.includes("hat") ||
        name.includes("cap") ||
        name.includes("sunglass") ||
        name.includes("beanie") ||
        cat === "accessories"
      ) {
        if (!headItem) headItem = item;
      } else if (
        cat === "outerwear" ||
        name.includes("jacket") ||
        name.includes("coat") ||
        name.includes("overshirt") ||
        name.includes("blazer")
      ) {
        if (!outerItem) outerItem = item;
      } else if (
        cat === "tops" ||
        name.includes("tee") ||
        name.includes("t-shirt") ||
        name.includes("shirt") ||
        name.includes("knit") ||
        name.includes("sweater")
      ) {
        if (!topItem) topItem = item;
      } else if (
        cat === "bottoms" ||
        name.includes("trouser") ||
        name.includes("pant") ||
        name.includes("jean") ||
        name.includes("cargo") ||
        name.includes("short")
      ) {
        if (!bottomItem) bottomItem = item;
      } else if (
        cat === "footwear" ||
        name.includes("shoe") ||
        name.includes("sneaker") ||
        name.includes("boot") ||
        name.includes("loafer")
      ) {
        if (!shoeItem) shoeItem = item;
      } else {
        // Fallback placement
        if (!topItem && cat.includes("top")) topItem = item;
        else if (!bottomItem && cat.includes("bottom")) bottomItem = item;
        else if (!shoeItem && cat.includes("foot")) shoeItem = item;
      }
    });

    const list: AnatomicalSlot[] = [];

    // 1. Head & Neck
    if (headItem) {
      list.push({
        id: "head",
        name: "Head & Neck",
        bodyPart: "Muffler / Accessory",
        zDepth: 42,
        item: headItem,
      });
    }

    // 2. Outer Layer (if present)
    if (outerItem) {
      list.push({
        id: "outer",
        name: "Outer Layer",
        bodyPart: "Jacket / Overshirt",
        zDepth: 32,
        item: outerItem,
      });
    }

    // 3. Upper Body / Torso
    if (topItem) {
      list.push({
        id: "top",
        name: "Upper Body",
        bodyPart: "Top / Shirt",
        zDepth: 24,
        item: topItem,
      });
    }

    // 4. Lower Body / Waist & Legs
    if (bottomItem) {
      list.push({
        id: "bottom",
        name: "Lower Body",
        bodyPart: "Trousers / Denim",
        zDepth: 16,
        item: bottomItem,
      });
    }

    // 5. Ground / Feet
    if (shoeItem) {
      list.push({
        id: "shoes",
        name: "Ground Base",
        bodyPart: "Footwear",
        zDepth: 28,
        item: shoeItem,
      });
    }

    return list;
  }, [items]);

  // Handle pointer tilt physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6; // Max 6 deg

    setTilt({ x: rotateX, y: rotateY });
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSheen((prev) => ({ ...prev, opacity: 0 }));
    setHoveredSlot(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative my-8 overflow-hidden rounded-2xl border border-[rgba(237,231,220,0.13)] bg-[#0D0F12] p-4 sm:p-8 md:p-10 transition-transform duration-200 ease-out"
      style={{
        perspective: 1200,
      }}
    >
      {/* Dynamic Specular Sheen Glow Overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-10"
        style={{
          opacity: sheen.opacity,
          background: `radial-gradient(circle 380px at ${sheen.x}% ${sheen.y}%, rgba(232, 145, 60, 0.22), transparent 70%)`,
        }}
      />

      {/* 3D Tilted Mannequin Stage */}
      <div
        className="relative mx-auto max-w-2xl transition-transform duration-200 ease-out flex flex-col items-center"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background Stylized Mannequin Wireframe / Spine Guide */}
        <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none opacity-20 z-0">
          {/* Mannequin Head Silhouette */}
          <div className="w-16 h-20 rounded-full border border-[rgba(237,231,220,0.4)] mt-2" />
          {/* Shoulder & Spine Guideline */}
          <div className="w-48 border-t border-[rgba(237,231,220,0.3)] mt-2" />
          <div className="flex-1 w-[1px] border-l border-dashed border-[rgba(237,231,220,0.25)] my-2" />
          {/* Pedestal Ground Base */}
          <div className="w-32 h-6 rounded-full border border-[rgba(232,145,60,0.4)] bg-[rgba(232,145,60,0.05)] mb-2" />
        </div>

        {/* Header Label: Outfit Silhouette Indicator */}
        <div className="relative z-10 mb-6 flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#E8913C] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E8913C]">
              Head-to-Toe View
            </span>
            <span className="text-xs text-[#9EA5A8]">&bull;</span>
            <span className="text-xs text-[#9EA5A8] hidden sm:inline">
              Complete Outfit Breakdown
            </span>
          </div>
          <span className="text-[11px] text-[#9EA5A8] bg-[#101317] px-2.5 py-1 rounded-md border border-[rgba(237,231,220,0.13)]">
            Click any piece to inspect
          </span>
        </div>

        {/* Anatomical Garment Stack (Head -> Outer -> Top -> Bottom -> Shoes) */}
        <div className="relative z-20 flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg">
          {slots.map((slot, index) => {
            const item = slot.item!;
            const isHovered = hoveredSlot === slot.id;

            return (
              <div
                key={slot.id}
                onMouseEnter={() => setHoveredSlot(slot.id)}
                onMouseLeave={() => setHoveredSlot(null)}
                onClick={() => onInspect(item)}
                className="group relative flex w-full items-center justify-between gap-4 rounded-xl border border-[rgba(237,231,220,0.13)] bg-[#101317]/90 p-3 sm:p-4 backdrop-blur-md transition-all duration-300 hover:border-[#E8913C] hover:bg-[#15191F] hover:shadow-2xl cursor-pointer"
                style={{
                  transform: `translateZ(${isHovered ? slot.zDepth + 18 : slot.zDepth}px)`,
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background 0.2s",
                }}
              >
                {/* Left: Body Slot Pin & Indicator */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border border-[rgba(237,231,220,0.13)] bg-[#0A0C0E]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#E8913C] bg-[#E8913C]/10 border border-[#E8913C]/20">
                        {slot.name}
                      </span>
                      <span className="text-[11px] text-[#9EA5A8] hidden xs:inline">
                        {slot.bodyPart}
                      </span>
                    </div>

                    <h4 className="mt-1 font-serif text-sm sm:text-base font-normal text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors line-clamp-1">
                      {item.name}
                    </h4>

                    <div className="mt-0.5 flex items-center gap-3 text-xs text-[#9EA5A8]">
                      <span>{item.brand}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[#E8913C]">{formatRupees(item.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Inspection Action Prompt */}
                <div className="flex items-center gap-2 text-[#9EA5A8] group-hover:text-[#EDE7DC] transition-colors shrink-0">
                  <span className="text-[11px] font-mono uppercase tracking-wider hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity text-[#E8913C]">
                    Inspect
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(237,231,220,0.13)] bg-[#0A0C0E]/60 group-hover:border-[#E8913C] group-hover:bg-[#E8913C]/10">
                    <Maximize2 className="h-3.5 w-3.5 group-hover:text-[#E8913C] transition-colors" />
                  </div>
                </div>

                {/* Connecting Spine Dot */}
                <div
                  className={`absolute -left-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border border-[#0A0C0E] transition-all duration-300 ${
                    isHovered
                      ? "bg-[#E8913C] shadow-[0_0_10px_#E8913C]"
                      : "bg-[#9EA5A8]/50"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Silhouette Guide */}
        <div className="mt-8 flex items-center gap-2 text-[11px] font-mono text-[#9EA5A8]">
          <span className="h-[1px] w-12 bg-[rgba(237,231,220,0.15)]" />
          <span>MATCHED ENSEMBLE</span>
          <span className="h-[1px] w-12 bg-[rgba(237,231,220,0.15)]" />
        </div>
      </div>
    </div>
  );
}
