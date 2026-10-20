"use client";

import { motion } from "framer-motion";
import {
  ChevronsUp,
  Compass,
  Crown,
  FileDown,
  KeyRound,
  Lock,
  Power,
  Radar,
  Share2,
  TerminalSquare,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { useXp } from "@/components/providers/xp-provider";
import { ACHIEVEMENTS } from "@/lib/gamification";

const ICONS: Record<string, LucideIcon> = {
  Power,
  FileDown,
  Share2,
  Compass,
  TerminalSquare,
  Radar,
  ChevronsUp,
  KeyRound,
  Crown,
};

const CYBER_GOLD = "#FFD700";

export function Achievements() {
  const { unlocked, xp, level, title } = useXp();
  const unlockedCount = unlocked.length;
  const total = ACHIEVEMENTS.length;
  const percent = Math.round((unlockedCount / total) * 100);

  return (
    <motion.section
      id="achievements"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 bg-background py-24"
    >
      <div className="container">
        <SectionHeading
          eyebrow=".trophies()"
          title="Achievement Vault"
          description="Setiap interaksi di website ini memberi XP. Buka bagian rahasia, jelajahi semua halaman, dan kumpulkan trophy-nya."
        />

        {/* progress header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-[#FFD700]/25 bg-arcade-card/70 px-6 py-5 text-center shadow-[0_0_28px_-14px_rgba(255,215,0,0.9)]"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.2em]">
            <span className="inline-flex items-center gap-2 text-[#FFD700]">
              <Trophy className="h-4 w-4" />
              {unlockedCount}/{total} unlocked
            </span>
            <span className="text-slate-400">
              Level {level} · {title}
            </span>
            <span className="text-arcade-cyan">{xp} XP total</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-arcade-line">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFE98A] to-[#FFD700] shadow-[0_0_14px_rgba(255,215,0,0.9)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* trophy grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isUnlocked = unlocked.includes(achievement.id);
            const Icon = ICONS[achievement.icon] ?? Trophy;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
                  isUnlocked
                    ? "border-[#FFD700]/50 bg-arcade-card shadow-[0_0_0_1px_rgba(255,215,0,0.25),0_0_26px_-8px_rgba(255,215,0,0.8)] hover:border-[#FFD700] hover:shadow-[0_0_0_1px_rgba(255,215,0,0.45),0_0_34px_-6px_rgba(255,215,0,1)]"
                    : "border-arcade-line bg-arcade-card/40 hover:border-arcade-purple/50"
                }`}
              >
                {/* tier corner tick */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full ${
                    achievement.tier === "gold"
                      ? "bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.95)]"
                      : achievement.tier === "silver"
                        ? "bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.9)]"
                        : "bg-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.9)]"
                  }`}
                />

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isUnlocked
                        ? "border-[#FFD700]/60 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_18px_-6px_rgba(255,215,0,0.95)]"
                        : "border-arcade-line bg-arcade-bg/60 text-slate-600"
                    }`}
                  >
                    {isUnlocked ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-display text-base font-bold ${
                          isUnlocked ? "text-slate-50" : "text-slate-500"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      {isUnlocked ? (
                        <span className="rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#FFD700]">
                          unlocked
                        </span>
                      ) : (
                        <span className="rounded-full border border-arcade-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
                          locked
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        isUnlocked ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {achievement.description}
                    </p>
                    <p
                      className={`mt-3 font-mono text-[11px] uppercase tracking-[0.18em] ${
                        isUnlocked ? "text-[#FFD700]/90" : "text-slate-600"
                      }`}
                    >
                      +{achievement.xp} XP · {achievement.tier}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
