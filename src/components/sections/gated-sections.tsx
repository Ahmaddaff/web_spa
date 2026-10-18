"use client";

import { About } from "./about";
import { Experience } from "./experience";
import { LockedSection } from "./locked-section";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { useUnlock } from "@/components/providers/unlock-provider";
import { ErrorBoundary } from "@/components/error-boundary";

/* Only the anchor and the position number are public while the gate is shut.
   No title, no eyebrow, no description — the real copy lives in the section
   components and only mounts once the game is won. */
const LOCKED_META = [
  { id: "about", index: "03" },
  { id: "skills", index: "04" },
  { id: "experience", index: "05" },
  { id: "projects", index: "06" },
];

/**
 * Journey: Home (halaman utama) → Play (minigame, halaman kedua) → About /
 * Skills / Experience / Projects → Contact. Everything after Play is sealed
 * and its content stays hidden until the minigame is won.
 */
export function GatedSections() {
  const { unlocked } = useUnlock();

  if (unlocked) {
    return (
      <>
        <ErrorBoundary label="about">
          <About />
        </ErrorBoundary>
        <ErrorBoundary label="skills">
          <Skills />
        </ErrorBoundary>
        <ErrorBoundary label="experience">
          <Experience />
        </ErrorBoundary>
        <ErrorBoundary label="projects">
          <Projects />
        </ErrorBoundary>
      </>
    );
  }

  return (
    <>
      {LOCKED_META.map((meta) => (
        <LockedSection key={meta.id} {...meta} />
      ))}
    </>
  );
}
