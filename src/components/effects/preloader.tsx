"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";

const BRAND_MARK = "/images/ahdaverse-mark.png";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/**
 * AHDAVERSE intro — intentionally calm.
 * The brand mark eases in (soft scale + fade), the wordmark follows, a thin
 * gradient progress line fills, then the whole curtain fades to reveal page 1.
 * No spin, no full-screen zoom, no fly-to-corner — just a quiet, clean reveal.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  // lock page scroll while the curtain is up
  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
  }, [done]);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    (async () => {
      // let the entrance + progress line play (~1.1s)
      await new Promise((r) => setTimeout(r, 1100));
      // gentle fade of the whole curtain
      await animate(scope.current, { opacity: 0 }, { duration: 0.5, ease: "easeOut" });
      if (!cancelled) setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [animate, reduced, scope]);

  if (done) return null;

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 bg-[#0a0a0a]"
    >
      {/* soft halo behind the mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),rgba(139,92,246,0.12),transparent_72%)] blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-16 w-16"
      >
        <Image
          src={BRAND_MARK}
          alt="AHDAVERSE"
          fill
          priority
          sizes="64px"
          className="object-contain"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="font-display text-lg font-extrabold tracking-[0.45em] text-gradient sm:text-xl"
      >
        AHDAVERSE
      </motion.span>

      {/* thin progress line */}
      <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.25, ease: "easeInOut" }}
          className="h-full origin-left bg-gradient-to-r from-cyan-400 to-violet-500"
        />
      </div>
    </div>
  );
}
