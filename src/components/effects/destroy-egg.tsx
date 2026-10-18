"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "lol. just kidding — this page is indestructible.",
  "nice try. the portfolio has plot armor.",
  "error 404: destructibility not found.",
  "self-destruct sequence... cancelled by user.",
];

/**
 * Caferati-inspired easter egg: "destroy this webpage" triggers a brief
 * glitch storm (chromatic aberration + scanlines + invert flash) and a
 * playful mono message. Overlay-only — no container transforms, so fixed
 * UI (navbar, cursor, overlays) never breaks.
 */
export function DestroyEgg() {
  const [glitching, setGlitching] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    if (!glitching) return;
    const t = setTimeout(() => setGlitching(false), 1700);
    return () => clearTimeout(t);
  }, [glitching]);

  return (
    <>
      <button
        type="button"
        data-cursor="?"
        onClick={() => {
          setMessage(
            MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
          );
          setGlitching(true);
        }}
        className="font-mono text-xs text-slate-600 underline decoration-slate-700 decoration-dotted underline-offset-4 transition hover:text-cyan-300 hover:decoration-cyan-400/60"
      >
        destroy this webpage
      </button>

      {glitching ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[96] animate-glitch-jitter"
          >
            {/* chromatic aberration */}
            <div
              className="absolute inset-0 animate-glitch-chroma mix-blend-screen"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,0,60,0.14), transparent 28%, transparent 72%, rgba(0,255,240,0.14))",
              }}
            />
            {/* scanlines */}
            <div
              className="absolute inset-0 animate-glitch-scan opacity-60"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(34,211,238,0.055) 2px 4px)",
              }}
            />
            {/* invert flash — base opacity 0 so the one-shot animation can
                never leave a white sheet on screen once it has finished */}
            <div className="absolute inset-0 animate-glitch-flash bg-white opacity-0" />
          </div>
          <p className="fixed bottom-28 left-1/2 z-[96] -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan-400/30 bg-black/85 px-4 py-2 font-mono text-xs text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur">
            {message}
          </p>
        </>
      ) : null}
    </>
  );
}
