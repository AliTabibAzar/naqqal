import type { Metadata } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["arabic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "سایه‌های روایت | داستان‌های تعاملی",
  description:
    "پلتفرم داستان‌های تعاملی سینمایی — مسیر خودت رو بساز، هر تصمیم دنیای داستان رو عوض می‌کنه.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${lalezar.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-bone">
        {children}
      </body>
    </html>
  );
}
