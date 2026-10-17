"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";

const BRAND_MARK = "/images/ahdaverse-mark.png";
const BASE = 64; // base size (px) of the flying logo — matches its on-screen box

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/**
 * AHDAVERSE intro: the brand mark + wordmark appear, the mark spins and
 * zooms in until it fills the screen, then zooms back out to the navbar logo
 * in the top-left corner — landing exactly on it — and the curtain fades to
 * reveal page 1 (Hero). On reduced-motion it just fades through quickly.
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
      const t = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    (async () => {
      // wait two frames so the navbar (landing target) is laid out
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );

      const logoEl = document.querySelector<HTMLElement>("[data-p-logo]");
      const markEl = document.querySelector<HTMLElement>("[data-nav-mark]");
      let target = { scale: 1, x: 0, y: 0 };
      if (logoEl && markEl) {
        const lr = logoEl.getBoundingClientRect();
        const mr = markEl.getBoundingClientRect();
        const lcx = (lr.left + lr.right) / 2;
        const lcy = (lr.top + lr.bottom) / 2;
        const mcx = (mr.left + mr.right) / 2;
        const mcy = (mr.top + mr.bottom) / 2;
        target = {
          scale: mr.width / lr.width,
          x: mcx - lcx,
          y: mcy - lcy,
        };
      }
      // scale that makes the brand disc cover the whole viewport
      const cover =
        (Math.max(window.innerWidth, window.innerHeight) / BASE) * 1.3;

      await animate(
        "[data-p-word]",
        { opacity: [0, 1], y: [16, 0] },
        { duration: 0.5, ease: "easeOut" }
      );
      await animate(
        "[data-p-logo]",
        { opacity: [0, 1], scale: [0.65, 1] },
        { duration: 0.55, ease: "easeOut" }
      );
      await new Promise((r) => setTimeout(r, 220));

      // zoom IN — spin + scale until it covers the screen
      await animate(
        "[data-p-logo]",
        { scale: cover, rotate: 360 },
        { duration: 0.95, ease: [0.66, 0, 0.34, 1] }
      );
      // wordmark fades as the mark takes over (runs in parallel)
      animate(
        "[data-p-word]",
        { opacity: 0, scale: 1.5 },
        { duration: 0.45, ease: "easeIn" }
      );

      // zoom OUT — shrink to the navbar mark size and fly into the corner
      await animate(
        "[data-p-logo]",
        { scale: target.scale, x: target.x, y: target.y, rotate: 720 },
        { duration: 0.9, ease: [0.7, 0, 0.18, 1] }
      );
      // drop the brand disc so only the mark remains (matches the navbar logo)
      await animate("[data-p-disc]", { opacity: 0 }, { duration: 0.45, ease: "easeOut" });

      // open page 1 — fade the curtain away
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
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 overflow-hidden bg-[#0a0a0a]"
    >
      <div
        data-p-logo
        className="relative h-16 w-16 opacity-0 will-change-transform"
        style={{ transformOrigin: "center" }}
      >
        <div
          data-p-disc
          className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 shadow-[0_0_70px_rgba(34,211,238,0.55)]"
        />
        <Image
          src={BRAND_MARK}
          alt="AHDAVERSE"
          fill
          priority
          sizes="64px"
          className="relative z-10 object-contain"
        />
      </div>

      <span
        data-p-word
        className="pointer-events-none select-none font-display text-2xl font-extrabold tracking-[0.4em] text-gradient opacity-0 sm:text-3xl"
      >
        AHDAVERSE
      </span>
    </div>
  );
}
