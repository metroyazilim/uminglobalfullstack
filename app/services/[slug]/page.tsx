import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, SERVICES } from "@/components/services";
import { SITE_URL, description } from "@/components/seo";

// The catalogue is fixed at build time, so every valid URL is prerendered. Refusing unknown
// params means a made-up slug returns the 404 page immediately instead of being rendered on
// demand and cached as a real page.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);
  if (!service) return {};

  const title = `${service.name} Services | UMIN Global`;
  const pageDescription = description(service.summary, "Delivered by UMIN Global from New York, London, Melbourne, Istanbul and Dubai.");
  return {
    title,
    description: pageDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description: pageDescription, url: `/services/${service.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description: pageDescription },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);
  if (!service) notFound();

  const category = CATEGORIES[service.category];
  const siblings = SERVICES.filter((entry) => entry.category === service.category && entry.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          serviceType: service.name,
          description: service.summary,
          url: `${SITE_URL}/services/${service.slug}`,
          category: category.label,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          areaServed: ["United Kingdom", "Europe", "United States", "Australia", "Türkiye", "Middle East"],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
            { "@type": "ListItem", position: 3, name: service.name, item: `${SITE_URL}/services/${service.slug}` },
          ],
        }}
      />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title={service.name}
            breadcrumbLabel={service.name}
            kicker={service.summary}
            breadcrumbParent={{ label: "Services", href: "/services" }}
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
              <Reveal>
                <span className="t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
                  {category.label}
                </span>
                <h2 className="t-h2 pt-4 text-ink">What {service.name} covers</h2>
                {service.detail.map((paragraph) => (
                  <p key={paragraph} className="t-lead pt-4 text-body">
                    {paragraph}
                  </p>
                ))}
                <div className="flex flex-col gap-3 pt-8 sm:flex-row">
                  <Button href="/contact">Start a Project</Button>
                  <Button href={category.href} variant="outlineDark">
                    All of {category.label}
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h2 className="t-h3 text-ink">Also part of {category.label}</h2>
                <ul className="pt-4">
                  {siblings.map((sibling) => (
                    <li key={sibling.slug}>
                      <Link
                        href={`/services/${sibling.slug}`}
                        className="t-body block py-1.5 text-body transition-colors duration-200 hover:text-accent"
                      >
                        {sibling.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
