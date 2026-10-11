# راهنمای موسیقی رایگان — سایه‌ی روایت

## چطور کار می‌کنه

فایل‌های mp3 رو توی `public/music/{storyId}/` بذار. اسم فایل = کلید mood یا nodeId:

```
public/music/
  sahar-geyrat/
    horror.mp3       ← mood: horror
    battle.mp3       ← mood: battle
    calm.mp3         ← mood: calm
    mystery.mp3      ← mood: mystery
    triumph.mp3      ← mood: triumph
  akademi-sahr-ch1/
    mystery.mp3
    calm.mp3
    01-arrival.mp3   ← اختصاصی برای nodeId «01-arrival» (اولویت داره)
```

اولویت: `nodeId.mp3` → `mood.mp3` → سکوت

بعدش `npm run scenes` رو اجرا کن تا manifest آپدیت بشه.

---

## منابع موسیقی رایگان (CC0 / بدون attribution)

### بهترین گزینه‌ها

| منبع | لینک | کیفیت | لایسنس |
|------|------|-------|--------|
| **Pixabay Music** | pixabay.com/music | عالی | رایگان، بدون attribution |
| **Kevin MacLeod (incompetech)** | incompetech.com | خوب | CC-BY (نیاز به ذکر) |
| **Free Music Archive** | freemusicarchive.org | متنوع | CC0 تا CC-BY |
| **OpenGameArt** | opengameart.org | خوب | CC0 |
| **Freesound** | freesound.org | عالی (SFX) | CC0 |
| **Mixkit** | mixkit.co/music | عالی | رایگان |

### جستجوهای پیشنهادی

برای هر mood این عبارت‌ها رو سرچ کن:

- **horror**: `dark ambient`, `horror drone`, `eerie atmosphere`, `suspense dark`
- **battle**: `epic battle`, `combat drums`, `war percussion`, `intense orchestral`
- **calm**: `peaceful ambient`, `soft piano`, `gentle wind`, `meditation`
- **mystery**: `mystery theme`, `suspense`, `detective ambient`, `puzzle`
- **triumph**: `victory fanfare`, `epic success`, `achievement`, `hopeful`

---

## مشخصات فنی

- **فرمت**: MP3, 128kbps, 44.1kHz
- **حجم**: حداکثر ۲ مگابایت هر فایل (برای سرعت لود)
- **مدت**: ۳۰ ثانیه تا ۲ دقیقه (به‌صورت حلقه پخش می‌شه)
- **لوپ**: فایل‌ها به‌صورت خودکار حلقه می‌شن، نیازی نیست خودت حلقه بذاری
- **crossfade**: ۲ ثانیه بین مودها به‌صورت خودکار

---

## نکات مهم

1. **حجم کم نگه دار** — هر فایل زیر ۲MB باشه تا موبایل سریع لود کنه
2. **تست روی موبایل** — ولوم پیش‌فرض ۵۰٪ هست، مطمئن شو خوب شنیده می‌شه
3. **بدون کپی‌رایت** — فقط از منابع CC0 یا رایگان استفاده کن
4. **نام‌گذاری** moodها باید دقیقاً یکی باشه: `horror`, `battle`, `calm`, `mystery`, `triumph`
