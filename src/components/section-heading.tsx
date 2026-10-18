"use client";

import { motion } from "framer-motion";

import { TextReveal } from "@/components/effects/text-reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500"
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/50" />
        <span className="font-mono text-violet-300/90">{eyebrow}</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/50" />
      </motion.div>

      <h2 className="relative mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="text-gradient">
          <TextReveal text={title} />
        </span>
      </h2>

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative mt-4 text-sm leading-relaxed text-slate-400 sm:text-base"
        >
          {description}
        </motion.p>
      ) : null}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative mx-auto mt-6 h-1 w-24 origin-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
      />
    </div>
  );
}
