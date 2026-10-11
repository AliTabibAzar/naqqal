"use client";

import { useEffect, useState } from "react";

const GLITCH_POOL = "ءؤإأآةىئﻻ#@&%$!?؟ـ";

export default function GlitchText({
  text,
  enabled,
  className = "",
}: {
  text: string;
  enabled: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!enabled) {
      setDisplay(text);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    let alive = true;
    const glitchBurst = () => {
      if (!alive) return;
      // چند کاراکتر رو موقتاً خراب کن
      const chars = text.split("");
      const count = 2 + Math.floor(Math.random() * 4);
      const idxs = new Set<number>();
      while (idxs.size < count && idxs.size < chars.length) {
        idxs.add(Math.floor(Math.random() * chars.length));
      }
      const broken = chars.map((ch, i) => {
        if (idxs.has(i) && ch.trim()) {
          return GLITCH_POOL[Math.floor(Math.random() * GLITCH_POOL.length)];
        }
        return ch;
      });
      setDisplay(broken.join(""));
      setTimeout(() => {
        if (alive) setDisplay(text);
      }, 90);
      setTimeout(glitchBurst, 2500 + Math.random() * 4000);
    };
    const first = setTimeout(glitchBurst, 1200);

    return () => {
      alive = false;
      clearTimeout(first);
      setDisplay(text);
    };
  }, [text, enabled]);

  if (!enabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`${className} glitch-on`} aria-label={text}>
      {display}
    </span>
  );
}
