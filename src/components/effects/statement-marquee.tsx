"use client";

const items = [
  "Web Developer",
  "IoT Engineer",
  "Legislative Leader",
  "Student",
  "Builder",
];

/**
 * Lusion-style oversized statement marquee: huge display type scrolling in
 * one band, alternating gradient-filled and outlined words. Pauses on hover.
 */
export function StatementMarquee() {
  const row = (
    <div className="flex w-max shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused] animate-[marquee_30s_linear_infinite]">
      {[...items, ...items].map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          {i % 2 === 0 ? (
            <span className="text-gradient font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl">
              {item}
            </span>
          ) : (
            <span className="font-display text-5xl font-extrabold uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(148,163,184,0.4)] sm:text-7xl">
              {item}
            </span>
          )}
          <span className="text-cyan-400/50">&#9670;</span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-hidden="true"
      className="group relative -my-2 rotate-[-2deg] scale-[1.06] overflow-hidden border-y border-arcade-line/70 bg-arcade-bg/85 py-8 backdrop-blur-sm sm:py-10"
    >
      <div className="flex [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {row}
      </div>
    </section>
  );
}
