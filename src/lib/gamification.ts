/**
 * Shared definitions for the "Interactive Game Portfolio & Universe" layer.
 * Pure data + maths only — no React, no DOM, so every gamification component
 * (XP bar, SFX toggle, trophies, terminal) reads the same source of truth.
 */

export type AchievementTier = "bronze" | "silver" | "gold";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  /** lucide-react icon name, resolved in the trophy section */
  icon: string;
  xp: number;
  tier: AchievementTier;
}

/** XP curve: every level costs a little more than the previous one. */
export function xpCostForLevel(level: number): number {
  return 100 + (level - 1) * 60;
}

export interface LevelInfo {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  /** 0..1 progress towards the next level */
  progress: number;
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(xp));
  while (remaining >= xpCostForLevel(level)) {
    remaining -= xpCostForLevel(level);
    level += 1;
  }
  const xpForNext = xpCostForLevel(level);
  return {
    level,
    xpInLevel: remaining,
    xpForNext,
    progress: Math.min(1, remaining / xpForNext),
  };
}

export const LEVEL_TITLES = [
  "Script Rookie",
  "Pixel Runner",
  "Neon Cadet",
  "Circuit Breaker",
  "Neon Architect",
  "Synth Sorcerer",
  "AHDAVERSE Legend",
];

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] ?? "AHDAVERSE Legend";
}

/** XP awarded for a plain interaction. */
export const XP = {
  boot: 10,
  click: 4,
  command: 6,
  section: 25,
  external: 15,
  cv: 25,
  gate: 300,
} as const;

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "system-boot",
    title: "System Boot",
    description: "Masuk ke AHDAVERSE untuk pertama kali.",
    icon: "Power",
    xp: XP.boot,
    tier: "bronze",
  },
  {
    id: "recruiter-ready",
    title: "Recruiter Ready",
    description: "Unduh CV lengkap dari halaman utama.",
    icon: "FileDown",
    xp: XP.cv,
    tier: "bronze",
  },
  {
    id: "networker",
    title: "Networker",
    description: "Buka salah satu tautan eksternal (GitHub, email, sosmed).",
    icon: "Share2",
    xp: XP.external,
    tier: "bronze",
  },
  {
    id: "universe-explorer",
    title: "Universe Explorer",
    description: "Jelajahi 3 bagian berbeda dari website.",
    icon: "Compass",
    xp: 50,
    tier: "bronze",
  },
  {
    id: "shell-wizard",
    title: "Shell Wizard",
    description: "Jalankan 5 perintah di mini-terminal.",
    icon: "TerminalSquare",
    xp: XP.command * 5,
    tier: "silver",
  },
  {
    id: "deep-diver",
    title: "Deep Diver",
    description: "Kunjungi seluruh bagian halaman — tidak ada yang terlewat.",
    icon: "Radar",
    xp: 150,
    tier: "silver",
  },
  {
    id: "level-five",
    title: "Level V",
    description: "Capai Level 5. Kredensial arcade-mu mulai diperhitungkan.",
    icon: "ChevronsUp",
    xp: 100,
    tier: "silver",
  },
  {
    id: "gate-breaker",
    title: "Gate Breaker",
    description: "Menangkan AHDAVERSE RUNNER dan buka semua bagian rahasia.",
    icon: "KeyRound",
    xp: XP.gate,
    tier: "gold",
  },
  {
    id: "level-ten",
    title: "AHDAVERSE Legend",
    description: "Capai Level 10. Kamu resmi bagian dari universe ini.",
    icon: "Crown",
    xp: 250,
    tier: "gold",
  },
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

/** Sections the explorer/deep-diver trophies watch. */
export const TRACKED_SECTIONS = [
  "home",
  "minigame",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const;

export const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  minigame: "Play",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};
