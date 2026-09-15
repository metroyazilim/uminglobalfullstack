import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import ContactInfoPanel from "@/components/ContactInfoPanel";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/structuredData";

// What actually happens after the form is sent. Concrete steps with a stated timeframe, because
// "we will be in touch" tells a prospective client nothing.
const NEXT_STEPS = [
  ["01", "Reply within one business day", "From New York, with the questions we need answered to quote."],
  ["02", "A 30-minute call", "Goal, constraints, budget range and timing - no deck."],
  ["03", "Written scope and price", "Model, milestones and what each side owns, in writing."],
];

export const metadata: Metadata = {
  title: "Contact | UMIN Global",
  description:
    "Talk to UMIN Global about a project, a Growth Partnership or a venture idea. New York headquarters, with offices in London, Melbourne, Istanbul and Dubai.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | UMIN Global",
    description:
      "Talk to UMIN Global about a project, a Growth Partnership or a venture idea. Offices in New York, London, Melbourne, Istanbul and Dubai.",
    url: "/contact",
  },
};

const PAGE_JSON_LD = webPageJsonLd({
  path: "/contact",
  name: "Contact UMIN Global",
  description: "Talk to UMIN Global about a project, a Growth Partnership or a venture idea. New York headquarters, with offices in London, Melbourne, Istanbul and Dubai.",
  pageType: "ContactPage",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className= "pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title= "Contact"
            breadcrumbLabel= "Contact"
            kicker= "We reply from New York within one business day."
          />

          <Section space="sm">
            <ContactInfoPanel />
          </Section>

          <Section space= "lg">
            <div className= "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <SectionHeading
                eyebrow= "Get in touch"
                title= "How can we help? "
                lead= "Start a project, apply for a Growth Partnership, request a package proposal or submit a venture idea."
              />
              <Reveal delay={1}>
                <ContactForm />
              </Reveal>
            </div>
          </Section>

          <Section tone="gray" rule>
            <SectionHeading eyebrow="What happens next" title="Three steps, one business day apart" />
            <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {NEXT_STEPS.map(([number, title, copy], index) => (
                <Reveal key={number} delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
                  <li className="h-full rounded-card bg-white p-6 lg:p-7">
                    <span className="text-[13px] font-bold tracking-[2px] text-accent">{number}</span>
                    <h3 className="t-h3 pt-2 text-ink">{title}</h3>
                    <p className="t-body pt-2 text-body">{copy}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>
        </main>
        <Footer />
      </div>
    </>
  );
}
