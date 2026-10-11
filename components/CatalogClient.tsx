"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Story } from "@/lib/types";
import { getProgress } from "@/lib/progress";
import { countEndings, getEndings } from "@/lib/story";
import { getCover } from "@/lib/scene-manifest";

export default function CatalogClient({ stories }: { stories: Story[] }) {
  const [progressMap, setProgressMap] = useState<
    Record<string, { currentNode: string; completedEndings: string[] }>
  >({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const m: Record<string, { currentNode: string; completedEndings: string[] }> = {};
    for (const s of stories) {
      const p = getProgress(s.id);
      if (p) m[s.id] = { currentNode: p.currentNode, completedEndings: p.completedEndings };
    }
    setProgressMap(m);
  }, [stories]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {stories.map((story, i) => {
        const prog = mounted ? progressMap[story.id] : null;
        const total = countEndings(story);
        const found = prog?.completedEndings.length ?? 0;
        const started = Boolean(prog && prog.currentNode && prog.currentNode !== story.startNode) ||
          (prog?.completedEndings.length ?? 0) > 0;
        const allEndings = getEndings(story);
        const cover = getCover(story.id);

        return (
          <Link
            key={story.id}
            href={`/story/${story.id}`}
            className="group relative overflow-hidden rounded-2xl border border-line bg-panel/50 p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_40px_rgba(212,168,83,0.12)] anim-fade-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* cover image or gradient fallback */}
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
                    "radial-gradient(ellipse at 30% 20%, #2a1f45 0%, #141b2d 50%, #0a0e1a 100%)",
                }}
              />
            )}
            <div className="relative">
              <div className="mb-3 flex flex-wrap gap-2">
                {story.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gold/20 px-2.5 py-0.5 text-[11px] text-gold/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-3xl text-gold group-hover:text-gold-bright transition-colors">
                {story.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-bone-dim line-clamp-3">
                {story.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-bone-dim/70">
                  <span>{Object.keys(story.nodes).length} صحنه</span>
                  <span className="text-gold/40">·</span>
                  <span>{total} پایان</span>
                  {found > 0 && (
                    <>
                      <span className="text-gold/40">·</span>
                      <span className="text-gold">
                        {found}/{total} کشف‌شده
                      </span>
                    </>
                  )}
                </div>
                <span className="rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold transition-colors group-hover:bg-gold/20">
                  {started ? "ادامه ←" : "شروع ←"}
                </span>
              </div>

              {/* endings preview */}
              {mounted && found > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {allEndings.map((e) => {
                    const has = (prog?.completedEndings ?? []).includes(e.id);
                    return (
                      <span
                        key={e.id}
                        title={has ? e.title : "کشف‌نشده"}
                        className={`rounded px-2 py-0.5 text-[10px] ${
                          has
                            ? e.good
                              ? "bg-gold/20 text-gold"
                              : "bg-blood/20 text-blood"
                            : "bg-panel text-bone-dim/40"
                        }`}
                      >
                        {has ? e.title : "؟"}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
