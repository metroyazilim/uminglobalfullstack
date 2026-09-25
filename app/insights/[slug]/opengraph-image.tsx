import { OG_SIZE, ogCard } from "@/components/ogCard";
import { getInsight, getInsightSlugs } from "@/lib/content/insights";

export const size = OG_SIZE;
export const contentType = "image/png";

// Prerender known articles while allowing newly published posts to resolve without a rebuild.
export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 300;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getInsight(slug);
  return ogCard({
    eyebrow: "Insights",
    title: post?.ogTitle ?? "Insights",
    subtitle: post?.ogSubtitle ?? "Notes from the work at UMIN Global.",
  });
}
