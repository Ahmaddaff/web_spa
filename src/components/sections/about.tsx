"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Languages as LanguagesIcon,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Counter } from "@/components/effects/counter";
import { PhotoAmbience, PhotoAmbienceSweep } from "@/components/effects/photo-ambience";
import { SectionHeading } from "@/components/section-heading";
import { education, languages, profile, stats } from "@/data/site-data";

const focusAreas = [
  "Web Development",
  "IoT & Embedded",
  "Leadership",
  "Public Relations",
];

export function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 py-24"
    >
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow=".about()"
          title="Student, Builder, and Leader"
          description="Mahasiswa Teknologi Informasi Universitas Amikom Purwokerto dengan minat besar pada web development, IoT, dan kepemimpinan organisasi."
        />

        <div className="mt-14 grid items-stretch gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: photo + quick facts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="relative mx-auto w-[340px] sm:w-[400px] lg:w-[440px]">
              {/* subtle aura behind the figure */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[45%] -z-10 h-[110%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.16),rgba(139,92,246,0.1),transparent_72%)] blur-3xl"
              />
              {/* ground shadow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-1/2 h-12 w-[60%] -translate-x-1/2 rounded-[50%] bg-violet-400/10 blur-2xl"
              />
              {/* ambience: light atmosphere around the figure */}
              <PhotoAmbience />
              <Image
                src={profile.photo}
                alt={`${profile.name} portrait`}
                width={1203}
                height={1602}
                className="relative z-10 h-auto w-full object-contain"
              />
              <PhotoAmbienceSweep />
            </div>

            <Card className="flex flex-1 flex-col border-white/10 bg-white/[0.03]">
              <CardContent className="flex flex-1 flex-col justify-center space-y-3 p-5 text-sm">
                <p className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="h-4 w-4 shrink-0 text-cyan-400" />
                  {profile.location}
                </p>
                <p className="flex items-center gap-2.5 text-slate-300">
                  <GraduationCap className="h-4 w-4 shrink-0 text-cyan-400" />
                  {profile.university} — {profile.major}
                </p>
                <p className="flex items-center gap-2.5 text-slate-300">
                  <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
                  Focus: Web Development, IoT, Leadership
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AHDAVERSE
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-400">
              <p className="text-justify">{profile.bio}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-violet-300/70">
                // motivation
              </div>
              <Quote className="h-5 w-5 text-violet-300" />
              <p className="mt-2 text-justify text-sm italic leading-relaxed text-slate-300">
                {profile.motivation}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-cyan-400/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                >
                  <p className="font-display text-3xl font-bold text-gradient text-glow">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* focus areas — fills the space below the stats */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-600">
                // focus areas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-200/90 transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Education + Languages */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-100">
                <GraduationCap className="h-5 w-5 text-cyan-300" />
                Education
              </h3>
              <div className="mt-5 space-y-5">
                {education.map((edu) => (
                  <div
                    key={edu.school}
                    className="relative border-l border-white/10 pl-5"
                  >
                    <span
                      className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                        edu.current
                          ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                          : "bg-slate-600"
                      }`}
                    />
                    <p className="font-medium text-slate-200">{edu.school}</p>
                    <p className="text-sm text-slate-400">{edu.degree}</p>
                    <p className="mt-0.5 text-xs text-cyan-300/80">
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-100">
                <LanguagesIcon className="h-5 w-5 text-violet-300" />
                Languages
              </h3>
              <div className="mt-5 space-y-5">
                {languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">
                        {lang.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {lang.level}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
