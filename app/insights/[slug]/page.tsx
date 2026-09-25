import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import BlogSidebar from "@/components/BlogSidebar";
import BlogPostShareRow from "@/components/BlogPostShareRow";
import BlogPostAuthor from "@/components/BlogPostAuthor";
import Section from "@/components/ui/Section";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { RichText } from "@/components/RichText";
import { SITE_URL, absoluteUrl } from "@/components/seo";
import { breadcrumbJsonLd } from "@/components/structuredData";
import type { Block } from "@/components/insights";
import { getInsight, getInsightSlugs } from "@/lib/content/insights";

// One route for every article; the content is managed through the admin with bundled content as
// a fallback when the database is unavailable.
export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Newly published articles can render on demand without waiting for a rebuild.
export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) return {};

  const url = `/insights/${post.slug}`;
  return {
    title: `${post.metaTitle} | UMIN Global`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: ["UMIN Global"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

// Body renderer. Keeping the block union small is deliberate: an article that needs a shape not
// in this list needs a decision about the design, not an arbitrary HTML escape hatch.
function BodyBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return <RichText html={block.text} className="t-lead pt-8 text-ink" />;
    case "p":
      return <RichText html={block.text} className="t-body pt-5 text-body" />;
    case "h2":
      return <h2 className="t-h3 pt-8 text-ink">{block.text}</h2>;
    case "list":
      return (
        <ul className="mt-5 divide-y divide-divider border-y border-divider">
          {block.items.map((item) => (
            <li key={item} className="t-body flex gap-4 py-4 text-body">
              <span aria-hidden="true" className="mt-2.5 h-[2px] w-4 shrink-0 bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <RichText html={block.text} className="t-lead mt-8 border-l-2 border-accent pl-6 font-medium text-ink" />
      );
  }
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/insights/${post.slug}`);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en",
    keywords: post.keywords.join(", "),
    articleSection: post.topic,
    timeRequired: `PT${post.readingMinutes}M`,
    // Word count is a genuine quality signal for article rich results, and deriving it means it
    // cannot drift from the text actually rendered below.
    wordCount: post.body.reduce(
      (total, block) =>
        total + (block.kind === "list" ? block.items.join(" ") : block.text).trim().split(/\s+/).length,
      0,
    ),
    author: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    image: `${url}/opengraph-image`,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Insights", path: "/insights" },
          { name: post.metaTitle, path: `/insights/${post.slug}` },
        ])}
      />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title={post.title}
            breadcrumbLabel="Article"
            breadcrumbParent={{ label: "Insights", href: "/insights" }}
            kicker={`Published ${post.dateDisplay} by UMIN Global · ${post.readingMinutes} min read`}
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
              <Reveal>
                <article>
                  <p className="t-eyebrow flex items-center gap-2 text-label">
                    <time dateTime={post.date}>{post.dateDisplay}</time>
                    <span aria-hidden="true">/</span>
                    <span>{post.topic}</span>
                  </p>

                  <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      // Lead image of the article and its LCP element.
                      priority
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover"
                    />
                  </div>

                  {/* Measured line length: the body column is capped so lines stay readable
                      instead of running the full grid width. */}
                  <div className="max-w-[680px]">
                    {post.body.map((block, index) => (
                      <BodyBlock key={`${block.kind}-${index}`} block={block} />
                    ))}

                    <h2 className="t-h3 pt-10 text-ink">Related</h2>
                    <ul className="pt-2">
                      {post.related.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="t-body group flex items-center gap-2 py-1.5 text-body transition-colors duration-200 hover:text-accent"
                          >
                            {item.label}
                            <span
                              aria-hidden="true"
                              className="text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                            >
                              &rarr;
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-10">
                      <BlogPostShareRow />
                    </div>
                    <div className="pt-10">
                      <BlogPostAuthor />
                    </div>
                  </div>
                </article>
              </Reveal>
              <BlogSidebar currentSlug={post.slug} />
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
