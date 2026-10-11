"use client";

import { useEffect, useRef } from "react";
import type { ParticleKind } from "@/lib/types";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue?: number;
}

const CONFIG: Record<
  Exclude<ParticleKind, "none" | undefined>,
  {
    count: number;
    color: (p: P) => string;
    update: (p: P, w: number, h: number, t: number) => void;
    spawn: (w: number, h: number, t: number) => P;
    globalAlpha: number;
  }
> = {
  embers: {
    count: 60,
    globalAlpha: 0.8,
    color: () => `hsla(${35 + Math.random() * 15}, 90%, 60%, 1)`,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: h + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.6 - Math.random() * 1.2,
      life: 0,
      maxLife: 120 + Math.random() * 120,
      size: 1 + Math.random() * 2,
      hue: 35 + Math.random() * 15,
    }),
    update: (p, _w, _h, t) => {
      p.x += p.vx + Math.sin((t + p.y) * 0.02) * 0.3;
      p.y += p.vy;
      p.vy *= 0.995;
    },
  },
  dust: {
    count: 50,
    globalAlpha: 0.4,
    color: () => "hsla(40, 20%, 70%, 1)",
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      life: 0,
      maxLife: 200 + Math.random() * 200,
      size: 0.5 + Math.random() * 1.5,
    }),
    update: (p, _w, _h, t) => {
      p.x += p.vx + Math.sin(t * 0.01 + p.y) * 0.1;
      p.y += p.vy + Math.cos(t * 0.01 + p.x) * 0.05;
    },
  },
  snow: {
    count: 80,
    globalAlpha: 0.7,
    color: () => "hsla(210, 20%, 95%, 1)",
    spawn: (w) => ({
      x: Math.random() * w,
      y: -10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.6 + Math.random() * 1.2,
      life: 0,
      maxLife: 400,
      size: 1 + Math.random() * 2.5,
    }),
    update: (p, _w, _h, t) => {
      p.x += p.vx + Math.sin(t * 0.02 + p.y * 0.1) * 0.5;
      p.y += p.vy;
    },
  },
  rain: {
    count: 120,
    globalAlpha: 0.5,
    color: () => "hsla(210, 40%, 70%, 1)",
    spawn: (w) => ({
      x: Math.random() * w,
      y: -20,
      vx: -0.5,
      vy: 8 + Math.random() * 6,
      life: 0,
      maxLife: 120,
      size: 1,
    }),
    update: (p) => {
      p.x += p.vx;
      p.y += p.vy;
    },
  },
  sparkle: {
    count: 45,
    globalAlpha: 0.9,
    color: (p) => `hsla(${260 + (p.hue ?? 0)}, 70%, 75%, 1)`,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 60 + Math.random() * 80,
      size: 1 + Math.random() * 2,
      hue: Math.random() * 40,
    }),
    update: (p) => {
      p.vy += Math.sin(p.life * 0.1) * 0.01;
      p.x += p.vx;
      p.y += p.vy;
    },
  },
};

export default function ParticleCanvas({
  kind,
  className = "",
}: {
  kind?: ParticleKind;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!kind || kind === "none") return;
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = CONFIG[kind];
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    // موبایل: DPR کمتر + ذرات کمتر (متناسب با مساحت صفحه)
    const smallScreen = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, smallScreen ? 1.5 : 2);
    const count = smallScreen
      ? Math.max(12, Math.floor(cfg.count / 4))
      : cfg.count;
    const parts: P[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      const p = cfg.spawn(w, h, t);
      p.life = Math.random() * p.maxLife;
      parts.push(p);
    }

    const loop = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = cfg.globalAlpha;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        cfg.update(p, w, h, t);
        p.life++;
        if (
          p.life > p.maxLife ||
          p.y > h + 50 ||
          p.y < -50 ||
          p.x < -50 ||
          p.x > w + 50
        ) {
          parts[i] = cfg.spawn(w, h, t);
          continue;
        }
        const fade = Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.globalAlpha = cfg.globalAlpha * fade;
        ctx.fillStyle = cfg.color(p);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [kind]);

  if (!kind || kind === "none") return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-10 ${className}`}
    />
  );
}
