"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Minimize2, Terminal } from "lucide-react";

import { useXp } from "@/components/providers/xp-provider";
import { useSfx } from "@/components/providers/sfx-provider";
import { profile, skillCategories, socials } from "@/data/site-data";
import { ACHIEVEMENTS, XP } from "@/lib/gamification";

interface Line {
  id: number;
  kind: "cmd" | "out" | "err";
  text: string;
}

const HELP_LINES = [
  "available commands:",
  "  help      — daftar perintah",
  "  whoami    — identitas singkat",
  "  skills    — tech stack",
  "  xp        — status XP & level",
  "  trophies  — progres achievement",
  "  contact   — email & sosial",
  "  clear     — bersihkan layar",
  "  exit      — tutup terminal",
];

/**
 * Floating mini-terminal (bottom-right). Fully self-contained: it only reads
 * the XP context and the shared site data, never the other way around.
 */
export function MiniTerminal() {
  const { xp, level, title, unlocked, seen, addXp, bump } = useXp();
  const sfx = useSfx();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [lines, setLines] = React.useState<Line[]>([
    { id: 0, kind: "out", text: "AHDAVERSE shell v1.0 — ketik `help` untuk mulai." },
  ]);
  const lineId = React.useRef(1);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const push = React.useCallback((kind: Line["kind"], text: string) => {
    setLines((prev) => [...prev, { id: lineId.current++, kind, text }]);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
  }, [open]);

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    push("cmd", `$ ${raw.trim()}`);
    if (!command) return;

    switch (command) {
      case "help":
        HELP_LINES.forEach((text) => push("out", text));
        break;
      case "whoami":
        push("out", `${profile.name} (@ahmad-dafanda)`);
        push("out", `${profile.title} — ${profile.university}`);
        push("out", profile.roles.join(" | "));
        break;
      case "skills":
        skillCategories.forEach((category) => {
          push("out", `${category.title}: ${category.skills.join(", ")}`);
        });
        break;
      case "xp":
        push("out", `XP ${xp} · Level ${level} (${title})`);
        push("out", `Bagian yang dijelajahi: ${seen.length}`);
        break;
      case "trophies":
        push("out", `Achievements unlocked: ${unlocked.length}/${ACHIEVEMENTS.length}`);
        unlocked.forEach((id) => {
          const found = ACHIEVEMENTS.find((a) => a.id === id);
          if (found) push("out", `  [x] ${found.title}`);
        });
        break;
      case "contact":
        push("out", `email: ${profile.email}`);
        socials.forEach((social) => push("out", `${social.name}: ${social.href}`));
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      case "sudo":
        push("out", "nice try. permission granted anyway — you already own this page.");
        break;
      default:
        push("err", `command not found: ${command} — ketik 'help'`);
        sfx.play("error");
        return;
    }

    // every successful command feeds the XP engine (and the Shell Wizard trophy)
    bump("command");
    addXp(XP.command, "Terminal command");
    sfx.play("coin");
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    run(input);
    setInput("");
  };

  return (
    <>
      {/* collapsed launcher */}
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button
            key="launcher"
            type="button"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={() => setOpen(true)}
            aria-label="Buka mini-terminal"
            title="Mini-terminal"
            className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-arcade-cyan/40 bg-arcade-card/90 px-4 py-2.5 font-mono text-xs text-arcade-cyan shadow-[0_0_22px_-8px_rgba(0,229,255,0.95)] backdrop-blur-md transition hover:border-arcade-cyan hover:shadow-neon-cyan sm:right-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">~/ahdaverse</span>
            <span className="inline-block h-3.5 w-[2px] animate-blink bg-arcade-cyan align-middle" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* expanded console */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="console"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-24 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-arcade-cyan/40 bg-arcade-bg/95 shadow-[0_0_0_1px_rgba(0,229,255,0.2),0_24px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:right-6"
          >
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-arcade-line bg-arcade-card/80 px-3.5 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-arcade-cyan">
                <Terminal className="h-3.5 w-3.5" />
                ahdaverse — shell
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup terminal"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-arcade-line text-slate-400 transition hover:border-arcade-cyan/60 hover:text-arcade-cyan"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* output */}
            <div
              ref={scrollRef}
              className="h-56 overflow-y-auto px-3.5 py-3 font-mono text-[11.5px] leading-relaxed"
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={
                    line.kind === "cmd"
                      ? "text-arcade-purple"
                      : line.kind === "err"
                        ? "text-arcade-magenta"
                        : "whitespace-pre-wrap text-slate-300"
                  }
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* prompt */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-arcade-line bg-arcade-card/60 px-3.5 py-2.5"
            >
              <span className="font-mono text-xs text-emerald-400">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label="Perintah terminal"
                placeholder="ketik 'help'…"
                className="w-full bg-transparent font-mono text-xs text-slate-100 caret-arcade-cyan placeholder:text-slate-600 focus:outline-none"
              />
              <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg] text-slate-600" />
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
