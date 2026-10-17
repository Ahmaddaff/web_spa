"use client";

import { About } from "./about";
import { Experience } from "./experience";
import { LockedSection } from "./locked-section";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { useUnlock } from "@/components/providers/unlock-provider";

const LOCKED_META = [
  {
    id: "about",
    index: "01",
    eyebrow: ".about()",
    title: "Student, Builder, and Leader",
    description:
      "Mahasiswa Teknologi Informasi Universitas Amikom Purwokerto dengan minat besar pada web development, IoT, dan kepemimpinan organisasi.",
  },
  {
    id: "skills",
    index: "02",
    eyebrow: ".skills()",
    title: "Tools I Work With",
    description:
      "Kombinasi kemampuan teknis dan soft skills yang saya asah melalui perkuliahan, proyek, dan pengalaman organisasi.",
  },
  {
    id: "experience",
    index: "03",
    eyebrow: ".experience()",
    title: "Leadership & Organization Journey",
    description:
      "Perjalanan organisasi, kepanitiaan, dan kepemimpinan yang membentuk cara saya bekerja, berkolaborasi, dan memberi dampak.",
  },
  {
    id: "projects",
    index: "04",
    eyebrow: ".projects()",
    title: "Selected Work & Publications",
    description:
      "Proyek teknologi dan publikasi ilmiah yang saya bangun — dari perangkat IoT dan aplikasi web hingga jurnal yang sudah diterbitkan.",
  },
];

/**
 * Journey: Home (halaman utama) → Play (minigame) → Contact (halaman
 * terakhir). About / Skills / Experience / Projects unlock only after the
 * minigame is won.
 */
export function GatedSections() {
  const { unlocked } = useUnlock();

  if (unlocked) {
    return (
      <>
        <About />
        <Skills />
        <Experience />
        <Projects />
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
