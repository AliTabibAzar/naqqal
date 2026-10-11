import type { Story } from "@/lib/types";

export const akademiCh2: Story = {
  id: "akademi-sahr-ch2",
  title: "آکادمی سحر — فصل ۲: شب اولین راز",
  description: "هفته‌ی اول تموم شده. کاوه صدات زده — کتابخونه، نیمه‌شب.",
  author: "سایه‌های روایت",
  tags: ["جادو", "مدرسه", "ماوراء"],
  worldId: "akademi-sahr",
  startNode: "week_later",
  nodes: {
    week_later: {
      titleCard: "فصل ۲: شب اولین راز",
      chapter: "هفته‌ی اول",
      particles: "sparkle",
      ambient: "city",
      tint: "magic",
      mood: "calm",
      text: "یه هفته از ورودت به آکادمی گذشته. کلاس‌ها رو دوست داری — تاریخ جادو، نوشتن طلسم، و پرواز با جارو (که هنوز نتونستی خوب یادش بگیری).\n\nولی ذهنت درگیر حرف‌های کاوه‌ست. «فردا شب، بعد از نیمه‌شب، بیا کتابخونه.»\n\n{name}... امشب اون شبه.",
      choices: [
        { text: "بری کتابخونه", next: "library_enter", sets: ["went_library"] },
        {
          text: "نری و ترجیح بدی بخوابی",
          next: "ending_safe",
          requires: { traits: ["cunning"] },
        },
        { text: "ولی دلت قرص نیست — بری ولی مراقب باشی", next: "library_enter", sets: ["careful"] },
      ],
    },

    library_enter: {
      chapter: "کتابخونه",
      particles: "dust",
      ambient: "cave",
      tint: "cold",
      mood: "mystery",
      effects: { torchlight: true, intensity: 1 },
      text: "کتابخونه‌ی آکادمی روزها یه جای آرومه، ولی شب... شب یه جای دیگه‌ست. قفسه‌های بلند مثل درختای تاریکن و نور ماه از پنجره‌های بلند میاد تو.\n\nکاوه رو کنار یه قفسه‌ی مخفی می‌بینی. صداش رو پایین میاره: «{name}... اومدی. بدو، بیا اینجا.»",
      choices: [
        { text: "نزدیکش بشی", next: "secret_door" },
        {
          text: "اول از پشت سرت رو چک کنی که کسی نباشه",
          next: "secret_door",
          requires: { traits: ["cunning"] },
          sets: ["noticed_shadow"],
        },
      ],
    },

    secret_door: {
      chapter: "کتابخونه",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { flicker: true, intensity: 2 },
      text: "کاوه یه کتاب رو از قفسه بیرون می‌کشه. یه صدای کلیک میاد و یکی از دیوارها آروم کنار می‌ره. پشت دیوار، راهروی تاریکی باز می‌شه که از تهش صدای نفس میاد.\n\nکاوه می‌گه: «اینجا رو فقط من و دو نفر دیگه پیدا کردن. از وقتی اومدم، هر شب از اینجا صدایی میاد.»\n\nصدای نفس بلندتر می‌شه. و یه اسم رو تکرار می‌کنه... اسم کاوه.",
      choices: [
        { text: "وارد راهرو بشی", next: "corridor", sets: ["entered_corridor"] },
        {
          text: "«کاوه، نباید بریم. برگردیم.»",
          next: "retreat",
          requires: { traits: ["kind"] },
        },
        {
          text: "صبر کنی و اول گوش بدی",
          next: "listen_first",
          requires: { traits: ["cunning"] },
        },
      ],
    },

    listen_first: {
      chapter: "کتابخونه",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { whispers: true, intensity: 2 },
      text: "گوش می‌دی. صدای نفس از ته راهرو میاد. و لابه‌لاش، کلماتی مثل نجوا:\n\n«کاوه... کاوه... بیا پایین...»\n\n{name}... اون صدا داره اسم دوستت رو صدا می‌زنه. و لحنش... لحن خطرناکیه.",
      choices: [
        { text: "بگی «صدا می‌گه اسم تو رو — تو نباید بری»", next: "corridor", sets: ["heard_voice", "warned"] },
        { text: "بپرسی «تو قبلاً این صدا رو شنیده بودی؟»", next: "corridor", sets: ["heard_voice", "deep_question"] },
      ],
    },

    retreat: {
      chapter: "کتابخونه",
      particles: "dust",
      ambient: "none",
      tint: "cold",
      mood: "calm",
      text: "می‌گی: «کاوه، نباید بریم. صدا خطرناکه.»\n\nکاوه یه لحظه مکث می‌کنه. بعد آروم سر تکون می‌ده: «حق با توئه. ولی... امشب نه. ولی فردا باید بفهمیم چیه.»\n\nدیوار رو برمی‌گردونی و آروم از کتابخونه بیرون میای. ولی توی راه، یه چیزی توی جیبت سنگینی می‌کنه... یه سنگ کوچیک سیاه که قبلاً اونجا نبود.",
      choices: [{ text: "بری اتاق و فردا فکر کنی", next: "ending_safe", sets: ["has_stone", "retreated"] }],
    },

    corridor: {
      chapter: "زیرزمین",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      shake: true,
      effects: { heartbeat: true, whispers: true, intensity: 2 },
      text: "وارد راهرو می‌شی. هوا سردتر می‌شه. دیوارها خیس‌ن و نور مشعل کاوه می‌لرزه. هر قدم که برمی‌داری، صدای نفس بلندتر می‌شه.\n\nبعد از چند دقیقه، به یه دروازه‌ی سنگی می‌رسی. روش یه نشونه حکاکی شده: یه چشم باز.\n\n{name}... پشت این دروازه، صدای نفس داره صدات می‌زنه.",
      choices: [
        { text: "دروازه رو باز کنی", next: "chamber" },
        {
          text: "اول با طلسم آتش کاوه رو روشن کنی",
          next: "chamber_with_light",
          requires: { origins: ["wizard-born"] },
          sets: ["used_magic"],
        },
        {
          text: "دست کاوه رو بگیری و آروم بری جلو",
          next: "chamber",
          requires: { traits: ["kind"] },
          sets: ["held_hand"],
        },
      ],
    },

    chamber_with_light: {
      chapter: "زیرزمین",
      particles: "embers",
      ambient: "cave",
      tint: "magic",
      mood: "mystery",
      effects: { intensity: 1 },
      text: "دستت رو بالا می‌بری و یه طلسم آتش ساده اجرا می‌کنی. تو خونه‌ی جادوگر بزرگ شدی — این طلسم برات مثل نفس کشیدنه.\n\nنور آتش اتاق رو روشن می‌کنه. و می‌بینی... اتاق بزرگه، وسطش یه چاه عمیقه. و کنار چاه، یه سایه‌ی ایستاده.\n\nسایه آروم برمی‌گرده. صورتش نداره. فقط دهانی باز داره که اسم کاوه رو تکرار می‌کنه.",
      choices: [{ text: "با ترس و شجاعت جلو بری", next: "chamber" }],
    },

    chamber: {
      chapter: "اتاق چاه",
      particles: "dust",
      ambient: "cave",
      tint: "blood",
      mood: "horror",
      shake: true,
      effects: { jumpScare: { text: "صورت نداره", flash: "red" }, heartbeat: true, intensity: 3 },
      text: "دروازه باز می‌شه. جلوی چاه، یه موجود ایستاده — سایه‌ای بدون صورت، فقط دهانی باز که اسم کاوه رو تکرار می‌کنه.\n\nکاوه جیغ می‌کشه و عقب می‌کشه. تو... {name}... وایمیستی.\n\nسایه دستش رو دراز می‌کنه. و تو می‌فهمی: این یه روحه. روح کسی که توی این چاه گیر افتاده.",
      choices: [
        {
          text: "با طلسم آتش روح رو برانی",
          next: "ending_banish",
          requires: { origins: ["wizard-born"] },
        },
        {
          text: "بپرسی «کی هستی؟»",
          next: "spirit_talk",
        },
        {
          text: "دست روح رو بگیری",
          next: "ending_sacrifice",
          requires: { traits: ["kind"] },
        },
        {
          text: "با کاوه فرار کنی",
          next: "ending_flee",
        },
      ],
    },

    spirit_talk: {
      chapter: "اتاق چاه",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { whispers: true, intensity: 2 },
      text: "می‌پرسی: «کی هستی؟»\n\nسایه یه لحظه ساکت می‌شه. بعد با صدایی مثل باد می‌گه: «من... من یه دانش‌آموز بودم. صد سال پیش. این چاه دروازه‌ست... دروازه به جایی که نباید باز بشه. و من... من بازش کردم.»\n\n«{name}... تو می‌تونی دروازه رو ببندی. ولی باید یه چیزی رو فدا کنی.»",
      choices: [
        { text: "«چی باید فدا کنم؟»", next: "ending_banish", sets: ["knows_truth"] },
        { text: "«می‌خوام کمکت کنم»", next: "ending_sacrifice", sets: ["knows_truth"], requires: { traits: ["kind"] } },
      ],
    },

    // ── پایان‌های فصل ۲ ──
    ending_banish: {
      ending: { id: "banish", title: "بانیش روح", good: true },
      chapter: "پایان فصل ۲",
      particles: "embers",
      ambient: "wind",
      tint: "magic",
      mood: "triumph",
      effects: { intensity: 0 },
      text: "دستت رو بالا می‌بری و طلسم بانیش رو اجرا می‌کنی. نور طلایی از کف دستت بیرون می‌زنه و سایه رو فرا می‌گیره. روح آروم، با یه ناله‌ی آرامش‌بخش، محو می‌شه.\n\nچاه بسته می‌شه. کاوه کنارت وایمیسته و با تعجب نگاهت می‌کنه: «{name}... تو کردی؟ تو واقعاً جادوگری.»\n\n{name}... تو اولین راز آکادمی رو حل کردی. و این فقط اول ماجراست.",
      choices: [],
    },

    ending_sacrifice: {
      ending: { id: "sacrifice", title: "فدای مهربانی", good: true },
      chapter: "پایان فصل ۲",
      particles: "sparkle",
      ambient: "none",
      tint: "magic",
      mood: "triumph",
      effects: { intensity: 0 },
      text: "دست سایه رو می‌گیری. سردی عمیقی تمام وجودت رو فرا می‌گیره. ولی تو ول نمی‌کنی.\n\nسایه آروم می‌گه: «{name}... ممنونم. تو بهم آرامش دادی.»\n\nنور سفیدی از سایه بیرون می‌زنه و چاه بسته می‌شه. تو روی زمین افتادی، ولی لبخند رو لبته. کاوه کمکت می‌کنه بلند شی.\n\n{name}... مهربانیت، بزرگ‌ترین جادو بود.",
      choices: [],
    },

    ending_flee: {
      ending: { id: "flee", title: "فرار شبانه", good: false },
      chapter: "پایان فصل ۲",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { heartbeat: true, intensity: 2 },
      text: "دست کاوه رو می‌گیری و می‌دویی. از راهرو، از کتابخونه، تا اتاق خواب. در رو می‌بندی و روی تخت می‌افتی.\n\nکاوه آروم می‌گه: «{name}... ما نتونستیم. ولی فردا باید به استادها بگیم.»\n\n{name}... تو فرار کردی. ولی اون صدا هنوز توی سنته. و فردا... فردا باید تصمیم بگیری.",
      choices: [],
    },

    ending_safe: {
      ending: { id: "safe_night", title: "شب امن", good: false },
      chapter: "پایان فصل ۲",
      particles: "sparkle",
      ambient: "none",
      tint: "cold",
      mood: "calm",
      effects: { intensity: 0 },
      text: "روی تخت دراز می‌کشی و چشمات رو می‌بندی. صدای نفس رو از پنجره می‌شنوی، ولی تصمیم می‌گیری بهش گوش ندی.\n\n{name}... تو یه شب آرام داشتی. ولی بعضی رازها، خودشون دنبالت میان.",
      choices: [],
    },
  },
};
