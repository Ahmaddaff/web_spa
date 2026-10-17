"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type LetterLinkProps = {
  /** Text rendered as individually animated letters. */
  text: string;
  className?: string;
  /** Extra elements (underline, active pill, …) rendered after the letters. */
  children?: ReactNode;
  stagger?: number;
} & Omit<React.ComponentProps<typeof motion.a>, "children">;

/**
 * Lusion-style letter link: each letter lives in its own overflow-hidden
 * column. On hover the top letter slides up and out while a cyan "ghost"
 * letter slides in from below, one letter at a time (variant propagation
 * from the parent motion.a keeps the stagger perfectly in sync).
 */
export function LetterLink({
  text,
  className = "",
  children,
  stagger = 0.025,
  ...rest
}: LetterLinkProps) {
  const letters = text.split("");

  return (
    <motion.a
      initial="rest"
      whileHover="hover"
      className={className}
      {...rest}
    >
      {letters.map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="relative inline-block overflow-hidden align-bottom"
        >
          <motion.span
            variants={{
              rest: { y: "0%" },
              hover: { y: "-100%" },
            }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
              delay: i * stagger,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            aria-hidden="true"
            variants={{
              rest: { y: "100%" },
              hover: { y: "0%" },
            }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
              delay: i * stagger,
            }}
            className="absolute inset-0 inline-block text-cyan-300"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
      {children}
    </motion.a>
  );
}
