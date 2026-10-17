"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { navLinks } from "@/data/site-data";

type Phase = "idle" | "covering" | "revealing";

const COVER_MS = 620;
const HOLD_MS = 260;
const REVEAL_MS = 720;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style route transition: every in-page anchor click plays a
 * circular wipe from the click point, jumps to the target section while
 * covered, then contracts from the center to reveal the new section.
 * Reduced-motion users get an instant jump instead.
 */
export function RouteTransition() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState("#home");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);

  const jumpTo = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", hash);
    }
  }, []);

  const start = useCallback((hash: string, x: number, y: number) => {
    if (busy.current) return;
    busy.current = true;
    setTarget(hash);
    setOrigin({ x, y });
    setPhase("covering");
    document.body.style.overflow = "hidden";
  }, []);

  // restore scroll on unmount (HMR safety)
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    []
  );

  // global interception of in-page anchor clicks
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const el = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (!(el instanceof HTMLAnchorElement)) return;
      const hash = el.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;
      if (!document.querySelector(hash)) return; // unknown target: leave alone
      event.preventDefault();

      if (prefersReduced()) {
        jumpTo(hash);
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;
      start(hash, x, y);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [jumpTo, start]);

  // phase progression: cover -> jump -> hold -> reveal -> idle
  useEffect(() => {
    if (phase === "covering") {
      timer.current = setTimeout(() => {
        jumpTo(target);
        timer.current = setTimeout(() => setPhase("revealing"), HOLD_MS);
      }, COVER_MS);
    } else if (phase === "revealing") {
      timer.current = setTimeout(() => {
        setPhase("idle");
        busy.current = false;
        document.body.style.overflow = "";
      }, REVEAL_MS);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, target, jumpTo]);

  const label =
    navLinks.find((l) => l.href === target)?.label ??
    target.slice(1).toUpperCase();

  return (
    <AnimatePresence>
      {phase !== "idle" ? (
        <motion.div
          key="route-overlay"
          className="fixed inset-0 z-[97] flex items-center justify-center bg-[#070707]"
          initial={{ clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` }}
          animate={{
            clipPath:
              phase === "covering"
                ? `circle(150% at ${origin.x}px ${origin.y}px)`
                : "circle(0% at 50% 50%)",
          }}
          transition={{
            duration: phase === "covering" ? COVER_MS / 1000 : REVEAL_MS / 1000,
            ease:
              phase === "covering"
                ? [0.65, 0, 0.35, 1]
                : [0.76, 0, 0.24, 1],
          }}
        >
          {/* grid texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]"
          />

          {/* corner ticks */}
          <span className="absolute left-8 top-8 h-6 w-6 border-l border-t border-cyan-400/40" />
          <span className="absolute right-8 top-8 h-6 w-6 border-r border-t border-cyan-400/40" />
          <span className="absolute bottom-8 left-8 h-6 w-6 border-b border-l border-cyan-400/40" />
          <span className="absolute bottom-8 right-8 h-6 w-6 border-b border-r border-cyan-400/40" />

          {/* center content */}
          <div className="relative px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
              className="font-mono text-[11px] uppercase tracking-[0.45em] text-slate-500"
            >
              navigating
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-100 sm:text-6xl"
            >
              <span className="text-cyan-400">#</span>
              {label}
            </motion.p>

            {/* sweeping progress line */}
            <div className="mx-auto mt-7 h-[2px] w-44 overflow-hidden bg-white/10">
              <motion.div
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-slate-600"
            >
              ahmad dafanda abdullah
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
