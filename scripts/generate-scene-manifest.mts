/**
 * پوشه‌ی public/scenes/{storyId}/ و public/music/{storyId}/ رو اسکن می‌کنه
 * و یه manifest (lib/scene-manifest.ts) تولید می‌کنه.
 *
 * فرمت فایل:
 *   تصویر:  public/scenes/{storyId}/{nodeId}.webp|.jpg|.png
 *   ویدیو:  public/scenes/{storyId}/{nodeId}.mp4
 *   کاور:   public/covers/{storyId}.webp|.jpg|.png
 *   موسیقی: public/music/{storyId}/{key}.mp3  (key = mood یا nodeId)
 *
 * اجرا: npm run scenes
 */
import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCENES_DIR = join(ROOT, "public", "scenes");
const COVERS_DIR = join(ROOT, "public", "covers");
const MUSIC_DIR = join(ROOT, "public", "music");
const OUT = join(ROOT, "lib", "scene-manifest.ts");

const IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const VIDEO_EXTS = new Set([".mp4", ".webm"]);
const AUDIO_EXTS = new Set([".mp3", ".ogg", ".wav", ".m4a", ".flac", ".webm"]);

interface SceneEntry {
  image?: string;
  video?: string;
}
interface Manifest {
  scenes: Record<string, SceneEntry>;
  covers: Record<string, string>;
  music: Record<string, string>;
}

function scan(): Manifest {
  const scenes: Record<string, SceneEntry> = {};
  const covers: Record<string, string> = {};
  const music: Record<string, string> = {};

  // scenes/{storyId}/{nodeId}.{ext}
  if (existsSync(SCENES_DIR)) {
    for (const storyId of readdirSync(SCENES_DIR)) {
      const storyDir = join(SCENES_DIR, storyId);
      try {
        const files = readdirSync(storyDir);
        for (const file of files) {
          if (file.startsWith(".")) continue;
          const dot = file.lastIndexOf(".");
          if (dot < 0) continue;
          const nodeId = file.slice(0, dot);
          const ext = file.slice(dot).toLowerCase();
          const key = `${storyId}/${nodeId}`;
          if (!scenes[key]) scenes[key] = {};
          if (IMAGE_EXTS.has(ext)) {
            scenes[key].image = `/scenes/${storyId}/${file}`;
          } else if (VIDEO_EXTS.has(ext)) {
            scenes[key].video = `/scenes/${storyId}/${file}`;
          }
        }
      } catch {
        /* not a directory */
      }
    }
  }

  // covers/{storyId}.{ext}
  if (existsSync(COVERS_DIR)) {
    for (const file of readdirSync(COVERS_DIR)) {
      if (file.startsWith(".")) continue;
      const dot = file.lastIndexOf(".");
      if (dot < 0) continue;
      const id = file.slice(0, dot);
      const ext = file.slice(dot).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        covers[id] = `/covers/${file}`;
      }
    }
  }

  // music/{storyId}/{key}.{ext}
  if (existsSync(MUSIC_DIR)) {
    for (const storyId of readdirSync(MUSIC_DIR)) {
      const storyDir = join(MUSIC_DIR, storyId);
      try {
        const files = readdirSync(storyDir);
        for (const file of files) {
          if (file.startsWith(".")) continue;
          const dot = file.lastIndexOf(".");
          if (dot < 0) continue;
          const key = file.slice(0, dot);
          const ext = file.slice(dot).toLowerCase();
          if (AUDIO_EXTS.has(ext)) {
            music[`${storyId}/${key}`] = `/music/${storyId}/${file}`;
          }
        }
      } catch {
        /* not a directory */
      }
    }
  }

  return { scenes, covers, music };
}

function main() {
  const manifest = scan();
  const sceneCount = Object.keys(manifest.scenes).length;
  const coverCount = Object.keys(manifest.covers).length;
  const musicCount = Object.keys(manifest.music).length;

  const content = `// این فایل خودکار تولید می‌شه — دست نزنید!
// اجرا: npm run scenes
// منبع: public/scenes/**, public/covers/**, public/music/**

export interface SceneEntry {
  image?: string;
  video?: string;
}

export const SCENE_MANIFEST: Record<string, SceneEntry> = ${JSON.stringify(manifest.scenes, null, 2)};

export const COVER_MANIFEST: Record<string, string> = ${JSON.stringify(manifest.covers, null, 2)};

export const MUSIC_MANIFEST: Record<string, string> = ${JSON.stringify(manifest.music, null, 2)};

/** تصویر/ویدیوی یک گره رو از manifest پیدا می‌کنه */
export function getScene(storyId: string, nodeId: string): SceneEntry | undefined {
  return SCENE_MANIFEST[\`\${storyId}/\${nodeId}\`];
}

/** کاور یک استوری/دنیا رو از manifest پیدا می‌کنه */
export function getCover(id: string): string | undefined {
  return COVER_MANIFEST[id];
}

/** مسیر آهنگ یک دنیا بر اساس mood یا key رو پیدا می‌کنه */
export function getMusic(storyId: string, key: string): string | undefined {
  return MUSIC_MANIFEST[\`\${storyId}/\${key}\`];
}

/** همه‌ی کلیدهای موسیقی یک دنیا */
export function getMusicKeys(storyId: string): string[] {
  return Object.keys(MUSIC_MANIFEST)
    .filter((k) => k.startsWith(storyId + "/"))
    .map((k) => k.slice(storyId.length + 1));
}
`;

  // اطمینان از وجود پوشه‌ی lib
  const outDir = dirname(OUT);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  writeFileSync(OUT, content, "utf-8");
  console.log(
    `✓ scene-manifest.ts updated: ${sceneCount} scenes, ${coverCount} covers, ${musicCount} music`
  );
  if (sceneCount === 0 && coverCount === 0 && musicCount === 0) {
    console.log("  (هیچ فایلی پیدا نشد — بعد از اضافه کردن فایل‌ها دوباره اجرا کن)");
  }
}

main();
