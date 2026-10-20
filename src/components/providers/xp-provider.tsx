"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUp, Sparkles, Trophy } from "lucide-react";

import { useUnlock } from "@/components/providers/unlock-provider";
import { useSfx } from "@/components/providers/sfx-provider";
import {
  ACHIEVEMENT_BY_ID,
  TRACKED_SECTIONS,
  XP,
  levelInfo,
  levelTitle,
} from "@/lib/gamification";

export interface XpToast {
  key: number;
  title: string;
  detail: string;
  tone: "xp" | "achievement" | "level";
}

interface XpContextValue {
  xp: number;
  level: number;
  title: string;
  xpInLevel: number;
  xpForNext: number;
  progress: number;
  /** ids of unlocked achievements, in unlock order */
  unlocked: string[];
  /** section ids the visitor has actually looked at */
  seen: string[];
  counters: Record<string, number>;
  addXp: (amount: number, label: string) => void;
  award: (id: string) => void;
  bump: (key: string, by?: number) => void;
}

const XpContext = React.createContext<XpContextValue | null>(null);

export function useXp(): XpContextValue {
  const ctx = React.useContext(XpContext);
  if (!ctx) throw new Error("useXp must be used inside <XpProvider>");
  return ctx;
}

/** XP granted for looking at a section for the first time. */
const SECTION_XP = 25;
const MAX_TOASTS = 3;

export function XpProvider({ children }: { children: React.ReactNode }) {
  const { unlocked } = useUnlock();
  const sfx = useSfx();

  const [xp, setXp] = React.useState(0);
  const [unlockedIds, setUnlockedIds] = React.useState<string[]>([]);
  const [seen, setSeen] = React.useState<string[]>([]);
  const [counters, setCounters] = React.useState<Record<string, number>>({});
  const [toasts, setToasts] = React.useState<XpToast[]>([]);
  const toastKey = React.useRef(0);
  const timers = React.useRef<number[]>([]);
  /** mirror of unlockedIds so award() stays pure (no setState inside updaters) */
  const unlockedRef = React.useRef<string[]>([]);

  const pushToast = React.useCallback(
    (toast: Omit<XpToast, "key">) => {
      const key = ++toastKey.current;
      setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), { ...toast, key }]);
      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== key));
      }, 3600);
      timers.current.push(timer);
    },
    []
  );

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const info = levelInfo(xp);

  const addXp = React.useCallback(
    (amount: number, label: string) => {
      if (amount <= 0) return;
      setXp((prev) => prev + amount);
      pushToast({
        title: `+${amount} XP`,
        detail: label,
        tone: "xp",
      });
    },
    [pushToast]
  );

  const award = React.useCallback(
    (id: string) => {
      const def = ACHIEVEMENT_BY_ID[id];
      if (!def) return;
      if (unlockedRef.current.includes(id)) return;
      unlockedRef.current = [...unlockedRef.current, id];
      setUnlockedIds(unlockedRef.current);
      setXp((current) => current + def.xp);
      pushToast({
        title: def.title,
        detail: `Achievement unlocked · +${def.xp} XP`,
        tone: "achievement",
      });
      sfx.play("achievement");
    },
    [pushToast, sfx]
  );

  const bump = React.useCallback((key: string, by = 1) => {
    setCounters((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + by }));
  }, []);

  /* ---------------------------------------------------------------- boot --- */
  React.useEffect(() => {
    award("system-boot");
    sfx.play("boot");
  }, [award, sfx]);

  /* ------------------------------------------------------- level change --- */
  const previousLevel = React.useRef(info.level);
  React.useEffect(() => {
    if (info.level > previousLevel.current) {
      previousLevel.current = info.level;
      pushToast({
        title: `LEVEL ${info.level}`,
        detail: levelTitle(info.level),
        tone: "level",
      });
      sfx.play("levelup");
    }
  }, [info.level, pushToast, sfx]);

  /* ------------------------------------------------- section exploration --- */
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = TRACKED_SECTIONS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setSeen((prev) => {
            if (prev.includes(id)) return prev;
            addXp(SECTION_XP, `Menjelajahi ${id}`);
            return [...prev, id];
          });
        });
      },
      { threshold: 0.25 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [addXp, unlocked]);

  /* ---------------------------------------------------- interaction taps --- */
  React.useEffect(() => {
    let lastAt = 0;
    const onClick = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const marked = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!marked) return;
      const now = performance.now();
      // the same element should not farm XP on every tap
      if (now - lastAt < 600) return;
      lastAt = now;

      const label = marked.dataset.cursor ?? "";
      bump("click");
      addXp(XP.click, label ? `Interaksi · ${label}` : "Interaksi");

      if (label === "GET") bump("cv");
      if (label === "OPEN") bump("external");
    };
    document.addEventListener("pointerdown", onClick, true);
    return () => document.removeEventListener("pointerdown", onClick, true);
  }, [addXp, bump]);

  /* ------------------------------------------- achievement rule engine --- */
  React.useEffect(() => {
    if ((counters.cv ?? 0) >= 1) award("recruiter-ready");
    if ((counters.external ?? 0) >= 1) award("networker");
    if ((counters.command ?? 0) >= 5) award("shell-wizard");
  }, [counters, award]);

  React.useEffect(() => {
    if (seen.length >= 3) award("universe-explorer");
    if (seen.length >= TRACKED_SECTIONS.length) award("deep-diver");
  }, [seen, award]);

  React.useEffect(() => {
    if (info.level >= 5) award("level-five");
    if (info.level >= 10) award("level-ten");
  }, [info.level, award]);

  React.useEffect(() => {
    if (unlocked) award("gate-breaker");
  }, [unlocked, award]);

  const value = React.useMemo<XpContextValue>(
    () => ({
      xp,
      level: info.level,
      title: levelTitle(info.level),
      xpInLevel: info.xpInLevel,
      xpForNext: info.xpForNext,
      progress: info.progress,
      unlocked: unlockedIds,
      seen,
      counters,
      addXp,
      award,
      bump,
    }),
    [xp, info.level, info.progress, info.xpForNext, info.xpInLevel, unlockedIds, seen, counters, addXp, award, bump]
  );

  return (
    <XpContext.Provider value={value}>
      {children}
      <XpToastLayer toasts={toasts} />
    </XpContext.Provider>
  );
}

/* ------------------------------------------------------------------ UI --- */

function XpToastLayer({ toasts }: { toasts: XpToast[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-4 z-[60] flex w-[min(19rem,calc(100vw-2rem))] flex-col-reverse gap-2 sm:left-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon =
            toast.tone === "achievement"
              ? Trophy
              : toast.tone === "level"
                ? ChevronsUp
                : Sparkles;
          const ring =
            toast.tone === "achievement"
              ? "border-[#FFD700]/60 shadow-[0_0_24px_-6px_rgba(255,215,0,0.85)]"
              : toast.tone === "level"
                ? "border-arcade-magenta/60 shadow-[0_0_24px_-6px_rgba(255,0,127,0.85)]"
                : "border-arcade-cyan/50 shadow-[0_0_22px_-8px_rgba(0,229,255,0.9)]";
          const iconColor =
            toast.tone === "achievement"
              ? "text-[#FFD700]"
              : toast.tone === "level"
                ? "text-arcade-magenta"
                : "text-arcade-cyan";
          return (
            <motion.div
              key={toast.key}
              layout
              initial={{ opacity: 0, x: -24, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={`flex items-center gap-3 rounded-xl border bg-arcade-card/95 px-3.5 py-2.5 backdrop-blur-md ${ring}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-bold tracking-wide text-slate-100">
                  {toast.title}
                </p>
                <p className="truncate text-[11px] text-slate-400">{toast.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
