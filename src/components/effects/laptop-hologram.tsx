"use client";

import { motion } from "framer-motion";
import { BarChart3, Braces, Cpu, Terminal } from "lucide-react";
import type { ReactNode } from "react";

type HoloElement = {
  id: string;
  className: string;
  content: ReactNode;
  rise: number;
  drift: number;
  delay: number;
  duration: number;
};

const elements: HoloElement[] = [
  {
    id: "terminal",
    className: "-left-1 -top-2",
    rise: 150,
    drift: -70,
    delay: 0,
    duration: 6,
    content: (
      <span className="flex items-center gap-1.5">
        <Terminal className="h-3 w-3 text-cyan-300" />
        <span className="text-emerald-300">npm run build</span>
        <span className="text-emerald-400">&#10003;</span>
      </span>
    ),
  },
  {
    id: "code",
    className: "left-9 -top-7",
    rise: 195,
    drift: 55,
    delay: 1.6,
    duration: 6.8,
    content: (
      <span className="flex items-center gap-1.5">
        <Braces className="h-3 w-3 text-violet-300" />
        <span className="text-slate-400">const</span>
        <span className="text-cyan-300">app</span>
        <span className="text-slate-400">=</span>
        <span className="text-violet-300">&quot;web&quot;</span>
      </span>
    ),
  },
  {
    id: "chart",
    className: "-left-7 top-4",
    rise: 120,
    drift: -115,
    delay: 3.1,
    duration: 6.2,
    content: (
      <span className="flex items-end gap-[3px]">
        <BarChart3 className="mr-1 h-3 w-3 text-cyan-300" />
        {[4, 8, 5, 10, 7].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm bg-gradient-to-t from-cyan-500/50 to-cyan-300"
            style={{ height: h }}
          />
        ))}
      </span>
    ),
  },
  {
    id: "cpu",
    className: "left-14 top-3",
    rise: 165,
    drift: 95,
    delay: 4.4,
    duration: 7,
    content: (
      <span className="flex items-center gap-1.5">
        <Cpu className="h-3 w-3 text-violet-300" />
        <span className="text-slate-300">iot.core</span>
      </span>
    ),
  },
];

const particles = [
  { x: -14, delay: 0.6, duration: 4.2 },
  { x: 10, delay: 1.9, duration: 4.8 },
  { x: -6, delay: 2.8, duration: 4.5 },
  { x: 18, delay: 3.6, duration: 5.1 },
];

/**
 * Holographic UI elements emerging from the laptop screen hinge,
 * floating upward around the photo. Purely decorative.
 */
export function LaptopHologram() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[68%] top-[63%] z-20 -translate-x-1/2"
    >
      {/* projection beam from the screen */}
      <motion.div
        animate={{ opacity: [0.12, 0.45, 0.12], scaleY: [0.85, 1.1, 0.85] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 h-52 w-8 -translate-x-1/2 origin-bottom rounded-full bg-gradient-to-t from-cyan-400/50 via-cyan-400/15 to-transparent blur-md"
      />

      {/* rising glow particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          animate={{
            opacity: [0, 0.9, 0],
            y: [0, -120 - i * 18],
            x: [0, p.x * 2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.9)]"
        />
      ))}

      {/* floating glass UI cards */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ opacity: 0, scale: 0.55, y: 14, x: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.55, 1, 1, 0.85],
            y: [14, -el.rise, -el.rise, -el.rise - 26],
            x: [0, el.drift, el.drift, el.drift],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeOut",
            times: [0, 0.22, 0.78, 1],
          }}
          className={`arcade-pop absolute whitespace-nowrap rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-cyan-200 backdrop-blur-sm ${el.className}`}
        >
          {el.content}
        </motion.div>
      ))}
    </div>
  );
}
