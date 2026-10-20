import { marqueeItems } from "@/data/site-data";
import { cn } from "@/lib/utils";

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-10 pr-10 transition-[animation-play-state] group-hover:[animation-play-state:paused]",
          reverse
            ? "animate-[marquee-reverse_28s_linear_infinite]"
            : "animate-[marquee_28s_linear_infinite]"
        )}
      >
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-arcade-purple/25 bg-arcade-card/60 px-4 py-1.5 font-display text-sm font-medium tracking-wide text-slate-300 shadow-[0_0_18px_-8px_rgba(168,85,247,0.9)] transition-all hover:border-arcade-cyan/50 hover:text-arcade-cyan hover:shadow-[0_0_22px_-6px_rgba(0,229,255,0.95)] sm:text-base"
          >
            {item}
            <span className="text-cyan-500/40">&#8226;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section
      aria-hidden="true"
      className="group relative border-y border-arcade-line/70 bg-background py-6"
    >
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
