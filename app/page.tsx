import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import { PageContentSlot } from "@/components/PageContentBlocks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBanner from "@/components/CtaBanner";
import HomeHero from "@/components/HomeHero";
import JourneyBand from "@/components/JourneyBand";
import HomeServiceCollage from "@/components/HomeServiceCollage";
import HomeWhoWeAre from "@/components/HomeWhoWeAre";
import HomeServicesSection from "@/components/HomeServicesSection";
import RegionStrip from "@/components/RegionStrip";
import NumbersBand from "@/components/NumbersBand";
import ProcessSection from "@/components/ProcessSection";
import Section from "@/components/ui/Section";

const BASE_METADATA: Metadata = {
  title: "UMIN Global | Higher Thinking. Greater Possibilities.",
  description:
    "UMIN Global helps ambitious businesses transform ideas into technology, brands, digital products and scalable companies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "UMIN Global | Higher Thinking. Greater Possibilities.",
    description: "UMIN Global helps ambitious businesses transform ideas into technology, brands, digital products and scalable companies.",
    url: "/",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "home");
}

export default function Home() {
  return (
    <>
      <Header />
      <div className= "pt-[72px] lg:pt-[104px]">
        <main>
          <PageContentSlot pageKey="home" />
          <HomeHero />
          <JourneyBand />

          {/* Asymmetric: photographs carry the left, the claim and the figures the right. */}
          <Section space= "lg">
            <div className= "grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
              <HomeServiceCollage />
              <HomeWhoWeAre />
            </div>
          </Section>

          <Section tone= "gray">
            <HomeServicesSection />
          </Section>

          <RegionStrip />

          <Section space= "sm">
            <NumbersBand />
          </Section>

          <Section tone= "gray">
            <ProcessSection />
          </Section>

          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
