import type { MetadataRoute } from "next";
import { SERVICES } from "@/components/services";
import { OFFICES } from "@/components/offices";
import { TEAM_MEMBERS } from "@/components/teamMembers";
import { INSIGHTS } from "@/components/insights";
import { SITE_URL } from "@/components/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** Articles carry their own date; everything else gets the build date. */
  lastModified?: string;
};

// Static routes listed explicitly; service, office, team and article pages are derived from the
// same data the pages render from, so a new entry in those catalogues appears here without a
// second edit - and nothing can be listed here that has no page behind it.
const STATIC_ROUTES: Entry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/what-we-do", priority: 0.9, changeFrequency: "monthly" },
  { path: "/technology-ai", priority: 0.9, changeFrequency: "monthly" },
  { path: "/growth-marketing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/umin-ai", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ventures", priority: 0.8, changeFrequency: "monthly" },
  { path: "/global-strategy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/team", priority: 0.7, changeFrequency: "monthly" },
  { path: "/offices", priority: 0.7, changeFrequency: "monthly" },
  { path: "/build-with-umin", priority: 0.7, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  const entries: Entry[] = [
    ...STATIC_ROUTES,
    ...SERVICES.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...OFFICES.map((office) => ({
      path: `/offices/${office.slug}`,
      priority: 0.6,
      changeFrequency: "yearly" as const,
    })),
    ...TEAM_MEMBERS.map((member) => ({
      path: `/team/${member.slug}`,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
    ...INSIGHTS.map((post) => ({
      path: `/insights/${post.slug}`,
      priority: 0.6,
      changeFrequency: "yearly" as const,
      // The real publication date, not the build date: a lastmod that moves on every deployment
      // without the text changing is noise, and crawlers discount it.
      lastModified: post.updated ?? post.date,
    })),
  ];

  return entries.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastModified ? new Date(lastModified) : buildDate,
    changeFrequency,
    priority,
  }));
}
