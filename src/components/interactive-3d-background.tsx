"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

/**
 * Interactive3DBackground:
 * A bespoke, high-performance 3D ambient background that hovers and tilts dynamically
 * as the user moves their mouse.
 * 
 * Features:
 * - 3D Perspective Canvas with depth-projected floating particle dust (gold, terracotta, champagne)
 * - Spring-damped mouse tracking (inertial lerp factor)
 * - 3D tilting luxury atmospheric orbs that physically counter-drift along the Z-axis
 * - High-contrast palette for both Light Theme (warm alabaster, fine linen) and Dark Theme (obsidian, rich amber)
 * - Interactive cursor light sheen
 */
export function Interactive3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mouse coordinates normalized to [-1, 1]
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, rawX: 0, rawY: 0 });
  const [orbTransform, setOrbTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    cursorX: "50%",
    cursorY: "50%",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      const normY = (e.clientY / innerHeight) * 2 - 1; // -1 to 1
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Palette for 3D particles based on Pale Sage Ivory & Muted Forest Sage
    const particleColors = ["#789575", "#5C7659", "#A6B8A3", "#435841", "#CAD2B4"];

    // Initialize 3D particle dust
    const PARTICLE_COUNT = 65;
    const particles: Particle3D[] = [];
    const FOV = 400; // Field of view for 3D perspective

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * width * 1.5;
      const y = (Math.random() - 0.5) * height * 1.5;
      const z = Math.random() * 800 - 200; // -200 to 600 depth
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth inertial damping (lerp) toward target mouse position
      const mouse = mouseRef.current;
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.055;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.055;

      // Update state for CSS 3D orbs transform (throttled smoothly)
      setOrbTransform({
        rotateX: mouse.currentY * -12, // Tilt up/down
        rotateY: mouse.currentX * 14,  // Tilt left/right
        translateX: mouse.currentX * 35,
        translateY: mouse.currentY * 35,
        cursorX: `${mouse.rawX || width / 2}px`,
        cursorY: `${mouse.rawY || height / 2}px`,
      });

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Render 3D Perspective Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle subtle continuous vertical drift
        p.baseY -= p.speed * 20 * delta;
        if (p.baseY < -height * 0.75) p.baseY = height * 0.75;

        // Dynamic 3D Hover Offset: Mouse tilts and rotates particle space
        const rotY = mouse.currentX * 0.25;
        const rotX = mouse.currentY * 0.25;

        // Rotate particle in 3D around center
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        // Apply mouse-driven rotation & translation
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Interactive mouse hover displacement (particles hover away slightly)
        const distToMouseX = x1 - mouse.currentX * 200;
        const distToMouseY = y2 - mouse.currentY * 200;
        const dist = Math.sqrt(distToMouseX * distToMouseX + distToMouseY * distToMouseY);
        const repulsion = Math.max(0, 1 - dist / 350) * 25;

        const finalX = x1 + (distToMouseX / (dist || 1)) * repulsion;
        const finalY = y2 + (distToMouseY / (dist || 1)) * repulsion;
        const finalZ = z2 + 300; // Keep in front of camera

        // Perspective 3D Projection formula
        if (finalZ > 10) {
          const scale = FOV / (FOV + finalZ);
          const screenX = centerX + finalX * scale;
          const screenY = centerY + finalY * scale;
          const projectedSize = Math.max(0.6, p.size * scale * 1.5);
          const alpha = Math.min(1, Math.max(0.05, p.opacity * scale * (isDark ? 1.2 : 0.85)));

          // Draw soft glowing particle
          ctx.beginPath();
          ctx.arc(screenX, screenY, projectedSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          // Connect nearby particles with delicate hairline luxury threads
          for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const p2 = particles[j];
            const dx = p.baseX - p2.baseX;
            const dy = p.baseY - p2.baseY;
            const linkDist = Math.sqrt(dx * dx + dy * dy);
            if (linkDist < 110) {
              const linkScale = FOV / (FOV + p2.baseZ + 300);
              const p2ScreenX = centerX + p2.baseX * linkScale;
              const p2ScreenY = centerY + p2.baseY * linkScale;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(p2ScreenX, p2ScreenY);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - linkDist / 110) * (isDark ? 0.08 : 0.05);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme]);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transition-colors duration-700"
      style={{
        backgroundColor: isDark ? "#0A0C0E" : "#FBF9F5",
        perspective: "1200px",
      }}
    >
      {/* 3D Tilting Spatial Canvas for Orbs & Ambient Depth */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${orbTransform.translateX}px, ${orbTransform.translateY}px, 0px) rotateX(${orbTransform.rotateX}deg) rotateY(${orbTransform.rotateY}deg)`,
        }}
      >
        {/* Orb 1: Primary Muted Forest Sage 3D Mesh Orb */}
        <div
          className="absolute -top-[12%] -left-[10%] h-[65vw] w-[65vw] max-w-[850px] max-h-[850px] rounded-full blur-[110px] transition-all duration-700"
          style={{
            transform: "translateZ(60px)",
            opacity: 0.35,
            background: "radial-gradient(circle, #789575 0%, rgba(120, 149, 117, 0.4) 40%, transparent 75%)",
          }}
        />

        {/* Orb 2: Secondary Pale Sage Ivory Warm Light Orb */}
        <div
          className="absolute top-[35%] -right-[12%] h-[70vw] w-[70vw] max-w-[950px] max-h-[950px] rounded-full blur-[120px] transition-all duration-700"
          style={{
            transform: "translateZ(-40px)",
            opacity: 0.4,
            background: "radial-gradient(circle, #CCD8B8 0%, rgba(229, 232, 206, 0.5) 45%, transparent 75%)",
          }}
        />

        {/* Orb 3: Subtle Center Floating Sage Anchor Orb */}
        <div
          className="absolute top-[68%] left-[20%] h-[50vw] w-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[100px] transition-all duration-700"
          style={{
            transform: "translateZ(20px)",
            opacity: 0.25,
            background: "radial-gradient(circle, #789575 0%, rgba(120, 149, 117, 0.25) 50%, transparent 80%)",
          }}
        />

        {/* Architectural 3D Hairline Grid */}
        <div
          className="absolute inset-[-10%] transition-opacity duration-500"
          style={{
            transform: "translateZ(-80px)",
            opacity: 0.04,
            backgroundImage: "linear-gradient(to right, #202D1F 1px, transparent 1px), linear-gradient(to bottom, #202D1F 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* HTML5 Canvas with 3D Perspective Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* Interactive Cursor Dynamic Spotlight Sheen */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${orbTransform.cursorX} ${orbTransform.cursorY}, rgba(120, 149, 117, 0.12), transparent 75%)`,
        }}
      />

      {/* Edge Vignette Shading */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(206, 212, 180, 0.5) 100%)",
        }}
      />
    </div>
  );
}

export default Interactive3DBackground;
