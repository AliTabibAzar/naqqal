"use client";

import { useEffect, useRef, useState } from "react";

export default function TorchLight({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // روی تاچ، ماسک تاریکیِ دنبال‌کننده‌ی انگشت بی‌فایده و پرهزینه‌ست
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || isTouch) return;
    const el = ref.current;
    if (!el) return;

    const move = (x: number, y: number) => {
      el.style.setProperty("--tx", `${x}px`);
      el.style.setProperty("--ty", `${y}px`);
    };

    const onMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };

    // شروع از وسط
    move(window.innerWidth / 2, window.innerHeight / 3);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [enabled, isTouch]);

  if (!enabled || isTouch) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{
        background:
          "radial-gradient(circle 240px at var(--tx, 50%) var(--ty, 35%), transparent 0%, transparent 35%, rgba(3, 5, 12, 0.75) 100%)",
        transition: "background 120ms linear",
      }}
    />
  );
}
