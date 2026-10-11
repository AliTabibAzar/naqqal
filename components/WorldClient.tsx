"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { World, WorldProgress } from "@/lib/types";
import { getWorldProgress } from "@/lib/progress";
import { getCover } from "@/lib/scene-manifest";
import { playClick } from "@/lib/audio";

export default function WorldClient({ world }: { world: World }) {
  const [wp, setWp] = useState<WorldProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const cover = getCover(world.id);

  useEffect(() => {
    setMounted(true);
    setWp(getWorldProgress(world.id));
  }, [world.id]);

  const origin = wp
    ? world.origins.find((o) => o.id === wp.character.originId)
    : null;
  const trait = wp
    ? world.traits.find((t) => t.id === wp.character.traitId)
    : null;

  // فصلی که الان می‌تونه بازی کنه (آخرین فصل باز)
  const activeChapter =
    wp && world.chapters[wp.currentChapter]
      ? world.chapters[wp.currentChapter]
      : null;

  return (
    <div className="relative min-h-screen">
      {/* پس‌زمینه‌ی دنیا */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-panel via-void to-void"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.08),transparent_60%)]"
      />

      <main className="relative z-10 mx-auto max-w-2xl px-5 py-10">
        <Link
          href="/"
          onClick={() => playClick()}
          className="mb-8 inline-block rounded-full border border-line px-4 py-2 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors"
        >
          ← همه‌ی دنیاها
        </Link>

        <header className="mb-8 text-center">
          {cover && (
            <div className="relative mx-auto mb-6 h-48 overflow-hidden rounded-2xl border border-line md:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt=""
                className="h-full w-full object-cover opacity-70"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
            </div>
          )}
          <h1 className="font-display text-4xl text-gold md:text-5xl">
            {world.title}
          </h1>
          <p className="mt-3 text-bone-dim">{world.description}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {world.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 text-xs text-bone-dim"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* مقدمه‌ی دنیا */}
        <section className="mb-10 rounded-2xl border border-line bg-panel/40 p-6">
          <h2 className="mb-4 font-display text-xl text-gold">درباره‌ی دنیا</h2>
          <div className="space-y-3 text-sm leading-7 text-bone-dim">
            {world.lore.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* شخصیت من */}
        {mounted && wp && (
          <section className="mb-10 rounded-2xl border border-gold/30 bg-gold/5 p-6">
            <h2 className="mb-4 font-display text-xl text-gold">شخصیت تو</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-bone-dim">نام: </span>
                <span className="text-bone">{wp.character.name}</span>
              </p>
              {origin && (
                <p>
                  <span className="text-bone-dim">خاستگاه: </span>
                  <span className="text-bone">{origin.name}</span>
                </p>
              )}
              {trait && (
                <p>
                  <span className="text-bone-dim">ویژگی: </span>
                  <span className="text-bone">{trait.name}</span>
                </p>
              )}
              <p className="text-xs text-bone-dim/70">
                پایان‌های کشف‌شده: {wp.completedEndings.length} · مرگ‌ها:{" "}
                {wp.deathCount}
              </p>
            </div>
            <Link
              href={`/world/${world.id}/create`}
              onClick={() => playClick()}
              className="mt-4 inline-block rounded-full border border-line px-4 py-1.5 text-xs text-bone-dim hover:border-line-strong hover:text-gold transition-colors"
            >
              شخصیت جدید بساز
            </Link>
          </section>
        )}

        {/* فصل‌ها */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl text-gold">فصل‌ها</h2>
          <div className="space-y-3">
            {world.chapters.map((ch, i) => {
              const unlocked = !wp || i <= wp.currentChapter;
              const done =
                wp &&
                wp.completedEndings.some((e) => e.startsWith(`${ch.id}:`));
              const isActive = wp && i === wp.currentChapter;
              return (
                <div
                  key={ch.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    unlocked
                      ? isActive
                        ? "border-gold/50 bg-gold/10"
                        : "border-line bg-panel/60"
                      : "border-line/30 bg-panel/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-bone-dim">
                        فصل {i + 1}
                      </span>
                      <p className="font-display text-lg text-bone">
                        {ch.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {done && (
                        <span className="text-xs text-gold">✓ کامل</span>
                      )}
                      {unlocked && !done && (
                        <Link
                          href={`/story/${ch.storyId}`}
                          onClick={() => playClick()}
                          className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-gold hover:bg-gold/20 transition-colors"
                        >
                          {isActive || !wp ? "شروع" : "ادامه"}
                        </Link>
                      )}
                      {!unlocked && (
                        <span className="text-xs text-bone-dim/50">🔒 قفل</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* دکمه‌ی ساخت شخصیت / ادامه */}
        {mounted && (
          <div className="flex flex-col gap-3">
            {!wp ? (
              <Link
                href={`/world/${world.id}/create`}
                onClick={() => playClick()}
                className="rounded-xl border border-gold/50 bg-gold/15 p-4 text-center text-gold hover:bg-gold/25 transition-colors"
              >
                ساخت شخصیت و ورود به دنیا
              </Link>
            ) : activeChapter ? (
              <Link
                href={`/story/${activeChapter.storyId}`}
                onClick={() => playClick()}
                className="rounded-xl border border-gold/50 bg-gold/15 p-4 text-center text-gold hover:bg-gold/25 transition-colors"
              >
                ادامه‌ی {activeChapter.title} ←
              </Link>
            ) : (
              <p className="text-center text-sm text-bone-dim">
                همه‌ی فصل‌ها رو تموم کردی! 🎉
              </p>
            )}
          </div>
        )}

        {!mounted && (
          <p className="text-center text-sm text-bone-dim">در حال بارگذاری...</p>
        )}
      </main>
    </div>
  );
}
