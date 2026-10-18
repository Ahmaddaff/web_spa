"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type LockedSectionProps = {
  id: string;
  index: string;
};

/* Uneven bar widths so the redaction reads as blacked-out copy rather than as
   a loading skeleton. */
const TITLE_BARS = ["w-32 sm:w-40", "w-16 sm:w-24", "w-10 sm:w-14"];
const LINE_BARS = ["w-full", "w-11/12", "w-2/3"];

/**
 * Placeholder shown instead of a gated section until the minigame is won.
 * It deliberately leaks nothing — no title, no eyebrow, no description. The
 * real copy lives in the section component and only mounts after unlock.
 */
export function LockedSection({ id, index }: LockedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // giant background number drifts upward as the section scrolls past
  const numY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  const goPlay = () => {
    document.getElementById("minigame")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={id} className="relative scroll-mt-24 py-24">
      <div className="container">
        <div ref={ref} className="relative mx-auto max-w-2xl text-center">
          {/* parallax index number — matches the other sections, reveals nothing */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          >
            <motion.span
              style={{ y: numY }}
              className="block font-display text-[8rem] font-extrabold leading-none tracking-tighter text-white/[0.025] sm:text-[11rem]"
            >
              {index}
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/50" />
            <span className="text-cyan-400/90">{index}</span>
            <span className="text-slate-600">//</span>
            <span className="font-mono text-violet-300/90">.classified()</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/50" />
          </motion.div>

          {/* redacted heading: the real title only exists after the gate opens */}
          <div
            aria-hidden="true"
            className="relative mt-5 flex items-center justify-center gap-3"
          >
            {TITLE_BARS.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className={`h-6 origin-center rounded-md bg-gradient-to-r from-white/[0.09] via-white/[0.15] to-white/[0.09] sm:h-7 ${w}`}
              />
            ))}
          </div>
          <p className="sr-only">
            Isi bagian ini dirahasiakan sampai minigame AHDAVERSE RUNNER
            diselesaikan.
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto mt-6 h-1 w-24 origin-center rounded-full bg-gradient-to-r from-cyan-400/40 to-violet-500/40"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <Lock className="h-6 w-6 text-cyan-300" />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-600">
            // sealed
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-slate-200">
            Informasinya masih dirahasiakan
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            Selesaikan{" "}
            <span className="text-cyan-300">AHDAVERSE RUNNER</span> di section
            Play untuk membuka isi bagian ini.
          </p>

          {/* redacted preview of the copy that is waiting behind the gate */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 max-w-sm space-y-2.5"
          >
            {LINE_BARS.map((w, i) => (
              <span
                key={w}
                className={`block h-2 rounded-full bg-white/[0.06] ${w} ${
                  i === 2 ? "mx-auto" : ""
                }`}
              />
            ))}
          </div>

          <Button onClick={goPlay} className="mt-7" data-cursor="GO">
            <Play className="h-4 w-4" />
            Main Sekarang
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
