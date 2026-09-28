import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import AboutWhoWeAre from "@/components/AboutWhoWeAre";
import AboutStats from "@/components/AboutStats";
import AboutMissionCards from "@/components/AboutMissionCards";
import RegionStrip from "@/components/RegionStrip";
import TeamCard from "@/components/TeamCard";
import { getTeamMembers } from "@/lib/content/team";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/structuredData";

const BASE_METADATA: Metadata = {
  title: "About UMIN | UMIN Global",
  description:
    "UMIN Global is a New York based technology and growth company working across the UK, Europe, USA, Australia, Türkiye and the Middle East.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About UMIN | UMIN Global",
    description: "UMIN Global is a New York based technology and growth company working across the UK, Europe, USA, Australia, Türkiye and the Middle East.",
    url: "/about",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "about");
}

const PAGE_JSON_LD = webPageJsonLd({
  path: "/about",
  name: "About UMIN Global",
  description: "UMIN Global is a New York based technology and growth company working across the UK, Europe, USA, Australia, Türkiye and the Middle East.",
  pageType: "AboutPage",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "About", path: "/about" }]);

export default async function AboutUsPage() {
  const teamMembers = await getTeamMembers();
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className= "pt-[72px] lg:pt-[104px]">
        <main>
          <PageContentSlot pageKey="about" />
          <PageHeroBanner
            title= "About UMIN"
            breadcrumbLabel= "About"
            kicker= "New York based. Working across seven regions."
          />

          <Section space= "lg">
            <AboutWhoWeAre />
          </Section>

          <AboutStats />

          <Section tone= "gray">
            <SectionHeading
              eyebrow= "Where we work"
              title= "Seven regions, one operating standard"
              lead= "Offices in New York, London, Melbourne, Istanbul, Dubai and Shanghai. Same team, same reporting, local execution."
            />
          </Section>

          <RegionStrip />

          <Section>
            <AboutMissionCards />
          </Section>

          <Section tone="gray">
            <SectionHeading
              eyebrow="Who you work with"
              title="Who you work with"
              lead="The founder owns the commercial side of every engagement; the CTO owns what gets built. There is no third layer."
            />
            <div className="grid grid-cols-1 gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <TeamCard key={member.slug} member={member} delay={index === 0 ? 0 : index === 1 ? 1 : 2} />
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
