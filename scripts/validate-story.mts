import { saharStory } from "../content/stories/sahar-geyrat.ts";
import { akademiCh1 } from "../content/stories/akademi-sahr-ch1.ts";
import { akademiCh2 } from "../content/stories/akademi-sahr-ch2.ts";
import { akademiWorld } from "../content/worlds/akademi-sahr.ts";
import type { Story } from "../lib/types.ts";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCENES_DIR = join(ROOT, "public", "scenes");
const COVERS_DIR = join(ROOT, "public", "covers");

const stories: Story[] = [saharStory, akademiCh1, akademiCh2];
const allErrors: string[] = [];
const allWarnings: string[] = [];

// ── اعتبارسنجی هر استوری ──
function validateStory(story: Story) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodeIds = Object.keys(story.nodes);

  if (!story.nodes[story.startNode]) {
    errors.push(`startNode "${story.startNode}" does not exist`);
  }

  for (const [id, node] of Object.entries(story.nodes)) {
    for (const c of node.choices) {
      if (!story.nodes[c.next]) {
        errors.push(`node "${id}" → next "${c.next}" missing`);
      }
      if (c.dice) {
        if (!story.nodes[c.dice.success])
          errors.push(`node "${id}" dice.success "${c.dice.success}" missing`);
        if (!story.nodes[c.dice.fail])
          errors.push(`node "${id}" dice.fail "${c.dice.fail}" missing`);
      }
    }
  }

  // BFS reachability
  const reachable = new Set<string>([story.startNode]);
  const queue = [story.startNode];
  while (queue.length) {
    const id = queue.shift()!;
    const node = story.nodes[id];
    if (!node) continue;
    const targets = node.choices.map((c) => c.next);
    for (const c of node.choices) {
      if (c.dice) targets.push(c.dice.success, c.dice.fail);
    }
    for (const t of targets) {
      if (story.nodes[t] && !reachable.has(t)) {
        reachable.add(t);
        queue.push(t);
      }
    }
  }
  const unreachable = nodeIds.filter((id) => !reachable.has(id));
  if (unreachable.length)
    warnings.push(`unreachable nodes: ${unreachable.join(", ")}`);

  const endings = Object.entries(story.nodes).filter(([, n]) => n.ending);
  const deaths = Object.entries(story.nodes).filter(([, n]) => n.death);
  const deadEnds = Object.entries(story.nodes).filter(
    ([, n]) => n.choices.length === 0 && !n.ending && !n.death
  );

  const unreachableEndings = endings.filter(([id]) => !reachable.has(id));
  if (unreachableEndings.length)
    errors.push(
      `unreachable endings: ${unreachableEndings.map(([id]) => id).join(", ")}`
    );

  for (const [id, n] of endings) {
    if (n.choices.length > 0) warnings.push(`ending "${id}" has choices`);
  }
  for (const [id, n] of deaths) {
    if (n.choices.length > 0) warnings.push(`death "${id}" has choices`);
  }

  // origins/traits requires → باید با دنیای مربوطه معتبر باشن
  if (story.worldId) {
    const validOrigins = new Set(akademiWorld.origins.map((o) => o.id));
    const validTraits = new Set(akademiWorld.traits.map((t) => t.id));
    for (const [id, node] of Object.entries(story.nodes)) {
      for (const c of node.choices) {
        for (const o of c.requires?.origins ?? []) {
          if (!validOrigins.has(o))
            errors.push(`node "${id}" invalid origin "${o}"`);
        }
        for (const t of c.requires?.traits ?? []) {
          if (!validTraits.has(t))
            errors.push(`node "${id}" invalid trait "${t}"`);
        }
      }
    }
  }

  // متغیرهای ناشناخته در متن
  const VALID_VARS = new Set(["name"]);
  for (const [id, node] of Object.entries(story.nodes)) {
    const texts = [
      node.text,
      node.titleCard ?? "",
      ...node.choices.map((c) => c.text),
    ];
    for (const t of texts) {
      const matches = t.matchAll(/\{(\w+)\}/g);
      for (const m of matches) {
        if (!VALID_VARS.has(m[1]))
          warnings.push(`node "${id}" unknown variable {${m[1]}}`);
      }
    }
  }

  // چک فایل‌های رسانه‌ای
  if (story.worldId || story.id) {
    const scenesDir = join(SCENES_DIR, story.id);
    const sceneFiles = existsSync(scenesDir)
      ? readdirSync(scenesDir).filter((f) => !f.startsWith("."))
      : [];
    const sceneNodeIds = new Set(
      sceneFiles.map((f) => f.slice(0, f.lastIndexOf(".")))
    );
    // فایل‌هایی که به nodeId ناموجود اشاره می‌کنن
    for (const nid of sceneNodeIds) {
      if (!story.nodes[nid])
        warnings.push(`scene file "${nid}" has no matching node`);
    }
    // nodeId هایی که فیلد image ست کردن ولی فایل ندارن
    for (const [id, node] of Object.entries(story.nodes)) {
      if (node.image && !existsSync(join(ROOT, "public", node.image)))
        warnings.push(`node "${id}" image "${node.image}" not found`);
      if (node.video && !existsSync(join(ROOT, "public", node.video)))
        warnings.push(`node "${id}" video "${node.video}" not found`);
    }
    if (sceneFiles.length > 0)
      console.log(`   Scenes: ${sceneFiles.length} media files`);
  }

  // آمار
  console.log(`\n📖 ${story.title}`);
  console.log(`   Nodes: ${nodeIds.length} · Reachable: ${reachable.size}`);
  console.log(
    `   Endings: ${endings.length} · Deaths: ${deaths.length} · Dead-ends: ${deadEnds.length}`
  );
  for (const [id] of deadEnds) console.log(`   ! dead-end: ${id}`);

  if (warnings.length) {
    console.log(`   WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.log(`     ⚠ ${w}`);
  }
  if (errors.length) {
    console.log(`   ERRORS (${errors.length}):`);
    for (const e of errors) console.log(`     ✗ ${e}`);
  }

  allErrors.push(...errors.map((e) => `[${story.id}] ${e}`));
  allWarnings.push(...warnings.map((w) => `[${story.id}] ${w}`));
}

// ── اعتبارسنجی دنیا ──
function validateWorld() {
  const w = akademiWorld;
  const errors: string[] = [];
  const storyIds = new Set(stories.map((s) => s.id));
  for (const ch of w.chapters) {
    if (!storyIds.has(ch.storyId))
      errors.push(`world chapter "${ch.id}" → story "${ch.storyId}" missing`);
  }
  // هر استوری فصل‌دار باید در دنیا ثبت شده باشه
  for (const s of stories) {
    if (s.worldId && !w.chapters.some((c) => c.storyId === s.id))
      errors.push(`story "${s.id}" has worldId but is not in world chapters`);
  }
  console.log(`\n🌍 ${w.title}`);
  console.log(
    `   Origins: ${w.origins.length} · Traits: ${w.traits.length} · Chapters: ${w.chapters.length}`
  );
  // کاور دنیا
  if (existsSync(COVERS_DIR)) {
    const coverFiles = readdirSync(COVERS_DIR).filter(
      (f) => !f.startsWith(".") && f.startsWith(w.id)
    );
    console.log(`   Cover: ${coverFiles.length > 0 ? "✓" : "— (none yet)"}`);
  }
  if (errors.length) {
    console.log(`   ERRORS (${errors.length}):`);
    for (const e of errors) console.log(`     ✗ ${e}`);
  }
  allErrors.push(...errors.map((e) => `[world] ${e}`));
}

// ── اجرا ──
console.log("═══ اعتبارسنجی داستان‌ها و دنیاها ═══");
for (const s of stories) validateStory(s);
validateWorld();

if (allWarnings.length) {
  console.log(`\n═══ WARNINGS (${allWarnings.length}) ═══`);
  for (const w of allWarnings) console.log(`  ⚠ ${w}`);
}
if (allErrors.length) {
  console.log(`\n═══ ERRORS (${allErrors.length}) ═══`);
  for (const e of allErrors) console.log(`  ✗ ${e}`);
  process.exit(1);
} else {
  console.log(
    `\n✓ همه‌ی گراف‌ها معتبرن (${stories.length} استوری، ${stories.reduce((a, s) => a + Object.keys(s.nodes).length, 0)} گره)`
  );
}
