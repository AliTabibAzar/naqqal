"use client";

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

export default function BloodCanvas({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (reduced) {
      ctx.fillStyle = "rgba(120, 15, 20, 0.35)";
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const drops: Drop[] = [];
    // burst from center-top
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 14;
      drops.push({
        x: w / 2 + (Math.random() - 0.5) * 60,
        y: h * 0.35 + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        r: 1 + Math.random() * 5,
        life: 0,
        maxLife: 50 + Math.random() * 60,
      });
    }
    // edge splatters
    for (let i = 0; i < 40; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        r: 2 + Math.random() * 8,
        life: 0,
        maxLife: 80 + Math.random() * 80,
      });
    }

    let raf = 0;
    let t = 0;
    const fadeMax = 90;

    const loop = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      // red vignette wash
      const washAlpha =
        t < fadeMax ? 0.35 * (1 - t / fadeMax) : 0;
      if (washAlpha > 0) {
        const grad = ctx.createRadialGradient(
          w / 2,
          h / 2,
          h * 0.2,
          w / 2,
          h / 2,
          h * 0.8
        );
        grad.addColorStop(0, `rgba(120, 15, 20, 0)`);
        grad.addColorStop(1, `rgba(120, 15, 20, ${washAlpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      for (const d of drops) {
        d.vy += 0.35;
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.99;
        d.life++;
        const fade = Math.max(0, 1 - d.life / d.maxLife);
        if (fade <= 0) continue;
        ctx.fillStyle = `rgba(${140 + Math.random() * 30}, ${15 + Math.random() * 10}, ${20 + Math.random() * 10}, ${fade * 0.9})`;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r, d.r * (1 + d.vy * 0.05), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < 160) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    };
    loop();

    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
