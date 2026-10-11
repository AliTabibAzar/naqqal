import type { Story } from "@/lib/types";

export const akademiCh1: Story = {
  id: "akademi-sahr-ch1",
  title: "آکادمی سحر — فصل ۱: ورود",
  description: "شب اول توی آکادمی. مراسم تقسیم، اولین دوست، و اولین راز.",
  author: "نقال",
  tags: ["جادو", "مدرسه", "ماوراء"],
  worldId: "akademi-sahr",
  startNode: "arrival",
  nodes: {
    // ── ورود ──
    arrival: {
      titleCard: "فصل ۱: ورود",
      chapter: "راه",
      particles: "sparkle",
      ambient: "wind",
      tint: "magic",
      mood: "mystery",
      text: "کالسکه‌ی سحر از لای ابرها پایین میاد. از پنجره، نوک یه برج سنگی رو می‌بینی که از مه بیرون زده. این آکادمی سحره — جایی که نامه‌ی طلایی دعوتت کرده بود.\n\n{name}... بالاخره رسیدی.",
      choices: [
        { text: "با اشتیاق از کالسکه پایین بیای", next: "gate" },
        { text: "یک لحظه صبر کنی و نفس عمیق بکشی", next: "gate" },
      ],
    },

    gate: {
      chapter: "دروازه",
      particles: "sparkle",
      ambient: "wind",
      tint: "magic",
      mood: "mystery",
      text: "دروازه‌ی اصلی آکادمی، دو تا ستون سنگی غول‌پیکره که روش با حروف نقره‌ای حکاکی شده: «دانش، قدرت، حقیقت».\n\nاستادی با عبای بنفش جلوت وایمیسته. می‌گه: «{name}، خوش اومدی. من استاد رازیانم. مراسم تقسیم شروع می‌شه.»",
      choices: [
        { text: "با احتراع سلام کنی", next: "hall", sets: ["respectful"] },
        { text: "بپرسی «تقسیم چیه؟»", next: "explain_sort", sets: ["curious"] },
      ],
    },

    explain_sort: {
      chapter: "دروازه",
      particles: "sparkle",
      ambient: "wind",
      tint: "magic",
      text: "رازیان لبخند می‌زنه: «آکادمی سه راه داره — راه آتش، راه آب، راه باد. هر کدوم یه نوع جادو داره. کلاه سحر — مثل شنلی که سر خودش تصمیم می‌گیره — تو رو به جایی می‌بره که تعلق داری.»\n\nمی‌گه: «ولی بعضی وقتا، کلاه نظر تو رو هم می‌پرسه.»",
      choices: [
        { text: "با اشتیاق وارد بشی", next: "hall" },
      ],
    },

    hall: {
      chapter: "تالار",
      particles: "embers",
      ambient: "city",
      tint: "magic",
      mood: "mystery",
      titleCard: "تالار تقسیم",
      text: "تالار بزرگه. سقف بلند، شمع‌های معلق، و صدها دانش‌آموز که دور یه سکوی سنگی حلقه زدن. وسط سکو، یه کلاه پارچه‌ای کهنه‌ست که مثل یه موجود زنده تکون می‌خوره.\n\nاستاد رازیان فریاد می‌زنه: «{name}!»\n\nسالن ساکت می‌شه. همه نگاهت می‌کنن.",
      choices: [
        { text: "با اعتماد به نفس قدم برداری", next: "hat_scene" },
        { text: "خجالت‌زده سرتو پایین بیاری", next: "hat_scene", sets: ["shy"] },
      ],
    },

    // ── کلاه سحر ──
    hat_scene: {
      chapter: "کلاه سحر",
      particles: "sparkle",
      ambient: "city",
      tint: "magic",
      mood: "mystery",
      text: "کلاه سحر رو سرت می‌ذاری. تاریک می‌شه. و بعد... یه صدا، مثل نجوا از درون خودت:\n\n«خب... تو کی هستی {name}؟»\n\nکلاه داره باهات حرف می‌زنه.",
      choices: [
        {
          text: "«کسی که می‌خواد کمک کنه»",
          next: "hat_fire_or_water",
          requires: { traits: ["kind"] },
        },
        {
          text: "«کسی که حقیقت رو می‌خواد»",
          next: "hat_air",
        },
        {
          text: "«کسی که از هیچی نمی‌ترسه»",
          next: "hat_fire_or_water",
          requires: { traits: ["brave"] },
        },
        {
          text: "سکوت کنی — بذار کلاه خودش تصمیم بگیره",
          next: "hat_fire_or_water",
          requires: { traits: ["cunning"] },
        },
      ],
    },

    hat_air: {
      chapter: "کلاه سحر",
      particles: "sparkle",
      ambient: "city",
      tint: "magic",
      mood: "triumph",
      text: "کلاه یه لحظه مکث می‌کنه. بعد با صدای بلند اعلام می‌کنه:\n\n«راه باد!»\n\nسالن منفجر می‌شه از تشویق. راه باد، راه حقیقت و دانشه. استاد رازیان لبخند می‌زنه: «آفرین {name}. راه باد، بهترین انتخابه... البته از نظر من.»",
      choices: [
        { text: "بری سر جات بین بچه‌های راه باد", next: "meet_friend", sets: ["house_air"] },
      ],
    },

    hat_fire_or_water: {
      chapter: "کلاه سحر",
      particles: "embers",
      ambient: "city",
      tint: "magic",
      mood: "mystery",
      text: "کلاه سحر عمیق فکر می‌کنه. بعد یه لحظه دندون‌هات رو لمس می‌کنه و فریاد می‌زنه:\n\n«راه آتش!»\n\nسالن از تشویق منفجر می‌شه. راه آتش، راه شجاعت و اراده‌ست.",
      choices: [
        { text: "بری سر جات بین بچه‌های راه آتش", next: "meet_friend", sets: ["house_fire"] },
      ],
    },

    // ── دوست + راز ──
    meet_friend: {
      chapter: "اولین شب",
      particles: "embers",
      ambient: "city",
      tint: "magic",
      mood: "calm",
      text: "بین بچه‌های خونه‌ات، یه پسر آروم با عینک گرد کنارت می‌شینه. معرفی می‌کنه: «من کاوه‌ام. تو {name} هستی، درسته؟ شنیدم کلاه باهات حرف زده... اون معمولاً با کسایی که حرف می‌زنه، یه چیز خاصی دارن.»\n\nکاوه نگاهش رو به سقف می‌دوزه: «شنیدی این هفته یه چیزی از زیر زمین اومده؟ استادها می‌گن صدای لوله‌ست، ولی من... من چیز دیگه‌ای شنیدم.»",
      choices: [
        { text: "«چی شنیدی؟» بپرسی", next: "secret_hint" },
        { text: "بگی «احتمالاً شایعه‌ست»", next: "night_room" },
      ],
    },

    secret_hint: {
      chapter: "اولین شب",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { whispers: true, intensity: 1 },
      text: "کاوه صداش رو پایین میاره: «یه صدای نفس... مثل اینکه کسی از ته چاه حرف می‌زنه. اسم یکی رو تکرار می‌کرد... اسم یکی از بچه‌های سال بالا.»\n\nنگاهش می‌کنی. چشماش می‌لرزه: «نگو به کسی. ولی اگه خواستی بدونی... فردا شب، بعد از نیمه‌شب، بیا کتابخونه. اونجاست که می‌شه فهمید.»",
      choices: [
        { text: "قبول کنی و بری اتاق", next: "night_room", sets: ["knows_secret", "library_night"] },
      ],
    },

    night_room: {
      chapter: "اولین شب",
      particles: "dust",
      ambient: "none",
      tint: "cold",
      mood: "calm",
      titleCard: "شب اول",
      text: "اتاق خوابت کوچیک ولی گرمه. تخت‌ها دو تا طبقه‌ست. از پنجره، ماه آسمون رو روشن کرده و برج‌های آکادمی مثل سایه‌های غول‌پیکر می‌درخشند.\n\n{name}... امشب اولین شبته. فردا کلاس‌ها شروع می‌شه. و شاید — فقط شاید — رازی که کاوه گفت، بزرگ‌تر از چیزی باشه که فکر می‌کنی.",
      choices: [
        { text: "با آرامش بخوابی", next: "ending_first_night" },
        { text: "بیدار بمونی و به حرف‌های کاوه فکر کنی", next: "ending_curious" },
      ],
    },

    // ── پایان‌های فصل ۱ ──
    ending_first_night: {
      ending: { id: "first_night", title: "شب آرام", good: true },
      chapter: "پایان فصل ۱",
      particles: "sparkle",
      ambient: "none",
      tint: "magic",
      mood: "triumph",
      effects: { intensity: 0 },
      text: "چشمات آروم بسته می‌شه. خواب‌هایی از نور و رنگ می‌بینی. وقتی صبح می‌شه، صدای زنگ آکادمی ات رو بیدار می‌کنه.\n\n{name}... اولین روزت شروع شده. و این فقط ابتدای ماجراست.",
      choices: [],
    },

    ending_curious: {
      ending: { id: "curious_night", title: "چشم‌های بیدار", good: true },
      chapter: "پایان فصل ۱",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "mystery",
      effects: { whispers: true, intensity: 1 },
      text: "بیدار می‌مونی و به حرف‌های کاوه فکر می‌کنی. «صدای نفس... اسم یکی رو تکرار می‌کرد...»\n\nنیمه‌شب، وقتی بقیه خوابن، از پنجره به بیرون نگاه می‌کنی. و در ته حیاط، یه نور قرمز کوچیک می‌بینی که یک بار چشمک می‌زنه و خاموش می‌شه.\n\n{name}... تو فقط شروع کردی.",
      choices: [],
    },
  },
};
