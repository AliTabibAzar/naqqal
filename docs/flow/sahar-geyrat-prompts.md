# راهنمای تولید صحنه با Google Flow

این فایل پرامپت‌های آماده برای ساخت ویدیوهای سینمایی داستان «سایه‌ی البرز» با Google Flow (مدل Veo) هست.

## قرارداد فایل‌ها

> **نکته‌ی ترکیبی 🎥+🖼️:** هر ۸ گره ویدیویی این فایل، پرامپت **عکس fallback** هم دارن (در `sahar-geyrat-image-prompts.md`). اگه ویدیو نساختی، عکس خودکار نمایش داده می‌شه. اپ اولویت رو روی ویدیو گذاشته (`video ?? image`).

خروجی Flow رو بعد از خروجی گرفتن، با ffmpeg فشرده کن و در مسیر زیر بذار:

```
public/scenes/sahar-geyrat/<nodeId>.mp4
```

- فرمت: **H.264 MP4**
- رزولوشن: **1280×720 (720p)**
- مدت: **۵–۸ ثانیه** (لوپ)
- حجم: **≤ ۲ مگابایت**
- بی‌صدا (اپ خودش صدا رو Web Audio تولید می‌کنه)

دستور فشرده‌سازی پیشنهادی:
```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart public/scenes/sahar-geyrat/<nodeId>.mp4
```

## نکات کلی پرامپت

- سبک: **سینمایی تاریک، فانتزی تاریک ایرانی، نورپردازی کم‌نور طلایی/کهربایی**
- پالت: سرمه‌ای شب، طلایی، قرمز خونی — هماهنگ با تم اپ
- کمپوزیسیون: مرکز تصویر کمی خالی بمونه تا متن روش خوانا باشه (اپ اورلی تیره می‌زنه)
- حالت: **loop** — شروع و پایان کلیپ باید قابل تکرار باشن
- بدون متن/زیرنویس در ویدیو

---

## صحنه‌های کلیدی (اولویت با ایناست)

### ۱. `village_night` — روستا در شب (شروع)
**اولویت: بالا**
> A Persian mountain village at night under a blood-red moon, an ancient fire temple with a single flickering flame, cold wind blowing dust and embers, dark cinematic fantasy, golden and deep blue tones, slow atmospheric camera drift, 8 second seamless loop, no text

### ۲. `cave_deep` — دل غار
**اولویت: بالا**
> Inside a vast dark cave, an ancient stone altar with a glowing red-hilted sword, two red eyes watching from the shadows, torchlight flickering on wet stone walls, dark fantasy, mysterious atmosphere, slow push-in camera, 8 second loop, no text

### ۳. `heart_of_shadows` — قلب سایه‌ها
**اولویت: بالا**
> A massive underground cavern filled with floating shadow spirits, a pulsating black heart of darkness at the center, purple and red magical energy swirling, epic dark fantasy, cinematic lighting, slow orbit camera, 8 second loop, no text

### ۴. `ending_breaker` — پایان خوب (شکستن نفرین)
**اولویت: بالا**
> A blinding golden explosion of light inside a dark cavern, shadows dissolving into smoke, a radiant sword of eternal fire, triumphant epic fantasy moment, golden particles rising, cinematic bloom, 8 second loop, no text

### ۵. `find_eternal_fire` — آتش ازلی
**اولویت: متوسط**
> An ancient stone bowl containing a mystical blue eternal flame, in a small sacred chamber, blue and gold magical glow, dark stone walls, serene and holy atmosphere, close-up cinematic shot, 8 second loop, no text

### ۶. `last_stand` — نبرد پایانی
**اولویت: متوسط**
> Villagers standing together defending a fire temple at night against shadow creatures, torches and firelight, epic battle moment, dark cinematic fantasy, dramatic rim lighting, 8 second loop, no text

### ۷. `death_collapse` — مرگ (ریزش غار)
**اولویت: متوسط (برای جلوه‌ی مرگ)**
> A dark cave collapsing, rocks and dust falling from the ceiling, torch light flickering and dying, dramatic and terrifying moment, dark fantasy, chaotic energy, 8 second loop, no text

### ۸. `abandoned_village` — روستای متروکه
**اولویت: پایین**
> An abandoned Persian village under blood-red moonlight, empty mud-brick houses, a old well in the center emitting cold mist, eerie and haunted atmosphere, dark cinematic fantasy, slow pan, 8 second loop, no text

---

## برای تصاویر ثابت (Imagen / فریم Flow)

برای گره‌های عادی‌تر، به‌جای ویدیو می‌تونی یک تصویر ثابت بسازی:

```
public/scenes/sahar-geyrat/<nodeId>.webp
```

گره‌هایی که هنوز ویدیو/تصویر ندارن و می‌تونی فریم بسازی:
- `cave_entrance` — دهانه‌ی غار
- `shrine_ritual` — دعای کنار آتشکده
- `witch_talk` — پیرزن بی‌سایه کنار چاه
- `sacrifice_blood` — فداکاری خون
- `claim_worthy` — پیمان با شمشیر
- `witch_secret` — راز پیرزن
- `look_well` — داخل چاه

---

## چک‌لیست قبل از ریختن فایل‌ها

- [ ] ویدیو ۷۲۰p، ≤ ۲MB، بدون صدا
- [ ] نام فایل دقیقاً `nodeId` باشه (مثلاً `village_night.mp4`)
- [ ] در مسیر `public/scenes/sahar-geyrat/` باشه
- [ ] لوپ تمیز باشه (شروع/پایان هماهنگ)
- [ ] بعد از ریختن، اپ رو رفرش کن — اگر فایل باشه خودکار نمایش داده می‌شه، اگر نباشه هنر کدی جایگزین می‌شه
