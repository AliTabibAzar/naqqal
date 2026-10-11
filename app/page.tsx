import Link from "next/link";
import { getAllStories } from "@/lib/story";
import { getAllWorlds } from "@/lib/world";
import CatalogClient from "@/components/CatalogClient";
import WorldCatalogClient from "@/components/WorldCatalogClient";

export default function Home() {
  const stories = getAllStories();
  const worlds = getAllWorlds();
  return (
    <div className="relative min-h-screen">
      {/* ambient background */}
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 10%, #1a2338 0%, #0a0e1a 50%, #05070f 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, rgba(212,168,83,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 md:py-16">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold/70">
            پلتفرم داستان‌های تعاملی
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-gold drop-shadow-[0_0_30px_rgba(212,168,83,0.3)]">
            سایه‌های روایت
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-bone-dim leading-relaxed">
            هر تصمیم، دنیای داستان رو عوض می‌کنه. انتخاب با توئه — عواقبش هم همین‌طور.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link
              href="/library"
              className="rounded-full border border-line px-5 py-2 text-bone-dim hover:border-gold/40 hover:text-gold transition-colors"
            >
              📚 کتابخانه‌ی من
            </Link>
          </div>
        </header>

        <WorldCatalogClient worlds={worlds} />

        <h2 className="mb-6 font-display text-2xl text-gold">📖 داستان‌ها</h2>
        <CatalogClient stories={stories} />

        <footer className="mt-16 border-t border-line pt-6 text-center text-xs text-bone-dim/50">
          ساخته‌شده با Next.js · همه‌چیز رایگان ·{" "}
          <span className="text-gold/50">آینده: حساب کاربری، پنل نویسنده، RPG</span>
        </footer>
      </div>
    </div>
  );
}
