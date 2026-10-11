import type {
  Character,
  Library,
  Progress,
  WorldProgress,
} from "@/lib/types";

const KEY = "shabake_dastan_v1";

function safeParse(raw: string | null): Library {
  if (!raw) return { stories: {}, worlds: {}, achievements: [] };
  try {
    const data = JSON.parse(raw);
    return {
      stories: data.stories ?? {},
      worlds: data.worlds ?? {}, // ذخیره‌های قدیمی ندارنش → خالی
      achievements: data.achievements ?? [],
    };
  } catch {
    return { stories: {}, worlds: {}, achievements: [] };
  }
}

function emptyLibrary(): Library {
  return { stories: {}, worlds: {}, achievements: [] };
}

// fallback حافظه‌ای اگه storage در دسترس نباشه
// (حالت ناشناس / مرورگرهای محدودکننده که getItem/setItem شون throw می‌کنه)
let memLib: Library | null = null;

export function loadLibrary(): Library {
  if (typeof window === "undefined") return emptyLibrary();
  try {
    const lib = safeParse(localStorage.getItem(KEY));
    memLib = lib;
    return lib;
  } catch {
    // storage بسته‌ست — با حافظه ادامه بده تا اپ کرش نکنه (فقط ذخیره نمی‌مونه)
    return memLib ?? emptyLibrary();
  }
}

function saveLibrary(lib: Library) {
  memLib = lib;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(lib));
  } catch {
    /* ذخیره نمی‌مونه ولی اپ کار می‌کنه */
  }
}

export function getProgress(storyId: string): Progress | null {
  return loadLibrary().stories[storyId] ?? null;
}

export function saveProgress(p: Progress) {
  const lib = loadLibrary();
  lib.stories[p.storyId] = p;
  saveLibrary(lib);
}

export function createProgress(storyId: string, startNode: string): Progress {
  return {
    storyId,
    currentNode: startNode,
    flags: [],
    history: [],
    startedAt: Date.now(),
    updatedAt: Date.now(),
    deathCount: 0,
    completedEndings: [],
  };
}

export function updateProgress(
  storyId: string,
  nodeId: string,
  newFlags: string[],
  history: string[],
  deathCount: number
) {
  const lib = loadLibrary();
  const existing = lib.stories[storyId];
  const completedEndings = existing?.completedEndings ?? [];
  saveProgress({
    storyId,
    currentNode: nodeId,
    flags: newFlags,
    history,
    startedAt: existing?.startedAt ?? Date.now(),
    updatedAt: Date.now(),
    deathCount,
    completedEndings,
  });
}

export function recordEnding(storyId: string, endingId: string) {
  const lib = loadLibrary();
  const existing = lib.stories[storyId];
  const endings = new Set(existing?.completedEndings ?? []);
  endings.add(endingId);
  if (existing) {
    existing.completedEndings = Array.from(endings);
    existing.updatedAt = Date.now();
    saveLibrary(lib);
  }
  checkAchievements(storyId, Array.from(endings));
}

function checkAchievements(storyId: string, endings: string[]) {
  const lib = loadLibrary();
  const set = new Set(lib.achievements);
  set.add("first_step");
  if (endings.length >= 1) set.add("first_ending");
  if (endings.length >= 2) set.add("two_endings");
  if (endings.length >= 3) set.add("three_endings");
  const prog = lib.stories[storyId];
  if (prog && prog.deathCount >= 1) set.add("first_death");
  if (prog && prog.completedEndings.length >= 4) set.add("all_endings");
  lib.achievements = Array.from(set);
  saveLibrary(lib);
}

export function registerDeath(storyId: string) {
  const lib = loadLibrary();
  const prog = lib.stories[storyId];
  if (prog) {
    prog.deathCount += 1;
    prog.updatedAt = Date.now();
    saveLibrary(lib);
  } else {
    saveProgress({
      storyId,
      currentNode: "",
      flags: [],
      history: [],
      startedAt: Date.now(),
      updatedAt: Date.now(),
      deathCount: 1,
      completedEndings: [],
    });
  }
  const set = new Set(lib.achievements);
  set.add("first_death");
  lib.achievements = Array.from(set);
  saveLibrary(lib);
}

export function getAchievements(): string[] {
  return loadLibrary().achievements;
}

// ─── پیشرفت دنیاها ──────────────────────────────────────────

export function getWorldProgress(worldId: string): WorldProgress | null {
  return loadLibrary().worlds[worldId] ?? null;
}

export function createWorldProgress(
  worldId: string,
  character: Character
): WorldProgress {
  const wp: WorldProgress = {
    worldId,
    character,
    currentChapter: 0,
    flags: [],
    completedEndings: [],
    startedAt: Date.now(),
    updatedAt: Date.now(),
    deathCount: 0,
  };
  const lib = loadLibrary();
  lib.worlds[worldId] = wp;
  saveLibrary(lib);
  // دستاورد ساخت شخصیت
  const set = new Set(lib.achievements);
  set.add("first_character");
  lib.achievements = Array.from(set);
  saveLibrary(lib);
  return wp;
}

export function updateWorldFlags(worldId: string, flags: string[]) {
  const lib = loadLibrary();
  const wp = lib.worlds[worldId];
  if (!wp) return;
  wp.flags = Array.from(new Set([...wp.flags, ...flags]));
  wp.updatedAt = Date.now();
  saveLibrary(lib);
}

export function recordWorldEnding(
  worldId: string,
  chapterId: string,
  endingId: string
) {
  const lib = loadLibrary();
  const wp = lib.worlds[worldId];
  if (!wp) return;
  const key = `${chapterId}:${endingId}`;
  const endings = new Set(wp.completedEndings);
  endings.add(key);
  wp.completedEndings = Array.from(endings);
  wp.updatedAt = Date.now();
  saveLibrary(lib);
  checkWorldAchievements(wp);
}

export function advanceWorldChapter(worldId: string) {
  const lib = loadLibrary();
  const wp = lib.worlds[worldId];
  if (!wp) return;
  wp.currentChapter += 1;
  wp.updatedAt = Date.now();
  saveLibrary(lib);
  checkWorldAchievements(wp);
}

export function registerWorldDeath(worldId: string) {
  const lib = loadLibrary();
  const wp = lib.worlds[worldId];
  if (!wp) return;
  wp.deathCount += 1;
  wp.updatedAt = Date.now();
  saveLibrary(lib);
  const set = new Set(lib.achievements);
  set.add("first_death");
  lib.achievements = Array.from(set);
  saveLibrary(lib);
}

function checkWorldAchievements(wp: WorldProgress) {
  const lib = loadLibrary();
  const set = new Set(lib.achievements);
  if (wp.currentChapter >= 1) set.add("chapter_two");
  if (wp.completedEndings.length >= 1) set.add("first_ending");
  if (wp.completedEndings.length >= 4) set.add("all_endings");
  lib.achievements = Array.from(set);
  saveLibrary(lib);
}

export const ACHIEVEMENTS: Record<
  string,
  { title: string; desc: string; icon: string }
> = {
  first_step: { title: "قدم نخست", desc: "اولین داستان رو شروع کن", icon: "✦" },
  first_ending: { title: "پایان‌نخست", desc: "به اولین پایان برس", icon: "◆" },
  two_endings: { title: "کاوشگر", desc: "دو پایان مختلف کشف کن", icon: "◇" },
  three_endings: { title: "شکارچی پایان", desc: "سه پایان کشف کن", icon: "★" },
  first_death: { title: "اولین مرگ", desc: "یه بار بمیری", icon: "☠" },
  all_endings: { title: "استاد روایت", desc: "همه‌ی پایان‌ها رو کشف کن", icon: "♛" },
  first_character: {
    title: "چهره‌ی تازه",
    desc: "اولین شخصیتت رو بساز",
    icon: "☺",
  },
  chapter_two: {
    title: "پا به فصل دوم",
    desc: "وارد فصل دوم یک دنیا بشو",
    icon: "⚔",
  },
};
