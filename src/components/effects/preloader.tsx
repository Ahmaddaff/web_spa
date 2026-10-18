"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const BRAND_MARK = "/images/ahdaverse-mark.png";
const BRAND = "AHDAVERSE";

type Phase = "enter" | "stay" | "exit";

/* timeline (ms) */
const ENTER_MS = 1000;
const EXIT_MS = 750;
/* the counter owns the stay length: the exit only starts once the counter has
   actually reached 100, so the number can never be cut off mid-way by a
   fixed timer that runs on a different clock than requestAnimationFrame. */
const COUNT_MS = 1350;
const HOLD_MS = 150;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/**
 * AHDAVERSE loading screen — three phases:
 *
 *  ENTER  · bottom neon line draws outward from the centre
 *         · logo grows from a small scale while its cyan-purple glow rises
 *         · brand name appears letter by letter with a soft light flash
 *  STAY   · logo "breathes" (slow pulse)
 *         · guard rings rotate endlessly around the logo
 *         · data particles drift out from the logo centre while the
 *           percentage counter runs 0 -> 100
 *  EXIT   · at 100% all particles + glow are sucked back into the centre
 *         · a brief light flash, then the logo bursts forward through the
 *           screen while fading to reveal page 1
 *
 * Reaching 100 on the counter is what triggers the exit (not a separate timer),
 * so the number is always shown in full.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<Phase>("enter");
  const reduced = usePrefersReducedMotion();
  const pctRef = useRef<HTMLSpanElement>(null);

  // lock page scroll while the curtain is up
  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
  }, [done]);

  // stable particle seeds (angle / distance / delay / size)
  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2 + (i % 3) * 0.13;
        const d = 62 + ((i * 37) % 92);
        return {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d,
          delay: (i % 7) * 0.05,
          size: 2.5 + ((i * 13) % 3) * 0.7,
        };
      }),
    []
  );

  // phase timeline — enter, then the counter takes over and hands off to exit
  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase("stay"), ENTER_MS);
    return () => clearTimeout(t1);
  }, [reduced]);

  // percentage counter 0 -> 100; reaching 100 is what starts the exit
  useEffect(() => {
    if (phase !== "stay") return;
    const start = performance.now();
    let raf = 0;
    let hold = 0;
    const finish = () => setPhase("exit");
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else hold = window.setTimeout(finish, HOLD_MS);
    };
    raf = requestAnimationFrame(tick);
    // safety net: if rAF is starved (e.g. background tab) never hang on the curtain
    const guard = window.setTimeout(finish, COUNT_MS + 1600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hold);
      clearTimeout(guard);
    };
  }, [phase]);

  // exit -> unmount
  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => setDone(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (done) return null;

  const staying = phase === "stay";
  const exiting = phase === "exit";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#08080c]">
      {/* ---- ENTER: bottom neon accent line, drawn from the centre outward ----
           NOTE: the line must be centred by a flex parent, never with a
           Tailwind `-translate-x-1/2` class — framer-motion writes its own
           inline `transform` for `scaleX`, which would wipe the translate. */}
      <div
        aria-hidden
        className="absolute bottom-[15%] left-0 flex w-full justify-center"
      >
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={exiting ? { scaleX: 1, opacity: 0 } : { scaleX: 1, opacity: 1 }}
          transition={{ duration: exiting ? 0.3 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-[2px] w-[min(72vw,560px)] origin-center rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.8)]"
        />
      </div>

      {/* ---- central stage ---- */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        {/* halo / glow — rises during enter, sucked in during exit */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.55 }}
          animate={exiting ? { opacity: 0, scale: 0.15 } : { opacity: 1, scale: 1 }}
          transition={{ duration: exiting ? 0.32 : 1.2, ease: "easeOut" }}
          className="absolute h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.55),rgba(139,92,246,0.38),transparent_72%)] blur-xl"
        />

        {/* ---- STAY: outer guard ring (rotates forever) ---- */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: staying ? 1 : 0 }}
          transition={{ duration: 0.45 }}
          className="absolute h-[152px] w-[152px]"
        >
          <motion.svg
            viewBox="0 0 152 152"
            className="h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="76"
              cy="76"
              r="68"
              fill="none"
              stroke="url(#ringA)"
              strokeWidth="1.6"
              strokeDasharray="132 64"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* ---- STAY: inner guard ring (rotates the other way) ---- */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: staying ? 1 : 0 }}
          transition={{ duration: 0.45 }}
          className="absolute h-[126px] w-[126px]"
        >
          <motion.svg
            viewBox="0 0 126 126"
            className="h-full w-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="63"
              cy="63"
              r="56"
              fill="none"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1.1"
              strokeDasharray="3 9"
            />
          </motion.svg>
        </motion.div>

        {/* ---- STAY: data particles drifting out of the logo centre ---- */}
        {particles.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full bg-cyan-300"
            style={{
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              boxShadow: "0 0 8px rgba(34,211,238,0.9)",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={
              exiting
                ? { x: 0, y: 0, opacity: 0, scale: 0 }
                : staying
                ? { x: p.x, y: p.y, opacity: 0.9, scale: 1 }
                : { x: 0, y: 0, opacity: 0, scale: 0 }
            }
            transition={
              exiting
                ? { duration: 0.3, ease: "easeIn" }
                : staying
                ? { duration: 1.25, delay: p.delay, ease: "easeOut" }
                : { duration: 0.2 }
            }
          />
        ))}

        {/* ---- logo: enter scale-up · stay breathing · exit burst ---- */}
        <motion.div
          initial={{ scale: 0.42, opacity: 0 }}
          animate={exiting ? { scale: 7.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{
            duration: exiting ? 0.62 : 1.05,
            ease: exiting ? [0.7, 0, 0.3, 1] : [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 h-16 w-16"
        >
          <motion.div
            className="relative h-full w-full"
            animate={staying ? { scale: [1, 1.07, 1] } : { scale: 1 }}
            transition={
              staying
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
          >
            <Image
              src={BRAND_MARK}
              alt="AHDAVERSE"
              fill
              priority
              sizes="64px"
              className="object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ---- ENTER: brand name, letter by letter with a soft light flash ---- */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.26 : 0.2 }}
        className="mt-10 flex items-center font-display text-lg font-extrabold text-slate-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.35)] sm:text-xl"
        style={{ letterSpacing: "0.4em", marginRight: "-0.4em" }}
      >
        {BRAND.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "brightness(2.6)" }}
            animate={{ opacity: 1, filter: "brightness(1)" }}
            transition={{ delay: 0.55 + i * 0.055, duration: 0.4, ease: "easeOut" }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>

      {/* ---- STAY: loading percentage 0 -> 100 ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={exiting ? { duration: 0.26 } : { delay: 0.85, duration: 0.4 }}
        className="mt-4 font-mono text-[11px] tracking-[0.35em] text-cyan-300/80"
      >
        <span ref={pctRef}>0</span>%
      </motion.div>

      {/* ---- EXIT: brief light flash ---- */}
      <motion.div
        aria-hidden
        animate={exiting ? { opacity: [0, 0.62, 0] } : { opacity: 0 }}
        transition={
          exiting
            ? { duration: 0.42, times: [0, 0.35, 1], ease: "easeOut" }
            : { duration: 0.2 }
        }
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),rgba(34,211,238,0.3),transparent_58%)]"
      />
    </div>
  );
}
