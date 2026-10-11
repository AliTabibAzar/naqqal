// این فایل خودکار تولید می‌شه — دست نزنید!
// اجرا: npm run scenes
// منبع: public/scenes/**, public/covers/**, public/music/**

export interface SceneEntry {
  image?: string;
  video?: string;
}

export const SCENE_MANIFEST: Record<string, SceneEntry> = {
  "sahar-geyrat/abandoned_village": {
    "image": "/scenes/sahar-geyrat/abandoned_village.webp"
  },
  "sahar-geyrat/ally_shadow": {
    "image": "/scenes/sahar-geyrat/ally_shadow.webp"
  },
  "sahar-geyrat/ask_betrayal": {
    "image": "/scenes/sahar-geyrat/ask_betrayal.webp"
  },
  "sahar-geyrat/cave_collapse": {
    "image": "/scenes/sahar-geyrat/cave_collapse.webp"
  },
  "sahar-geyrat/cave_deep": {
    "image": "/scenes/sahar-geyrat/cave_deep.webp"
  },
  "sahar-geyrat/cave_entrance": {
    "image": "/scenes/sahar-geyrat/cave_entrance.webp"
  },
  "sahar-geyrat/cave_symbols": {
    "image": "/scenes/sahar-geyrat/cave_symbols.webp"
  },
  "sahar-geyrat/claim_humble": {
    "image": "/scenes/sahar-geyrat/claim_humble.webp"
  },
  "sahar-geyrat/claim_worthy": {
    "image": "/scenes/sahar-geyrat/claim_worthy.webp"
  },
  "sahar-geyrat/death_collapse": {
    "image": "/scenes/sahar-geyrat/death_collapse.webp"
  },
  "sahar-geyrat/death_shadows": {
    "image": "/scenes/sahar-geyrat/death_shadows.webp"
  },
  "sahar-geyrat/death_well": {
    "image": "/scenes/sahar-geyrat/death_well.webp"
  },
  "sahar-geyrat/ending_annihilation": {
    "image": "/scenes/sahar-geyrat/ending_annihilation.webp"
  },
  "sahar-geyrat/ending_breaker": {
    "image": "/scenes/sahar-geyrat/ending_breaker.webp"
  },
  "sahar-geyrat/ending_coward": {
    "image": "/scenes/sahar-geyrat/ending_coward.webp"
  },
  "sahar-geyrat/ending_new_shadow": {
    "image": "/scenes/sahar-geyrat/ending_new_shadow.webp"
  },
  "sahar-geyrat/ending_pact_shadow": {
    "image": "/scenes/sahar-geyrat/ending_pact_shadow.webp"
  },
  "sahar-geyrat/ending_shrine_keeper": {
    "image": "/scenes/sahar-geyrat/ending_shrine_keeper.webp"
  },
  "sahar-geyrat/ending_unity": {
    "image": "/scenes/sahar-geyrat/ending_unity.webp"
  },
  "sahar-geyrat/escape_alone": {
    "image": "/scenes/sahar-geyrat/escape_alone.webp"
  },
  "sahar-geyrat/find_eternal_fire": {
    "image": "/scenes/sahar-geyrat/find_eternal_fire.webp"
  },
  "sahar-geyrat/heart_of_shadows": {
    "image": "/scenes/sahar-geyrat/heart_of_shadows.webp"
  },
  "sahar-geyrat/last_stand": {
    "image": "/scenes/sahar-geyrat/last_stand.webp"
  },
  "sahar-geyrat/look_well": {
    "image": "/scenes/sahar-geyrat/look_well.webp"
  },
  "sahar-geyrat/refuse_sacrifice": {
    "image": "/scenes/sahar-geyrat/refuse_sacrifice.webp"
  },
  "sahar-geyrat/reject_shadow": {
    "image": "/scenes/sahar-geyrat/reject_shadow.webp"
  },
  "sahar-geyrat/sacrifice_blood": {
    "image": "/scenes/sahar-geyrat/sacrifice_blood.webp"
  },
  "sahar-geyrat/sacrifice_memory": {
    "image": "/scenes/sahar-geyrat/sacrifice_memory.webp"
  },
  "sahar-geyrat/shadow_talk": {
    "image": "/scenes/sahar-geyrat/shadow_talk.webp"
  },
  "sahar-geyrat/shrine_ritual": {
    "image": "/scenes/sahar-geyrat/shrine_ritual.webp"
  },
  "sahar-geyrat/survive_collapse": {
    "image": "/scenes/sahar-geyrat/survive_collapse.webp"
  },
  "sahar-geyrat/take_sword": {
    "image": "/scenes/sahar-geyrat/take_sword.webp"
  },
  "sahar-geyrat/throw_sword": {
    "image": "/scenes/sahar-geyrat/throw_sword.webp"
  },
  "sahar-geyrat/village_night": {
    "image": "/scenes/sahar-geyrat/village_night.webp"
  },
  "sahar-geyrat/village_night2": {
    "image": "/scenes/sahar-geyrat/village_night2.webp"
  },
  "sahar-geyrat/warn_village": {
    "image": "/scenes/sahar-geyrat/warn_village.webp"
  },
  "sahar-geyrat/witch_secret": {
    "image": "/scenes/sahar-geyrat/witch_secret.webp"
  },
  "sahar-geyrat/witch_talk": {
    "image": "/scenes/sahar-geyrat/witch_talk.webp"
  }
};

export const COVER_MANIFEST: Record<string, string> = {
  "sahar-geyrat": "/covers/sahar-geyrat.webp"
};

export const MUSIC_MANIFEST: Record<string, string> = {};

/** تصویر/ویدیوی یک گره رو از manifest پیدا می‌کنه */
export function getScene(storyId: string, nodeId: string): SceneEntry | undefined {
  return SCENE_MANIFEST[`${storyId}/${nodeId}`];
}

/** کاور یک استوری/دنیا رو از manifest پیدا می‌کنه */
export function getCover(id: string): string | undefined {
  return COVER_MANIFEST[id];
}

/** مسیر آهنگ یک دنیا بر اساس mood یا key رو پیدا می‌کنه */
export function getMusic(storyId: string, key: string): string | undefined {
  return MUSIC_MANIFEST[`${storyId}/${key}`];
}

/** همه‌ی کلیدهای موسیقی یک دنیا */
export function getMusicKeys(storyId: string): string[] {
  return Object.keys(MUSIC_MANIFEST)
    .filter((k) => k.startsWith(storyId + "/"))
    .map((k) => k.slice(storyId.length + 1));
}
