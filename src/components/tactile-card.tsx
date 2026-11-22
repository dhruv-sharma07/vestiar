"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface TactileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // max tilt in degrees (default 3.5deg)
  elevation?: number; // translateZ in px (default 8px)
  sheenOpacity?: number; // max opacity of dynamic light sheen (default 0.35)
  className?: string;
  disabled?: boolean;
}

/**
 * TactileCard brings physical 3D card physics to clothing and outfit cards.
 * Inspired by luxury industrial design and Apple Pro interfaces:
 * - perspective: 1000px & preserve-3d
 * - smooth spring-damped tilt (rotateX, rotateY) & subtle translateZ elevation
 * - dynamic light sheen catching cursor light
 * - auto-disabled on mobile / coarse pointers for native scroll ergonomics
 */
export function TactileCard({
  children,
  maxTilt = 10,
  elevation = 16,
  sheenOpacity = 0.45,
  className = "",
  disabled = false,
  style,
  ...props
}: TactileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Check mobile / touch screen to disable 3D tilt
  useEffect(() => {
    const checkMobile = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || isMobile || !cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2; // -1 to 1

      // Subtle spring tilt: rotateY follows normX, rotateX inverses normY
      const rotY = normX * maxTilt;
      const rotX = -normY * maxTilt;

      // Update light sheen coordinates in percentage
      const posX = (x / rect.width) * 100;
      const posY = (y / rect.height) * 100;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!card) return;
        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(
          2
        )}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${elevation}px)`;
        setSheenPos({ x: posX, y: posY });
      });
    },
    [disabled, isMobile, maxTilt, elevation]
  );

  const handlePointerEnter = useCallback(() => {
    if (disabled || isMobile) return;
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.transition =
        "transform 150ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease";
    }
  }, [disabled, isMobile]);

  const handlePointerLeave = useCallback(() => {
    if (disabled || isMobile) return;
    setIsHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (cardRef.current) {
      // Smooth spring back to resting state with zero snap
      cardRef.current.style.transition =
        "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 400ms ease";
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  }, [disabled, isMobile]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative preserve-3d will-change-transform ${className}`}
      style={{
        transformStyle: isMobile ? "flat" : "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {children}

      {/* Dynamic Light Sheen Radial Highlight Overlay */}
      {!isMobile && !disabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-30"
          style={{
            opacity: isHovered ? sheenOpacity : 0,
            background: `radial-gradient(circle 280px at ${sheenPos.x}% ${sheenPos.y}%, rgba(232, 145, 60, 0.35), transparent 75%)`,
          }}
        />
      )}
    </div>
  );
}
