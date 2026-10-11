"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { World } from "@/lib/types";
import { createWorldProgress, getWorldProgress } from "@/lib/progress";
import { playClick, playWin } from "@/lib/audio";

const PRONOUNS = [
  { id: "male", label: "مرد" },
  { id: "female", label: "زن" },
  { id: "neutral", label: "خنثی / دوستانه" },
] as const;

export default function CharacterCreator({ world }: { world: World }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState<string>("neutral");
  const [originId, setOriginId] = useState<string | null>(null);
  const [traitId, setTraitId] = useState<string | null>(null);
  const [existing, setExisting] = useState(false);

  useEffect(() => {
    setExisting(getWorldProgress(world.id) !== null);
  }, [world.id]);

  const canSubmit =
    name.trim().length >= 2 && originId !== null && traitId !== null;

  const submit = () => {
    if (!canSubmit || !originId || !traitId) return;
    playWin();
    createWorldProgress(world.id, {
      name: name.trim(),
      pronouns: pronoun as "male" | "female" | "neutral",
      originId,
      traitId,
    });
    router.push(`/world/${world.id}`);
  };

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-panel via-void to-void"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.08),transparent_60%)]"
      />

      <main className="relative z-10 mx-auto max-w-2xl px-5 py-10">
        <a
          href={`/world/${world.id}`}
          onClick={() => playClick()}
          className="mb-8 inline-block rounded-full border border-line px-4 py-2 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors"
        >
          ← {world.title}
        </a>

        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl text-gold md:text-4xl">
            ساخت شخصیت
          </h1>
          <p className="mt-2 text-sm text-bone-dim">
            {existing
              ? "یه شخصیت جدید می‌سازی — پیشرفت قبلی جایگزین می‌شه."
              : "اولین ساکن این دنیا تویی."}
          </p>
        </header>

        <div className="space-y-8">
          {/* نام */}
          <section>
            <label className="mb-2 block text-sm text-bone-dim" htmlFor="char-name">
              نام
            </label>
            <input
              id="char-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="مثلاً: آرمان"
              className="w-full rounded-xl border border-line bg-panel/60 px-4 py-3 text-bone placeholder:text-bone-dim/50 focus:border-gold/50 focus:outline-none"
            />
          </section>

          {/* ضمیر */}
          <section>
            <p className="mb-2 text-sm text-bone-dim">ضمیر</p>
            <div className="flex flex-wrap gap-2">
              {PRONOUNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { playClick(); setPronoun(p.id); }}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors cursor-pointer ${
                    pronoun === p.id
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-line text-bone-dim hover:border-line-strong"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* خاستگاه */}
          <section>
            <p className="mb-2 text-sm text-bone-dim">خاستگاه</p>
            <div className="grid gap-3">
              {world.origins.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { playClick(); setOriginId(o.id); }}
                  className={`rounded-xl border p-4 text-right transition-all duration-200 cursor-pointer ${
                    originId === o.id
                      ? "border-gold/50 bg-gold/10 shadow-[0_0_15px_rgba(212,168,83,0.1)]"
                      : "border-line bg-panel/40 hover:border-line-strong"
                  }`}
                >
                  <p className="font-display text-lg text-bone">{o.name}</p>
                  <p className="mt-1 text-sm text-bone-dim">{o.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* ویژگی */}
          <section>
            <p className="mb-2 text-sm text-bone-dim">ویژگی بارز</p>
            <div className="grid gap-3">
              {world.traits.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { playClick(); setTraitId(t.id); }}
                  className={`rounded-xl border p-4 text-right transition-all duration-200 cursor-pointer ${
                    traitId === t.id
                      ? "border-gold/50 bg-gold/10 shadow-[0_0_15px_rgba(212,168,83,0.1)]"
                      : "border-line bg-panel/40 hover:border-line-strong"
                  }`}
                >
                  <p className="font-display text-lg text-bone">{t.name}</p>
                  <p className="mt-1 text-sm text-bone-dim">{t.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* دکمه‌ی ثبت */}
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={`w-full rounded-xl border p-4 font-display text-lg transition-colors ${
              canSubmit
                ? "border-gold/50 bg-gold/15 text-gold hover:bg-gold/25 cursor-pointer"
                : "border-line/30 bg-panel/20 text-bone-dim/50 cursor-not-allowed"
            }`}
          >
            ورود به {world.title}
          </button>
        </div>
      </main>
    </div>
  );
}
