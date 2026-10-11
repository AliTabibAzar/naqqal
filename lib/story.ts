import type { Story, StoryNode } from "@/lib/types";
import { saharStory } from "@/content/stories/sahar-geyrat";
import { akademiCh1 } from "@/content/stories/akademi-sahr-ch1";
import { akademiCh2 } from "@/content/stories/akademi-sahr-ch2";

const stories: Story[] = [saharStory, akademiCh1, akademiCh2];

export function getAllStories(): Story[] {
  // فصل‌های دنیا جداگانه در کاتالوگ نشون داده نمی‌شن
  return stories.filter((s) => !s.worldId);
}

export function getAllStoryIds(): string[] {
  // همه‌ی داستان‌ها شامل فصل‌های دنیا — برای generateStaticParams (خروجی استاتیک)
  return stories.map((s) => s.id);
}

export function getStory(id: string): Story | null {
  return stories.find((s) => s.id === id) ?? null;
}

export function getNode(story: Story, id: string): StoryNode | null {
  return story.nodes[id] ?? null;
}

export function isValidNext(story: Story, next: string): boolean {
  return Boolean(story.nodes[next]);
}

export function countEndings(story: Story): number {
  return Object.values(story.nodes).filter((n) => n.ending).length;
}

export function getEndings(story: Story) {
  return Object.entries(story.nodes)
    .filter(([, n]) => n.ending)
    .map(([id, n]) => ({ nodeId: id, ...n.ending! }));
}
