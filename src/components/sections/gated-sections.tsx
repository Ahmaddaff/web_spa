"use client";

import { About } from "./about";
import { Experience } from "./experience";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { useUnlock } from "@/components/providers/unlock-provider";
import { ErrorBoundary } from "@/components/error-boundary";

/**
 * Journey: Home → Play (minigame, halaman kedua) → About / Skills /
 * Experience / Projects → Contact.
 *
 * While the gate is shut these sections are not rendered at all — not even as
 * placeholders — so the page only contains the pages that are actually open
 * (Home, Play, Contact). Winning the game mounts the rest.
 */
export function GatedSections() {
  const { unlocked } = useUnlock();

  if (!unlocked) return null;

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
