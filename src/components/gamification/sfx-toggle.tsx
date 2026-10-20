"use client";

import { Volume2, VolumeX } from "lucide-react";

import { useSfx } from "@/components/providers/sfx-provider";
import { cn } from "@/lib/utils";

/** Navbar toggle for the 8-bit SFX engine. `data-sfx-mute` keeps the toggle
 *  itself silent — it should never play the generic click blip. */
export function SfxToggle() {
  const { enabled, toggle } = useSfx();

  return (
    <button
      type="button"
      data-sfx-mute
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Matikan efek suara" : "Nyalakan efek suara"}
      title={enabled ? "SFX: ON" : "SFX: OFF"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
        enabled
          ? "border-arcade-cyan/50 bg-arcade-cyan/10 text-arcade-cyan shadow-[0_0_16px_-6px_rgba(0,229,255,0.95)] hover:border-arcade-cyan hover:shadow-neon-cyan"
          : "border-arcade-line bg-arcade-card/60 text-slate-500 hover:border-arcade-purple/50 hover:text-arcade-purple"
      )}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
