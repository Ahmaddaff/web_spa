"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Cpu,
  Github,
  Globe,
  Mic,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { TiltCard } from "@/components/effects/tilt-card";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/site-data";

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  book: BookOpen,
  globe: Globe,
  shopping: ShoppingBag,
  sparkles: Sparkles,
  mic: Mic,
  cpu: Cpu,
  users: Users,
};

export function Projects() {
  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 bg-background py-24"
    >
      <div className="container">
        <SectionHeading
          eyebrow=".projects()"
          title="Selected Work & Publications"
          description="Proyek teknologi dan publikasi ilmiah yang saya bangun — dari perangkat IoT dan aplikasi web hingga jurnal yang sudah diterbitkan."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => {
            const Icon = iconMap[project.icon] ?? Sparkles;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                className="h-full"
              >
                <TiltCard>
                  <SpotlightCard className="flex h-full flex-col">
                    {project.featured ? (
                      <>
                        <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l border-t border-cyan-400/60" />
                        <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r border-t border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b border-l border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b border-r border-cyan-400/60" />
                      </>
                    ) : null}

                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      {project.featured ? (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-violet-300/80">
                      <span className="text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-cyan-400/60">/</span>
                      {project.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-slate-100">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-arcade-line/70 pt-4 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="VIEW"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                          <Globe className="h-4 w-4" />
                          {project.demoLabel ?? "Live Demo"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      {project.demo2 ? (
                        <a
                          href={project.demo2}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="VIEW"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                          <Globe className="h-4 w-4" />
                          {project.demo2Label ?? "Live Demo"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="CODE"
                          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <MagneticButton>
            <Button asChild variant="outline">
              <a
                href="https://github.com/Ahmaddaff"
                target="_blank"
                rel="noreferrer"
                data-cursor="CODE"
              >
                <Github className="h-4 w-4" />
                See more on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </MagneticButton>
        </div>
      </div>
    </motion.section>
  );
}
