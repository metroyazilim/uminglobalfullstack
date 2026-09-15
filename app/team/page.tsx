import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import TeamCard from "@/components/TeamCard";
import { TEAM_MEMBERS } from "@/components/teamMembers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";

const TITLE = "Our Team | UMIN Global";
const DESCRIPTION =
  "UMIN Global is run by its founder, Anthon Ikram Umit - one senior point of contact across technology, growth, AI, ventures and market entry.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/team" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PAGE_JSON_LD = collectionPageJsonLd({
  path: "/team",
  name: "Our Team",
  description: DESCRIPTION,
  itemType: "Person",
  items: TEAM_MEMBERS.map((member) => ({
    name: member.name,
    path: `/team/${member.slug}`,
    description: member.role,
  })),
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Team", path: "/team" }]);

export default function TeamPage() {
  return (
    <>
      <JsonLd data={PAGE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Our Team"
            breadcrumbLabel="Team"
            kicker="One senior point of contact, on every engagement."
          />

          <Section space="lg">
            <SectionHeading
              eyebrow="Who you work with"
              title="No account managers between you and the work"
              lead="The person who scopes the engagement is the person who runs it and reports on it."
            />
            <div className="grid grid-cols-1 gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM_MEMBERS.map((member) => (
                <TeamCard key={member.slug} member={member} />
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
