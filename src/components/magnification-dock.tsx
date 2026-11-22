"use client";

/**
 * MagnificationDock Component
 *
 * A premium macOS-inspired dock component with fluid magnification effects,
 * spring physics, and tooltips. Built with Framer Motion.
 */

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  badge?: React.ReactNode;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  tooltipPosition?: "top" | "bottom";
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  tooltipPosition?: "top" | "bottom";
  badge?: React.ReactNode;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  tooltipPosition = "bottom",
  badge,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-card border-border border shadow-md hover:border-[#E0623A]/50 transition-colors cursor-pointer ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(
              child as React.ReactElement<{
                isHovered?: MotionValue<number>;
                tooltipPosition?: "top" | "bottom";
              }>,
              { isHovered, tooltipPosition }
            )
          : child
      )}

      {badge && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0623A] px-1 text-[9px] font-bold text-white shadow-xs">
          {badge}
        </span>
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  tooltipPosition?: "top" | "bottom";
};

function DockLabel({
  children,
  className = "",
  isHovered,
  tooltipPosition = "bottom",
}: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  const isTop = tooltipPosition === "top";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? 4 : -4 }}
          animate={{ opacity: 1, y: isTop ? -8 : 8 }}
          exit={{ opacity: 0, y: isTop ? 4 : -4 }}
          transition={{ duration: 0.18 }}
          className={`${className} pointer-events-none absolute ${
            isTop ? "-top-8" : "top-full"
          } left-1/2 z-50 w-fit whitespace-pre rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-luxury`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div
      className={`flex items-center justify-center text-foreground ${className}`}
    >
      {children}
    </div>
  );
}

export function MagnificationDock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 54,
  distance = 130,
  panelHeight = 48,
  dockHeight = 64,
  baseItemSize = 38,
  tooltipPosition = "bottom",
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + 8),
    [dockHeight, magnification]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="flex max-w-full items-center justify-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-center w-fit gap-2.5 rounded-3xl border-border border bg-card/60 backdrop-blur-md px-3 py-1.5 shadow-sm`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            tooltipPosition={tooltipPosition}
            badge={item.badge}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel tooltipPosition={tooltipPosition}>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MagnificationDock;
