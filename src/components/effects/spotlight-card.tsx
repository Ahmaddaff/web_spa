"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Aceternity-style spotlight card: a radial glow follows the cursor
 * while hovering, with a subtle border highlight.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-arcade-cyan/25 bg-arcade-card p-6 shadow-[0_0_24px_-10px_rgba(0,229,255,0.75)] transition-all duration-300 hover:border-arcade-cyan/60 hover:shadow-[0_0_0_1px_rgba(0,229,255,0.45),0_0_34px_-6px_rgba(0,229,255,0.95)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(0,229,255,0.12), transparent 65%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
