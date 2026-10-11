import { notFound } from "next/navigation";
import { getStory } from "@/lib/story";
import { getWorldOfStory } from "@/lib/world";
import StoryReader from "@/components/StoryReader";

// این مسیر بر اساس params داده لود می‌کنه؛ به‌صورت blocking رندر می‌شه
// (طبق مستندات Next.js 16 — instant-shell-url-data)
export const instant = false;

export function generateStaticParams() {
  return [{ id: "sahar-geyrat" }];
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
