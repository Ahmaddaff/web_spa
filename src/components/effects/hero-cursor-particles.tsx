"use client";

import * as React from "react";

const COLORS = ["#00E5FF", "#A855F7", "#FF007F", "#8AF5FF", "#C48CFF"];
const MAX_PARTICLES = 140;
const SPAWN_DISTANCE = 7;
const LIFETIME = 620;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

/**
 * Neon particle cursor trail. The canvas sits inside <Hero> (pointer-events
 * none) and only reacts while the cursor is inside that section.
 */
export function HeroCursorParticles() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = canvas.parentElement;
    const particles: Particle[] = [];
    let frame = 0;
    let lastTime = 0;
    let last = { x: 0, y: 0, has: false };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.55;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.18,
        size: 1.1 + Math.random() * 2.1,
        life: LIFETIME,
        maxLife: LIFETIME,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
      if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (!last.has || Math.hypot(x - last.x, y - last.y) >= SPAWN_DISTANCE) {
        spawn(x, y);
        if (Math.random() > 0.45) spawn(x, y);
        last = { x, y, has: true };
      }
    };

    const onLeave = () => {
      last = { x: 0, y: 0, has: false };
    };

    host?.addEventListener("pointermove", onMove, { passive: true });
    host?.addEventListener("pointerleave", onLeave);

    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      const dt = lastTime ? Math.min(40, time - lastTime) : 16;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt * 0.09;
        p.y += p.vy * dt * 0.09;
        p.vy += 0.00035 * dt; // gentle gravity
        const t = p.life / p.maxLife;
        const alpha = Math.max(0, t) * 0.85;

        // halo
        ctx.globalAlpha = alpha * 0.35;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    frame = requestAnimationFrame(render);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      particles.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="hero-cursor-particles"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}
