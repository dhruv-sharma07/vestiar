"use client";

import React, { useRef, useState, useCallback } from "react";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareColor?: string;
}

export function Card3D({
  children,
  className = "",
  intensity = 12,
  glareColor = "rgba(232, 145, 60, 0.22)", // Subtle amber specular reflection
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles based on cursor distance from center (-1 to 1)
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rX = -percentY * intensity;
      const rY = percentX * intensity;

      setRotateX(rX);
      setRotateY(rY);

      // Percentage for radial glare
      setGlarePos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
      });
    },
    [intensity]
  );

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative preserve-3d will-change-transform ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="w-full h-full rounded-2xl md:rounded-3xl transition-transform duration-200 ease-out preserve-3d relative overflow-hidden"
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateZ(10px)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)",
        }}
      >
        {/* Specular 3D Light Sheen */}
        {isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-inherit transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 70%)`,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}
