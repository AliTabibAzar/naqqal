import { notFound } from "next/navigation";
import { getStory, getAllStoryIds } from "@/lib/story";
import { getWorldOfStory } from "@/lib/world";
import StoryReader from "@/components/StoryReader";

// این مسیر بر اساس params داده لود می‌کنه.
// (فلگ instant حذف شده تا با خروجی استاتیک سازگار باشه — همه‌چیز موقع بیلد رندر می‌شه)
export function generateStaticParams() {
  // همه‌ی داستان‌ها شامل فصل‌های دنیا — لازم برای خروجی استاتیک (GitHub Pages)
  return getAllStoryIds().map((id) => ({ id }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = getStory(id);
  if (!story) notFound();
  const world = getWorldOfStory(id);
  return <StoryReader story={story} world={world ?? undefined} />;
}
