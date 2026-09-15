import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import ServicesGridFive from "@/components/ServicesGridFive";
import CapabilityList from "@/components/CapabilityList";
import ProcessSteps from "@/components/ProcessSteps";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import JsonLd from "@/components/JsonLd";
import { SERVICES, SERVICES_BY_CATEGORY } from "@/components/services";
import { SITE_URL, description } from "@/components/seo";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "What We Do | Five Capabilities, One Team | UMIN Global";
const DESCRIPTION = description(
  "Five capabilities from one senior team: Technology & AI, Growth & Marketing, UMIN AI,",
  "Ventures and Global Strategy - 42 services, one page each.",
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/what-we-do" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/what-we-do" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const TECHNOLOGY = SERVICES_BY_CATEGORY("technology");
const GROWTH = SERVICES_BY_CATEGORY("growth");

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "What We Do", path: "/what-we-do" }]);

export default function WhatWeDoPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "UMIN Global services",
          numberOfItems: SERVICES.length,
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: `${SITE_URL}/services/${service.slug}`,
          })),
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="What we do"
            breadcrumbLabel="What we do"
            kicker="Five capabilities, delivered by one team."
          />

          <Section>
            <SectionHeading
              eyebrow="Our capabilities"
              title="Five capabilities. One global partner."
              lead="We build the technology, then the brand and acquisition engine around it."
            />
            <div className="pt-10">
              <ServicesGridFive />
            </div>
          </Section>

          <Section tone="gray">
            <CapabilityList
              eyebrow="Technology & AI"
              title="Technology that solves a business problem"
              lead="Every engagement starts from the workflow and the cost attached to it, not from a stack preference."
              services={TECHNOLOGY}
              image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&h=750&q=80"
              imageAlt="A UMIN Global engineering team planning technology work"
            />
          </Section>

          <Section rule>
            <CapabilityList
              eyebrow="Growth & Marketing"
              title="Presence, acquisition and retention"
              lead="Run as one system on top of technology we can change when the numbers say so."
              services={GROWTH}
              image="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1000&h=750&q=80"
              imageAlt="A UMIN Global growth and marketing review"
            />
          </Section>

          <Section tone="gray">
            <SectionHeading eyebrow="How we work" title="Four stages, one team" />
            <div className="pt-10">
              <ProcessSteps />
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
