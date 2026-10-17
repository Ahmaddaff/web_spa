"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const imgRef = useRef<HTMLImageElement | null>(null);
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

  /* ---------- load best score ---------- */
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(BEST_KEY) || "0");
      if (v > 0) setBest(v);
    } catch {
      /* private mode */
    }
  }, []);

  /* ---------- load character head (face + neck cutout, no laptop) ---------- */
  useEffect(() => {
    const img = new Image();
    img.src = "/images/runner-head.png";
    img.onload = () => {
      imgRef.current = img;
    };
  }, []);

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

    // collisions
    const charW = 56;
    const charH = 84;
    const cx = s.w * 0.16;
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
      // vertical distance in above-ground terms: character center vs chip
      const dy = Math.abs(s.charY + 42 - c.y);
      if (Math.abs(px - cx) < 44 && dy < 52) {
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

    // bugs
    for (const b of s.bugs) {
      const bx = b.x - s.camX;
      if (bx < -60 || bx > w + 60) continue;
      const by = h - b.y - b.h + (b.kind === "air" ? Math.sin(t * 4 + b.bob) * 6 : 0);
      ctx.save();
      ctx.translate(bx + b.w / 2, by + b.h / 2);
      // body
      ctx.fillStyle = "#f43f5e";
      ctx.shadowColor = "rgba(244,63,94,0.5)";
      ctx.shadowBlur = 10;
      roundRect(ctx, -b.w / 2, -b.h / 2, b.w, b.h, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      // antennae
      ctx.strokeStyle = "#fda4af";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-b.w / 4, -b.h / 2);
      ctx.lineTo(-b.w / 4 - 4, -b.h / 2 - 7);
      ctx.moveTo(b.w / 4, -b.h / 2);
      ctx.lineTo(b.w / 4 + 4, -b.h / 2 - 7);
      ctx.stroke();
      // eyes
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-5, -2, 3.4, 0, Math.PI * 2);
      ctx.arc(5, -2, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(-5, -2, 1.5, 0, Math.PI * 2);
      ctx.arc(5, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // character — full runner: photo head + canvas-drawn body (head to toe)
    const img = imgRef.current;
    const cw = 62;
    const ch = 86;
    const cx = w * 0.16;
    const grounded = s.grounded;
    const runPhase = s.runT / 78;
    const bob = grounded ? Math.sin(runPhase * 2) * 1.6 : 0;
    const feetY = h - GROUND_H - s.charY;
    const hipY = feetY - 29;
    const lean = grounded
      ? 0.06
      : Math.max(-0.14, Math.min(0.14, s.vy * 0.012)) +
        (s.vy < 0 ? 0.05 : -0.03);
    const flash = s.invincible > 0 && Math.floor(ts / 90) % 2 === 0;

    if (!img) {
      // fallback silhouette until the head loads
      ctx.fillStyle = "#22d3ee";
      roundRect(ctx, cx, h - GROUND_H - s.charY - ch, cw, ch, 10);
      ctx.fill();
    } else {
      // shadow — shrinks as the runner rises
      const sh = 1 - Math.min(0.55, s.charY / 240);
      ctx.globalAlpha = 0.35 * sh;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(
        cx + cw / 2,
        h - GROUND_H + 6,
        26 * sh,
        6 * sh,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(cx + cw / 2, hipY + bob);
      ctx.rotate(lean);
      if (flash) ctx.globalAlpha = 0.35;

      const shirt = "#96bedc";
      const shirtFar = "#7ba3c2";
      const pants = "#334155";
      const pantsFar = "#273549";
      const skin = "rgb(199,163,147)";
      const shoe = "#1e293b";

      /* pose angles — 0 = straight down, positive = forward (run direction) */
      let thighNear: number, kneeNear: number, thighFar: number, kneeFar: number;
      let armNear: number, elbowNear: number, armFar: number, elbowFar: number;
      if (grounded) {
        // running cycle — legs counter-swing, knees bend on recovery,
        // arms pump opposite to the legs
        const sw = Math.sin(runPhase);
        thighNear = sw * 0.55;
        kneeNear = 0.25 + Math.max(0, -sw) * 0.85;
        thighFar = -sw * 0.55;
        kneeFar = 0.25 + Math.max(0, sw) * 0.85;
        armNear = -sw * 0.45;
        elbowNear = 0.35 + Math.max(0, sw) * 0.4;
        armFar = sw * 0.45;
        elbowFar = 0.35 + Math.max(0, -sw) * 0.4;
      } else if (s.vy < 0) {
        // rising — tuck the legs, drive the arms up
        thighNear = 0.8;
        kneeNear = 1.15;
        thighFar = -0.45;
        kneeFar = 0.95;
        armNear = 2.55;
        elbowNear = 0.45;
        armFar = 2.3;
        elbowFar = 0.55;
      } else {
        // falling — legs reach down, arms out for balance
        thighNear = 0.35;
        kneeNear = 0.2;
        thighFar = -0.3;
        kneeFar = 0.35;
        armNear = 2.45;
        elbowNear = 0.3;
        armFar = 2.2;
        elbowFar = 0.4;
      }

      // two-segment limb (thigh/upper-arm + calf/forearm) with shoe/hand cap
      const limb = (
        ox: number,
        oy: number,
        a1: number,
        l1: number,
        a2: number,
        l2: number,
        w1: number,
        w2: number,
        color: string,
        cap: "shoe" | "hand"
      ) => {
        const kx = ox + Math.sin(a1) * l1;
        const ky = oy + Math.cos(a1) * l1;
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineWidth = w1;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(kx, ky);
        ctx.stroke();
        const a2abs = a1 + a2;
        const ex = kx + Math.sin(a2abs) * l2;
        const ey = ky + Math.cos(a2abs) * l2;
        ctx.lineWidth = w2;
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        if (cap === "shoe") {
          ctx.save();
          ctx.translate(ex, ey);
          ctx.rotate(a2abs);
          ctx.fillStyle = shoe;
          ctx.beginPath();
          ctx.ellipse(2.5, 1, 6.5, 3.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = skin;
          ctx.beginPath();
          ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      /* ---- far side of the body (behind the torso) ---- */
      limb(-3, 0, thighFar, 15, kneeFar, 14, 8, 6.5, pantsFar, "shoe");
      limb(-9, -22, armFar, 11, elbowFar, 10, 6, 5, shirtFar, "hand");

      /* ---- torso: shirt from hips to shoulders ---- */
      ctx.fillStyle = shirt;
      ctx.beginPath();
      ctx.moveTo(-10, 3);
      ctx.quadraticCurveTo(-13, -11, -11, -21);
      ctx.lineTo(11, -21);
      ctx.quadraticCurveTo(13, -11, 10, 3);
      ctx.quadraticCurveTo(0, 6, -10, 3);
      ctx.closePath();
      ctx.fill();
      // far-side shading
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.beginPath();
      ctx.moveTo(4, -20);
      ctx.quadraticCurveTo(8, -11, 6, 3);
      ctx.lineTo(10, 3);
      ctx.quadraticCurveTo(13, -11, 11, -21);
      ctx.closePath();
      ctx.fill();
      // collar band where the neck meets the shirt
      ctx.fillStyle = shirt;
      ctx.beginPath();
      ctx.ellipse(0, -20, 6.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      /* ---- near side of the body (in front of the torso) ---- */
      limb(3, 0, thighNear, 15, kneeNear, 14, 8.5, 7, pants, "shoe");
      limb(9, -22, armNear, 11, elbowNear, 10, 6.5, 5.5, shirt, "hand");

      /* ---- head photo on top (covers the collar seam) ---- */
      const hw = 28;
      const hh = hw / 0.809; // ≈ 35 — head + neck, aspect of runner-head.png
      ctx.drawImage(img, -hw / 2, -18 - hh, hw, hh);

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
    const loop = (ts: number) => {
      const s = g.current;
      if (!s.running) return;
      if (!s.lastTs) s.lastTs = ts;
      const dt = Math.min(50, ts - s.lastTs);
      s.lastTs = ts;
      if (s.inView && phaseRef.current === "playing") update(dt);
      else if (s.inView && (phaseRef.current === "win" || phaseRef.current === "over"))
        updateParticles(dt);
      render(ts);
      s.raf = requestAnimationFrame(loop);
    };
    g.current.running = true;
    g.current.raf = requestAnimationFrame(loop);
    return () => {
      g.current.running = false;
      cancelAnimationFrame(g.current.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- pause when off-screen / tab hidden ---------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        g.current.inView = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
    const onVis = () => {
      if (document.hidden) g.current.inView = false;
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

  const onPointer = () => {
    if (phaseRef.current === "ready" || phaseRef.current === "over" || phaseRef.current === "win") {
      resetGame();
    } else {
      jump();
    }
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
            onPointerDown={onPointer}
            className="block h-[380px] w-full touch-pan-y select-none sm:h-[460px]"
          />

          {/* overlays */}
          {phase === "ready" && (
            <div
              onPointerDown={onPointer}
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
