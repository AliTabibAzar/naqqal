/**
 * فایل‌های ریخته‌شده در inbox/ رو بر اساس اسم، به مسیر درست
 * (از روی پرامپت‌ها در docs/flow/*-image-prompts.md) منتقل می‌کنه
 * و به WebP ≤300KB با حداکثر عرض 1280 تبدیل می‌کنه.
 *
 * اجرا: npm run inbox
 * گزینه‌ها:
 *   --dry        فقط گزارش، بدون تغییر
 *   --keep       فایل اصلی inbox رو نگه دار (پیش‌فرض: حذف بعد از موفقیت)
 */
import { readdirSync, existsSync, mkdirSync, readFileSync, unlinkSync, renameSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INBOX = join(ROOT, "inbox");
const PROMPTS_DIR = join(ROOT, "docs", "flow");
const MAX_BYTES = 300 * 1024;
const MAX_WIDTH = 1280;

const DRY = process.argv.includes("--dry");
const KEEP = process.argv.includes("--keep");
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

interface Target {
  file: string; // public/scenes/xxx/nodeId.webp
  promptFile: string;
}

/** پارس همه‌ی **File:** از فایل‌های پرامپت — اسم فایل مقصد = کلید */
function parseTargets(): Map<string, Target> {
  const map = new Map<string, Target>();
  const files = readdirSync(PROMPTS_DIR).filter(
    (f) => f.endsWith("-image-prompts.md") || f.endsWith("-world-prompts.md")
  );
  for (const pf of files) {
    const content = readFileSync(join(PROMPTS_DIR, pf), "utf-8");
    const re = /\*\*File:\*\*\s*`(public\/[^`]+)`/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      const file = m[1];
      const key = basename(file, extname(file)); // nodeId یا cover id
      if (!map.has(key)) map.set(key, { file, promptFile: pf });
    }
  }
  return map;
}

async function convert(srcPath: string, destPath: string): Promise<void> {
  mkdirSync(dirname(destPath), { recursive: true });
  const img = sharp(srcPath);
  const meta = await img.metadata();

  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // کیفیت تطبیقی: از 80 شروع، تا رسیدن به حد حجم پایین بیا
  for (const quality of [80, 70, 60, 50, 45, 40]) {
    const buf = await pipeline.clone().webp({ quality }).toBuffer();
    if (buf.length <= MAX_BYTES) {
      const tmp = destPath + ".tmp";
      const { writeFileSync } = await import("node:fs");
      writeFileSync(tmp, buf);
      renameSync(tmp, destPath);
      return;
    }
  }
  // اگه با کمترین کیفیت هم زیاد بود، عرض رو کم کن
  const smaller = await sharp(srcPath)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 50 })
    .toBuffer();
  const { writeFileSync } = await import("node:fs");
  writeFileSync(destPath, smaller);
}

async function main() {
  const targets = parseTargets();
  console.log(`پرامپت‌ها: ${targets.size} مقصد شناخته شد`);

  if (!existsSync(INBOX)) {
    console.log("inbox خالیه — فایل‌هات رو بذار توی inbox/ و دوباره اجرا کن.");
    return;
  }

  const files = readdirSync(INBOX).filter((f) => {
    const ext = extname(f).toLowerCase();
    return !f.startsWith(".") && IMAGE_EXTS.has(ext);
  });

  if (files.length === 0) {
    console.log("inbox خالیه — فایلی با پسوند تصویری پیدا نشد.");
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const f of files) {
    const key = basename(f, extname(f));
    const target = targets.get(key);
    const srcPath = join(INBOX, f);

    if (!target) {
      console.log(`✗ ناشناخته: ${f} — هیچ پرامپتی با اسم «${key}» نیست`);
      failed++;
      continue;
    }

    const destPath = join(ROOT, target.file);
    try {
      if (DRY) {
        console.log(`~ dry: ${f} → ${target.file}`);
      } else {
        await convert(srcPath, destPath);
        const size = (readFileSync(destPath).length / 1024).toFixed(0);
        console.log(`✓ ${f} → ${target.file} (${size}KB)`);
        if (!KEEP) unlinkSync(srcPath);
      }
      ok++;
    } catch (e) {
      console.log(`✗ خطا در ${f}: ${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\nنتیجه: ${ok} موفق${failed ? ` · ${failed} ناموفق` : ""}`);
  if (ok > 0 && !DRY) {
    console.log("بعداً: npm run scenes  (برای آپدیت manifest)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
