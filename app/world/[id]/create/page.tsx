import { notFound } from "next/navigation";
import { getWorld, getAllWorlds } from "@/lib/world";
import CharacterCreator from "@/components/CharacterCreator";

export function generateStaticParams() {
  return getAllWorlds().map((w) => ({ id: w.id }));
}

export default async function CreateCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const world = getWorld(id);
  if (!world) notFound();
  return <CharacterCreator world={world} />;
}
