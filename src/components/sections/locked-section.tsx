"use client";

import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

type LockedSectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
};

/** Placeholder shown instead of a gated section until the minigame is won. */
export function LockedSection({
  id,
  index,
  eyebrow,
  title,
  description,
}: LockedSectionProps) {
  const goPlay = () => {
    document.getElementById("minigame")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={id} className="relative scroll-mt-24 py-24">
      <div className="container">
        <SectionHeading
          index={index}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

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
            // locked
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-slate-200">
            Bagian ini masih terkunci
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            Menangkan{" "}
            <span className="text-cyan-300">AHDAVERSE RUNNER</span> di section
            Play untuk membuka seluruh isi halaman ini.
          </p>
          <Button onClick={goPlay} className="mt-6" data-cursor="GO">
            <Play className="h-4 w-4" />
            Main Sekarang
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
