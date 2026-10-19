import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * HUD-style frame: four glowing corner brackets wrapped around any content.
 * Used for the profile photo and featured project cards.
 */
export function HudFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <span className="pointer-events-none absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 border-arcade-cyan/70 shadow-[-2px_-2px_14px_rgba(0,229,255,0.55)]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-6 w-6 border-r-2 border-t-2 border-arcade-cyan/70 shadow-[2px_-2px_14px_rgba(0,229,255,0.55)]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-arcade-cyan/70 shadow-[-2px_2px_14px_rgba(0,229,255,0.55)]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-arcade-cyan/70 shadow-[2px_2px_14px_rgba(0,229,255,0.55)]" />
    </div>
  );
}
