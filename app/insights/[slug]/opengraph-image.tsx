import { OG_SIZE, ogCard } from "@/components/ogCard";
import { INSIGHTS, findInsight } from "@/components/insights";

export const size = OG_SIZE;
export const contentType = "image/png";

// Prerendered per article, same as the page: without generateStaticParams this route would be
// rendered on demand on Vercel the first time a crawler or a social scraper asks for the card.
export function generateStaticParams() {
  return INSIGHTS.map((post) => ({ slug: post.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findInsight(slug);
  return ogCard({
    eyebrow: "Insights",
    title: post?.ogTitle ?? "Insights",
    subtitle: post?.ogSubtitle ?? "Notes from the work at UMIN Global.",
  });
}
