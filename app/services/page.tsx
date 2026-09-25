import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { CATEGORIES, SERVICES, type ServiceCategory } from "@/components/services";
import { description } from "@/components/seo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";

const TITLE = "All Services | UMIN Global";
const DESCRIPTION = description(
  "Every service UMIN Global delivers: software, AI, brand, advertising, SEO, CRM,",
  "automation and market entry - 42 pages, one per service.",
);

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/services" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "services");
}

const ORDER: ServiceCategory[] = ["technology", "growth", "ai"];

const PAGE_JSON_LD = collectionPageJsonLd({
  path: "/services",
  name: "All Services",
  description: DESCRIPTION,
  itemType: "Service",
  items: SERVICES.map((service) => ({
    name: service.name,
    path: `/services/${service.slug}`,
    description: service.summary,
  })),
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Services", path: "/services" }]);

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageContentSlot pageKey="services" />
          <PageHeroBanner
            title="All Services"
            breadcrumbLabel="Services"
            kicker="Every service, with its own page and a straight answer on what it does."
          />

          {ORDER.map((category, categoryIndex) => {
            const services = SERVICES.filter((service) => service.category === category);
            return (
              <Section key={category} tone={categoryIndex % 2 === 0 ? "white" : "gray"} space="md">
                <SectionHeading
                  eyebrow={CATEGORIES[category].label}
                  title={`${services.length} services under ${CATEGORIES[category].label}`}
                  lead="Each one is a page, not a bullet - what it is, when it is worth doing, and how we run it."
                />
                <ul className="grid grid-cols-1 gap-x-10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Reveal>
                        <Link
                          href={`/services/${service.slug}`}
                          className="group block py-3 transition-colors duration-200"
                        >
                          <span className="t-body flex items-center gap-2 font-medium text-ink group-hover:text-accent">
                            {service.name}
                            <span
                              aria-hidden="true"
                              className="text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                            >
                              &rarr;
                            </span>
                          </span>
                          <span className="t-small block pt-1 text-body">{service.summary}</span>
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </Section>
            );
          })}

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
