"use client";

import { motion } from "framer-motion";

/**
 * Lusion-style word reveal: each word wipes open from a clipped line while
 * sliding up slightly, staggered left to right when scrolled into view.
 * Uses clip-path (self-clipping) instead of overflow masks + transforms,
 * which renders reliably across browsers without layer-promotion quirks.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.75,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ clipPath: "inset(0% 0% 102% 0%)", y: 10 }}
          whileInView={{ clipPath: "inset(0% 0% -6% 0%)", y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </span>
  );
}
