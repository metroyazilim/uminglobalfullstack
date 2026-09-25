import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import CapabilityList from "@/components/CapabilityList";
import ProcessSteps from "@/components/ProcessSteps";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { SERVICES_BY_CATEGORY } from "@/components/services";
import { SITE_URL, description } from "@/components/seo";
import FaqSection from "@/components/FaqSection";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "Custom Software, SaaS & AI Development | UMIN Global";
const DESCRIPTION = description(
  "Custom software, web and mobile apps, SaaS platforms, integrations, cloud and applied AI,",
  "built around the workflow and what it costs your business today.",
);

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/technology-ai" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/technology-ai" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "technology-ai");
}

const TECHNOLOGY = SERVICES_BY_CATEGORY("technology");

const FAQS = [
  {
    question: "How long does a first version take?",
    answer:
      "Most first releases land in six to twelve weeks. The variable is not engineering speed but how quickly decisions about scope and process get made, which is why we agree what version one must do before starting.",
  },
  {
    question: "Do we own the code?",
    answer:
      "Yes. On a project engagement the deliverables, repositories and infrastructure belong to your business on completion. Ongoing maintenance is a separate, optional arrangement.",
  },
  {
    question: "Build custom or buy off the shelf?",
    answer:
      "Buy when the process is generic and the tool does not force you to work differently. Build when the process is what makes you competitive. We will tell you which case you are in before quoting a build.",
  },
  {
    question: "Can you work with our existing stack and team?",
    answer:
      "Yes. Most engagements start inside an existing system rather than on a clean slate, including taking over a codebase written by someone else.",
  },
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Technology & AI", path: "/technology-ai" }]);

export default function TechnologyAiPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Technology & AI",
          description: DESCRIPTION,
          url: `${SITE_URL}/technology-ai`,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Technology & AI services",
            itemListElement: TECHNOLOGY.map((service) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: service.name, url: `${SITE_URL}/services/${service.slug}` },
            })),
          },
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageContentSlot pageKey="technology-ai" />
          <PageHeroBanner
            title="Technology & AI"
            breadcrumbLabel="Technology & AI"
            kicker="Software that solves a business problem, not a stack preference."
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              <Reveal>
                <span className="t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
                  Technology &amp; AI
                </span>
                <h2 className="t-h2 pt-4 text-ink">Built around the workflow, then the cost</h2>
                <p className="t-lead pt-4 text-body">
                  Every engagement starts with the process the business actually runs and what it
                  costs today &mdash; hours, error rate, headcount attached to the task. The
                  architecture decision comes after that, never before it.
                </p>
                <p className="t-lead pt-4 text-body">
                  The same team then builds the brand and acquisition engine around the product, so
                  the software ships into a market rather than into a repository.
                </p>
                <Button href="/contact" size="lg" className="mt-8">
                  Start a Project
                </Button>
              </Reveal>
              <Reveal variant="fade" delay={1}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
                  <Image
                    src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&h=900&q=80"
                    alt="UMIN Global engineers building custom software"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </Section>

          <Section tone="gray">
            <CapabilityList
              eyebrow="Technology & AI services"
              title="Fifteen services, each with its own page"
              lead="Pick the one you came for - every entry explains what it is, when it is worth doing and how we run it."
              services={TECHNOLOGY}
            />
          </Section>

          <Section>
            <SectionHeading eyebrow="How we work" title="Four stages, one team" />
            <div className="pt-10">
              <ProcessSteps />
            </div>
          </Section>

          <Section tone="gray" rule>
            <FaqSection eyebrow="Technology & AI questions" title="What clients ask before a build" items={FAQS} />
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
