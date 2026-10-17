"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Download, Lock, Menu, X } from "lucide-react";

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
  const active = useScrollSpy(spyIds);
  const { scrollYProgress } = useScroll();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showLockedToast = (label: string) => {
    setToast(`"${label}" terkunci — menangkan AHDAVERSE RUNNER untuk membukanya`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="#home" className="group flex items-center gap-3">
          <Image
            src="/images/ahdaverse-mark.png"
            alt="AHDAVERSE"
            width={49}
            height={36}
            data-nav-mark
            className="h-9 w-auto opacity-95 transition group-hover:opacity-100"
          />
          <span className="hidden font-display text-sm font-semibold tracking-wide text-slate-200 sm:block">
            {profile.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isLocked = !unlocked && LOCKED_HREFS.includes(link.href);
            if (isLocked) {
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => showLockedToast(link.label)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-400"
                  >
                    <Lock className="h-3 w-3" />
                    {link.label}
                  </button>
                </li>
              );
            }
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <LetterLink
                  href={link.href}
                  text={link.label}
                  data-cursor="GO"
                  className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/20"
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
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
      />

      {/* locked-section hint toast */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full z-10 mt-2 max-w-[90vw] -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/30 bg-[#0a0a0a]/95 px-4 py-2 font-mono text-[11px] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.15)] backdrop-blur"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const isLocked = !unlocked && LOCKED_HREFS.includes(link.href);
                if (isLocked) {
                  return (
                    <li key={link.href}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          showLockedToast(link.label);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-white/5 hover:text-slate-400"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        {link.label}
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
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
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2.5 text-sm font-medium text-cyan-200"
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
