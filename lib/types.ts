export type Tint = "poison" | "fear" | "magic" | "cold" | "blood";
export type ParticleKind =
  | "embers"
  | "dust"
  | "snow"
  | "rain"
  | "sparkle"
  | "none";
export type AmbientKind =
  | "wind"
  | "forest"
  | "battle"
  | "cave"
  | "city"
  | "none";

export type Mood = "horror" | "battle" | "calm" | "mystery" | "triumph";

export interface NodeEffects {
  heartbeat?: boolean;
  jumpScare?: { text?: string; flash?: "white" | "red" };
  flicker?: boolean;
  whispers?: boolean;
  glitchText?: boolean;
  adrenaline?: boolean;
  lowHealth?: number;
  torchlight?: boolean;
  intensity?: number;
}

export interface DiceCheck {
  sides: number;
  difficulty: number;
  success: string;
  fail: string;
}

export interface ChoiceRequires {
  flags?: string[];
  withoutFlags?: string[];
  origins?: string[];
  traits?: string[];
}

export interface Choice {
  text: string;
  next: string;
  requires?: ChoiceRequires;
  sets?: string[];
  dice?: DiceCheck;
}

export interface Ending {
  id: string;
  title: string;
  good: boolean;
}

export interface StoryNode {
  text: string;
  chapter?: string;
  image?: string;
  video?: string;
  tint?: Tint;
  particles?: ParticleKind;
  ambient?: AmbientKind;
  shake?: boolean;
  titleCard?: string;
  death?: boolean;
  ending?: Ending;
  timer?: number;
  mood?: Mood;
  effects?: NodeEffects;
  choices: Choice[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  cover?: string;
  /** اگر این استوری فصل یک دنیا باشه، شناسه‌ی دنیا اینجاست */
  worldId?: string;
  startNode: string;
  nodes: Record<string, StoryNode>;
}

export interface Progress {
  storyId: string;
  currentNode: string;
  flags: string[];
  history: string[];
  startedAt: number;
  updatedAt: number;
  deathCount: number;
  completedEndings: string[];
}

export interface Library {
  stories: Record<string, Progress>;
  worlds: Record<string, WorldProgress>;
  achievements: string[];
}

// ─── دنیا و شخصیت ───────────────────────────────────────────

export type Pronouns = "male" | "female" | "neutral";

export interface Character {
  name: string;
  pronouns: Pronouns;
  originId: string;
  traitId: string;
}

export interface OriginOption {
  id: string;
  name: string;
  desc: string;
}

export interface TraitOption {
  id: string;
  name: string;
  desc: string;
}

export interface WorldChapter {
  id: string;
  /** شناسه‌ی استوری‌ای که متن فصل رو نگه می‌داره */
  storyId: string;
  title: string;
}

export interface World {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  cover?: string;
  /** مقدمه‌ی دنیا — در صفحه‌ی ورود نشون داده می‌شه */
  lore: string[];
  origins: OriginOption[];
  traits: TraitOption[];
  chapters: WorldChapter[];
}

export interface WorldProgress {
  worldId: string;
  character: Character;
  /** ایندکس فصلی که الان باز/بازشدنی‌ست (0-based) */
  currentChapter: number;
  /** پرچم‌هایی که از فصل‌های قبل جمع شدن و فصل بعد باهاشون شروع می‌شه */
  flags: string[];
  /** پایان‌های کشف‌شده به شکل "chapterId:endingId" */
  completedEndings: string[];
  startedAt: number;
  updatedAt: number;
  deathCount: number;
}
