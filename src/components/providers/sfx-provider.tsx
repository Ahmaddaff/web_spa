"use client";

import * as React from "react";

import { useUnlock } from "@/components/providers/unlock-provider";

export type SfxName =
  | "click"
  | "hover"
  | "type"
  | "coin"
  | "unlock"
  | "achievement"
  | "levelup"
  | "boot"
  | "error";

interface SfxContextValue {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggle: () => void;
  play: (name: SfxName) => void;
}

const SfxContext = React.createContext<SfxContextValue | null>(null);

export function useSfx(): SfxContextValue {
  const ctx = React.useContext(SfxContext);
  if (!ctx) throw new Error("useSfx must be used inside <SfxProvider>");
  return ctx;
}

const STORAGE_KEY = "ahdaverse-sfx-enabled";

/** One oscillator voice: a short frequency glide with a percussive envelope. */
interface Tone {
  type: OscillatorType;
  from: number;
  to?: number;
  /** seconds */
  dur: number;
  gain?: number;
  /** seconds, offset inside the cue */
  delay?: number;
}

/** Retro 8-bit cue sheet — everything is built from square/triangle voices. */
const CUES: Record<SfxName, Tone[]> = {
  click: [{ type: "square", from: 520, to: 780, dur: 0.055, gain: 0.05 }],
  hover: [{ type: "triangle", from: 880, to: 660, dur: 0.04, gain: 0.018 }],
  type: [{ type: "square", from: 1180, dur: 0.02, gain: 0.022 }],
  coin: [
    { type: "square", from: 988, dur: 0.05, gain: 0.05 },
    { type: "square", from: 1319, dur: 0.14, gain: 0.05, delay: 0.05 },
  ],
  unlock: [
    { type: "triangle", from: 523.25, dur: 0.09, gain: 0.06 },
    { type: "triangle", from: 659.25, dur: 0.09, gain: 0.06, delay: 0.08 },
    { type: "triangle", from: 783.99, dur: 0.09, gain: 0.06, delay: 0.16 },
    { type: "triangle", from: 1046.5, dur: 0.22, gain: 0.06, delay: 0.24 },
  ],
  achievement: [
    { type: "square", from: 659.25, dur: 0.08, gain: 0.05 },
    { type: "square", from: 830.61, dur: 0.08, gain: 0.05, delay: 0.07 },
    { type: "square", from: 987.77, dur: 0.08, gain: 0.05, delay: 0.14 },
    { type: "square", from: 1318.51, dur: 0.26, gain: 0.05, delay: 0.21 },
    { type: "triangle", from: 2637.02, dur: 0.18, gain: 0.02, delay: 0.21 },
  ],
  levelup: [
    { type: "square", from: 392, dur: 0.09, gain: 0.05 },
    { type: "square", from: 523.25, dur: 0.09, gain: 0.05, delay: 0.08 },
    { type: "square", from: 659.25, dur: 0.09, gain: 0.05, delay: 0.16 },
    { type: "square", from: 783.99, dur: 0.09, gain: 0.05, delay: 0.24 },
    { type: "square", from: 1046.5, dur: 0.3, gain: 0.055, delay: 0.32 },
    { type: "triangle", from: 130.81, to: 98, dur: 0.4, gain: 0.05, delay: 0 },
  ],
  boot: [
    { type: "sine", from: 220, to: 880, dur: 0.34, gain: 0.045 },
    { type: "square", from: 1046.5, dur: 0.1, gain: 0.04, delay: 0.34 },
  ],
  error: [{ type: "sawtooth", from: 220, to: 80, dur: 0.2, gain: 0.05 }],
};

function readStoredPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return true;
    return stored === "1";
  } catch {
    return true;
  }
}

/**
 * Chiptune SFX engine (WebAudio, no assets) + the navbar toggle.
 *
 * The engine attaches one capture-phase pointer listener so every button and
 * link in the site gets its click blip without any existing component having
 * to know about audio. It sits inside <UnlockProvider> so it can also cheer
 * the moment the gate opens.
 */
export function SfxProvider({ children }: { children: React.ReactNode }) {
  const { unlocked } = useUnlock();
  const [enabled, setEnabledState] = React.useState(true);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterRef = React.useRef<GainNode | null>(null);
  const enabledRef = React.useRef(true);
  const wasUnlocked = React.useRef(false);

  React.useEffect(() => {
    const stored = readStoredPreference();
    setEnabledState(stored);
    enabledRef.current = stored;
  }, []);

  const setEnabled = React.useCallback((value: boolean) => {
    setEnabledState(value);
    enabledRef.current = value;
    try {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      /* private mode */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setEnabled(!enabledRef.current);
  }, [setEnabled]);

  const ensureContext = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    if (!ctxRef.current) {
      try {
        const ctx = new Ctor();
        const master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
        ctxRef.current = ctx;
        masterRef.current = master;
      } catch {
        return null;
      }
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }, []);

  const play = React.useCallback(
    (name: SfxName) => {
      if (!enabledRef.current) return;
      const cue = CUES[name];
      if (!cue) return;
      const ctx = ensureContext();
      const master = masterRef.current;
      if (!ctx || !master) return;

      const now = ctx.currentTime;
      cue.forEach((tone) => {
        const start = now + (tone.delay ?? 0);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.from, start);
        if (tone.to !== undefined) {
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(1, tone.to),
            start + tone.dur
          );
        }
        const peak = tone.gain ?? 0.05;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.dur);
        osc.connect(gain);
        gain.connect(master);
        osc.start(start);
        osc.stop(start + tone.dur + 0.02);
      });
    },
    [ensureContext]
  );

  // one capture listener gives every control its blip — no component changes
  React.useEffect(() => {
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest?.(
        "button, a, [role='button'], [data-cursor]"
      ) as HTMLElement | null;
      if (!el) return;
      // the toggle itself (and anything asking to stay silent) must not click
      if (el.closest("[data-sfx-mute]")) return;
      play("click");
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [play]);

  // the gate opening is the loudest moment of the site
  React.useEffect(() => {
    if (unlocked && !wasUnlocked.current) {
      wasUnlocked.current = true;
      play("unlock");
    }
    if (!unlocked) wasUnlocked.current = false;
  }, [unlocked, play]);

  const value = React.useMemo<SfxContextValue>(
    () => ({ enabled, setEnabled, toggle, play }),
    [enabled, setEnabled, toggle, play]
  );

  return <SfxContext.Provider value={value}>{children}</SfxContext.Provider>;
}
