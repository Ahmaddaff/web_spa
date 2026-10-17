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
            className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-medium tracking-wide text-slate-500 sm:text-base"
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
      className="group relative border-y border-white/5 bg-white/[0.02] py-6"
    >
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
