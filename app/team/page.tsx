import type { Metadata } from "next";
import { applyPageSeoOverride } from "@/lib/seo-overrides";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import TeamCard from "@/components/TeamCard";
import { getTeamMembers } from "@/lib/content/team";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/components/structuredData";

const TITLE = "Our Team | UMIN Global";
const DESCRIPTION =
  "Anthon Ikram Umit, Founder, and Muhammet Berat Arslan, CTO - two senior contacts covering technology, growth, AI, ventures and market entry at UMIN Global.";

const BASE_METADATA: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/team" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeoOverride(BASE_METADATA, "team");
}

export const revalidate = 300;


const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: "Team", path: "/team" }]);

export default async function TeamPage() {
  const members = await getTeamMembers();
  const pageJsonLd = collectionPageJsonLd({
    path: "/team",
    name: "Our Team",
    description: DESCRIPTION,
    itemType: "Person",
    items: members.map((member) => ({
      name: member.name,
      path: `/team/${member.slug}`,
      description: member.role,
    })),
  });
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Our Team"
            breadcrumbLabel="Team"
            kicker="Senior people on the work, on every engagement."
          />

          <Section space="lg">
            <SectionHeading
              eyebrow="Who you work with"
              title="No account managers between you and the work"
              lead="The people who scope an engagement are the people who run it and report on it - the founder on the commercial side, the CTO on what gets built."
            />
            <div className="grid grid-cols-1 gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
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
