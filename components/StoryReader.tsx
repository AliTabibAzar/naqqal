"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Choice, Story, StoryNode } from "@/lib/types";
import BackgroundArt from "./BackgroundArt";
import ParticleCanvas from "./ParticleCanvas";
import BloodCanvas from "./BloodCanvas";
import Typewriter from "./Typewriter";
import RouteMap from "./RouteMap";
import EffectOverlay from "./EffectOverlay";
import TorchLight from "./TorchLight";
import HealthBar from "./HealthBar";
import FilmGrain from "./FilmGrain";
import {
  playClick,
  playSelect,
  playDeath,
  playWin,
  playAmbient,
  playDice,
  playSwordHit,
  playDrums,
} from "@/lib/audio";
import { playMusic, stopMusic } from "@/lib/music";
import SoundPanel from "./SoundPanel";
import {
  getProgress,
  updateProgress,
  recordEnding,
  registerDeath,
  getWorldProgress,
  recordWorldEnding,
  registerWorldDeath,
  updateWorldFlags,
  advanceWorldChapter,
} from "@/lib/progress";
import { interpolate, choiceAllowedByCharacter } from "@/lib/world";
import { getScene, getMusic } from "@/lib/scene-manifest";
import type { Character, World } from "@/lib/types";

const TINT_CLASS: Record<string, string> = {
  poison: "tint-poison",
  fear: "tint-fear",
  magic: "tint-magic",
  cold: "tint-cold",
  blood: "tint-blood",
};

const INTENSE_KEY = "shabake_intense_fx";

export default function StoryReader({
  story,
  world,
}: {
  story: Story;
  world?: World;
}) {
  const [nodeId, setNodeId] = useState<string>(story.startNode);
  const [flags, setFlags] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [deathCount, setDeathCount] = useState(0);
  const [dead, setDead] = useState(false);
  const [ending, setEnding] = useState<StoryNode["ending"] | null>(null);
  const [shake, setShake] = useState(false);
  const [bloodTrigger, setBloodTrigger] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [ttsOn, setTtsOn] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTitle, setShowTitle] = useState<string | null>(null);
  const [textDone, setTextDone] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const [intense, setIntense] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [showSoundPanel, setShowSoundPanel] = useState(false);
  const hydrated = useRef(false);
  const hydratedFx = useRef(false);

  const node = story.nodes[nodeId] ?? story.nodes[story.startNode];
  const fx = node.effects;
  const mood = node.mood;

  // تصویر/ویدیو: فیلد دستی گره اولویت داره، بعد manifest (auto-detection)
  const sceneMedia = getScene(story.id, nodeId);
  const sceneImage = node.image ?? sceneMedia?.image;
  const sceneVideo = node.video ?? sceneMedia?.video;

  // اگه این فصلی از یک دنیا باشه، فصل بعدی موجوده؟
  const chapterIndex = world
    ? world.chapters.findIndex((c) => c.storyId === story.id)
    : -1;
  const hasNextChapter =
    world !== undefined &&
    chapterIndex >= 0 &&
    chapterIndex < world.chapters.length - 1;
  const nextChapter = hasNextChapter ? world!.chapters[chapterIndex + 1] : null;

  // hydrate from localStorage once
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const saved = getProgress(story.id);
    if (saved && story.nodes[saved.currentNode]) {
      setNodeId(saved.currentNode);
      setFlags(saved.flags);
      setHistory(saved.history);
      setDeathCount(saved.deathCount);
    }
    // اگه فصلی از دنیاست، شخصیت و پرچم‌های مشترک رو هم لود کن
    if (world) {
      const wp = getWorldProgress(world.id);
      if (wp) {
        setCharacter(wp.character);
        // پرچم‌های دنیا رو با پرچم‌های این فصل ادغام کن (فقط برای شروع تازه)
        if (!saved || saved.history.length === 0) {
          setFlags((f) => Array.from(new Set([...wp.flags, ...f])));
        }
        setDeathCount(wp.deathCount);
      }
    }
  }, [story, world]);

  // persist
  useEffect(() => {
    if (!hydrated.current) return;
    updateProgress(story.id, nodeId, flags, history, deathCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, flags, history]);

  // title card on chapter change
  useEffect(() => {
    if (!node.titleCard) {
      // گره titleCard نداره — تیتر قبلی رو حتماً پاک کن (وگرنه گیر می‌کنه)
      setShowTitle(null);
      return;
    }
    setShowTitle(node.titleCard);
    const t = setTimeout(() => setShowTitle(null), 2600);
    return () => clearTimeout(t);
  }, [nodeId, node.titleCard]);

  // hydrate intense preference
  useEffect(() => {
    if (hydratedFx.current) return;
    hydratedFx.current = true;
    try {
      const saved = localStorage.getItem(INTENSE_KEY);
      if (saved !== null) setIntense(saved === "1");
    } catch {
      /* noop */
    }
  }, []);

  const toggleIntense = () => {
    setIntense((v) => {
      const nv = !v;
      try {
        localStorage.setItem(INTENSE_KEY, nv ? "1" : "0");
      } catch {
        /* noop */
      }
      playClick();
      return nv;
    });
  };

  // ambient audio با فشار
  useEffect(() => {
    if (!soundOn) {
      playAmbient("none");
      return;
    }
    playAmbient(node.ambient ?? "none", fx?.intensity ?? 0);
    return () => playAmbient("none");
  }, [node.ambient, soundOn, nodeId, fx?.intensity]);

  // موسیقی پس‌زمینه بر اساس mood (crossfade بین مودها)
  useEffect(() => {
    if (!soundOn) {
      stopMusic();
      return;
    }
    // اولویت: فایل اختصاصی nodeId، وگرنه mood
    const key = getMusic(story.id, nodeId) ? nodeId : (mood ?? "calm");
    void playMusic(story.id, key);
    return () => stopMusic();
  }, [soundOn, nodeId, mood, story.id]);

  // battle mood — طبل و ضربه‌ی شمشیر در ورود
  useEffect(() => {
    if (!soundOn || !intense) return;
    if (mood === "battle") {
      playDrums(2.5);
      const t = setTimeout(() => playSwordHit(), 700);
      return () => clearTimeout(t);
    }
  }, [nodeId, mood, soundOn, intense]);

  // shake
  useEffect(() => {
    if (node.shake || node.death) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 650);
      return () => clearTimeout(t);
    }
  }, [nodeId, node.shake, node.death]);

  // death handling
  useEffect(() => {
    if (node.death) {
      setDead(true);
      setDeathCount((d) => d + 1);
      registerDeath(story.id);
      if (world) registerWorldDeath(world.id);
      if (soundOn) playDeath();
      setBloodTrigger((b) => b + 1);
    } else {
      setDead(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  // ending handling
  useEffect(() => {
    if (node.ending) {
      setEnding(node.ending);
      recordEnding(story.id, node.ending.id);
      if (world && chapterIndex >= 0) {
        const chapter = world.chapters[chapterIndex];
        recordWorldEnding(world.id, chapter.id, node.ending.id);
        updateWorldFlags(world.id, flags);
      }
      if (soundOn) playWin();
    } else {
      setEnding(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  // TTS
  useEffect(() => {
    if (!ttsOn || typeof window === "undefined" || !("speechSynthesis" in window))
      return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      interpolate(node.text, character)
    );
    u.lang = "fa-IR";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [nodeId, ttsOn, node.text, character]);

  const available = useCallback(
    (c: Choice) => {
      if (c.requires?.flags && !c.requires.flags.every((f) => flags.includes(f)))
        return false;
      if (
        c.requires?.withoutFlags &&
        c.requires.withoutFlags.some((f) => flags.includes(f))
      )
        return false;
      if (!choiceAllowedByCharacter(c.requires, character)) return false;
      return true;
    },
    [flags, character]
  );

  const lockReason = (c: Choice) => {
    if (c.requires?.flags && !c.requires.flags.every((f) => flags.includes(f)))
      return "نیازمند پیش‌نیاز";
    if (
      c.requires?.withoutFlags &&
      c.requires.withoutFlags.some((f) => flags.includes(f))
    )
      return "قفل‌شده";
    if (!choiceAllowedByCharacter(c.requires, character))
      return "مخصوص شخصیت دیگه";
    return "";
  };

  const goTo = useCallback(
    (next: string, sets?: string[]) => {
      if (!story.nodes[next]) return;
      setHistory((h) => [...h, nodeId]);
      setNodeId(next);
      if (sets && sets.length) setFlags((f) => Array.from(new Set([...f, ...sets])));
    },
    [story.nodes, nodeId]
  );

  const handleChoose = useCallback(
    (c: Choice) => {
      if (!available(c)) return;
      if (soundOn) {
        if (intense && mood === "battle") playSwordHit();
        else playSelect();
      }

      if (c.dice) {
        setDiceRolling(true);
        setDiceResult(null);
        if (soundOn) playDice();
        setTimeout(() => {
          const roll = 1 + Math.floor(Math.random() * c.dice!.sides);
          setDiceResult(roll);
          setDiceRolling(false);
          setTimeout(() => {
            const target =
              roll >= c.dice!.difficulty ? c.dice!.success : c.dice!.fail;
            goTo(target, c.sets);
          }, 1100);
        }, 900);
        return;
      }

      goTo(c.next, c.sets);
    },
    [available, goTo, soundOn, intense, mood]
  );

  const handleChooseRef = useRef(handleChoose);
  handleChooseRef.current = handleChoose;

  // choice timer
  useEffect(() => {
    setTextDone(false);
    setDiceResult(null);
    if (node.timer && node.choices.length > 0 && !node.death && !node.ending) {
      setTimerLeft(node.timer);
      const iv = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(iv);
            // auto-pick first available
            handleChooseRef.current(node.choices[0]);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(iv);
    } else {
      setTimerLeft(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  const restart = () => {
    if (soundOn) playClick();
    setNodeId(story.startNode);
    setFlags([]);
    setHistory([]);
    setDead(false);
    setEnding(null);
    updateProgress(story.id, story.startNode, [], [], deathCount);
  };

  const tintClass = node.tint ? TINT_CLASS[node.tint] : "";

  return (
    <div className={`relative min-h-screen ${shake ? "anim-shake" : ""} ${hydrated.current ? "" : "anim-opening"}`}>
      <BackgroundArt
        tint={node.tint}
        particles={node.particles}
        image={sceneImage}
        video={sceneVideo}
      />
      <ParticleCanvas kind={node.particles} />
      {tintClass && (
        <div aria-hidden className={`pointer-events-none fixed inset-0 z-10 ${tintClass}`} />
      )}
      <BloodCanvas trigger={bloodTrigger} />
      <EffectOverlay effects={fx} intense={intense && soundOn} nodeKey={nodeId} />
      <TorchLight enabled={intense && Boolean(fx?.torchlight) && !ending} />
      <FilmGrain enabled={intense && soundOn} />

      {/* header controls */}
      <header className="relative z-30 flex items-center justify-between px-4 py-3 md:px-8">
          <button
            onClick={() => {
              playClick();
              window.history.back();
            }}
            className="rounded-full border border-line px-4 py-2 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
          >
            بازگشت
          </button>
          {character && (
            <div className="hidden md:flex items-center gap-2 rounded-full border border-gold/30 bg-panel/60 px-4 py-1.5 text-xs text-gold/90">
              <span className="text-gold/50">☺</span>
              <span>{character.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playClick(); setShowSoundPanel(true); }}
              aria-label="تنظیمات صدا"
              className="rounded-full border border-line px-3 py-2 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
            >
              ⚙️
            </button>
            <button
              onClick={() => { playClick(); setSoundOn((s) => !s); }}
            aria-label={soundOn ? "قطع صدا" : "پخش صدا"}
            className={`rounded-full border px-3 py-2 text-sm transition-colors cursor-pointer ${
              soundOn ? "border-gold/40 text-gold" : "border-line text-bone-dim"
            }`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => { playClick(); setTtsOn((s) => !s); }}
            aria-label="گوینده"
            className={`rounded-full border px-3 py-2 text-sm transition-colors cursor-pointer ${
              ttsOn ? "border-gold/40 text-gold" : "border-line text-bone-dim"
            }`}
          >
            {ttsOn ? "گوینده روشن" : "گوینده"}
          </button>
          <button
            onClick={toggleIntense}
            aria-label={intense ? "غلطاندن جلوه‌های شدید" : "روشن کردن جلوه‌های شدید"}
            aria-pressed={intense}
            className={`rounded-full border px-3 py-2 text-sm transition-colors cursor-pointer ${
              intense ? "border-blood/50 text-blood" : "border-line text-bone-dim"
            }`}
            title={intense ? "جلوه‌های شدید روشن" : "جلوه‌های شدید خاموش"}
          >
            {intense ? "شدید" : "ملایم"}
          </button>
          <button
            onClick={() => { playClick(); setShowMap((s) => !s); }}
            className="rounded-full border border-line px-3 py-2 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
          >
            نقشه
          </button>
          <button
            onClick={restart}
            className="rounded-full border border-line px-3 py-2 text-sm text-bone-dim hover:border-blood/50 hover:text-blood transition-colors cursor-pointer"
          >
            شروع دوباره
          </button>
        </div>
      </header>

      {/* title card — با کلیک هم بسته می‌شه */}
      {showTitle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 anim-fade-in cursor-pointer"
          onClick={() => setShowTitle(null)}
        >
          <h2 className="anim-title font-display text-4xl md:text-6xl text-gold text-center px-6">
            {showTitle}
          </h2>
        </div>
      )}

      {/* sound settings panel */}
      <SoundPanel open={showSoundPanel} onClose={() => setShowSoundPanel(false)} />

      {/* dice overlay */}
      {diceRolling && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/80 anim-fade-in">
          <div className="text-7xl font-display text-gold animate-bounce">🎲</div>
          <p className="mt-4 text-bone-dim">در حال تاس‌ریزی...</p>
        </div>
      )}
      {diceResult !== null && !diceRolling && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/80 anim-fade-in">
          <div className="text-7xl font-display text-gold">{diceResult}</div>
          <p className="mt-4 text-bone-dim">
            {diceResult >= (node.choices.find((c) => c.dice)?.dice?.difficulty ?? 99)
              ? "موفقیت!"
              : "شکست..."}
          </p>
        </div>
      )}

      {/* map */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-void/95 p-4 overflow-auto anim-fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-2xl text-gold">نقشه‌ی مسیر</h3>
              <button
                onClick={() => setShowMap(false)}
                className="rounded-full border border-line px-4 py-2 text-bone-dim hover:text-gold cursor-pointer"
              >
                بستن
              </button>
            </div>
            <RouteMap story={story} history={history} current={nodeId} />
          </div>
        </div>
      )}

      {/* content */}
      <main className="relative z-20 mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-2xl flex-col justify-center px-5 pb-16 pt-6">
        {node.chapter && (
          <p className="mb-3 text-center text-xs tracking-widest text-gold/70">
            {node.chapter}
          </p>
        )}

        {/* death / ending state */}
        {dead && (
          <div className="mb-6 rounded-2xl border border-blood/40 bg-blood/10 p-5 text-center anim-fade-in">
            <p className="font-display text-3xl text-blood">مردی</p>
            <p className="mt-2 text-sm text-bone-dim">
              تعداد مرگ‌ها: {deathCount} — هر مرگ یه درس است
            </p>
          </div>
        )}

        {ending && (
          <div
            className={`mb-6 rounded-2xl border p-6 text-center anim-fade-in ${
              ending.good
                ? "border-gold/40 bg-gold/10"
                : "border-blood/40 bg-blood/10"
            }`}
          >
            <p className="text-xs tracking-widest text-bone-dim">
              {ending.good ? "پایان خوب" : "پایان تلخ"}
            </p>
            <p className="mt-1 font-display text-3xl text-gold">{ending.title}</p>
          </div>
        )}

        {typeof fx?.lowHealth === "number" && (
          <HealthBar value={fx.lowHealth} />
        )}

        <Typewriter
          text={interpolate(node.text, character)}
          onDone={() => setTextDone(true)}
          className="mb-8"
          glitch={intense && Boolean(fx?.glitchText)}
          adrenaline={intense && Boolean(fx?.adrenaline)}
          speed={18}
        />

        {/* timer */}
        {timerLeft !== null && textDone && !dead && !ending && (
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-panel overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-1000"
                style={{ width: `${(timerLeft / (node.timer || 1)) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gold tabular-nums">{timerLeft}s</span>
          </div>
        )}

        {/* choices */}
        {textDone && !dead && !ending && node.choices.length > 0 && (
          <div className="flex flex-col gap-3">
            {node.choices.map((c, i) => {
              const ok = available(c);
              return (
                <button
                  key={i}
                  disabled={!ok}
                  onClick={() => handleChoose(c)}
                  className={`group rounded-xl border p-4 text-right transition-all duration-200 anim-fade-up ${
                    ok
                      ? "border-line bg-panel/60 hover:border-gold/50 hover:bg-panel hover:shadow-[0_0_20px_rgba(212,168,83,0.15)] cursor-pointer"
                      : "border-line/30 bg-panel/20 opacity-50 cursor-not-allowed"
                  }`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className={ok ? "text-bone group-hover:text-gold-bright transition-colors" : "text-bone-dim"}>
                      {interpolate(c.text, character)}
                    </span>
                    {ok ? (
                      <span className="text-gold/60 group-hover:text-gold transition-colors">←</span>
                    ) : (
                      <span className="text-xs text-bone-dim/70">{lockReason(c)}</span>
                    )}
                  </span>
                  {c.dice && ok && (
                    <span className="mt-1 block text-xs text-magic">
                      تاس {c.dice.sides}تایی — نیاز به {c.dice.difficulty}+
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* end actions */}
        {ending && (
          <div className="mt-4 flex flex-col gap-3 anim-fade-up">
            {hasNextChapter && nextChapter && (
              <a
                href={`/story/${nextChapter.storyId}`}
                onClick={() => {
                  if (world) advanceWorldChapter(world.id);
                }}
                className="rounded-xl border border-gold/50 bg-gold/15 p-4 text-center text-gold hover:bg-gold/25 transition-colors"
              >
                ادامه در {nextChapter.title} ←
              </a>
            )}
            <button
              onClick={restart}
              className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-gold hover:bg-gold/20 transition-colors cursor-pointer"
            >
              {hasNextChapter ? "دوباره این فصل" : "دوباره از اول"}
            </button>
            <a
              href="/library"
              className="rounded-xl border border-line p-4 text-center text-bone-dim hover:border-line-strong hover:text-gold transition-colors"
            >
              دیدن پایان‌ها و کتابخانه
            </a>
          </div>
        )}

        {dead && (
          <div className="mt-4 flex flex-col gap-3 anim-fade-up">
            <button
              onClick={() => {
                // respawn at last safe node
                const prev = history[history.length - 1];
                if (prev && story.nodes[prev]) {
                  setHistory((h) => h.slice(0, -1));
                  setNodeId(prev);
                  setDead(false);
                } else {
                  restart();
                }
              }}
              className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-gold hover:bg-gold/20 transition-colors cursor-pointer"
            >
              تلاش دوباره
            </button>
            <button
              onClick={restart}
              className="rounded-xl border border-line p-4 text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
            >
              شروع از نو
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
