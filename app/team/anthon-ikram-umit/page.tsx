import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import TeamMemberProfile from "@/components/TeamMemberProfile";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/components/structuredData";
import { ANTHON } from "@/components/teamMembers";
import { SITE_URL } from "@/components/seo";

const TITLE = "Anthon Ikram Umit, Founder | UMIN Global";

export const metadata: Metadata = {
  title: TITLE,
  description: ANTHON.bioShort,
  alternates: { canonical: `/team/${ANTHON.slug}` },
  openGraph: { title: TITLE, description: ANTHON.bioShort, url: `/team/${ANTHON.slug}`, type: "profile" },
  twitter: { card: "summary_large_image", title: TITLE, description: ANTHON.bioShort },
};

// The page renders Home / Team / <name>; the schema has to say the same thing.
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Team", path: "/team" },
  { name: ANTHON.name, path: `/team/${ANTHON.slug}` },
]);

export default function AnthonPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: ANTHON.name,
          jobTitle: ANTHON.role,
          description: ANTHON.bioShort,
          url: `${SITE_URL}/team/${ANTHON.slug}`,
          image: `${SITE_URL}${ANTHON.photo}`,
          worksFor: { "@type": "Organization", name: "UMIN Global", url: SITE_URL },
          email: "info@uminglobal.com",
          telephone: "+61-404-336-767",
        }}
      />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title={ANTHON.name}
            breadcrumbLabel={ANTHON.name}
            kicker={ANTHON.role}
            breadcrumbParent={{ label: "Team", href: "/team" }}
          />
          <TeamMemberProfile member={ANTHON} />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
