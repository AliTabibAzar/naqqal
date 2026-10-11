"use client";

import { useEffect, useRef, useState } from "react";
import type { Tint, ParticleKind } from "@/lib/types";

const GRADIENTS: Record<string, string> = {
  default:
    "radial-gradient(ellipse at 30% 20%, #1a2338 0%, #0a0e1a 55%, #05070f 100%)",
  cave: "radial-gradient(ellipse at 50% 80%, #141b2d 0%, #0a0e1a 45%, #03050c 100%)",
  magic: "radial-gradient(ellipse at 50% 40%, #2a1f45 0%, #140f28 50%, #05070f 100%)",
  blood: "radial-gradient(ellipse at 50% 30%, #3a1218 0%, #1a0a10 50%, #05070f 100%)",
  fear: "radial-gradient(ellipse at 50% 50%, #1a0a14 0%, #0a0610 50%, #05070f 100%)",
  cold: "radial-gradient(ellipse at 40% 30%, #12253a 0%, #0a1420 50%, #05070f 100%)",
  embers:
    "radial-gradient(ellipse at 50% 90%, #3a2410 0%, #1a1208 45%, #05070f 100%)",
};

function pickGradient(tint?: Tint, particles?: ParticleKind) {
  if (tint === "magic") return GRADIENTS.magic;
  if (tint === "blood") return GRADIENTS.blood;
  if (tint === "fear") return GRADIENTS.fear;
  if (tint === "cold") return GRADIENTS.cold;
  if (particles === "embers") return GRADIENTS.embers;
  return GRADIENTS.default;
}

const CROSSFADE_MS = 1200;

export default function BackgroundArt({
  tint,
  particles,
  image,
  video,
}: {
  tint?: Tint;
  particles?: ParticleKind;
  image?: string;
  video?: string;
}) {
  const grad = pickGradient(tint, particles);

  // لایه‌ی فعلی و قبلی برای crossfade
  const [layers, setLayers] = useState<
    { src?: string; kind: "image" | "video" | "none"; id: number }[]
  >([{ kind: "none", id: 0 }]);
  const layerId = useRef(0);

  const [failed, setFailed] = useState<Set<string>>(new Set());

  const src = video ?? image;
  const kind: "image" | "video" | "none" = src
    ? video
      ? "video"
      : "image"
    : "none";

  useEffect(() => {
    if (src && failed.has(src)) return;
    const prev = layers[0];
    const currentSrc = prev.kind !== "none" ? undefined : src;
    // اگه تغییر کرده، لایه‌ی جدید اضافه کن
    if (prev.src !== src || (prev.kind === "none" && kind !== "none")) {
      layerId.current += 1;
      const newLayer = { src, kind, id: layerId.current };
      setLayers((ls) => [newLayer, ...ls].slice(0, 2));
    }
    void currentSrc;
  }, [src, kind, failed, layers]);

  // پاک کردن لایه‌ی قدیمی بعد از crossfade
  useEffect(() => {
    if (layers.length < 2) return;
    const t = setTimeout(() => {
      setLayers((ls) => ls.slice(0, 1));
    }, CROSSFADE_MS + 100);
    return () => clearTimeout(t);
  }, [layers]);

  const markFailed = (s: string) => {
    setFailed((f) => new Set(f).add(s));
    // اگه لایه‌ی بالایی خراب بود، حذفش کن
    setLayers((ls) => {
      const top = ls[0];
      if (top?.src === s) return ls.slice(1);
      return ls;
    });
  };

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      {/* base code-art gradient — همیشه زیر تصویر، به‌عنوان fallback */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: grad }}
      />

      {/* لایه‌های رسانه با crossfade */}
      {layers.map((layer, i) => {
        if (layer.kind === "none" || !layer.src) return null;
        const isTop = i === 0;
        return (
          <div
            key={layer.id}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isTop ? 1 : 0,
              transitionDuration: `${CROSSFADE_MS}ms`,
            }}
          >
            {layer.kind === "video" ? (
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-45"
                src={layer.src}
                autoPlay
                loop
                muted
                playsInline
                onError={() => markFailed(layer.src!)}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={layer.src}
                alt=""
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-55"
                onError={() => markFailed(layer.src!)}
              />
            )}
          </div>
        );
      })}

      {/* dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/35" />
      {/* subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,15,0.55) 100%)",
        }}
      />
    </div>
  );
}
