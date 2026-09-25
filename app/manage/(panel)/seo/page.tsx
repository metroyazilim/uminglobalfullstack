import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/content/site-settings";
import { prisma } from "@/lib/db";
import { SITE_PAGES, type SitePageKey } from "@/lib/site-pages";
import { SeoWorkspace, type SeoEntry } from "./SeoWorkspace";

type SearchParams = Promise<{ item?: string }>;

const PAGE_SEO_DEFAULTS: Record<SitePageKey, { title: string; description: string }> = {
  home: {
    title: "UMIN Global | Higher Thinking. Greater Possibilities.",
    description: "UMIN Global helps ambitious businesses transform ideas into technology, brands, digital products and scalable companies.",
  },
  about: {
    title: "About UMIN | UMIN Global",
    description: "UMIN Global is a New York based technology and growth company working across the UK, Europe, USA, Australia, Türkiye and the Middle East.",
  },
  "what-we-do": {
    title: "What We Do | Five Capabilities, One Team | UMIN Global",
    description: "Five capabilities from one senior team: Technology & AI, Growth & Marketing, UMIN AI, Ventures and Global Strategy - 42 services, one page each.",
  },
  "technology-ai": {
    title: "Custom Software, SaaS & AI Development | UMIN Global",
    description: "Custom software, web and mobile apps, SaaS platforms, integrations, cloud and applied AI, built around the workflow and what it costs your business today.",
  },
  "growth-marketing": {
    title: "Growth & Marketing: Brand, Ads, SEO | UMIN Global",
    description: "Brand, website, content, advertising, SEO, CRM and lead generation run as one system - as a Growth Partnership or a Complete Package you own.",
  },
  "umin-ai": {
    title: "UMIN AI: AI Agents & Automation | UMIN Global",
    description: "AI agents, customer service AI, sales and workflow automation and document intelligence - implemented where they create measurable commercial value.",
  },
  ventures: {
    title: "Ventures | Co-Building Companies With Founders | UMIN Global",
    description: "UMIN Global co-builds new companies with founders and operators, contributing product, brand, growth and AI capability for equity or an agreed revenue share.",
  },
  "global-strategy": {
    title: "Global Strategy | Market Entry & Expansion | UMIN Global",
    description: "Market entry and expansion across the UK, Europe, USA, Australia, Türkiye and the Gulf, run by one senior team from six offices.",
  },
  services: {
    title: "All Services | UMIN Global",
    description: "Every service UMIN Global delivers: software, AI, brand, advertising, SEO, CRM, automation and market entry - 42 pages, one per service.",
  },
  team: {
    title: "Our Team | UMIN Global",
    description: "Anthon Ikram Umit, Founder, and Muhammet Berat Arslan, CTO - two senior contacts covering technology, growth, AI, ventures and market entry at UMIN Global.",
  },
  offices: {
    title: "Offices | UMIN Global",
    description: "UMIN Global works from New York, London, Melbourne, Istanbul, Dubai and Shanghai - one senior team, one reporting standard, local execution in seven regions.",
  },
  insights: {
    title: "Insights | UMIN Global",
    description: "Practical notes on technology, applied AI, growth marketing and international expansion, written by the team delivering the work at UMIN Global.",
  },
  contact: {
    title: "Contact | UMIN Global",
    description: "Talk to UMIN Global about a project, a Growth Partnership or a venture idea. New York headquarters; offices in London, Melbourne, Istanbul, Dubai and Shanghai.",
  },
  "build-with-umin": {
    title: "Build With UMIN | UMIN Global",
    description: "Your idea could become the next business. UMIN co-builds ventures with founders and operators - and is hiring in New York and remotely.",
  },
};

export default async function SeoPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { item } = await searchParams;
  const [overrides, postRows, site] = await Promise.all([
    prisma.pageSeo.findMany(),
    prisma.post.findMany({
      where: { status: { not: "ARCHIVED" } },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        description: true,
        excerpt: true,
        image: true,
        status: true,
      },
      orderBy: { date: "desc" },
    }),
    getSiteSettings(),
  ]);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://uminglobal.com").replace(/\/+$/, "");

  const overrideByKey = new Map(overrides.map((row) => [row.key, row]));

  const pages: SeoEntry[] = SITE_PAGES.map((page) => {
    const override = overrideByKey.get(page.key);
    const defaults = PAGE_SEO_DEFAULTS[page.key];
    return {
      kind: "page",
      id: page.key,
      label: page.label,
      path: page.path,
      title: override?.title ?? "",
      description: override?.description ?? "",
      image: override?.ogImage ?? "",
      defaultTitle: defaults.title,
      defaultDescription: defaults.description,
      defaultImage: `${siteUrl}/opengraph-image`,
      editHref: "/manage/pages",
    };
  });

  const posts: SeoEntry[] = postRows.map((post) => ({
    kind: "post",
    id: post.id,
    label: post.title || "(Untitled insight)",
    path: `/insights/${post.slug}`,
    title: post.metaTitle,
    description: post.description,
    image: post.image,
    defaultTitle: `${post.title} | UMIN Global`,
    defaultDescription: post.excerpt,
    defaultImage: post.image,
    editHref: `/manage/posts/${post.id}`,
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Search & Social"
        title="SEO workspace"
        description="Manage search titles, descriptions, share images and organisation details in one place. Select an entry to preview and publish its metadata."
      />
      <SeoWorkspace site={site} pages={pages} posts={posts} initialItem={item ?? null} siteUrl={siteUrl} />
    </div>
  );
}
