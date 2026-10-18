"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { experiences } from "@/data/site-data";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 py-24"
    >
      <div className="container">
        <SectionHeading
          eyebrow=".experience()"
          title="Leadership & Organization Journey"
          description="Perjalanan organisasi, kepanitiaan, dan kepemimpinan yang membentuk cara saya bekerja, berkolaborasi, dan memberi dampak."
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-3xl">
          {/* beam track */}
          <div className="absolute bottom-2 left-[15px] top-2 w-[2px] bg-white/10" />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-2 left-[15px] top-2 w-[2px] origin-top bg-gradient-to-b from-cyan-400 via-sky-400 to-violet-500 shadow-[0_0_14px_rgba(34,211,238,0.65)]"
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={`${exp.org}-${exp.role}-${exp.period}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative pl-14"
              >
                {/* timeline dot */}
                <span className="absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0a0a0a] shadow-[0_0_18px_rgba(34,211,238,0.45)]">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/25" />
                  <Briefcase className="relative h-3.5 w-3.5 text-cyan-300" />
                </span>

                <Card className="border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-slate-100">
                      {exp.org}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="shrink-0 font-mono text-[11px]"
                    >
                      {exp.period}
                    </Badge>
                  </div>

                  <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm font-medium text-cyan-300/90">
                    <span className="font-mono text-xs text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-600">/</span>
                    {exp.role}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2.5 text-sm leading-relaxed text-slate-400"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
