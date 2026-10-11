"use client";

import { useEffect, useRef, useState } from "react";

const GLITCH_POOL = "ءؤإأآةىئ#@&%$!?؟ـ}{";

function glitchString(s: string, count: number): string {
  const chars = s.split("");
  const idxs = new Set<number>();
  while (idxs.size < count && idxs.size < chars.length) {
    idxs.add(Math.floor(Math.random() * chars.length));
  }
  return chars
    .map((ch, i) =>
      idxs.has(i) && ch.trim()
        ? GLITCH_POOL[Math.floor(Math.random() * GLITCH_POOL.length)]
        : ch
    )
    .join("");
}

export default function Typewriter({
  text,
  speed = 18,
  onDone,
  className = "",
  glitch = false,
  adrenaline = false,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
  glitch?: boolean;
  adrenaline?: boolean;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const onDoneRef = useRef(onDone);
  const glitchRef = useRef(glitch);
  glitchRef.current = glitch;

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setShown("");
    setDone(false);
    idx.current = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveSpeed = adrenaline ? Math.max(6, speed * 0.5) : speed;

    if (reduced) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const elapsed = now - last;
      if (elapsed >= effectiveSpeed) {
        // catch-up زمانی: اگه فریم افتاده، چند کاراکتر جلو می‌پریم
        // تا سرعت wall-clock ثابت بمونه (مهم برای گوشی‌های کند)
        const steps = Math.min(
          Math.floor(elapsed / effectiveSpeed),
          text.length - idx.current
        );
        if (steps > 0) {
          last += steps * effectiveSpeed;
          idx.current += steps;
          setShown(text.slice(0, idx.current));
        }
        if (idx.current >= text.length) {
          setDone(true);
          onDoneRef.current?.();
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, speed, adrenaline]);

  // گلیچ متناوب بعد از اتمام تایپ
  useEffect(() => {
    if (!glitch || !done) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const burst = () => {
      if (!alive || !glitchRef.current) return;
      setShown(glitchString(text, 3));
      setTimeout(() => {
        if (alive) setShown(text);
      }, 80);
      setTimeout(burst, 2000 + Math.random() * 4500);
    };
    const t = setTimeout(burst, 900);
    return () => {
      alive = false;
      clearTimeout(t);
      setShown(text);
    };
  }, [glitch, done, text]);

  const skip = () => {
    if (done) return;
    setShown(text);
    setDone(true);
    onDoneRef.current?.();
  };

  return (
    <div onClick={skip} className={`cursor-pointer ${className}`}>
      <p
        className={`whitespace-pre-wrap leading-loose text-lg md:text-xl text-bone/95 ${
          adrenaline ? "anim-shake-fast" : ""
        }`}
        style={
          adrenaline
            ? { textShadow: "0 0 8px rgba(196,78,82,0.4)" }
            : undefined
        }
      >
        {shown}
        {!done && (
          <span className="inline-block w-2 h-5 bg-gold/70 align-middle animate-pulse" />
        )}
      </p>
      {!done && (
        <p className="mt-3 text-xs text-bone-dim/60">برای رد شدن کلیک کن</p>
      )}
    </div>
  );
}
