import type { NextConfig } from "next";

// حالت خروجی استاتیک برای GitHub Pages:
//   NAQQAL_STATIC=1 NAQQAL_BASE_PATH=/naqqal npm run build
// بیلد معمولی (لوکال/VPS) بدون این envها انجام می‌شه و دست‌نخورده می‌مونه.
const isStaticExport = process.env.NAQQAL_STATIC === "1";

const nextConfig: NextConfig = {
  /* config options here */
  // نکته: cacheComponents با output:'export' ناسازگاره (PPR سرور می‌خواد)،
  // پس توی حالت استاتیک خاموش می‌شه. exportهای `instant` هم به همین دلیل
  // از پیج‌ها حذف شدن — توی خروجی استاتیک همه‌چیز موقع بیلد رندر می‌شه.
  ...(isStaticExport
    ? {}
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  ...(isStaticExport
    ? {
        output: "export",
        basePath: process.env.NAQQAL_BASE_PATH || "/naqqal",
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
