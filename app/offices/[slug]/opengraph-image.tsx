import { getOffice, getOfficeSlugs } from "@/lib/content/offices";
import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "UMIN Global office";

export async function generateStaticParams() {
  return (await getOfficeSlugs()).map((slug) => ({ slug }));
}

export default async function OfficeOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const office = await getOffice(slug);
  if (!office) return ogCard({ eyebrow: "Offices", title: "UMIN Global" });

  return ogCard({
    eyebrow: `${office.headquarters ? "Headquarters" : "Office"} · ${office.region}`,
    title: `UMIN Global ${office.city}`,
    subtitle: office.summary,
  });
}
