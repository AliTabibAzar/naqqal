import { notFound } from "next/navigation";
import { getWorld, getAllWorlds } from "@/lib/world";
import WorldClient from "@/components/WorldClient";

export function generateStaticParams() {
  return getAllWorlds().map((w) => ({ id: w.id }));
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const world = getWorld(id);
  if (!world) notFound();
  return <WorldClient world={world} />;
}
