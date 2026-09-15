import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import CapabilityList from "@/components/CapabilityList";
import DetailMoreServices from "@/components/DetailMoreServices";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";

import JsonLd from "@/components/JsonLd";
import { SERVICES_BY_CATEGORY } from "@/components/services";
import { SITE_URL, description } from "@/components/seo";
import FaqSection from "@/components/FaqSection";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "UMIN AI: AI Agents & Automation | UMIN Global";
const DESCRIPTION = description(
  "AI agents, customer service AI, sales and workflow automation and document intelligence -",
  "implemented where they create measurable commercial value.",
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/umin-ai" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/umin-ai" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const AI_CAPABILITIES = SERVICES_BY_CATEGORY("ai");

// Where AI is worth applying - stated as the three questions we work through with a client,
// because "AI transformation" on its own tells nobody what they are buying.
const QUESTIONS = [
  { q: "What does the work cost today? ", a: "Hours, error rate, response time, headcount attached to the task." },
  { q: "What part is genuinely repeatable? ", a: "The steps with stable inputs and a checkable output." },
  { q: "What happens when it is wrong? ", a: "The review path, the audit trail and who signs off." },
];

const FAQS = [
  {
    question: "Where does AI actually pay back?",
    answer:
      "On tasks that repeat many times a day with stable inputs and a checkable output. If the work needs judgement on every instance, automation usually costs more than it saves.",
  },
  {
    question: "What happens when the AI is wrong?",
    answer:
      "Every implementation we ship has a review path, a confidence threshold and a logged audit trail, agreed before any of it goes live.",
  },
  {
    question: "Is our data used to train public models?",
    answer:
      "No. Data boundaries and credentials are defined explicitly per engagement, and retrieval runs against your own material rather than adding it to a shared model.",
  },
  {
    question: "Can you start small?",
    answer:
      "Yes, and we prefer it: one process, measured, before the surface widens. That keeps the first invoice tied to a result you can check.",
  },
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "UMIN AI", path: "/umin-ai" }]);

export default function UminAiPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "UMIN AI",
          serviceType: "Applied artificial intelligence",
          description: DESCRIPTION,
          url: `${SITE_URL}/umin-ai`,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "UMIN AI services",
            itemListElement: AI_CAPABILITIES.map((service) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: service.name, url: `${SITE_URL}/services/${service.slug}` },
            })),
          },
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className= "pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title= "UMIN AI"
            breadcrumbLabel= "UMIN AI"
            kicker= "Applied where it reduces cost or wins revenue."
          />

          <Section space= "lg">
            <div className= "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              <Reveal>
                <span className= "t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
                  UMIN AI
                </span>
                <h2 className= "t-h2 pt-4 text-ink">Intelligence that works for business</h2>
                <p className= "t-lead pt-4 text-body">
                  Artificial intelligence should create measurable value. We start with the process,
                  the cost and the data that already exist &mdash; then decide what is worth
                  automating.
                </p>
                <Button href= "/contact" size= "lg" className= "mt-8">
                  Start a Project
                </Button>
              </Reveal>
              <Reveal variant= "fade" delay={1}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
                  <Image
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=900&q=80"
                    alt="Engineers reviewing an AI workflow at UMIN Global"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </Section>

          <Section tone= "gray">
            <SectionHeading eyebrow= "Before we build" title= "Three questions, in this order" />
            <dl className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {QUESTIONS.map((item, index) => (
                <Reveal key={item.q} delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
                  <div className="h-full rounded-card bg-white p-6 lg:p-7">
                    <dt className="t-h3 text-ink">{item.q}</dt>
                    <dd className="t-body pt-2 text-body">{item.a}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Section>

          <Section>
            <CapabilityList eyebrow="AI capabilities" title="Where we apply AI" services={AI_CAPABILITIES} />
            <Reveal>
              <p className= "t-lead mt-12 border-l-2 border-accent pl-6 text-ink">
                We don&rsquo;t add AI because it&rsquo;s fashionable. We implement it where it makes
                commercial sense.
              </p>
            </Reveal>
          </Section>

          <Section tone= "gray">
            <SectionHeading eyebrow= "More from UMIN" title= "The rest of what we do" />
            <div className= "pt-10">
              <DetailMoreServices />
            </div>
          </Section>

          <Section tone="gray" rule>
            <FaqSection eyebrow="AI questions" title="What clients ask before an AI project" items={FAQS} />
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
