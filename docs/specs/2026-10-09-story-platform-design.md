# پلتفرم داستان تعاملی سینمایی — Spec نهایی

تاریخ: ۲۰۲۶-۱۰-۰۹
وضعیت: تأییدشده برای اجرا

## ۱. خلاصه

وب‌اپ فارسی/RTL برای تجربه‌ی داستان‌های تعاملی شاخه‌ای با حس سینمایی/بازی. کاربر داستانی رو انتخاب می‌کنه، نقش شخصیت اصلی رو بازی می‌کنه، و هر تصمیم مسیر داستان رو عوض می‌کنه. تأکید ویژه روی غوطه‌وری: پس‌زمینه‌ی سینمایی، ذرات، صداهای سینتیزشده، جلوه‌های مرگ، و مسیر تصویری با Google Flow برای صحنه‌های کلیدی.

## ۲. تصمیم‌های کلیدی

| موضوع | تصمیم |
|-------|--------|
| منبع داستان | شاخه‌های از پیش نوشته‌شده (JSON) |
| نویسنده | ادمین (فایل JSON در repo)؛ UGC در آینده |
| مکانیک | انتخاب ساده + قلاب `requires.flags` برای RPG آینده |
| کاربر | مهمان با ذخیره‌ی localStorage؛ حساب در آینده |
| پلتفرم | وب‌اپ ریسپانسیو، موبایل‌اول |
| زبان | فارسی، RTL کامل |
| هزینه | صفر — صدا/Web Audio، هنر/Canvas+SVG، فونت/Google Fonts |
| رسانه | آماده برای تصویر/ویدیوی Google Flow؛ fallback به هنر کدی |

## ۳. معماری

```
Next.js 16 (App Router) + TypeScript + Tailwind 4
├── content/stories/*.json     داستان‌ها (فایل‌های محتوا)
├── lib/story/                 types + loader + validate
├── lib/progress.ts            localStorage پیشرفت/پایان/دستاورد
├── lib/audio.ts               موتور Web Audio (سینتیز صدا)
├── components/                کامپوننت‌های UI و سینمایی
└── app/                       صفحات (/, /story/[id], /library)
```

- تعامل و ذخیره سمت کلاینت؛ بدون بک‌اند
- رسانه در `public/scenes/` با نام‌گذاری `<storyId>/<nodeId>.webp|mp4`

## ۴. مدل داده‌ی داستان

```ts
interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  cover?: string;            // مسیر تصویر یا null (fallback کدی)
  startNode: string;
  nodes: Record<string, StoryNode>;
}

interface StoryNode {
  id?: string;
  text: string;
  chapter?: string;          // نام فصل برای تایتل سینمایی
  image?: string;            // پس‌زمینه‌ی تصویری
  video?: string;            // لوپ ویدیویی (کلیدی)
  tint?: "poison" | "fear" | "magic" | "cold" | "blood";
  particles?: "embers" | "dust" | "snow" | "rain" | "sparkle" | "none";
  ambient?: "wind" | "forest" | "battle" | "cave" | "city" | "none";
  shake?: boolean;           // لرزش صفحه
  titleCard?: string;        // متن تایتل فصل سینمایی
  death?: boolean;           // گره‌ی مرگ
  ending?: { id: string; title: string; good: boolean };
  timer?: number;            // ثانیه مهلت انتخاب
  choices: Choice[];
}

interface Choice {
  text: string;
  next: string;
  requires?: { flags?: string[]; withoutFlags?: string[] };
  sets?: string[];           // flag هایی که این انتخاب فعال می‌کنه
  dice?: { sides: number; difficulty: number; success: string; fail: string };
}
```

## ۵. موتور سینمایی (رایگان/کد)

| سیستم | پیاده‌سازی |
|-------|-----------|
| ذرات محیطی | Canvas: embers/dust/snow/rain/sparkle |
| خون‌پاشی مرگ | Canvas splatter + shake + صدای ضربه |
| صدا | Web Audio سینتیزشده: click, select, death, win, ambient drone |
| تایپ‌افکت | متن با سرعت ظاهر شدن؛ skip با کلیک |
| تایتل فصل | کارت سینمایی با fade |
| تینت | overlay CSS بر اساس `tint` گره |
| تاس | انیمیشن + نتیجه‌ی تصادفی برای `dice` |
| تایمر | شمارش معکوس روی گزینه‌های `timer` |
| گوینده | SpeechSynthesis فارسی (اختیاری، دکمه‌ی mute) |

## ۶. گیمیفیکیشن

- **پایان‌ها:** گالری پایان‌ها با شمارش «X از Y کشف شد»
- **دستاوردها:** اولین مرگ، بدون مرگ تا پایان، کشف ۳ پایان، همه‌ی پایان‌ها
- **نقشه‌ی مسیر:** نمودار SVG از مسیر طی‌شده + شاخه‌های ناشناخته

## ۷. صفحات

| مسیر | محتوا |
|------|-------|
| `/` | کاتالوگ: کاور، عنوان، تگ، نشانگر پیشرفت |
| `/story/[id]` | ریدر سینمایی با همه‌ی افکت‌ها + هدر (صدا/گوینده/نقشه/ریست) |
| `/library` | ادامه‌ی داستان‌ها + پایان‌های کشف‌شده + دستاوردها |

## ۸. رسانه‌ی Google Flow

- هر گره می‌تونه `image` (WebP) و `video` (MP4 لوپ بی‌صدا ۷۲۰p ≤۲MB) داشته باشه
- نام‌گذاری: `public/scenes/<storyId>/<nodeId>.webp` و `.mp4`
- اگر فایل وجود نداشت → fallback به هنر کدی (گرادیان + ذرات)
- ویدیو: `muted loop playsinline autoplay` + دکمه‌ی pause در هدر

## ۹. داستان نمونه

داستان فارسی «سایه‌ی البرز»:
- ۱۵–۲۰ گره، ۴+ پایان (خوب/بد)
- گره‌های مرگ با جلوه‌ی خون
- flag ساده (مثلاً `has_torch`) برای نمایش `requires`
- یک چک‌شانس (تاس) و یک انتخاب با تایمر
- تایتل فصل سینمایی

## ۱۰. خارج از محدوده (آینده)

حساب کاربری + ذخیره‌ی ابری، پنل ادمین، آمار/مهارت RPG، UGC، صدای انسانی/TTS پولی، پنل کمیک.

## ۱۱. معیار پذیرش

- `npm run build` بدون خطا
- RTL و موبایل‌اول درست کار کنه
- شروع، ۲+ مسیر، مرگ، پایان، ادامه از کتابخانه، رفرش با حفظ پیشرفت
- بدون فایل رسانه‌ای، اپ کامل کار کنه (fallback کدی)
