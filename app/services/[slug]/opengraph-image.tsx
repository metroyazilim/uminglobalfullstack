import { CATEGORIES, SERVICES } from "@/components/services";
import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "UMIN Global service";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function ServiceOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);
  if (!service) return ogCard({ eyebrow: "Services", title: "UMIN Global" });

  return ogCard({
    eyebrow: CATEGORIES[service.category].label,
    title: service.name,
    subtitle: service.summary,
  });
}
