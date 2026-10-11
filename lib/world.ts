import type { Character, World, WorldProgress } from "@/lib/types";
import { akademiWorld } from "@/content/worlds/akademi-sahr";

// رجیستری دنیاها — هر دنیا یک فایل جدا داره که اینجا ثبت می‌شه
const worlds: World[] = [akademiWorld];

export function getAllWorlds(): World[] {
  return worlds;
}

export function getWorld(id: string): World | null {
  return worlds.find((w) => w.id === id) ?? null;
}

export function getWorldOfStory(storyId: string): World | null {
  return (
    worlds.find((w) => w.chapters.some((c) => c.storyId === storyId)) ?? null
  );
}

export function getChapterIndex(world: World, storyId: string): number {
  return world.chapters.findIndex((c) => c.storyId === storyId);
}

export function isValidOrigin(world: World, originId: string): boolean {
  return world.origins.some((o) => o.id === originId);
}

export function isValidTrait(world: World, traitId: string): boolean {
  return world.traits.some((t) => t.id === traitId);
}

/**
 * متن گره یا انتخاب رو با متغیرهای شخصیت پر می‌کنه.
 * فعلاً فقط {name} — بعداً {pronoun} و غیره.
 */
export function interpolate(
  text: string,
  character: Character | null
): string {
  if (!character) return text;
  return text.replaceAll("{name}", character.name);
}

/** آیا این انتخاب برای شخصیت فعلی بازه؟ (قیدهای خاستگاه/ویژگی) */
export function choiceAllowedByCharacter(
  requires: { origins?: string[]; traits?: string[] } | undefined,
  character: Character | null
): boolean {
  if (!requires) return true;
  if (requires.origins && requires.origins.length > 0) {
    if (!character) return false;
    if (!requires.origins.includes(character.originId)) return false;
  }
  if (requires.traits && requires.traits.length > 0) {
    if (!character) return false;
    if (!requires.traits.includes(character.traitId)) return false;
  }
  return true;
}

/** آیا فصل شماره‌ی `index` برای این پیشرفت بازه؟ */
export function isChapterUnlocked(wp: WorldProgress, index: number): boolean {
  return index <= wp.currentChapter;
}
