"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Library, Story } from "@/lib/types";
import { loadLibrary, ACHIEVEMENTS } from "@/lib/progress";
import { getAllStories, countEndings, getEndings } from "@/lib/story";
import { getAllWorlds } from "@/lib/world";

export default function LibraryPage() {
  const [lib, setLib] = useState<Library | null>(null);
  const [mounted, setMounted] = useState(false);
  const stories: Story[] = getAllStories();
  const worlds = getAllWorlds();

  useEffect(() => {
    setMounted(true);
    setLib(loadLibrary());
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, #1a2338 0%, #0a0e1a 55%, #05070f 100%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-gold/70">کتابخانه‌ی من</p>
            <h1 className="font-display text-4xl text-gold">پیشرفت‌ها</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-line px-4 py-2 text-sm text-bone-dim hover:border-gold/40 hover:text-gold transition-colors"
          >
            ← کاتالوگ
          </Link>
        </header>

        {!mounted || !lib ? (
          <p className="text-center text-bone-dim">در حال بارگذاری...</p>
        ) : (
          <div className="space-y-10">
            {/* worlds */}
            {worlds.length > 0 && (
              <section>
                <h2 className="mb-4 font-display text-2xl text-bone">دنیاها</h2>
                <div className="space-y-3">
                  {worlds.map((w) => {
                    const wp = lib.worlds[w.id];
                    const found = wp?.completedEndings.length ?? 0;
                    return (
                      <Link
                        key={w.id}
                        href={`/world/${w.id}`}
                        className="block rounded-xl border border-magic/30 bg-panel/50 p-4 transition-all hover:border-magic/60"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display text-xl text-gold">{w.title}</p>
                            <p className="mt-1 text-xs text-bone-dim">
                              {wp
                                ? `${wp.character.name} · فصل ${Math.min(wp.currentChapter + 1, w.chapters.length)}/${w.chapters.length}${wp.deathCount ? ` · ${wp.deathCount} مرگ` : ""}`
                                : "شخصیت ساخته‌نشده"}
                            </p>
                          </div>
                          <span className="text-magic/60">←</span>
                        </div>
                        {wp && found > 0 && (
                          <p className="mt-2 text-[11px] text-gold/70">
                            {found} پایان کشف‌شده
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* in-progress stories */}
            <section>
              <h2 className="mb-4 font-display text-2xl text-bone">داستان‌ها</h2>
              <div className="space-y-3">
                {stories.map((s) => {
                  const p = lib.stories[s.id];
                  const total = countEndings(s);
                  const found = p?.completedEndings.length ?? 0;
                  const hasProgress = Boolean(p && (p.history.length > 0 || found > 0));
                  return (
                    <Link
                      key={s.id}
                      href={`/story/${s.id}`}
                      className="block rounded-xl border border-line bg-panel/50 p-4 transition-all hover:border-gold/40"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-display text-xl text-gold">{s.title}</p>
                          <p className="mt-1 text-xs text-bone-dim">
                            {hasProgress
                              ? `${found}/${total} پایان کشف‌شده${p?.deathCount ? ` · ${p.deathCount} مرگ` : ""}`
                              : "شروع‌نشده"}
                          </p>
                        </div>
                        <span className="text-gold/60">←</span>
                      </div>
                      {found > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {getEndings(s).map((e) => {
                            const has = (p?.completedEndings ?? []).includes(e.id);
                            return (
                              <span
                                key={e.id}
                                className={`rounded px-2 py-0.5 text-[10px] ${
                                  has
                                    ? e.good
                                      ? "bg-gold/20 text-gold"
                                      : "bg-blood/20 text-blood"
                                    : "bg-void text-bone-dim/30"
                                }`}
                              >
                                {has ? e.title : "؟"}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* achievements */}
            <section>
              <h2 className="mb-4 font-display text-2xl text-bone">دستاوردها</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
                  const has = lib.achievements.includes(id);
                  return (
                    <div
                      key={id}
                      className={`rounded-xl border p-4 transition-all ${
                        has
                          ? "border-gold/40 bg-gold/10"
                          : "border-line bg-panel/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-2xl ${has ? "text-gold" : "text-bone-dim/40"}`}
                        >
                          {a.icon}
                        </span>
                        <div>
                          <p className={`font-display text-lg ${has ? "text-gold" : "text-bone-dim"}`}>
                            {a.title}
                          </p>
                          <p className="text-xs text-bone-dim/70">{a.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* stats */}
            <section className="rounded-xl border border-line bg-panel/30 p-5">
              <h2 className="mb-3 font-display text-xl text-bone">آمار کلی</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="font-display text-3xl text-gold">
                    {Object.keys(lib.stories).length + Object.keys(lib.worlds).length}
                  </p>
                  <p className="text-xs text-bone-dim">داستان/دنیا</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-gold">
                    {Object.values(lib.stories).reduce(
                      (a, s) => a + s.completedEndings.length,
                      0
                    ) +
                      Object.values(lib.worlds).reduce(
                        (a, s) => a + s.completedEndings.length,
                        0
                      )}
                  </p>
                  <p className="text-xs text-bone-dim">پایان کشف‌شده</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-blood">
                    {Object.values(lib.stories).reduce((a, s) => a + s.deathCount, 0) +
                      Object.values(lib.worlds).reduce((a, s) => a + s.deathCount, 0)}
                  </p>
                  <p className="text-xs text-bone-dim">مرگ</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-magic">
                    {Object.keys(lib.worlds).length}
                  </p>
                  <p className="text-xs text-bone-dim">شخصیت</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
