import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import DetailIntro from "@/components/DetailIntro";
import DetailGallery from "@/components/DetailGallery";
import DetailMoreServices from "@/components/DetailMoreServices";
import PartnershipModels from "@/components/PartnershipModels";
import CapabilityList from "@/components/CapabilityList";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import JsonLd from "@/components/JsonLd";
import { SERVICES_BY_CATEGORY } from "@/components/services";
import { SITE_URL, description } from "@/components/seo";
import FaqSection from "@/components/FaqSection";
import { breadcrumbJsonLd } from "@/components/structuredData";

const TITLE = "Growth & Marketing: Brand, Ads, SEO | UMIN Global";
const DESCRIPTION = description(
  "Brand, website, content, advertising, SEO, CRM and lead generation run as one system -",
  "as a Growth Partnership or a Complete Package you own.",
);

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/growth-marketing" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/growth-marketing" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "growth-marketing");
}

const GROWTH = SERVICES_BY_CATEGORY("growth");

const FAQS = [
  {
    question: "How soon do results show?",
    answer:
      "Paid channels give a readable signal within two to four weeks. SEO and content compound over three to six months. We report on cost per qualified lead throughout rather than on impressions.",
  },
  {
    question: "What is the difference between the two models?",
    answer:
      "A Growth Partnership is ongoing and shares the upside through an agreed revenue basis. A Complete Package is a one-off project price and the deliverables are yours outright on completion.",
  },
  {
    question: "Do you replace our marketing team?",
    answer:
      "No. We take the capabilities you do not have in-house and work alongside the people you do, with the reporting shared rather than held by us.",
  },
  {
    question: "Can you work with our current CRM and ads accounts?",
    answer:
      "Yes. We work in your accounts, so the history, the audiences and the data stay with your business if the engagement ends.",
  },
];

// Matches the breadcrumb rendered in PageHeroBanner: a visible trail with no BreadcrumbList
// behind it is the one Google will not show in the SERP.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Growth & Marketing", path: "/growth-marketing" }]);

export default function GrowthPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Growth & Marketing",
          description: DESCRIPTION,
          url: `${SITE_URL}/growth-marketing`,
          provider: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Growth & Marketing services",
            itemListElement: GROWTH.map((service) => ({
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
          <PageContentSlot pageKey="growth-marketing" />
          <PageHeroBanner
            title= "Growth & Marketing"
            breadcrumbLabel= "Growth"
            kicker= "Presence, acquisition and retention as one system."
          />

          <Section space= "lg">
            <DetailIntro />
          </Section>

          <Section tone= "gray">
            <CapabilityList
              eyebrow="Included"
              title="What Growth & Marketing covers"
              services={GROWTH}
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&h=750&q=80"
              imageAlt="A UMIN Global growth and marketing planning session"
            />
          </Section>

          <Section>
            <DetailGallery />
          </Section>

          <Section tone= "gray" id= "models" space= "lg">
            <SectionHeading
              eyebrow= "Two ways to work with UMIN"
              title= "Partner with us, or own the build"
              lead= "One shares the upside and the risk. The other hands you an asset outright."
              align= "center"
            />
            <div className= "pt-12">
              <PartnershipModels />
            </div>
          </Section>

          <Section rule>
            <SectionHeading eyebrow= "More from UMIN" title= "The rest of what we do" />
            <div className= "pt-10">
              <DetailMoreServices />
            </div>
          </Section>

          <Section tone="gray" rule>
            <FaqSection eyebrow="Growth & Marketing questions" title="What clients ask before a growth engagement" items={FAQS} />
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
