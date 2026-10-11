"use client";

// ─── معماری ۳ کاناله ───
// Master Gain
// ├── Music Bus    (فایل mp3 از public/music/)
// ├── SFX Bus      (WebAudio one-shots)
// └── Ambient Bus  (درون‌های WebAudio)

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let ambientBus: GainNode | null = null;

// ولوم‌ها (0..1) — مقدارهای پیش‌فرض
export const DEFAULT_VOLUMES = {
  master: 0.5,
  music: 0.5,
  sfx: 0.7,
  ambient: 0.25,
} as const;

export type BusName = "master" | "music" | "sfx" | "ambient";

let volumes: Record<BusName, number> = { ...DEFAULT_VOLUMES };

const VOL_KEY = "shabake_volumes";

function loadVolumes() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(VOL_KEY);
    if (raw) {
      const v = JSON.parse(raw);
      volumes = {
        master: clamp01(v.master ?? DEFAULT_VOLUMES.master),
        music: clamp01(v.music ?? DEFAULT_VOLUMES.music),
        sfx: clamp01(v.sfx ?? DEFAULT_VOLUMES.sfx),
        ambient: clamp01(v.ambient ?? DEFAULT_VOLUMES.ambient),
      };
    }
  } catch {
    /* noop */
  }
}

function saveVolumes() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOL_KEY, JSON.stringify(volumes));
  } catch {
    /* noop */
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    loadVolumes();
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volumes.master;
    master.connect(ctx.destination);

    musicBus = ctx.createGain();
    musicBus.gain.value = volumes.music;
    musicBus.connect(master);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = volumes.sfx;
    sfxBus.connect(master);

    ambientBus = ctx.createGain();
    ambientBus.gain.value = volumes.ambient;
    ambientBus.connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setBusVolume(bus: BusName, v: number) {
  v = clamp01(v);
  volumes[bus] = v;
  saveVolumes();
  // اعمال فوری اگر context ساخته شده
  if (bus === "master" && master) master.gain.value = v;
  else if (bus === "music" && musicBus) musicBus.gain.value = v;
  else if (bus === "sfx" && sfxBus) sfxBus.gain.value = v;
  else if (bus === "ambient" && ambientBus) ambientBus.gain.value = v;
}

export function getBusVolume(bus: BusName): number {
  return volumes[bus];
}

export function getVolumes(): Record<BusName, number> {
  return { ...volumes };
}

export function resetVolumes() {
  volumes = { ...DEFAULT_VOLUMES };
  saveVolumes();
  if (master) master.gain.value = volumes.master;
  if (musicBus) musicBus.gain.value = volumes.music;
  if (sfxBus) sfxBus.gain.value = volumes.sfx;
  if (ambientBus) ambientBus.gain.value = volumes.ambient;
}

export function setMasterVolume(v: number) {
  setBusVolume("master", v);
}

// ─── Ducking: کم کردن ambient هنگام SFX ───
let duckTimer: ReturnType<typeof setTimeout> | null = null;

function duckAmbient() {
  if (!ambientBus || !ctx) return;
  const t = ctx.currentTime;
  const target = volumes.ambient * 0.55;
  ambientBus.gain.cancelScheduledValues(t);
  ambientBus.gain.setValueAtTime(ambientBus.gain.value, t);
  ambientBus.gain.linearRampToValueAtTime(target, t + 0.08);
  if (duckTimer) clearTimeout(duckTimer);
  duckTimer = setTimeout(() => {
    if (!ambientBus || !ctx) return;
    const t2 = ctx.currentTime;
    ambientBus.gain.cancelScheduledValues(t2);
    ambientBus.gain.setValueAtTime(ambientBus.gain.value, t2);
    ambientBus.gain.linearRampToValueAtTime(volumes.ambient, t2 + 0.5);
  }, 600);
}

export function stopAll() {
  stopAmbient();
  stopHeartbeat();
  stopWhisper();
  if (ctx) {
    void ctx.close();
    ctx = null;
    master = null;
    musicBus = null;
    sfxBus = null;
    ambientBus = null;
  }
}

// ─── Helpers ───

function env(
  c: AudioContext,
  gain: GainNode,
  peak: number,
  attack: number,
  decay: number
) {
  const t = c.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function noiseBuffer(c: AudioContext, dur: number) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// ─── SFX (روی sfxBus) ───

export function playClick() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  duckAmbient();
  const g = c.createGain();
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.value = 880;
  g.connect(sfxBus);
  o.connect(g);
  env(c, g, 0.15, 0.005, 0.08);
  o.start();
  o.stop(c.currentTime + 0.12);
}

export function playSelect() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  duckAmbient();
  const g = c.createGain();
  g.connect(sfxBus);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(520, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.12);
  o.connect(g);
  env(c, g, 0.2, 0.01, 0.18);
  o.start();
  o.stop(c.currentTime + 0.25);
}

export function playDeath() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  duckAmbient();
  // impact
  const g = c.createGain();
  g.connect(sfxBus);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(160, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.6);
  o.connect(g);
  env(c, g, 0.6, 0.005, 0.9);
  o.start();
  o.stop(c.currentTime + 1.0);
  // noise burst
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.4);
  const ng = c.createGain();
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 800;
  n.connect(f);
  f.connect(ng);
  ng.connect(sfxBus);
  env(c, ng, 0.4, 0.005, 0.4);
  n.start();
  n.stop(c.currentTime + 0.5);
  // dark drone tail
  const d = c.createOscillator();
  const dg = c.createGain();
  d.type = "sawtooth";
  d.frequency.value = 55;
  const df = c.createBiquadFilter();
  df.type = "lowpass";
  df.frequency.value = 300;
  d.connect(df);
  df.connect(dg);
  dg.connect(sfxBus);
  env(c, dg, 0.15, 0.1, 1.4);
  d.start();
  d.stop(c.currentTime + 1.7);
}

export function playWin() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const g = c.createGain();
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    g.connect(sfxBus!);
    o.connect(g);
    const t = c.currentTime + i * 0.12;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.start(t);
    o.stop(t + 0.55);
  });
}

export function playDice() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  for (let i = 0; i < 6; i++) {
    const g = c.createGain();
    const o = c.createOscillator();
    o.type = "square";
    o.frequency.value = 1200 + Math.random() * 800;
    g.connect(sfxBus);
    o.connect(g);
    const t = c.currentTime + i * 0.08;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.start(t);
    o.stop(t + 0.08);
  }
}

// ─── Ambient (روی ambientBus) ───

let ambientGain: GainNode | null = null;
let ambientSrc: AudioBufferSourceNode | null = null;
let ambientMod: OscillatorNode[] = [];

export function playAmbient(kind: string, intensity: number = 0) {
  stopAmbient();
  if (kind === "none" || !kind) return;
  const c = ensureCtx();
  if (!c || !ambientBus) return;
  ambientGain = c.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(ambientBus);

  // نویز بادی حلقه‌ای به‌جای اسیلاتور sawtooth — بدون وزوز، حس هوای طبیعی
  ambientSrc = c.createBufferSource();
  ambientSrc.buffer = noiseBuffer(c, 4);
  ambientSrc.loop = true;

  // شخصیت هر فضا با فرکانس فیلتر
  const filterFreq: Record<string, number> = {
    wind: 700,
    forest: 500,
    battle: 350,
    cave: 260,
    city: 600,
  };
  const base = filterFreq[kind] ?? 500;

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = base;
  filter.Q.value = 0.6;

  // حرکت کند روی فرکانس فیلتر — وزش طبیعی باد
  const sweep = c.createOscillator();
  sweep.type = "sine";
  sweep.frequency.value = 0.07 + intensity * 0.05;
  const sweepGain = c.createGain();
  sweepGain.gain.value = base * 0.35;
  sweep.connect(sweepGain);
  sweepGain.connect(filter.frequency);

  // نفس‌کشیدن کند روی دامنه
  const vol = 0.05 + intensity * 0.025;
  const breathe = c.createOscillator();
  breathe.type = "sine";
  breathe.frequency.value = 0.11 + intensity * 0.06;
  const breatheGain = c.createGain();
  breatheGain.gain.value = vol * 0.45;
  breathe.connect(breatheGain);
  breatheGain.connect(ambientGain.gain);

  ambientSrc.connect(filter);
  filter.connect(ambientGain);

  const t = c.currentTime;
  ambientGain.gain.setValueAtTime(0.0001, t);
  ambientGain.gain.exponentialRampToValueAtTime(vol, t + 2.0);

  ambientMod = [sweep, breathe];
  ambientSrc.start();
  sweep.start();
  breathe.start();
}

export function stopAmbient() {
  if (ambientGain && ctx) {
    // fade-out ملایم به‌جای hard-stop
    const t = ctx.currentTime;
    try {
      ambientGain.gain.cancelScheduledValues(t);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, t);
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    } catch {
      /* noop */
    }
    const g = ambientGain;
    const src = ambientSrc;
    const mods = ambientMod;
    setTimeout(() => {
      try {
        src?.stop();
      } catch {
        /* noop */
      }
      for (const m of mods) {
        try {
          m.stop();
        } catch {
          /* noop */
        }
      }
      try {
        g.disconnect();
      } catch {
        /* noop */
      }
    }, 450);
  }
  ambientSrc = null;
  ambientMod = [];
  ambientGain = null;
}

// ─── Immersion SFX ───

let heartTimer: ReturnType<typeof setInterval> | null = null;
let whisperNodes: {
  src: AudioBufferSourceNode;
  gain: GainNode;
  lfo: OscillatorNode;
}[] = [];

function thump(c: AudioContext, at: number, freq: number, vol: number) {
  if (!sfxBus) return;
  const g = c.createGain();
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, at);
  o.frequency.exponentialRampToValueAtTime(freq * 0.5, at + 0.12);
  g.connect(sfxBus);
  o.connect(g);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
  o.start(at);
  o.stop(at + 0.25);
}

export function playHeartbeat(intensity: number = 1) {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  stopHeartbeat();
  const bpm = 60 + Math.min(intensity, 3) * 12;
  const beat = () => {
    if (!ctx || !sfxBus) return;
    const t = ctx.currentTime;
    thump(ctx, t, 55, 0.35 * intensity);
    thump(ctx, t + 0.28, 50, 0.25 * intensity);
  };
  beat();
  heartTimer = setInterval(beat, 60000 / bpm);
}

export function stopHeartbeat() {
  if (heartTimer) {
    clearInterval(heartTimer);
    heartTimer = null;
  }
}

export function playWhisper(duration: number = 2.5) {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  stopWhisper();
  const buf = noiseBuffer(c, duration);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1400;
  bp.Q.value = 6;
  const g = c.createGain();
  g.gain.value = 0;
  src.connect(bp);
  bp.connect(g);
  g.connect(sfxBus);
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.04, t + 0.4);
  g.gain.setValueAtTime(0.04, t + duration - 0.6);
  g.gain.linearRampToValueAtTime(0.0001, t + duration);
  const lfo = c.createOscillator();
  lfo.frequency.value = 6;
  const lfoG = c.createGain();
  lfoG.gain.value = 350;
  lfo.connect(lfoG);
  lfoG.connect(bp.frequency);
  lfo.start();
  src.start();
  src.stop(t + duration);
  lfo.stop(t + duration);
  // سورس نویز هم ترک می‌شه تا نجوات روی هم تلنبار نشن
  whisperNodes = [{ src, gain: g, lfo }];
}

export function stopWhisper() {
  for (const n of whisperNodes) {
    try {
      const t = ctx?.currentTime;
      if (ctx && t !== undefined) {
        // fade سریع برای جلوگیری از کلیک، بعد توقف کامل سورس
        n.gain.gain.cancelScheduledValues(t);
        n.gain.gain.setValueAtTime(n.gain.gain.value, t);
        n.gain.gain.linearRampToValueAtTime(0.0001, t + 0.12);
      }
      const { src, lfo } = n;
      setTimeout(() => {
        try {
          src.stop();
        } catch {
          /* noop */
        }
        try {
          lfo.stop();
        } catch {
          /* noop */
        }
      }, 150);
    } catch {
      /* noop */
    }
  }
  whisperNodes = [];
}

export function playJumpScare() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  duckAmbient();
  const t = c.currentTime;
  // sharp noise burst
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.7);
  const nf = c.createBiquadFilter();
  nf.type = "highpass";
  nf.frequency.value = 900;
  const ng = c.createGain();
  n.connect(nf);
  nf.connect(ng);
  ng.connect(sfxBus);
  ng.gain.setValueAtTime(0.5, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  n.start(t);
  n.stop(t + 0.7);
  // descending scream-like tone
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(1400, t);
  o.frequency.exponentialRampToValueAtTime(120, t + 0.5);
  const og = c.createGain();
  const of = c.createBiquadFilter();
  of.type = "lowpass";
  of.frequency.value = 2500;
  o.connect(of);
  of.connect(og);
  og.connect(sfxBus);
  og.gain.setValueAtTime(0.3, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.start(t);
  o.stop(t + 0.65);
  // sub boom
  const s = c.createOscillator();
  s.type = "sine";
  s.frequency.setValueAtTime(70, t);
  s.frequency.exponentialRampToValueAtTime(35, t + 0.5);
  const sg = c.createGain();
  s.connect(sg);
  sg.connect(sfxBus);
  sg.gain.setValueAtTime(0.5, t);
  sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  s.start(t);
  s.stop(t + 0.65);
}

export function playSwordHit() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  duckAmbient();
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.setValueAtTime(2800, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.15);
  const g = c.createGain();
  const f = c.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = 1500;
  o.connect(f);
  f.connect(g);
  g.connect(sfxBus);
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.start(t);
  o.stop(t + 0.35);
  thump(c, t, 90, 0.3);
}

export function playDrums(duration: number = 3) {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  const step = 0.22;
  const count = Math.floor(duration / step);
  for (let i = 0; i < count; i++) {
    const at = c.currentTime + i * step;
    const accent = i % 4 === 0;
    thump(c, at, accent ? 65 : 55, accent ? 0.3 : 0.15);
  }
}

export function playHeartAlarm() {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  stopHeartbeat();
  const beat = () => {
    if (!ctx || !sfxBus) return;
    const t = ctx.currentTime;
    thump(ctx, t, 70, 0.4);
    thump(ctx, t + 0.18, 65, 0.3);
  };
  beat();
  heartTimer = setInterval(beat, 340);
}
