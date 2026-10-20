"use client";

import { motion } from "framer-motion";

import { useXp } from "@/components/providers/xp-provider";

/**
 * Navbar XP / Level read-out. Renders nothing but a level chip plus a neon
 * progress bar that fills as the visitor interacts with the page.
 */
export function XpIndicator() {
  const { level, title, xpInLevel, xpForNext, progress, xp } = useXp();
  const percent = Math.round(progress * 100);

  return (
    <div
      className="hidden items-center gap-2 sm:flex"
      title={`Level ${level} — ${title} · ${xpInLevel}/${xpForNext} XP`}
    >
      <div className="flex h-9 items-center gap-2 rounded-lg border border-arcade-purple/40 bg-arcade-card/70 px-2.5 shadow-[0_0_18px_-10px_rgba(168,85,247,0.95)]">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-arcade-purple">
          LV
        </span>
        <span className="font-display text-sm font-extrabold leading-none text-slate-100">
          {level}
        </span>
        <div
          className="h-1.5 w-14 overflow-hidden rounded-full bg-arcade-line lg:w-20"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP progress to level ${level + 1}`}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-arcade-cyan via-arcade-purple to-arcade-magenta shadow-[0_0_8px_rgba(0,229,255,0.95)]"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>
        <span className="hidden font-mono text-[9px] tabular-nums text-slate-500 lg:inline">
          {xpInLevel}/{xpForNext}
        </span>
      </div>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 xl:inline">
        {xp} XP
      </span>
    </div>
  );
}
