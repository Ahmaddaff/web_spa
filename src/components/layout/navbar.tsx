"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Download, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navLinks, profile } from "@/data/site-data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { LetterLink } from "@/components/effects/letter-link";
import { useUnlock } from "@/components/providers/unlock-provider";

const LOCKED_HREFS = ["#about", "#skills", "#experience", "#projects"];
const OPEN_IDS = ["home", "minigame", "contact"];
const ALL_IDS = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "minigame",
  "contact",
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { unlocked } = useUnlock();
  const spyIds = useMemo(
    () => (unlocked ? ALL_IDS : OPEN_IDS),
    [unlocked]
  );
  // the gated pages do not exist until the game is won, so they are not in
  // the navigation either — no dead links, no lock buttons
  const links = useMemo(
    () =>
      unlocked
        ? navLinks
        : navLinks.filter((link) => !LOCKED_HREFS.includes(link.href)),
    [unlocked]
  );
  const active = useScrollSpy(spyIds);
  const { scrollYProgress } = useScroll();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-arcade-line bg-arcade-bg/80 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.95)] backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="#home" className="group flex items-center gap-3">
          <Image
            src="/images/ahdaverse-logo.png"
            alt="AHDAVERSE"
            width={140}
            height={32}
            data-nav-mark
            className="h-8 w-auto opacity-95 transition group-hover:opacity-100"
          />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <LetterLink
                  href={link.href}
                  text={link.label}
                  data-cursor="GO"
                  className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-arcade-cyan text-glow"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-arcade-cyan to-transparent shadow-[0_0_8px_rgba(0,229,255,0.9)] transition-transform duration-300 group-hover:scale-x-100" />
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-arcade-cyan/10 ring-1 ring-inset ring-arcade-cyan/30 shadow-neon-cyan"
                    />
                  ) : null}
                </LetterLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={profile.resumeUrl} download data-cursor="GET">
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* scroll progress indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-arcade-cyan via-arcade-purple to-arcade-magenta shadow-[0_0_12px_rgba(168,85,247,0.85)]"
      />

      {/* mobile menu */}

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-arcade-line bg-arcade-bg/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {links.map((link) => {
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-arcade-purple/10 hover:text-arcade-cyan"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex items-center justify-center gap-2 rounded-xl border border-arcade-purple/40 bg-arcade-purple/10 px-3 py-2.5 text-sm font-medium text-violet-200 transition-shadow hover:shadow-neon-purple"
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
