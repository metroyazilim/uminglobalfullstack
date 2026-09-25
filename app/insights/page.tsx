import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import BlogPostCard from "@/components/BlogPostCard";
import BlogSidebar from "@/components/BlogSidebar";
import Section from "@/components/ui/Section";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { description } from "@/components/seo";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";
import { getInsights } from "@/lib/content/insights";

const TITLE = "Insights | UMIN Global";
const DESCRIPTION = description(
  "Practical notes on technology, applied AI, growth marketing and international expansion,",
  "written by the team delivering the work at UMIN Global.",
);

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/insights" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/insights" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "insights");
}
export const revalidate = 300;

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Insights", path: "/insights" }]);

export default async function InsightsPage() {
  const insights = await getInsights();
  // Blog + ItemList rather than a bare CollectionPage: it is what makes the index eligible as an
  // article carousel, and every entry resolves to a real article page.
  const pageJsonLd = collectionPageJsonLd({
    path: "/insights",
    name: "Insights",
    description: DESCRIPTION,
    pageType: "Blog",
    itemType: "BlogPosting",
    items: insights.map((post) => ({
      name: post.title,
      path: `/insights/${post.slug}`,
      description: post.description,
    })),
  });
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Insights"
            breadcrumbLabel="Insights"
            kicker="Short notes from the work, not thought leadership."
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {insights.map((post, index) => (
                  <Reveal key={post.slug} delay={index < 2 ? 0 : 1} className="h-full">
                    <BlogPostCard post={post} />
                  </Reveal>
                ))}
              </div>
              <BlogSidebar />
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
