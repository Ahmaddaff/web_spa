"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [data-cursor]";

const isDisabled = (el: HTMLElement | null) =>
  el?.hasAttribute("disabled") ||
  el?.getAttribute("aria-disabled") === "true";

/**
 * Dual-layer cursor follower (desktop only): a spring-lagged ring plus an
 * instant dot, giving a precise HUD-pointer feel. The ring inflates to a
 * labeled disc over interactive elements (label read from `data-cursor`),
 * while the dot fades out. Disabled on touch devices.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springConfig = { stiffness: 350, damping: 30, mass: 0.3 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const scale = useSpring(1, { stiffness: 400, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
    ) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  // contextual hover: inflate ring over links/buttons, show data-cursor label
  useEffect(() => {
    if (!enabled) return;
    const onOver = (event: MouseEvent) => {
      const hit = (event.target as HTMLElement | null)?.closest?.(
        INTERACTIVE
      ) as HTMLElement | null;
      if (!hit || isDisabled(hit)) return;
      scale.set(2.6);
      setLabel(hit.getAttribute("data-cursor"));
    };
    const onOut = (event: MouseEvent) => {
      const hit = (event.target as HTMLElement | null)?.closest?.(
        INTERACTIVE
      ) as HTMLElement | null;
      if (!hit) return;
      const related = (event as MouseEvent).relatedTarget as HTMLElement | null;
      // ignore child-to-child moves inside the same interactive element
      if (related && related.closest?.(INTERACTIVE)) return;
      scale.set(1);
      setLabel(null);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [enabled, scale]);

  if (!enabled) return null;

  return (
    <>
      {/* inflating ring */}
      <motion.div
        style={{ x: springX, y: springY, scale }}
        className="pointer-events-none fixed left-0 top-0 z-[99]"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="h-7 w-7 rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]" />
        </div>
      </motion.div>

      {/* contextual label — constant size, centered in the inflated ring */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-[99]"
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              key="cursor-label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* instant dot — fades out while the ring is inflated */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[98]"
      >
        <motion.div
          animate={{ opacity: label ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          className="-translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
        </motion.div>
      </motion.div>
    </>
  );
}
