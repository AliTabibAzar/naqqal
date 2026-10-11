import type { Story } from "@/lib/types";

export const saharStory: Story = {
  id: "sahar-geyrat",
  title: "سایه‌ی البرز",
  description:
    "در دل کوه‌های البرز، روستایی از یک نفرین کهن رنج می‌برد. تو آخرین بازمانده‌ی خاندان آتش‌بانی. شبی که ماه خون می‌شه، باید انتخاب کنی: آتش رو خاموش کنی، یا با سایه‌ها پیمان ببندی.",
  author: "نقال",
  tags: ["ماجراجویی", "ترسناک", "ایران باستان", "فانتزی تاریک"],
  startNode: "village_night",
  nodes: {
    village_night: {
      titleCard: "فصل اول — آتشی که نباید خاموش می‌شد",
      chapter: "آتشکده‌ی کوچک",
      particles: "embers",
      ambient: "wind",
      text: "باد سردی از دل کوه می‌وزه و شعله‌ی آتشکده رو به لرزه درمیاره. تو آخرین آتش‌بان خاندان «مهرگان» هستی. سه شب پیش، پدربزرگت روی تخت گفت: «وقتی ماه خون می‌شه، سایه‌ها بیدار میشن. تو باید تصمیم بگیری — نگهشون دار، یا ولشون کن.»\n\nامشب اون شب است. ماه از پشت کوه سرخ درمیاد.",
      choices: [
        { text: "مشعل رو برداری و به سمت غار کوه بری", next: "cave_entrance", sets: ["has_torch"] },
        { text: "در آتشکده بمونی و دعا بخونی", next: "shrine_ritual" },
        { text: "به سمت روستای متروکه بری", next: "abandoned_village" },
      ],
    },

    cave_entrance: {
      chapter: "دهانه‌ی غار",
      particles: "dust",
      ambient: "cave",
      tint: "cold",
      text: "مشعل رو بالا می‌گیری. دهانه‌ی غار مثل دهن باز یه هیولاست. روی صخره‌ی کناری، حکاکی‌های کهن هست: «هر که وارد شود، یا آتش می‌آورد یا خاکستر.»\n\nصدایی از دل تاریکی می‌شنوی — مثل زنجیری که کشیده بشه.",
      choices: [
        { text: "با احتیاط وارد غار بشی", next: "cave_deep" },
        { text: "اول به اطراف نگاه کنی", next: "cave_symbols" },
        { text: "برگردی — اینجا جای تو نیست", next: "village_night2" },
      ],
    },

    cave_deep: {
      chapter: "دل تاریکی",
      particles: "sparkle",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { heartbeat: true, whispers: true, flicker: true, intensity: 2, torchlight: true },
      text: "هوای غار سنگینه و بوی خاک مرطوب می‌دی. مشعل سایه‌های عجیبی روی دیوار میندازه. ناگهان به یه سالن بزرگ می‌رسی. وسط سالن، یه تخته‌سنگ بزرگ هست و روش یه شمشیر قدیمی با دسته‌ی سرخ.\n\nپشت تخته‌سنگ، یه شکل ایستاده — چشماش قرمزه.",
      choices: [
        { text: "شمشیر رو برداری", next: "take_sword" },
        { text: "فرار کنی", next: "cave_collapse", requires: { withoutFlags: ["coward"] } },
        { text: "با صدای بلند بپرسی: کی هستی؟", next: "shadow_talk" },
      ],
    },

    cave_symbols: {
      chapter: "حکاکی‌های فراموش‌شده",
      particles: "sparkle",
      ambient: "cave",
      text: "مشعل رو نزدیک دیوار می‌بری. حکاکی‌ها داستان خاندان مهرگان رو تعریف می‌کنن: آن‌ها نگهبانان «آتش ازلی» بودن که مانع از بیداری سایه‌ها می‌شد. اما یکی از اجدادت خیانت کرد و آتش رو ضعیف کرد.\n\nیه نوشته‌ی آخر هست: «تنها راه، آتش ازلی رو به قلب سایه‌ها برگردونه.»",
      choices: [
        { text: "شمشیر رو برداری", next: "take_sword" },
        { text: "نشانی آتش ازلی رو پیدا کنی", next: "find_eternal_fire" },
        { text: "به روستا برگردی و هشدار بدی", next: "warn_village" },
      ],
    },

    take_sword: {
      chapter: "پیمان با فولاد",
      particles: "embers",
      ambient: "battle",
      tint: "magic",
      shake: true,
      text: "دستت رو روی دسته‌ی شمشیر می‌ذاری. فلز سرده، ولی با لمس تو گرم می‌شه. نور طلایی‌ای از تیغه ساطع می‌شه و شکل پشت تخته‌سنگ عقب می‌نشینه.\n\nصدایی توی سرت: «بالاخره یکی از مهرگان‌ها اومد. ولی آیا لایقی؟»",
      choices: [
        { text: "«من لایق هستم.» بگو", next: "claim_worthy" },
        { text: "«من فقط می‌خوام مردمم رو نجات بدم.»", next: "claim_humble" },
        { text: "شمشیر رو پرت کنی", next: "throw_sword" },
      ],
    },

    shadow_talk: {
      chapter: "گفتگو با سایه",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { heartbeat: true, glitchText: true, whispers: true, intensity: 2 },
      text: "سایه جلوتر میاد. حالا می‌تونی ببینیش: یه شکل انسانی از دود سیاه، با دو چشم قرمز. می‌گه: «من سایه‌ی اولین مهرگان هستم — همون که خیانت کرد. از تو می‌خوام که آتش رو ول کنی. آزادم کن.»\n\nدستش رو دراز می‌کنه.",
      choices: [
        { text: "دستش رو بگیری", next: "ally_shadow" },
        { text: "رد کنی", next: "reject_shadow" },
        { text: "بپرسی: چرا خیانت کردی؟", next: "ask_betrayal" },
      ],
    },

    cave_collapse: {
      chapter: "فرار",
      particles: "dust",
      ambient: "cave",
      shake: true,
      mood: "battle",
      effects: { adrenaline: true, heartbeat: true, intensity: 3 },
      text: "برمی‌گردی و می‌دویی. ولی صدای ریزش سنگ بلند می‌شه. سقف غار داره فرو می‌ریزه. مشعل از دستت می‌افته.",
      choices: [
        { text: "با تمام سرعت بدو", next: "death_collapse" },
        { text: "خودت رو پشت صخره پنهان کنی", next: "survive_collapse", requires: { flags: ["has_torch"] } },
      ],
    },

    death_collapse: {
      death: true,
      particles: "dust",
      shake: true,
      mood: "horror",
      effects: { jumpScare: { text: "خاکستر شدی", flash: "red" }, heartbeat: true, intensity: 3 },
      text: "سنگی روی سرت فرو می‌ریزه. تاریکی مطلق. سایه‌ها دورت جمع میشن و آروم می‌خندن. تو بازمانده‌ی خاندان مهرگان بودی — و همین‌جا خاکستر شدی.",
      choices: [],
    },

    survive_collapse: {
      chapter: "زنده موندن",
      particles: "dust",
      ambient: "cave",
      text: "پشت صخره خم می‌شی و سنگ‌ها دورت فرو می‌ریزن. وقتی سکوت می‌شه، می‌بینی فقط یه راهروی باریک باقی مونده. مشعل هنوز دستته — و شعله‌ش سرخ‌تر شده.",
      choices: [
        { text: "از راهروی باریک بری جلو", next: "find_eternal_fire" },
        { text: "برگردی", next: "warn_village" },
      ],
    },

    find_eternal_fire: {
      chapter: "آتش ازلی",
      particles: "embers",
      ambient: "cave",
      tint: "magic",
      text: "راهرو به یه اتاق کوچک و مقدس می‌رسه. وسط اتاق، یه کاسه‌ی سنگی هست و روش شعله‌ای آبی می‌سوزه — آتش ازلی. برای هزاران سال اینجا منتظر مونده.\n\nصدای آتش می‌گه: «برای برگردوندنم به قلب سایه‌ها، باید چیزی رو فدا کنی.»",
      choices: [
        { text: "«خونم رو فدا می‌کنم.»", next: "sacrifice_blood" },
        { text: "«خاطرم رو فدا می‌کنم.»", next: "sacrifice_memory" },
        { text: "«هیچ‌وقت فدا نمی‌کنم.»", next: "refuse_sacrifice" },
      ],
    },

    sacrifice_blood: {
      chapter: "فداکاری",
      particles: "embers",
      ambient: "battle",
      tint: "blood",
      shake: true,
      text: "دستت رو بالای کاسه می‌بری. خونت روی شعله‌ی آبی می‌چکه و آتش سرخ می‌شه. دردی عمیق تمام وجودت رو می‌گیره، ولی قدرتی عظیم وارد بدنت می‌شه.\n\nحالا تو حامل آتش ازلی هستی. باید به قلب سایه‌ها بری.",
      choices: [
        { text: "به سمت قلب سایه‌ها حرکت کنی", next: "heart_of_shadows" },
      ],
    },

    sacrifice_memory: {
      chapter: "فراموشی",
      particles: "sparkle",
      ambient: "cave",
      tint: "magic",
      text: "چشمات رو می‌بندی و تصویر پدربزرگ، روستا، و همه‌ی خاطراتت رو به آتش می‌سپاری. وقتی چشمات رو باز می‌کنی، دیگه اسم خودت رو یادت نیست. ولی می‌دونی چه کاری باید بکنی.\n\nآتش ازلی در سینه‌ات می‌تپه.",
      choices: [
        { text: "بی‌نام و بی‌تردید به قلب سایه‌ها بری", next: "heart_of_shadows", sets: ["no_memory"] },
      ],
    },

    refuse_sacrifice: {
      chapter: "طمع",
      particles: "embers",
      ambient: "cave",
      tint: "fear",
      shake: true,
      text: "می‌گی هیچ‌چیز رو فدا نمی‌کنی. شعله‌ی آبی خاموش می‌شه و اتاق تاریک می‌شه. صدایی خشمگین: «پس تو هم مثل اجدادت هستی — فقط می‌خوای قدرت رو.»\n\nسایه‌ها از دیوارها بیرون می‌زنن.",
      choices: [
        { text: "بجنگی", next: "death_shadows" },
        { text: "فرار کنی", next: "escape_alone" },
      ],
    },

    death_shadows: {
      death: true,
      particles: "dust",
      tint: "blood",
      shake: true,
      mood: "horror",
      effects: { jumpScare: { text: "سایه‌ها برنده‌اند", flash: "red" }, heartbeat: true, intensity: 3 },
      text: "سایه‌ها دورت حلقه می‌زنن. سرما استخون‌هات رو می‌شکنه. آخرین چیزی که می‌بینی، شعله‌ی خاموش آتشکده‌ست.",
      choices: [],
    },

    escape_alone: {
      chapter: "گریز",
      particles: "dust",
      ambient: "wind",
      text: "از غار بیرون می‌دی. ماه خون هنوز بالای کوه هست. روستا رو می‌بینی — و دودی که ازش بلند می‌شه. سایه‌ها دارن حمله می‌کنن.\n\nمی‌تونی فرار کنی و زنده بمونی. ولی مردمت...",
      choices: [
        { text: "بری و خودت رو نجات بدی", next: "ending_coward" },
        { text: "برگردی و بجنگی", next: "last_stand" },
      ],
    },

    heart_of_shadows: {
      titleCard: "فصل آخر — قلب تاریکی",
      chapter: "قلب سایه‌ها",
      particles: "embers",
      ambient: "battle",
      tint: "magic",
      shake: true,
      mood: "horror",
      effects: { heartbeat: true, whispers: true, flicker: true, intensity: 3, torchlight: true },
      text: "به یه غار بزرگ می‌رسی که هزاران سایه توش شناورن. وسط غار، یه قلب سیاه می‌تپه — منبع نفرین. سایه‌ی اولین مهرگان جلوی تو ظاهر می‌شه.\n\n«بالاخره اومدی. حالا باید انتخاب کنی — نفرین رو بشکنی، یا جاش رو بگیری.»",
      choices: [
        { text: "آتش ازلی رو در قلب سایه‌ها فرو کنی", next: "ending_breaker", requires: { flags: [] } },
        { text: "جای سایه‌ی اول رو بگیری", next: "ending_new_shadow" },
        { text: "همه چیز رو با هم نابود کنی", next: "ending_annihilation", dice: { sides: 20, difficulty: 12, success: "ending_breaker", fail: "ending_annihilation" } },
      ],
    },

    ending_breaker: {
      ending: { id: "breaker", title: "شکننده‌ی نفرین", good: true },
      chapter: "پایان",
      particles: "embers",
      ambient: "wind",
      tint: "magic",
      mood: "triumph",
      effects: { intensity: 0 },
      text: "شمشیر آتشین رو در قلب سایه‌ها فرو می‌بری. نور طلایی تمام غار رو پر می‌کنه. سایه‌ها فریاد می‌کشن و مثل دود محو می‌شن. نفرین شکسته.\n\nصبح می‌شه. ماه عادی بالای کوه هست. تو بیرون میای و روستایی‌ها رو می‌بینی که از خونه‌هاشون بیرون اومدن. اسمت رو فریاد می‌زنن.\n\nتو آخرین آتش‌بان مهرگان بودی — و آتش رو برای همیشه آزاد کردی.",
      choices: [],
    },

    ending_new_shadow: {
      ending: { id: "new_shadow", title: "سایه‌ی تازه", good: false },
      chapter: "پایان",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { heartbeat: true, intensity: 1 },
      text: "دستت رو دراز می‌کنی و قدرت سایه‌ها رو قبول می‌کنی. تاریکی در وجودت نفوذ می‌کنه. حالا تو سایه‌ی جدیدی — قوی‌تر از هر چیزی که بود.\n\nولی دیگه انسان نیستی. و روستا، زیر سایه‌ی تو، برای همیشه در تاریکی فرو می‌ره.",
      choices: [],
    },

    ending_annihilation: {
      ending: { id: "annihilation", title: "نابودی همه‌چیز", good: false },
      chapter: "پایان",
      particles: "dust",
      tint: "blood",
      shake: true,
      ambient: "battle",
      mood: "horror",
      effects: { jumpScare: { text: "خاکستر", flash: "white" }, intensity: 3 },
      text: "تصمیم می‌گی همه چیز رو با هم نابود کنی. آتش ازلی و قلب سایه‌ها همزمان منفجر می‌شن. غار فرو می‌ریزه.\n\nوقتی چشمات رو باز می‌کنی، هیچی نیست. نه سایه‌ها، نه آتش، نه روستا. فقط خاکستر و سکوت.\n\nگاهی نابودی، نوعی نجات نیست.",
      choices: [],
    },

    ending_coward: {
      ending: { id: "coward", title: "فرار‌کننده", good: false },
      chapter: "پایان",
      particles: "dust",
      ambient: "wind",
      text: "می‌دویی و به عقب نگاه نمی‌کنی. صدای فریاد مردم رو پشت سرت می‌شنوی. ماه خون بالای سرت می‌درخشه.\n\nزنده موندی. ولی هر شب، وقتی چشمات رو می‌بندی، صداها رو می‌شنوی. تو فرار کردی — و خاندان مهرگان با تو تموم شد.",
      choices: [],
    },

    last_stand: {
      chapter: "ایستادگی",
      particles: "embers",
      ambient: "battle",
      tint: "blood",
      shake: true,
      mood: "battle",
      effects: { adrenaline: true, lowHealth: 0.45, heartbeat: true, intensity: 3 },
      text: "برمی‌گردی. مشعلت رو بالا می‌گیری و جلوی در آتشکده می‌ایستی. سایه‌ها می‌رسن. تو می‌جنگی — با آتش، با فریاد، با همه‌ی وجودت.\n\nمردم روستا از پشت سرت میان و کنارت می‌جنگن. برای اولین بار، خاندان مهرگان تنها نیست.",
      choices: [
        { text: "«برای آتش!» فریاد بکشی", next: "ending_unity" },
      ],
    },

    ending_unity: {
      ending: { id: "unity", title: "اتحاد آتش", good: true },
      chapter: "پایان",
      particles: "embers",
      ambient: "wind",
      tint: "magic",
      mood: "triumph",
      effects: { intensity: 0 },
      text: "فریادت با فریاد مردم یکی می‌شه. نوری طلایی از آتشکده بیرون می‌زنه و سایه‌ها رو می‌سوزونه. ولی این بار، آتش فقط مال تو نیست — مال همه‌ی مردمه.\n\nسایه‌ها عقب‌نشینی می‌کنن. نفرین ضعیف می‌شه. و تو می‌فهمی که آتش‌بانی واقعی، تنها نگهبانی نیست — بلکه اتحاده.",
      choices: [],
    },

    village_night2: {
      chapter: "بازگشت به آتشکده",
      particles: "embers",
      ambient: "wind",
      text: "برمی‌گردی. شعله‌ی آتشکده ضعیف‌تر شده. باید زودتر تصمیم بگیری.",
      choices: [
        { text: "مشعل رو برداری و به غار بری", next: "cave_entrance", sets: ["has_torch"] },
        { text: "در آتشکده بمونی", next: "shrine_ritual" },
      ],
    },

    shrine_ritual: {
      chapter: "دعا",
      particles: "embers",
      ambient: "wind",
      tint: "magic",
      text: "روی زانو می‌شینی و دعای آتش‌بانان رو زمزمه می‌کنی. شعله آروم‌آروم قوی‌تر می‌شه. ولی صدایی از بیرون می‌شنوی — جیغ مردم روستا.\n\nسایه‌ها حمله کردن.",
      choices: [
        { text: "بیرون بری و بجنگی", next: "last_stand" },
        { text: "در آتشکده قفل بشی", next: "ending_shrine_keeper" },
      ],
    },

    ending_shrine_keeper: {
      ending: { id: "shrine_keeper", title: "نگهبان آتشکده", good: false },
      chapter: "پایان",
      particles: "embers",
      ambient: "wind",
      tint: "fear",
      text: "در آتشکده رو قفل می‌کنی و کنار شعله می‌شینی. بیرون، جیغ‌ها کم‌کم قطع می‌شه. تو زنده موندی.\n\nولی وقتی صبح می‌شه، بیرون رو نگاه می‌کنی — روستا خالیه. تو تنها نگهبان آتشی هستی که دیگه کسی رو نجات نمی‌ده.",
      choices: [],
    },

    abandoned_village: {
      titleCard: "روستای فراموش‌شده",
      chapter: "روستای متروکه",
      particles: "dust",
      ambient: "wind",
      tint: "cold",
      text: "روستای متروکه زیر نور ماه خون وحشتناکه. خونه‌ها خالی ان، ولی در بعضی‌ها شمع روشن هست. در میدان مرکزی، یه چاه قدیمی هست و ازش بخار سرد بلند می‌شه.\n\nکنار چاه، یه پیرزن نشسته. ولی سایه‌نداره.",
      choices: [
        { text: "با پیرزن حرف بزنی", next: "witch_talk" },
        { text: "داخل چاه نگاه کنی", next: "look_well" },
        { text: "برگردی", next: "village_night2" },
      ],
    },

    witch_talk: {
      chapter: "گفتگوی بی‌سایه",
      particles: "sparkle",
      ambient: "wind",
      tint: "magic",
      text: "پیرزن سرت رو نگاه می‌کنه و می‌گه: «می‌دونم از کجا اومدی، مهرگان. من آخرین کسی بودم که آتش‌بان بود — قبل از تو.»\n\nمی‌گه سایه‌ها رو می‌شه با آتش ازلی شکست، ولی باید به غار بری و اون آتش رو پیدا کنی.",
      choices: [
        { text: "«کجاست آتش ازلی؟»", next: "find_eternal_fire", sets: ["witch_hint"] },
        { text: "«چرا سایه‌دار نیستی؟»", next: "witch_secret" },
      ],
    },

    witch_secret: {
      chapter: "راز پیرزن",
      particles: "sparkle",
      ambient: "wind",
      tint: "magic",
      text: "پیرزن لبخند تلخی می‌زنه: «چون من با سایه‌ها پیمان بستم. آزادشون کردم تا از شر آتش خلاص بشم. ولی حالا خودم سایه‌نیستم و نه آتش‌بان. در هیچ‌جا جام ندارم.»\n\n«تو می‌تونی بهتر از من انتخاب کنی.»",
      choices: [
        { text: "«به غار می‌رم.»", next: "cave_entrance", sets: ["has_torch", "witch_hint"] },
        { text: "«من هم مثل تو پیمان می‌بندم.»", next: "ending_pact_shadow" },
      ],
    },

    ending_pact_shadow: {
      ending: { id: "pact_shadow", title: "پیمان‌شکن", good: false },
      chapter: "پایان",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      text: "دستت رو دراز می‌کنی و با سایه‌ها پیمان می‌بندی. آزادی‌ای که می‌خوای رو به دست می‌اری، ولی بهایش رو مردمت می‌دن.\n\nپیرزن آروم می‌گه: «تو دومین مهرگانی هستی که همین اشتباه رو می‌کنه.»\n\nو تو می‌فهمی که آزادی بدون مسئولیت، فقط نوعی بردگیه.",
      choices: [],
    },

    look_well: {
      chapter: "در چاه",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      mood: "horror",
      effects: { heartbeat: true, whispers: true, flicker: true, intensity: 2 },
      text: "سرت رو بالای چاه خم می‌کنی. ته چاه تاریکه، ولی یه نور قرمز می‌بینی. و یه صدا: «پایین بیا...»",
      choices: [
        { text: "پایین بری", next: "death_well" },
        { text: "عقب بکشی", next: "village_night2" },
      ],
    },

    death_well: {
      death: true,
      particles: "dust",
      tint: "blood",
      shake: true,
      mood: "horror",
      effects: { jumpScare: { text: "دهانه‌ی تاریکی", flash: "red" }, heartbeat: true, intensity: 3 },
      text: "پایین می‌ری. ته چاه، سایه‌ها منتظرن. چاه دهانه‌ای بود به قلب تاریکی. و تو خودت رو تقدیمش کردی.",
      choices: [],
    },

    ally_shadow: {
      chapter: "پیمان با تاریکی",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      text: "دست سایه رو می‌گیری. سرمایی عمیق تمام وجودت رو فرا می‌گیره. سایه می‌گه: «حالا تو حامل مایی. ولی برای آزادی کامل، باید آتش ازلی رو نابود کنی.»\n\nمی‌تونی قبول کنی، یا پشیمون بشی.",
      choices: [
        { text: "قبول کنی", next: "ending_pact_shadow" },
        { text: "پشیمون بشی و رد کنی", next: "reject_shadow" },
      ],
    },

    reject_shadow: {
      chapter: "مقاومت",
      particles: "embers",
      ambient: "cave",
      tint: "magic",
      shake: true,
      text: "دستت رو می‌کشی عقب. می‌گی: «من مهرگانم — نگهبان آتم.» سایه خشمگین می‌شه و دودش دورت حلقه می‌زنه. ولی مشعلت مقاومت می‌کنه.\n\nسایه عقب‌نشینی می‌کنه و غلغلک‌زنان: «تو راه غار رو می‌دونی. ولی آیا لایق اون آتشی؟»",
      choices: [
        { text: "به سمت آتش ازلی بری", next: "find_eternal_fire" },
        { text: "برگردی و مردم رو هشدار بدی", next: "warn_village" },
      ],
    },

    ask_betrayal: {
      chapter: "دلیل خیانت",
      particles: "dust",
      ambient: "cave",
      tint: "fear",
      text: "سایه ساکت می‌شه. بعد آروم: «آتش‌ها من رو زنده نگه داشتن، ولی من پیر شدم. ترسیدم. خواستم آزاد باشم. ولی آزادی بدون نور، فقط تاریکیه.»\n\n«تو می‌تونی بهتر از من انتخاب کنی.»",
      choices: [
        { text: "«من انتخاب می‌کنم که بجنگم.»", next: "find_eternal_fire" },
        { text: "«من هم می‌ترسم.»", next: "ally_shadow" },
      ],
    },

    claim_worthy: {
      chapter: "لیاقت",
      particles: "embers",
      ambient: "battle",
      tint: "magic",
      text: "«من لایق هستم.» صدات توی غار می‌پیچه. شمشیر در دستت می‌درخشه. شکل سایه آروم: «شاید. ولی لیاقت با شمشیر ثابت نمی‌شه — با فداکاری.»\n\nباید آتش ازلی رو پیدا کنی.",
      choices: [
        { text: "جستجو برای آتش ازلی", next: "find_eternal_fire" },
      ],
    },

    claim_humble: {
      chapter: "فروتنی",
      particles: "embers",
      ambient: "cave",
      tint: "magic",
      text: "«من فقط می‌خوام مردمم رو نجات بدم.» سایه مکث می‌کنه. بعد آروم: «فروتنی... چیزیه که اجدادت فراموش کردن. شاید تو متفاوت باشی.»\n\nشمشیر سبک‌تر می‌شه در دستت.",
      choices: [
        { text: "جستجو برای آتش ازلی", next: "find_eternal_fire", sets: ["humble"] },
      ],
    },

    throw_sword: {
      chapter: "طغیان",
      particles: "dust",
      ambient: "cave",
      shake: true,
      text: "شمشیر رو پرت می‌کنی. به دیوار می‌خوره و صدای فلز می‌پیچه. سایه خشمگین: «بی‌احترامی! بدون شمشیر هیچی نیستی.»\n\nسایه‌ها حمله می‌کنن.",
      choices: [
        { text: "بجنگی با دست خالی", next: "death_shadows" },
        { text: "فرار کنی", next: "escape_alone" },
      ],
    },

    warn_village: {
      chapter: "هشدار",
      particles: "dust",
      ambient: "wind",
      text: "به روستا برمی‌گردی و فریاد می‌زنی: «سایه‌ها میان!» بعضی‌ها باور می‌کنن، بعضی‌ها می‌خندن. ولی وقتی ماه خون بالاتر می‌ره، همه می‌فهمن.",
      choices: [
        { text: "کنار مردم بجنگی", next: "last_stand" },
        { text: "تنهایی فرار کنی", next: "ending_coward" },
      ],
    },
  },
};
