import { OG_SIZE, ogCard } from "@/components/ogCard";
import { TEAM_MEMBERS, findTeamMember } from "@/components/teamMembers";

export const size = OG_SIZE;
export const contentType = "image/png";

// Prerendered per person, so a shared profile link shows that person rather than a generic card.
export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = findTeamMember(slug);
  return ogCard({
    eyebrow: member?.role ?? "Team",
    title: member?.name ?? "UMIN Global",
    subtitle: member ? `${member.role} at UMIN Global.` : "The team behind UMIN Global.",
  });
}
