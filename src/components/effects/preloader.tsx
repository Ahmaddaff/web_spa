"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { profile } from "@/data/site-data";

const letters = profile.name.toUpperCase().split("");

/**
 * Lusion-style preloader: percentage counter, letter-by-letter name reveal,
 * then the whole panel wipes upward to unveil the site. Locks page scroll
 * while visible.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // lock scroll while the curtain is up; restore once the wipe completes
    if (done) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [done]);

  useEffect(() => {
    const start = performance.now();
    const duration = 1900;
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneTimer = setTimeout(() => setDone(true), 280);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* corner mono labels */}
          <span className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
            portfolio&nbsp;//&nbsp;v3
          </span>
          <span className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
            loading
          </span>

          {/* letter-by-letter name reveal */}
          <div className="flex flex-wrap justify-center px-6" aria-label={profile.name}>
            {letters.map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <motion.span
                  className="inline-block font-display text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </span>
            ))}
          </div>

          {/* counter */}
          <motion.p
            className="mt-8 font-mono text-sm tabular-nums tracking-[0.3em] text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {String(progress).padStart(3, "0")}
            <span className="text-slate-600">%</span>
          </motion.p>

          {/* progress line */}
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              style={{ scaleX: progress / 100 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
