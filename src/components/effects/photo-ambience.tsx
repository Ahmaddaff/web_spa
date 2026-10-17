"use client";

import { useEffect, useState } from "react";
import { motion, type TargetAndTransition, type Transition } from "framer-motion";

/**
 * PhotoAmbience — cinematic light atmosphere around the portrait cutout.
 *   <PhotoAmbience />        behind the figure: rotating halo, key light,
 *                            side beams, drifting particles, ground pulse
 *   <PhotoAmbienceSweep />   in front of the figure: soft light sweep
 * All decorative, pointer-events-none, prefers-reduced-motion guarded.
 * Place <Image className="relative z-10" /> between the two.
 */

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const s = i * 137.5;
  return {
    left: ((Math.sin(s) * 0.5 + 0.5) * 86 + 5).toFixed(1),
    top: ((Math.cos(s * 1.7) * 0.5 + 0.5) * 90 + 3).toFixed(1),
    size: (3 + (Math.sin(s * 0.7) + 1) * 2.4).toFixed(1),
    duration: 5 + (Math.cos(s * 1.3) + 1) * 2.5,
    delay: (i % 6) * 0.8,
    drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 7),
    tint: i % 3 === 0 ? "rgba(167,139,250,0.9)" : i % 3 === 1 ? "rgba(103,232,249,0.9)" : "rgba(255,255,255,0.85)",
  };
});

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function useAnim(keyframes: TargetAndTransition, transition: Transition) {
  const reduced = useReducedMotion();
  return reduced
    ? {}
    : { animate: keyframes, transition };
}

export function PhotoAmbience() {
  const halo = useAnim({ rotate: 360 }, { duration: 26, repeat: Infinity, ease: "linear" });
  const beamA = useAnim(
    { y: ["-26%", "26%"], opacity: [0, 0.55, 0] },
    { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
  );
  const beamB = useAnim(
    { y: ["26%", "-26%"], opacity: [0, 0.45, 0] },
    { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.2 }
  );
  const ground = useAnim(
    { scaleX: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] },
    { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
  );

  return (
    <div
      aria-hidden="true"
      data-photo-ambience=""
      className="pointer-events-none absolute inset-0 z-0 select-none"
    >
      {/* rotating conic halo behind the figure */}
      <motion.div
        initial={{ x: "-50%", y: "-50%" }}
        {...halo}
        className="absolute left-1/2 top-1/2 h-[130%] w-[132%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.5) 36deg, transparent 110deg, transparent 230deg, rgba(139,92,246,0.5) 292deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent 56%, #000 70%, #000 82%, transparent 93%)",
          maskImage:
            "radial-gradient(closest-side, transparent 56%, #000 70%, #000 82%, transparent 93%)",
        }}
      />

      {/* key light behind the head */}
      <div className="absolute left-1/2 top-[-4%] h-28 w-2/3 -translate-x-1/2 rounded-[50%] bg-cyan-300/25 blur-2xl" />

      {/* side beams sweeping upward */}
      <motion.div
        initial={{ rotate: -14 }}
        {...beamA}
        className="absolute -left-8 top-0 h-[125%] w-[13%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(34,211,238,0.35), transparent)",
          filter: "blur(6px)",
        }}
      />
      <motion.div
        initial={{ rotate: 16 }}
        {...beamB}
        className="absolute -right-6 top-0 h-[125%] w-[11%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(139,92,246,0.4), transparent)",
          filter: "blur(6px)",
        }}
      />

      {/* drifting light particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} />
      ))}

      {/* pulsing ground reflection */}
      <motion.div
        {...ground}
        className="absolute -bottom-2 left-1/2 h-12 w-[68%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,211,238,0.32), rgba(139,92,246,0.14), transparent 75%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}

function Particle({ p }: { p: (typeof PARTICLES)[number] }) {
  const a = useAnim(
    { y: [0, -16, 0], x: [0, p.drift, 0], opacity: [0.15, 0.9, 0.15] },
    { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }
  );
  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        background: p.tint,
        boxShadow: `0 0 ${(+p.size * 3).toFixed(0)}px ${p.tint}`,
      }}
      {...a}
    />
  );
}

export function PhotoAmbienceSweep() {
  const sweep = useAnim(
    { x: ["-130%", "240%"] },
    { duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 4, delay: 1.6 }
  );
  return (
    <motion.div
      aria-hidden="true"
      data-photo-ambience-sweep=""
      {...sweep}
      className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden"
    >
      <div
        className="absolute inset-y-0 -left-1/3 w-1/3 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent)",
          filter: "blur(10px)",
        }}
      />
    </motion.div>
  );
}
