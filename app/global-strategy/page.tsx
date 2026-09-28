import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import RegionStrip from "@/components/RegionStrip";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { getOffices } from "@/lib/content/offices";
import { SITE_URL, description } from "@/components/seo";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "Global Strategy | Market Entry & Expansion | UMIN Global";
const DESCRIPTION = description(
  "Market entry and expansion across the UK, Europe, USA, Australia, Türkiye and the Gulf,",
  "run by one senior team from six offices.",
);

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/global-strategy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/global-strategy" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "global-strategy");
}

const DECISIONS = [
  ["Demand", "Whether the demand you have at home exists in the target market at all."],
  ["Entry", "Which route in: direct, partner, acquisition or local entity."],
  ["Proof", "What has to be true in the first ninety days to justify the second phase."],
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Global Strategy", path: "/global-strategy" }]);

export default async function GlobalStrategyPage() {
  const offices = await getOffices();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Global Strategy",
          serviceType: "Market entry and international expansion",
          description: DESCRIPTION,
          url: `${SITE_URL}/global-strategy`,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          areaServed: ["United Kingdom", "Europe", "United States", "Australia", "Türkiye", "Middle East"],
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageContentSlot pageKey="global-strategy" />
          <PageHeroBanner
            title="Global Strategy"
            breadcrumbLabel="Global Strategy"
            kicker="Expansion is a business decision before it is a campaign."
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <Reveal>
                <span className="t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
                  Seven regions
                </span>
                <h2 className="t-h2 pt-4 text-ink">Entering a market, not translating a website</h2>
                <p className="t-lead pt-4 text-body">
                  Most failed expansions were never strategy failures. The offer was localised at the
                  surface &mdash; language, currency, a new landing page &mdash; while the pricing,
                  the buying process and the acquisition channels stayed the ones that worked at home.
                </p>
                <p className="t-lead pt-4 text-body">
                  We work the demand, the entry route and the proof points first, then run the
                  technology and growth execution from the office that sits in that region.
                </p>
                <div className="flex flex-col gap-3 pt-8 sm:flex-row">
                  <Button href="/contact">Start a Project</Button>
                  <Button href="/offices" variant="outlineDark">
                    Our offices
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <dl>
                  {DECISIONS.map(([term, value]) => (
                    <div key={term} className="py-4">
                      <dt className="t-eyebrow text-accent">{term}</dt>
                      <dd className="t-body pt-2 text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Section>

          <RegionStrip />

          <Section tone="gray">
            <SectionHeading
              eyebrow="Where we execute"
              title="Six offices, one operating standard"
              lead="Each office has its own page: what it covers and what is run from there."
            />
            <ul className="pt-8">
              {offices.map((office) => (
                <li key={office.slug}>
                  <Link href={`/offices/${office.slug}`} className="group block py-3">
                    <span className="t-h3 flex items-center gap-3 text-ink group-hover:text-accent">
                      {office.city}
                      <span className="t-eyebrow text-label">{office.region}</span>
                    </span>
                    <span className="t-body block pt-1 text-body">{office.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
