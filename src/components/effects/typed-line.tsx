"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Segment = { text: string; className?: string };

/**
 * Caferati-style typed line: text is revealed character by character
 * (segments keep their own colors) with a blinking block cursor at the end.
 * Reduced-motion users see the full line instantly.
 */
export function TypedLine({
  segments,
  className = "",
  speed = 42,
  startDelay = 400,
}: {
  segments: Segment[];
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const full = segments.map((s) => s.text).join("");
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? full.length
      : 0
  );

  useEffect(() => {
    if (count >= full.length) return;
    const t = setTimeout(
      () => setCount((c) => c + 1),
      count === 0 ? startDelay : speed
    );
    return () => clearTimeout(t);
  }, [count, full.length, speed, startDelay]);

  const parts: ReactNode[] = [];
  let typed = 0;
  segments.forEach((seg, si) => {
    const take = Math.max(0, Math.min(seg.text.length, count - typed));
    if (take > 0) {
      parts.push(
        <span key={si} className={seg.className}>
          {seg.text.slice(0, take)}
        </span>
      );
    }
    typed += seg.text.length;
  });

  return (
    <span className={className}>
      {parts}
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[1.05em] w-[0.6em] translate-y-[0.18em] animate-blink bg-cyan-300 align-middle"
      />
    </span>
  );
}
