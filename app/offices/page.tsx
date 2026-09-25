import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { getOffices } from "@/lib/content/offices";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";

const TITLE = "Offices | UMIN Global";
const DESCRIPTION =
  "UMIN Global works from New York, London, Melbourne, Istanbul, Dubai and Shanghai - one senior team, one reporting standard, local execution in seven regions.";

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/offices" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/offices" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "offices");
}

export const revalidate = 300;


const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Offices", path: "/offices" }]);

export default async function OfficesIndexPage() {
  const offices = await getOffices();
  const pageJsonLd = collectionPageJsonLd({
    path: "/offices",
    name: "Offices",
    description: DESCRIPTION,
    itemType: "LocalBusiness",
    items: offices.map((office) => ({
      name: `UMIN Global ${office.city}`,
      path: `/offices/${office.slug}`,
      description: office.summary,
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
              {offices.map((office, index) => (
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
