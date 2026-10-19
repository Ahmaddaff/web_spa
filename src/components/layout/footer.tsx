"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

import { navLinks, profile, socials } from "@/data/site-data";
import { useUnlock } from "@/components/providers/unlock-provider";

const LOCKED_HREFS = ["#about", "#skills", "#experience", "#projects"];

export function Footer() {
  const { unlocked } = useUnlock();
  // pages still sealed behind the game are not listed at all
  const links = unlocked
    ? navLinks
    : navLinks.filter((link) => !LOCKED_HREFS.includes(link.href));

  return (
    <footer className="relative border-t border-arcade-line bg-arcade-bg">
      {/* giant outline name — Lusion-style oversized typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden border-b border-arcade-line/70"
      >
        <p className="whitespace-nowrap py-6 text-center font-display text-[clamp(3.5rem,15vw,11rem)] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(168,85,247,0.32)] drop-shadow-[0_0_28px_rgba(168,85,247,0.35)]">
          AHDAVERSE
        </p>
      </div>

      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="#home" className="flex items-center gap-3">
              <Image
                src="/images/ahdaverse-logo.png"
                alt="AHDAVERSE"
                width={140}
                height={32}
                className="h-8 w-auto opacity-95 transition hover:opacity-100"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {profile.title} — {profile.location}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="dot-unlocked h-1.5 w-1.5 rounded-full" />
              sys.status: online
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">Navigasi</h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor="GO"
                    className="neon-link inline-flex items-center gap-1.5 text-slate-400 hover:text-arcade-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">Terhubung</h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  data-cursor="OPEN"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-arcade-line bg-arcade-card text-slate-400 transition hover:-translate-y-0.5 hover:border-arcade-purple/60 hover:text-arcade-cyan hover:shadow-neon-purple"
                >
                  <social.icon className="h-[18px] w-[18px]" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-arcade-line/70 pt-6 sm:flex-row sm:gap-6">
          <p className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {profile.name}. All rights
            reserved.
          </p>
          <a
            href="#home"
            data-cursor="TOP"
            className="neon-link inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-arcade-cyan"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
