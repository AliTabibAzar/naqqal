"use client";

import Link from "next/link";

// مرز خطای سراسری — اگه جایی توی کلاینت کرش رخ بده،
// به‌جای صفحه‌ی سفید، صفحه‌ی «تلاش دوباره» نشون می‌ده.
// (مهم برای مرورگرهای گوشی که رفتار storage/API متفاوتی دارن)
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-6 text-center"
    >
      <p className="font-display text-3xl text-gold">یه چیزی خراب شد</p>
      <p className="max-w-md text-sm leading-relaxed text-bone-dim">
        مشکلی توی اجرای صفحه پیش اومد. معمولاً با یه بار تلاش دوباره درست
        می‌شه — پیشرفتت از دست نرفته.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="cursor-pointer rounded-full border border-gold/40 bg-gold/10 px-6 py-2 text-sm text-gold transition-colors hover:bg-gold/20"
        >
          تلاش دوباره
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-2 text-sm text-bone-dim transition-colors hover:border-gold/40 hover:text-gold"
        >
          خانه
        </Link>
      </div>
    </div>
  );
}
