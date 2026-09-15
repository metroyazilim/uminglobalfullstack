import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import CareersJobList from "@/components/CareersJobList";
import CareersCulture from "@/components/CareersCulture";
import VentureSteps from "@/components/VentureSteps";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/structuredData";

export const metadata: Metadata = {
  title: "Build With UMIN | UMIN Global",
  description:
    "Your idea could become the next business. UMIN co-builds ventures with founders and operators - and is hiring in New York and remotely.",
  alternates: { canonical: "/build-with-umin" },
  openGraph: {
    title: "Build With UMIN | UMIN Global",
    description: "Your idea could become the next business. UMIN co-builds ventures with founders and operators - and is hiring in New York and remotely.",
    url: "/build-with-umin",
  },
};

const CRITERIA = [
  ["A real problem", "Something a business already pays to work around."],
  ["A market that can pay", "Named buyers, not a category."],
  ["A committed founder", "Someone in the work every week."],
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Build With UMIN", path: "/build-with-umin" }]);

// Deliberately a WebPage and not a JobPosting: JobPosting requires a datePosted and a
// validThrough, and Google demotes listings whose dates cannot be trusted. The roles are
// described in the copy instead.
const PAGE_JSON_LD = webPageJsonLd({
  path: "/build-with-umin",
  name: "Build With UMIN",
  description:
    "Your idea could become the next business. UMIN co-builds ventures with founders and operators - and is hiring in New York and remotely.",
});

export default function BuildWithUminPage() {
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className= "pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title= "Build with UMIN"
            breadcrumbLabel= "Build with UMIN"
            kicker= "Ventures we co-build, and the team building them."
          />

          <Section space= "lg">
            <div className= "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <Reveal>
                <span className= "t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
                  Ventures
                </span>
                <h2 className= "t-h2 pt-4 text-ink">Your idea could become the next business</h2>
                <p className= "t-lead pt-4 text-body">
                  You don&rsquo;t need to be technical or to have a team in place. If the idea is
                  strong, we provide the product, brand and growth capability and build it with you.
                </p>
                <Button href= "/contact" size= "lg" className= "mt-8">
                  Submit Your Idea
                </Button>
              </Reveal>
              <Reveal delay={1}>
                <dl className="flex flex-col gap-4">
                  {CRITERIA.map(([term, value]) => (
                    <div key={term} className="rounded-card bg-white p-6">
                      <dt className="t-eyebrow text-accent">{term}</dt>
                      <dd className="t-body pt-2 text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Section>

          <Section tone= "gray">
            <SectionHeading
              eyebrow= "How it works"
              title= "From submitted idea to a company that grows"
              lead= "Equity, revenue share and contribution are agreed in writing before any work begins."
            />
            <div className= "pt-10">
              <VentureSteps />
            </div>
          </Section>

          <Section>
            <SectionHeading eyebrow= "Open roles" title= "Join the team building them" />
            <div className= "pt-10">
              <CareersJobList />
            </div>
          </Section>

          <Section tone= "gray" space= "lg">
            <CareersCulture
              image= "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=800&q=80"
              alt= "Founders and the UMIN team planning a venture"
              title= "How we work with founders"
              paragraphs={[
 "A venture is not an agency project. Product decisions, pricing, positioning and the first customers are worked through together, weekly.",
 "What each side contributes - engineering, design, brand, marketing, AI, capital of time - is written down before the build starts.",
              ]}
              reverse
            />
            <div className= "pt-16">
              <CareersCulture
                image= "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=800&q=80"
                alt= "Working at UMIN Global in New York"
                title= "Working at UMIN"
                paragraphs={[
 "Small senior teams and short decision chains: the person who designs the solution ships it.",
 "We work across six regions, so written clarity matters more than hours at a desk.",
                ]}
              />
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
