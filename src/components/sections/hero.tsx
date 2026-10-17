"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { Typewriter } from "@/components/effects/typewriter";
import { TextReveal } from "@/components/effects/text-reveal";
import { TypedLine } from "@/components/effects/typed-line";
import { DestroyEgg } from "@/components/effects/destroy-egg";
import { LaptopHologram } from "@/components/effects/laptop-hologram";
import { PhotoAmbience, PhotoAmbienceSweep } from "@/components/effects/photo-ambience";
import { HeroScene } from "@/components/three/hero-scene";
import { profile, socials } from "@/data/site-data";

const floatingChips = [
  { label: "React", className: "left-1 top-10 lg:-left-12" },
  { label: "Next.js", className: "right-1 top-28 lg:-right-14" },
  { label: "IoT", className: "left-0 bottom-36 lg:-left-10" },
  { label: "TypeScript", className: "right-0 bottom-24 lg:-right-12" },
];

export function Hero() {
  // mouse parallax — the portrait drifts gently against the cursor
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 20, mass: 0.6 };
  const photoX = useSpring(parallaxX, springConfig);
  const photoY = useSpring(parallaxY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      parallaxX.set(-nx * 12);
      parallaxY.set(-ny * 12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallaxX, parallaxY]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28"
    >
      {/* soft glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute left-1/2 top-[-6rem] h-[380px] w-[880px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-[360px] w-[360px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <HeroScene />

      <div className="container relative z-10 grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* Left: copy */}
        <div>
          {/* terminal line + availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs backdrop-blur">
              <span className="text-emerald-400">$</span>
              <TypedLine
                segments={[
                  { text: " whoami", className: "text-slate-400" },
                  { text: " → ", className: "text-slate-600" },
                  { text: "ahmad-dafanda", className: "text-cyan-300" },
                ]}
              />
            </div>
            <Badge
              variant="outline"
              className="gap-2 border-cyan-400/30 bg-cyan-400/5 px-3 py-1.5 text-cyan-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              Open for collaboration
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="text-slate-100">Hi, I&apos;m </span>
            <span className="text-gradient text-glow">
              <TextReveal text="Dafanda" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-3 font-display text-xl font-semibold text-slate-300 sm:text-2xl"
          >
            {profile.name}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-4 flex h-9 items-center gap-2 text-lg font-medium text-cyan-300 sm:text-xl"
          >
            <span className="font-mono text-violet-400">&gt;</span>
            <Typewriter words={profile.roles} />
            <span className="inline-block h-6 w-[2px] animate-blink bg-cyan-300" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-6 max-w-xl text-justify text-[15px] leading-relaxed text-slate-400"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Button asChild size="lg">
                <a href="#projects" data-cursor="WORK">
                  View Work
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline">
                <a href={profile.resumeUrl} download data-cursor="GET">
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-500/70" />
              {profile.location}
            </span>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="MAIL"
              className="inline-flex items-center gap-1.5 transition hover:text-cyan-300"
            >
              <Mail className="h-4 w-4 text-cyan-500/70" />
              {profile.email}
            </a>
            <span className="font-mono text-xs text-slate-600">
              remotely available · UTC+7
            </span>
          </motion.div>

          <div className="mt-7 flex items-center gap-3">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                data-cursor="OPEN"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <social.icon className="h-[18px] w-[18px]" />
              </motion.a>
            ))}
          </div>

          {/* caferati-style mono links: github ribbon + easter egg */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-5 flex items-center gap-4 font-mono text-xs"
          >
            <a
              href="https://github.com/Ahmaddaff"
              target="_blank"
              rel="noreferrer"
              data-cursor="OPEN"
              className="text-slate-500 transition hover:text-cyan-300"
            >
              follow on github <span aria-hidden="true">&#8599;</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">
              /
            </span>
            <DestroyEgg />
          </motion.div>
        </div>

        {/* Right: profile cutout with aura glow + floating chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ x: photoX, y: photoY }}
          className="relative mx-auto w-full max-w-[460px] lg:max-w-[500px]"
        >
          {/* aura glow behind the figure */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[45%] -z-10 h-[115%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.22),rgba(139,92,246,0.14),transparent_72%)] blur-3xl"
          />
          {/* ground shadow for grounding */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 left-1/2 h-14 w-[65%] -translate-x-1/2 rounded-[50%] bg-cyan-400/10 blur-2xl"
          />

          {floatingChips.map((chip, i) => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 0.9 + i * 0.15, duration: 0.4 },
                scale: { delay: 0.9 + i * 0.15, duration: 0.4 },
                y: {
                  duration: 4 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1 + i * 0.3,
                },
              }}
              className={`absolute z-20 hidden rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[11px] text-slate-300 backdrop-blur sm:block ${chip.className}`}
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 align-middle" />
              {chip.label}
            </motion.span>
          ))}

          {/* slow breathing zoom on the figure */}
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* ambience: light atmosphere behind the figure */}
            <PhotoAmbience />

            <Image
              src={profile.photo}
              alt={`${profile.name} portrait`}
              width={1203}
              height={1602}
              priority
              className="relative z-10 h-auto w-full object-contain"
            />
            {/* ambience: soft light sweep in front of the figure */}
            <PhotoAmbienceSweep />
            {/* holographic UI emerging from the laptop screen */}
            <LaptopHologram />
          </motion.div>

          <motion.div
            animate={{ x: "-50%", y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -bottom-6 left-1/2 z-20 w-max rounded-2xl px-5 py-3 text-center shadow-xl shadow-black/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
              // currently
            </p>
            <p className="mt-0.5 text-sm font-semibold text-cyan-300">
              Ketua Umum Senat Mahasiswa 2026
            </p>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        animate={{ x: "-50%", y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 z-10 flex-col items-center gap-2 text-slate-500 transition hover:text-cyan-300 lg:flex"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
          scroll
        </span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-slate-600 p-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </span>
      </motion.a>
    </section>
  );
}
