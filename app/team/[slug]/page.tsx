import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import CtaBanner from "@/components/CtaBanner";
import TeamMemberProfile from "@/components/TeamMemberProfile";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, personJsonLd } from "@/components/structuredData";
import { getTeamMember, getTeamSlugs } from "@/lib/content/team";
import { getInsightsByAuthor } from "@/lib/content/insights";
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
    openGraph: {
      type: "profile",
      // A page-level openGraph object replaces the layout's, so these have to be repeated.
      siteName: "UMIN Global",
      locale: "en_US",
      title,
      description: member.bioShort,
      url,
      firstName: member.name.split(" ").slice(0, -1).join(" "),
      lastName: member.name.split(" ").slice(-1)[0],
    },
    twitter: { card: "summary_large_image", title, description: member.bioShort },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) notFound();

  const url = absoluteUrl(`/team/${member.slug}`);
  const articles = await getInsightsByAuthor(member.slug);

  return (
    <>
      {/* ProfilePage is the type Google reads for a page about one person; the Person node is
          shared with the byline of every article this member wrote (see personJsonLd). */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${url}#page`,
          url,
          name: `${member.name}, ${member.role}`,
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          mainEntity: { ...personJsonLd(member), email: "info@uminglobal.com" },
          ...(articles.length
            ? { hasPart: articles.map((post) => ({ "@id": `${absoluteUrl(`/insights/${post.slug}`)}#article` })) }
            : {}),
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
          <TeamMemberProfile member={member} articles={articles} />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
