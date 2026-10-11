"use client";

// ─── موتور موسیقی فایل‌محور با crossfade ───
// فایل‌ها: public/music/{storyId}/{key}.mp3
// key می‌تونه mood باشه (horror/battle/calm/mystery/triumph) یا nodeId

import { getMusic } from "@/lib/scene-manifest";

let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;

// آهنگ فعلی و قبلی برای crossfade
let currentSource: AudioBufferSourceNode | null = null;
let currentGain: GainNode | null = null;
let currentKey: string | null = null;
let currentStoryId: string | null = null;

// کش decode شده‌ها
const bufferCache = new Map<string, AudioBuffer>();
const inflight = new Map<string, Promise<AudioBuffer | null>>();
// کش منفی کوتاه‌مدت برای URLهای خراب — جلوگیری از طوفان ریکوئست تکراری
const failedAt = new Map<string, number>();
const NEG_CACHE_MS = 60_000;
// پاسخ‌های کوچک‌تر از این قطعاً فایل صوتی نیستن (decode هم نکن)
const MIN_AUDIO_BYTES = 4096;

const FADE_TIME = 2.0; // ثانیه crossfade

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    musicGain = ctx.createGain();
    musicGain.gain.value = 1;
    // وصل به باس موسیقی در audio.ts
    // چون audio.ts هم جداگانه context داره، اینجا یه context مستقل داریم
    // ولی از همون volume استفاده می‌کنیم
    import("@/lib/audio").then((audio) => {
      if (musicGain) {
        musicGain.gain.value = audio.getBusVolume("music");
      }
    }).catch(() => {
      /* noop */
    });
    musicGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

async function decodeFile(url: string): Promise<AudioBuffer | null> {
  // از کش
  const cached = bufferCache.get(url);
  if (cached) return cached;

  // کش منفی: اگه اخیراً fail شده، دوباره fetch نکن
  const failed = failedAt.get(url);
  if (failed && Date.now() - failed < NEG_CACHE_MS) return null;

  // اگر در حال دانلوده، صبر کن
  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        failedAt.set(url, Date.now());
        return null;
      }
      const arr = await res.arrayBuffer();
      // خیلی کوچیک = فایل صوتی نیست — decode نکن (جلوگیری از اسپم کنسول)
      if (arr.byteLength < MIN_AUDIO_BYTES) {
        failedAt.set(url, Date.now());
        return null;
      }
      const c = ensureCtx();
      if (!c) return null;
      const buf = await c.decodeAudioData(arr);
      bufferCache.set(url, buf);
      failedAt.delete(url);
      return buf;
    } catch {
      failedAt.set(url, Date.now());
      return null;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, promise);
  return promise;
}

/**
 * آهنگی بر اساس mood یا nodeId پخش کن (با crossfade).
 * اگر فایلی پیدا نشد، سکوت (آهنگ قبلی fade-out می‌شه).
 */
export async function playMusic(
  storyId: string,
  key: string
): Promise<void> {
  // اگر همین آهنگ داره پخش می‌شه، کاری نکن
  if (currentStoryId === storyId && currentKey === key && currentSource) {
    return;
  }

  const c = ensureCtx();
  if (!c || !musicGain) return;

  const musicUrl = getMusic(storyId, key);
  let buffer: AudioBuffer | null = null;
  if (musicUrl) {
    buffer = await decodeFile(musicUrl);
  }

  // اگر context بسته شده بعد از await
  if (!ctx || !musicGain) return;

  const t = ctx.currentTime;

  // fade-out آهنگ قبلی
  if (currentSource && currentGain) {
    const oldGain = currentGain;
    const oldSource = currentSource;
    oldGain.gain.cancelScheduledValues(t);
    oldGain.gain.setValueAtTime(oldGain.gain.value, t);
    oldGain.gain.linearRampToValueAtTime(0.0001, t + FADE_TIME);
    setTimeout(() => {
      try {
        oldSource.stop();
        oldSource.disconnect();
        oldGain.disconnect();
      } catch {
        /* noop */
      }
    }, FADE_TIME * 1000 + 100);
  }

  currentSource = null;
  currentGain = null;

  if (!buffer) {
    // فایلی نیست — فقط سکوت
    currentKey = key;
    currentStoryId = storyId;
    return;
  }

  // آهنگ جدید با fade-in
  const source = c.createBufferSource();
  source.buffer = buffer;
  source.loop = true; // حلقه
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(1, t + FADE_TIME);
  source.connect(gain);
  gain.connect(musicGain);
  source.start(t);

  currentSource = source;
  currentGain = gain;
  currentKey = key;
  currentStoryId = storyId;
}

/** توقف موسیقی با fade-out */
export function stopMusic() {
  if (!ctx || !currentSource || !currentGain) return;
  const t = ctx.currentTime;
  const src = currentSource;
  const g = currentGain;
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(g.gain.value, t);
  g.gain.linearRampToValueAtTime(0.0001, t + FADE_TIME);
  setTimeout(() => {
    try {
      src.stop();
      src.disconnect();
      g.disconnect();
    } catch {
      /* noop */
    }
  }, FADE_TIME * 1000 + 100);
  currentSource = null;
  currentGain = null;
  currentKey = null;
  currentStoryId = null;
}

/** مسیر فعلی آهنگ (برای دیباگ) */
export function getCurrentMusicKey(): string | null {
  return currentKey;
}

/** آهنگ‌های یک دنیا رو prefetch کن (اختیاری) */
export async function prefetchMusic(
  storyId: string,
  keys: string[]
): Promise<void> {
  for (const key of keys) {
    const url = getMusic(storyId, key);
    if (url) await decodeFile(url).catch(() => null);
  }
}
