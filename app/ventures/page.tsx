import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import VentureSteps from "@/components/VentureSteps";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/components/seo";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "Ventures | Co-Building Companies With Founders | UMIN Global";
const DESCRIPTION =
  "UMIN Global co-builds new companies with founders and operators, contributing product, brand, growth and AI capability for equity or an agreed revenue share.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ventures" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/ventures" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const WHAT_WE_CONTRIBUTE = [
  ["Product", "Architecture, build and the first shipped version - not a prototype."],
  ["Brand", "Positioning, identity and the site the first customers will judge."],
  ["Growth", "Acquisition, lifecycle and the reporting that shows what is working."],
  ["AI", "Automation where it removes real operating cost from day one."],
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Ventures", path: "/ventures" }]);

export default function VenturesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Ventures",
          serviceType: "Venture building",
          description: DESCRIPTION,
          url: `${SITE_URL}/ventures`,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Ventures"
            breadcrumbLabel="Ventures"
            kicker="We co-build companies with founders and operators."
          />

          <Section space="lg">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <Reveal>
                <span className="t-eyebrow flex items-center gap-3 text-label">
                  <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
                  Ventures
                </span>
                <h2 className="t-h2 pt-4 text-ink">Capability instead of a cheque</h2>
                <p className="t-lead pt-4 text-body">
                  Most early companies do not fail for lack of an idea. They fail because the
                  product, the brand and the acquisition engine are built by three different parties
                  at three different speeds.
                </p>
                <p className="t-lead pt-4 text-body">
                  We take on the whole technical and commercial build with the founder, for equity or
                  an agreed revenue share, and the contribution on both sides is written down before
                  any work starts.
                </p>
                <div className="flex flex-col gap-3 pt-8 sm:flex-row">
                  <Button href="/contact">Submit Your Idea</Button>
                  <Button href="/build-with-umin" variant="outlineDark">
                    Build With UMIN
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <dl>
                  {WHAT_WE_CONTRIBUTE.map(([term, value]) => (
                    <div key={term} className="py-4">
                      <dt className="t-eyebrow text-accent">{term}</dt>
                      <dd className="t-body pt-2 text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Section>

          <Section tone="gray">
            <SectionHeading
              eyebrow="How it works"
              title="From submitted idea to a company that grows"
              lead="Equity, revenue share and contribution are agreed in writing before any work begins."
            />
            <div className="pt-10">
              <VentureSteps />
            </div>
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
