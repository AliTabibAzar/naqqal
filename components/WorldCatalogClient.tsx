"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { World, WorldProgress } from "@/lib/types";
import { getWorldProgress } from "@/lib/progress";
import { getCover } from "@/lib/scene-manifest";

export default function WorldCatalogClient({ worlds }: { worlds: World[] }) {
  const [progressMap, setProgressMap] = useState<
    Record<string, WorldProgress>
  >({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const m: Record<string, WorldProgress> = {};
    for (const w of worlds) {
      const p = getWorldProgress(w.id);
      if (p) m[w.id] = p;
    }
    setProgressMap(m);
  }, [worlds]);

  if (worlds.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 font-display text-2xl text-gold">🌍 دنیاها</h2>
      <p className="mb-6 -mt-4 text-sm text-bone-dim">
        وارد یک دنیا شو، شخصیت بساز و در اون زندگی کن.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {worlds.map((world, i) => {
          const wp = mounted ? progressMap[world.id] : null;
          const chaptersDone = wp
            ? wp.completedEndings.filter((e) =>
                world.chapters.some((c) => e.startsWith(`${c.id}:`))
              ).length
            : 0;
          const cover = getCover(world.id);

          return (
            <Link
              key={world.id}
              href={`/world/${world.id}`}
              className="group relative overflow-hidden rounded-2xl border border-magic/30 bg-panel/50 p-6 transition-all duration-300 hover:border-magic/60 hover:shadow-[0_0_40px_rgba(147,111,227,0.15)] anim-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity group-hover:opacity-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(ellipse at 70% 20%, #2a1f45 0%, #141b2d 50%, #0a0e1a 100%)",
                  }}
                />
              )}
              <div className="relative">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-magic/40 px-2.5 py-0.5 text-[11px] text-magic">
                    دنیا
                  </span>
                  {world.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gold/20 px-2.5 py-0.5 text-[11px] text-gold/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-3xl text-gold group-hover:text-gold-bright transition-colors">
                  {world.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-dim line-clamp-2">
                  {world.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-bone-dim/70">
                    <span>{world.chapters.length} فصل</span>
                    {wp && (
                      <>
                        <span className="text-gold/40">·</span>
                        <span className="text-gold">
                          {wp.character.name}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="rounded-full bg-magic/10 px-4 py-1.5 text-sm text-magic transition-colors group-hover:bg-magic/20">
                    {wp ? "ادامه ←" : "ورود ←"}
                  </span>
                </div>

                {mounted && wp && (
                  <p className="mt-3 text-[11px] text-bone-dim/60">
                    {chaptersDone}/{world.chapters.length} پایان ·{" "}
                    {wp.deathCount} مرگ
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
