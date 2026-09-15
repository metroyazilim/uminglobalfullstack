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
import { OFFICES } from "@/components/offices";
import { SITE_URL, description } from "@/components/seo";

// The catalogue is fixed at build time, so every valid URL is prerendered. Refusing unknown
// params means a made-up slug returns the 404 page immediately instead of being rendered on
// demand and cached as a real page.
export const dynamicParams = false;

export function generateStaticParams() {
  return OFFICES.map((office) => ({ slug: office.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const office = OFFICES.find((entry) => entry.slug === slug);
  if (!office) return {};

  const title = `UMIN Global ${office.city} | ${office.region} Office`;
  const pageDescription = description(
    office.summary,
    `Software, applied AI, brand and growth work delivered across ${office.region} by one senior team.`,
  );
  return {
    title,
    description: pageDescription,
    alternates: { canonical: `/offices/${office.slug}` },
    openGraph: { title, description: pageDescription, url: `/offices/${office.slug}` },
    twitter: { card: "summary_large_image", title, description: pageDescription },
  };
}

export default async function OfficePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const office = OFFICES.find((entry) => entry.slug === slug);
  if (!office) notFound();

  const others = OFFICES.filter((entry) => entry.slug !== office.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `UMIN Global ${office.city}`,
          description: office.summary,
          url: `${SITE_URL}/offices/${office.slug}`,
          email: "info@uminglobal.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: office.city,
            addressCountry: office.country,
          },
          areaServed: office.region,
          parentOrganization: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Offices", item: `${SITE_URL}/offices` },
            { "@type": "ListItem", position: 3, name: office.city, item: `${SITE_URL}/offices/${office.slug}` },
          ],
        }}
      />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title={`UMIN Global ${office.city}`}
            breadcrumbLabel={office.city}
            kicker={`${office.headquarters ? "Headquarters" : "Office"} · ${office.region}`}
            breadcrumbParent={{ label: "Offices", href: "/offices" }}
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
              <Reveal>
                <span className="t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
                  {office.country}
                </span>
                <h2 className="t-h2 pt-4 text-ink">What runs from {office.city}</h2>
                {office.detail.map((paragraph) => (
                  <p key={paragraph} className="t-lead pt-4 text-body">
                    {paragraph}
                  </p>
                ))}
                <div className="flex flex-col gap-3 pt-8 sm:flex-row">
                  <Button href="/contact">Talk to {office.city}</Button>
                  <Button href="/what-we-do" variant="outlineDark">
                    What we do
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h2 className="t-h3 text-ink">Other offices</h2>
                <ul className="pt-4">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/offices/${other.slug}`}
                        className="t-body block py-1.5 text-body transition-colors duration-200 hover:text-accent"
                      >
                        {other.city} &middot; {other.region}
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
