import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { OFFICES } from "@/components/offices";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";

const TITLE = "Offices | UMIN Global";
const DESCRIPTION =
  "UMIN Global works from New York, London, Melbourne, Istanbul, Dubai and Shanghai - one senior team, one reporting standard, local execution in seven regions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/offices" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/offices" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PAGE_JSON_LD = collectionPageJsonLd({
  path: "/offices",
  name: "Offices",
  description: DESCRIPTION,
  itemType: "LocalBusiness",
  items: OFFICES.map((office) => ({
    name: `UMIN Global ${office.city}`,
    path: `/offices/${office.slug}`,
    description: office.summary,
  })),
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Offices", path: "/offices" }]);

export default function OfficesIndexPage() {
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Offices"
            breadcrumbLabel="Offices"
            kicker="Six offices, seven regions, one operating standard."
          />

          <Section space="lg">
            <SectionHeading
              eyebrow="Where we work"
              title="The same team, in the client's time zone"
              lead="Each office covers a region and works to the same delivery and reporting standard set in New York."
            />
            <div className="pt-8">
              {OFFICES.map((office, index) => (
                <Reveal key={office.slug} delay={index === 0 ? 0 : index === 1 ? 1 : 2}>
                  <Link href={`/offices/${office.slug}`} className="group block py-6">
                    <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-8">
                      <h2 className="t-h2 flex items-center gap-3 text-ink group-hover:text-accent">
                        {office.city}
                        <span
                          aria-hidden="true"
                          className="t-body text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                        >
                          &rarr;
                        </span>
                      </h2>
                      <span className="t-eyebrow text-label">
                        {office.headquarters ? "Headquarters · " : ""}
                        {office.region}
                      </span>
                    </div>
                    <p className="t-lead max-w-[760px] pt-2 text-body">{office.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
