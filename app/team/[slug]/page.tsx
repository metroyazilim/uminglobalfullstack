import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import TeamMemberProfile from "@/components/TeamMemberProfile";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/components/structuredData";
import { getTeamMember, getTeamSlugs } from "@/lib/content/team";
import { SITE_URL, absoluteUrl } from "@/components/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return {};

  // <title> is clamped at ~60 characters in the SERP, and "Chief Technology Officer" alone
  // pushes this person's name past it - so the title uses the short form while the page and the
  // Person schema keep the full role.
  const shortRole = member.role === "Chief Technology Officer" ? "CTO" : member.role;
  const title = `${member.name}, ${shortRole} | UMIN Global`;
  const url = `/team/${member.slug}`;
  return {
    title,
    description: member.bioShort,
    alternates: { canonical: url },
    openGraph: { type: "profile", title, description: member.bioShort, url },
    twitter: { card: "summary_large_image", title, description: member.bioShort },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) notFound();

  const url = absoluteUrl(`/team/${member.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${url}#person`,
          name: member.name,
          jobTitle: member.role,
          description: member.bioShort,
          url,
          image: `${SITE_URL}${member.photo}`,
          worksFor: { "@id": `${SITE_URL}/#organization` },
          knowsAbout: member.worksOn.map((item) => item.label),
          email: "info@uminglobal.com",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Team", path: "/team" },
          { name: member.name, path: `/team/${member.slug}` },
        ])}
      />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title={member.name}
            breadcrumbLabel={member.name}
            kicker={member.role}
            breadcrumbParent={{ label: "Team", href: "/team" }}
          />
          <TeamMemberProfile member={member} />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
