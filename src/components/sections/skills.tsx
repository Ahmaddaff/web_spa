"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  LayoutTemplate,
  Server,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { SectionHeading } from "@/components/section-heading";
import { skillCategories } from "@/data/site-data";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  server: Server,
  cpu: Cpu,
  wrench: Wrench,
  users: Users,
  sparkles: Sparkles,
};

export function Skills() {
  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 bg-background py-24"
    >
      <div className="container">
        <SectionHeading
          eyebrow=".skills()"
          title="Tools I Work With"
          description="Kombinasi kemampuan teknis dan soft skills yang saya asah melalui perkuliahan, proyek, dan pengalaman organisasi."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => {
            const Icon = iconMap[category.icon] ?? Wrench;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="h-full"
              >
                <SpotlightCard className="flex h-full flex-col">
                  {/* HUD corner accents */}
                  <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-violet-400/0 transition-colors duration-300 group-hover:border-violet-400/60" />
                  <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-violet-400/0 transition-colors duration-300 group-hover:border-violet-400/60" />
                  <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-violet-400/0 transition-colors duration-300 group-hover:border-violet-400/60" />
                  <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-violet-400/0 transition-colors duration-300 group-hover:border-violet-400/60" />

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-slate-100">
                        {category.title}
                      </h3>
                      <p className="font-mono text-xs text-slate-500">
                        {category.skills.length} skills
                      </p>
                    </div>
                    <span className="ml-auto font-mono text-[11px] text-slate-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="hover:border-cyan-400/40 hover:text-cyan-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
