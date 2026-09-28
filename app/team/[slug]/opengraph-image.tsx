import { OG_SIZE, ogCard } from "@/components/ogCard";
import { getTeamMember, getTeamSlugs } from "@/lib/content/team";

export const size = OG_SIZE;
export const contentType = "image/png";

// Prerendered per person, so a shared profile link shows that person rather than a generic card.
export async function generateStaticParams() {
  return (await getTeamSlugs()).map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  return ogCard({
    eyebrow: member?.role ?? "Team",
    title: member?.name ?? "UMIN Global",
    subtitle: member ? `${member.role} at UMIN Global.` : "The team behind UMIN Global.",
  });
}
