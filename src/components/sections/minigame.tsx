"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as RPointerEvent } from "react";
import { motion } from "framer-motion";

import { SectionHeading } from "@/components/section-heading";
import { useUnlock } from "@/components/providers/unlock-provider";

/* ------------------------------------------------------------------ *
 *  Ahdaverse Runner — a side-scrolling minigame (robbyleonardi-style)
 *  Character = Ahmad (photo head + canvas-drawn full body, head to toe).
 *  Auto-run, jump over bugs, grab chips. Four zones:
 *  ABOUT → SKILLS → EXPERIENCE → CONTACT.
 *  Winning the game unlocks the About / Skills / Experience / Projects
 *  sections (persisted in localStorage).
 * ------------------------------------------------------------------ */

type Phase = "ready" | "playing" | "over" | "win";

const ZONES = [
  { name: "ABOUT", len: 2200 },
  { name: "SKILLS", len: 2200 },
  { name: "EXPERIENCE", len: 2200 },
  { name: "CONTACT", len: 2200 },
];
const TOTAL_LEN = ZONES.reduce((s, z) => s + z.len, 0);
const GROUND_H = 64;
const BEST_KEY = "ahdaverse-runner-best";

interface Bug {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "ground" | "air";
  bob: number;
}
interface Chip {
  x: number;
  y: number;
  taken: boolean;
  spin: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function Minigame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhase] = useState<Phase>("ready");
  const [best, setBest] = useState(0);
  const { unlocked, unlock } = useUnlock();

  const g = useRef({
    w: 960,
    h: 460,
    dpr: 1,
    camX: 0,
    speed: 3.6,
    charY: 0, // offset above ground (0 = on ground)
    vy: 0,
    grounded: true,
    runT: 0,
    invincible: 0,
    shake: 0,
    score: 0,
    lives: 3,
    zone: 0,
    bannerT: 0,
    nextBug: 600,
    nextChip: 320,
    bugs: [] as Bug[],
    chips: [] as Chip[],
    particles: [] as Particle[],
    stars: [] as { x: number; y: number; r: number; p: number }[],
    raf: 0,
    running: false,
    inView: false,
    lastTs: 0,
  });

  // loop control handle (start/stop) so the RAF loop can be paused when the
  // canvas is off-screen or after the run ends, freeing the main thread.
  const loopCtl = useRef<{
    start: () => void;
    stop: () => void;
    errored: boolean;
  }>({ start: () => {}, stop: () => {}, errored: false });

  /* ---------- load best score ---------- */
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(BEST_KEY) || "0");
      if (v > 0) setBest(v);
    } catch {
      /* private mode */
    }
  }, []);

  /* ---------- load character sprite sheet (8 frames, transparent bg) ---------- */
  useEffect(() => {
    const img = new Image();
    img.src = "/images/runner-spritesheet.png";
    img.onload = () => {
      spriteRef.current = img;
    };
  }, []);

  /* The sheet holds exactly 7 figures in 266x480 cells. Each one was cut out
     with alpha connected-component labelling, so a cell can only ever contain
     its own character — the old 198px grid sliced straight through the art and
     dragged slices of the neighbouring poses into every frame.
     All cells share the same anchor: head centre at x = HEAD_X, feet on the
     baseline at y = FEET_Y, so frames never jump around while cycling. */
  const CELL_W = 266;
  const CELL_H = 480;
  const HEAD_X = 162; // head centre inside every cell
  const FEET_Y = 470; // baseline inside every cell
  const RUN_FRAMES = [0, 1, 2, 4, 5, 6]; // ground cycle
  const JUMP_FRAME = 3; // airborne stride
  const CHAR_TARGET_H = 92; // tallest figure on screen
  const REF_H = 460; // tallest figure in the sheet — one constant scale

  /* ---------- sizing ---------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.current.w = rect.width;
      g.current.h = rect.height;
      g.current.dpr = dpr;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const s = g.current;
      s.stars = Array.from({ length: 70 }, () => ({
        x: Math.random() * s.w * 2,
        y: Math.random() * (s.h - GROUND_H) * 0.85,
        r: Math.random() * 1.4 + 0.4,
        p: Math.random() * Math.PI * 2,
      }));
      // if the loop is parked (off-screen / after win), repaint once so a
      // rotation or resize doesn't leave a cleared/blank canvas.
      if (!s.running) render(performance.now());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /* ---------- helpers ---------- */
  const spawnBurst = (x: number, y: number, color: string, n: number) => {
    const s = g.current;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 3 + 1;
      s.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.5,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color,
        size: Math.random() * 3 + 1.5,
      });
    }
  };

  const resetGame = useCallback(() => {
    const s = g.current;
    s.camX = 0;
    s.speed = 3.6;
    s.charY = 0;
    s.vy = 0;
    s.grounded = true;
    s.runT = 0;
    s.invincible = 0;
    s.shake = 0;
    s.score = 0;
    s.lives = 3;
    s.zone = 0;
    s.bannerT = 90;
    s.nextBug = 700;
    s.nextChip = 380;
    s.bugs = [];
    s.chips = [];
    s.particles = [];
    phaseRef.current = "playing";
    setPhase("playing");
    loopCtl.current.start();
  }, []);

  const jump = useCallback(() => {
    const s = g.current;
    if (s.grounded) {
      s.vy = -13;
      s.grounded = false;
    }
  }, []);

  const endGame = useCallback(
    (win: boolean) => {
      const s = g.current;
      phaseRef.current = win ? "win" : "over";
      setPhase(win ? "win" : "over");
      if (win) {
        unlock(); // gate: About / Skills / Experience / Projects open up
        for (let i = 0; i < 26; i++) {
          spawnBurst(
            s.w * (0.2 + Math.random() * 0.6),
            s.h * (0.15 + Math.random() * 0.4),
            ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24"][i % 4],
            2
          );
        }
      }
      const finalScore = s.score;
      setBest((b) => {
        if (finalScore > b) {
          try {
            localStorage.setItem(BEST_KEY, String(finalScore));
          } catch {
            /* ignore */
          }
          return finalScore;
        }
        return b;
      });
    },
    [spawnBurst, unlock]
  );

  /* ---------- update ---------- */
  const update = (dt: number) => {
    const s = g.current;
    const f = dt / 16.667; // frame-normalized factor

    // speed ramps per zone
    s.speed = 3.6 + s.zone * 0.45;
    s.camX += s.speed * f;
    s.runT += dt;

    // character physics
    if (!s.grounded) {
      s.vy += 0.6 * f;
      s.charY -= s.vy * f;
      if (s.charY <= 0) {
        s.charY = 0;
        s.vy = 0;
        s.grounded = true;
      }
    }

    // running dust kicked up behind the feet
    if (
      s.grounded &&
      s.particles.length < 120 &&
      Math.random() < 0.2 * f
    ) {
      s.particles.push({
        x: s.w * 0.16 + 8 + Math.random() * 6,
        y: s.h - GROUND_H - 2,
        vx: -1.2 - Math.random() * 1.2,
        vy: -0.3 - Math.random() * 0.4,
        life: 22 + Math.random() * 14,
        maxLife: 36,
        color: "#94a3b8",
        size: 2 + Math.random() * 2,
      });
    }
    if (s.invincible > 0) s.invincible -= dt;
    if (s.shake > 0) s.shake -= dt;
    if (s.bannerT > 0) s.bannerT -= dt;

    // zone progression
    let acc = 0;
    let zi = 0;
    for (let i = 0; i < ZONES.length; i++) {
      acc += ZONES[i].len;
      if (s.camX < acc) {
        zi = i;
        break;
      }
      zi = i;
    }
    if (zi !== s.zone) {
      s.zone = zi;
      s.bannerT = 110;
    }
    if (s.camX >= TOTAL_LEN) {
      endGame(true);
      return;
    }

    // spawn obstacles & chips ahead of camera
    const ahead = s.camX + s.w + 60;
    while (s.nextBug < ahead) {
      const air = Math.random() < 0.3;
      const w = 26 + Math.random() * 20;
      const h = air ? 26 + Math.random() * 14 : 30 + Math.random() * 24;
      s.bugs.push({
        x: s.nextBug,
        y: air ? GROUND_H + 100 + Math.random() * 30 : GROUND_H,
        w,
        h,
        kind: air ? "air" : "ground",
        bob: Math.random() * Math.PI * 2,
      });
      const gap = 480 + Math.random() * 280 - s.zone * 35;
      s.nextBug += Math.max(330, gap) + w;
    }
    while (s.nextChip < ahead) {
      const high = Math.random() < 0.55;
      s.chips.push({
        x: s.nextChip,
        y: GROUND_H + (high ? 96 + Math.random() * 50 : 34 + Math.random() * 24),
        taken: false,
        spin: Math.random() * Math.PI * 2,
      });
      s.nextChip += 220 + Math.random() * 200;
    }

    // despawn behind camera
    s.bugs = s.bugs.filter((b) => b.x + b.w > s.camX - 80);
    s.chips = s.chips.filter((c) => c.x > s.camX - 80 && !c.taken);

    // collisions (match the sprite character size: 92px tall)
    const charW = 56;
    const charH = 92;
    const cx = s.w * 0.16;
    const charCx = cx + charW / 2; // character centre, screen space
    // Character and chips are both measured from the canvas bottom: the feet
    // rest on the ground line at GROUND_H, so the centre sits GROUND_H + charY
    // + charH/2 above the bottom. c.y is already in that same space.
    const charCy = GROUND_H + s.charY + charH / 2;
    const step = s.speed * f; // how far the world scrolled this frame
    const cyTop = s.h - GROUND_H - s.charY - charH;
    const cx0 = cx + 10;
    const cx1 = cx + charW - 10;
    const cy0 = cyTop + 12;
    const cy1 = cyTop + charH;

    for (const b of s.bugs) {
      const bx0 = b.x - s.camX;
      const bx1 = bx0 + b.w;
      const by0 = s.h - b.y - b.h;
      const by1 = s.h - b.y;
      if (s.invincible <= 0 && cx1 > bx0 && cx0 < bx1 && cy1 > by0 && cy0 < by1) {
        s.lives -= 1;
        s.invincible = 1600;
        s.shake = 320;
        spawnBurst(bx0 + b.w / 2, by0 + b.h / 2, "#fbbf24", 14);
        if (s.lives <= 0) {
          endGame(false);
          return;
        }
      }
    }
    for (const c of s.chips) {
      if (c.taken) continue;
      const px = c.x - s.camX;
      // This used to read `Math.abs(s.charY + 46 - c.y)`, which forgot that
      // c.y is measured from the canvas bottom while charY is measured from
      // the ground line — the whole pickup band sat GROUND_H (64px) too low,
      // so chips were passed straight through without scoring.
      const dy = Math.abs(charCy - c.y);
      // swept test: the chip travels `step` px this frame, so check the
      // interval it crossed rather than a single sample point
      const overlapsX = px + step > charCx - 44 && px < charCx + 44;
      if (overlapsX && dy < 58) {
        c.taken = true;
        s.score += 10;
        spawnBurst(px, s.h - c.y, "#22d3ee", 8);
      }
    }

    // particles
    for (const p of s.particles) {
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.vy += 0.12 * f;
      p.life -= f;
    }
    s.particles = s.particles.filter((p) => p.life > 0);
  };

  /* particles keep flying after the run ends (win fireworks / death burst) */
  const updateParticles = (dt: number) => {
    const s = g.current;
    const f = dt / 16.667;
    for (const p of s.particles) {
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.vy += 0.12 * f;
      p.life -= f;
    }
    s.particles = s.particles.filter((p) => p.life > 0);
  };

  /* ---------- render ---------- */
  const render = (ts: number) => {
    const canvas = canvasRef.current;
    const s = g.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h, dpr } = s;
    ctx.save();
    ctx.scale(dpr, dpr);
    if (s.shake > 0) {
      ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }

    // background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0b0b14");
    grad.addColorStop(1, "#101018");
    ctx.fillStyle = grad;
    ctx.fillRect(-10, -10, w + 20, h + 20);

    // stars (far parallax)
    const t = ts / 1000;
    for (const st of s.stars) {
      const sx = ((st.x - s.camX * 0.22) % (w * 2) + w * 2) % (w * 2);
      if (sx < w) {
        ctx.globalAlpha = 0.35 + 0.3 * Math.sin(t * 2 + st.p);
        ctx.fillStyle = "#8ea2c0";
        ctx.fillRect(sx, st.y, st.r, st.r);
      }
    }
    ctx.globalAlpha = 1;

    // ghost zone word (mid parallax) — robby-style terrain typography
    let acc = 0;
    for (let i = 0; i < ZONES.length; i++) {
      const zx = acc + ZONES[i].len / 2 - s.camX * 0.55;
      acc += ZONES[i].len;
      if (zx > -500 && zx < w + 500) {
        ctx.font = "900 110px 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = i === s.zone ? "rgba(167,139,250,0.10)" : "rgba(255,255,255,0.035)";
        ctx.fillText(ZONES[i].name, zx, h * 0.42);
      }
    }

    // ground
    const gy = h - GROUND_H;
    ctx.fillStyle = "#15151f";
    ctx.fillRect(-10, gy, w + 20, GROUND_H + 10);
    ctx.strokeStyle = "rgba(34,211,238,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, gy);
    ctx.lineTo(w + 10, gy);
    ctx.stroke();
    // chevrons
    ctx.fillStyle = "rgba(34,211,238,0.10)";
    const chevW = 26;
    const off = s.camX % chevW;
    for (let x = -off - chevW; x < w + chevW; x += chevW) {
      ctx.beginPath();
      ctx.moveTo(x, h - 10);
      ctx.lineTo(x + chevW / 2, gy + 12);
      ctx.lineTo(x + chevW, h - 10);
      ctx.closePath();
      ctx.fill();
    }

    // chips
    for (const c of s.chips) {
      const px = c.x - s.camX;
      if (px < -30 || px > w + 30) continue;
      const py = h - c.y;
      const sq = Math.abs(Math.cos(t * 3 + c.spin));
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(0.4 + sq * 0.6, 1);
      ctx.shadowColor = "rgba(34,211,238,0.8)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(9, 0);
      ctx.lineTo(0, 11);
      ctx.lineTo(-9, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // bugs — detailed obstacles: oval body, animated legs, curved antennae, pulsing eyes
    for (const b of s.bugs) {
      const bx = b.x - s.camX;
      if (bx < -60 || bx > w + 60) continue;
      const by = h - b.y - b.h + (b.kind === "air" ? Math.sin(t * 4 + b.bob) * 6 : 0);
      const cx2 = bx + b.w / 2;
      const cy2 = by + b.h / 2;
      // zone-based color (each zone gets a different hue)
      const zoneColors = ["#f43f5e", "#a78bfa", "#22d3ee", "#fbbf24"];
      const baseColor = zoneColors[s.zone % zoneColors.length];
      ctx.save();
      ctx.translate(cx2, cy2);
      // outer glow
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 14;
      // body (oval)
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.w / 2, b.h / 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // body highlight
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.ellipse(-b.w * 0.15, -b.h * 0.2, b.w * 0.25, b.h * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      // 6 animated legs (3 pairs)
      const legPhase = t * 7 + b.bob;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (let i = -1; i <= 1; i++) {
        const swing = Math.sin(legPhase + i * 1.3) * 3;
        ctx.beginPath();
        ctx.moveTo(-b.w * 0.12, b.h * 0.25 + i * 4);
        ctx.lineTo(-b.w * 0.12 - 5 + swing, b.h * 0.25 + i * 4 + 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.w * 0.12, b.h * 0.25 + i * 4);
        ctx.lineTo(b.w * 0.12 + 5 - swing, b.h * 0.25 + i * 4 + 7);
        ctx.stroke();
      }
      // curved antennae
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-b.w * 0.18, -b.h * 0.42);
      ctx.quadraticCurveTo(-b.w * 0.28, -b.h * 0.62, -b.w * 0.22, -b.h * 0.72);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.w * 0.18, -b.h * 0.42);
      ctx.quadraticCurveTo(b.w * 0.28, -b.h * 0.62, b.w * 0.22, -b.h * 0.72);
      ctx.stroke();
      // antennae tips (glowing)
      const tipGlow = 0.6 + 0.4 * Math.sin(t * 5 + b.bob);
      ctx.fillStyle = `rgba(255,255,255,${tipGlow})`;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(-b.w * 0.22, -b.h * 0.72, 2, 0, Math.PI * 2);
      ctx.arc(b.w * 0.22, -b.h * 0.72, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // pulsing eyes
      const eyePulse = 0.7 + 0.3 * Math.sin(t * 3 + b.bob);
      ctx.fillStyle = `rgba(255,255,255,${eyePulse})`;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(-b.w * 0.18, -b.h * 0.12, 2.8, 0, Math.PI * 2);
      ctx.arc(b.w * 0.18, -b.h * 0.12, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // character — sprite sheet frames (7 frames, transparent bg, smooth cycle)
    const sprite = spriteRef.current;
    // same width the collision code uses, so the sprite sits exactly where the
    // pickup and hit boxes are
    const cw = 56;
    const ch = CHAR_TARGET_H; // visual height
    const cx = w * 0.16;
    const grounded = s.grounded;
    const runPhase = s.runT / 75; // ~13 fps — smooth running cycle
    const bob = grounded ? Math.sin(runPhase * Math.PI * 2) * 1.8 : 0;
    const feetY = h - GROUND_H - s.charY;
    const lean = grounded
      ? 0.05
      : Math.max(-0.12, Math.min(0.12, s.vy * 0.01));
    const flash = s.invincible > 0 && Math.floor(ts / 90) % 2 === 0;

    if (!sprite) {
      // fallback silhouette until the sprite sheet loads
      ctx.fillStyle = "#22d3ee";
      roundRect(ctx, cx, feetY - ch, cw, ch, 10);
      ctx.fill();
    } else {
      // ground shadow — shrinks as the runner rises
      const shadowScale = 1 - Math.min(0.55, s.charY / 240);
      ctx.globalAlpha = 0.35 * shadowScale;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(
        cx + cw / 2,
        h - GROUND_H + 6,
        28 * shadowScale,
        6 * shadowScale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;

      // select frame: jump frame when airborne, otherwise cycle ground frames
      const frameIndex = grounded
        ? RUN_FRAMES[Math.floor(runPhase) % RUN_FRAMES.length]
        : JUMP_FRAME;
      // one constant scale for every frame: normalising each frame to the same
      // height made the runner visibly pulse
      const scale = CHAR_TARGET_H / REF_H;

      ctx.save();
      ctx.translate(cx + cw / 2, feetY + bob);
      ctx.rotate(lean);
      if (flash) ctx.globalAlpha = 0.35;
      // soft rim light: the outfit is near-black and would otherwise vanish
      // against the near-black background
      ctx.shadowColor = "rgba(34,211,238,0.55)";
      ctx.shadowBlur = 14;
      // Draw the whole cell rather than a tight crop, anchored so that the head
      // sits on the pivot and the feet sit on the ground line. Because every
      // cell carries the same anchor there is nothing to clip and nothing from
      // a neighbouring cell can ever appear.
      ctx.drawImage(
        sprite,
        frameIndex * CELL_W,
        0,
        CELL_W,
        CELL_H,
        -HEAD_X * scale,
        -FEET_Y * scale,
        CELL_W * scale,
        CELL_H * scale
      );
      ctx.restore();
    }

    // particles
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    /* ---------- HUD ---------- */
    ctx.font = "700 13px ui-monospace, monospace";
    ctx.textBaseline = "top";
    // score
    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(`SCORE ${String(s.score).padStart(4, "0")}`, 16, 14);
    // lives
    ctx.textAlign = "right";
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("♥".repeat(Math.max(0, s.lives)) + "♡".repeat(Math.max(0, 3 - s.lives)), w - 16, 14);
    // zone
    ctx.textAlign = "center";
    ctx.fillStyle = "#a78bfa";
    ctx.fillText(`ZONE ${s.zone + 1}/${ZONES.length} — ${ZONES[s.zone].name}`, w / 2, 14);
    // progress bar
    const prog = Math.min(1, s.camX / TOTAL_LEN);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(16, 36, w - 32, 4);
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(16, 36, (w - 32) * prog, 4);

    // zone banner
    if (s.bannerT > 0 && phaseRef.current === "playing") {
      const a = Math.min(1, s.bannerT / 40);
      ctx.globalAlpha = a;
      ctx.textAlign = "center";
      ctx.font = "900 30px 'Arial Black', sans-serif";
      ctx.fillStyle = "#a78bfa";
      ctx.fillText(`ZONE ${s.zone + 1} — ${ZONES[s.zone].name}`, w / 2, h * 0.24);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  };

  /* ---------- loop ---------- */
  useEffect(() => {
    const s = g.current;
    const loop = (ts: number) => {
      if (!s.running) return;
      if (!s.lastTs) s.lastTs = ts;
      const dt = Math.min(50, ts - s.lastTs);
      s.lastTs = ts;
      try {
        if (s.inView) {
          if (phaseRef.current === "playing") {
            update(dt);
            // the run must repaint every frame — without this the canvas keeps
            // showing the last "ready" frame while the state advances silently
            render(ts);
          } else if (phaseRef.current === "win" || phaseRef.current === "over") {
            updateParticles(dt);
            render(ts);
            // celebration / death burst has settled — stop drawing to free the
            // main thread (matters most on lower-powered mobile devices)
            if (s.particles.length === 0) {
              s.running = false;
              cancelAnimationFrame(s.raf);
              return;
            }
          } else {
            render(ts);
          }
        }
      } catch (err) {
        // a transient canvas error must never silently kill the loop
        if (!loopCtl.current.errored) {
          loopCtl.current.errored = true;
          console.error("[minigame] render loop error", err);
        }
        s.running = false;
        cancelAnimationFrame(s.raf);
        return;
      }
      s.raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (s.running) return;
      s.running = true;
      s.lastTs = 0;
      s.raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
    };
    loopCtl.current = { start, stop, errored: false };
    // start only if the canvas is on-screen; the IntersectionObserver below
    // will start/stop it as the section scrolls in and out of view.
    if (s.inView) start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- pause when off-screen / tab hidden ---------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        g.current.inView = entry.isIntersecting;
        if (entry.isIntersecting) loopCtl.current.start();
        else loopCtl.current.stop();
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
    // `inView` belongs to the IntersectionObserver — this handler must only
    // pause/resume the loop. Clobbering `inView` here used to freeze the canvas
    // for good: on returning to the tab the loop restarted with inView === false
    // and did nothing, and the observer never fires again while the section
    // stays in view.
    const onVis = () => {
      if (document.hidden) loopCtl.current.stop();
      else if (g.current.inView) loopCtl.current.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* ---------- input ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!g.current.inView) return;
      if (e.code !== "Space" && e.code !== "ArrowUp" && e.code !== "KeyW") return;
      const el = document.activeElement;
      if (el && el.tagName === "BUTTON") return; // let buttons handle space
      e.preventDefault();
      if (phaseRef.current === "ready") resetGame();
      else if (phaseRef.current === "playing") jump();
      else if (phaseRef.current === "over" || phaseRef.current === "win") resetGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetGame, jump]);

  /* ---------- pointer input ----------
   * During a run a press jumps straight away (must feel instant). Otherwise a
   * press only *arms* a restart, which fires on release and only when the
   * pointer barely moved — on a phone a vertical swipe across the canvas has to
   * scroll the page instead of starting the game. Taps that land on a button
   * are left to that button. */
  const pressRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    if (phaseRef.current === "playing") {
      jump();
      return;
    }
    pressRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const onPointerUp = (e: RPointerEvent<HTMLElement>) => {
    const p = pressRef.current;
    pressRef.current = null;
    if (!p || phaseRef.current === "playing") return;
    if (e.target instanceof Element && e.target.closest("button")) return;
    const moved = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    if (moved > 12 || Date.now() - p.t > 700) return; // that was a scroll, not a tap
    resetGame();
  };

  const goContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="minigame"
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative px-6 py-24"
    >
      <SectionHeading
        index="06"
        eyebrow=".play()"
        title="Minigame"
        description="Bantu Dafanda berlari melewati zona About, Skills, Experience, sampai Contact. Lompati bug-nya, kumpulkan chip-nya — menangkan game ini untuk membuka section yang masih terkunci."
      />

      <div className="relative mx-auto mt-12 max-w-5xl">
        <div
          ref={wrapRef}
          data-cursor="JUMP"
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b14] shadow-[0_0_60px_rgba(34,211,238,0.07)]"
        >
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="block h-[380px] w-full touch-pan-y select-none sm:h-[460px]"
          />

          {/* overlays */}
          {phase === "ready" && (
            <div
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-[#0b0b14]/80 backdrop-blur-sm"
            >
              <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="text-gradient">AHDAVERSE RUNNER</span>
              </p>
              <p className="font-mono text-xs tracking-[0.3em] text-cyan-400/80">
                PRESS SPACE / TAP TO START
              </p>
              <p className="mt-2 max-w-xs text-center text-xs text-slate-400">
                SPACE / ↑ / TAP = lompat · hindari bug · kumpulkan chip
                {best > 0 ? ` · best: ${best}` : ""}
              </p>
              {!unlocked && (
                <p className="mt-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-center font-mono text-[11px] text-violet-200">
                  Menangkan untuk membuka About · Skills · Experience · Projects
                </p>
              )}
            </div>
          )}

          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b14]/85 backdrop-blur-sm">
              <p className="font-display text-3xl font-extrabold text-rose-400 sm:text-4xl">
                GAME OVER
              </p>
              <p className="font-mono text-sm text-slate-300">
                SCORE {g.current.score} · BEST {best}
              </p>
              <button
                onClick={resetGame}
                className="mt-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-6 py-2 font-mono text-xs tracking-[0.25em] text-cyan-300 transition hover:bg-cyan-400/20"
              >
                RETRY
              </button>
            </div>
          )}

          {phase === "win" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b14]/70 backdrop-blur-sm">
              <p className="font-display text-3xl font-extrabold text-cyan-300 sm:text-4xl">
                LEVEL COMPLETE!
              </p>
              <p className="font-mono text-sm text-slate-300">
                SCORE {g.current.score} · BEST {best}
              </p>
              <p className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 font-mono text-[11px] text-cyan-200">
                ✓ Semua section sudah terbuka
              </p>
              <button
                onClick={goContact}
                className="mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2 font-mono text-xs font-bold tracking-[0.25em] text-[#0a0a0a] transition hover:opacity-90"
              >
                LET&apos;S TALK →
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.2em] text-slate-500">
          <span>// runner v1.0 — built with canvas + framer motion</span>
          <span>{best > 0 ? `BEST ${best}` : "NO RECORD YET"}</span>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
