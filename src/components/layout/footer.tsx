"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";

import { navLinks, profile, socials } from "@/data/site-data";
import { useUnlock } from "@/components/providers/unlock-provider";

const LOCKED_HREFS = ["#about", "#skills", "#experience", "#projects"];

export function Footer() {
  const { unlocked } = useUnlock();

  return (
    <footer className="relative border-t border-white/10 bg-[#070707]">
      {/* giant outline name — Lusion-style oversized typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden border-b border-white/5"
      >
        <p className="whitespace-nowrap py-6 text-center font-display text-[clamp(3.5rem,15vw,11rem)] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(148,163,184,0.18)]">
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              {profile.title} — {profile.location}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              sys.status: online
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">Navigasi</h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => {
                const isLocked = !unlocked && LOCKED_HREFS.includes(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="GO"
                      className={`inline-flex items-center gap-1.5 transition hover:text-cyan-300 ${
                        isLocked ? "text-slate-700" : "text-slate-500"
                      }`}
                    >
                      {isLocked ? <Lock className="h-3 w-3" /> : null}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  <social.icon className="h-[18px] w-[18px]" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/5 pt-6 sm:flex-row sm:gap-6">
          <p className="text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {profile.name}. All rights
            reserved.
          </p>
          <a
            href="#home"
            data-cursor="TOP"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-cyan-300"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
