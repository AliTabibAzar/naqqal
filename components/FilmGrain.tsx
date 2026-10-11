"use client";

import { useEffect, useState } from "react";

/**
 * دانه‌ی فیلم سینمایی — لایه‌ی SVG با feTurbulence.
 * روی کل صفحه overlay می‌شه و به‌صورت تصادفی jitter می‌کنه.
 * با prefers-reduced-motion غیرفعال می‌شه.
 */
export default function FilmGrain({ enabled = true }: { enabled?: boolean }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!enabled || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay">
      <svg className="h-full w-full opacity-[0.07] anim-grain">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
}
