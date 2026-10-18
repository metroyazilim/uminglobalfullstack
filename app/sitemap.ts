import type { MetadataRoute } from "next";
import { SERVICES } from "@/components/services";
import { getOfficeSlugs } from "@/lib/content/offices";
import { getTeamMembers } from "@/lib/content/team";
import { getInsights } from "@/lib/content/insights";
import { SITE_URL, absoluteUrl } from "@/components/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** Articles carry their own date; everything else gets the build date. */
  lastModified?: string;
  /** Image sitemap entries - how photos of a person get indexed against their profile. */
  images?: string[];
};

const imageUrl = (src: string) => (/^https?:\/\//.test(src) ? src : absoluteUrl(src));

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

// Articles and team members are published from the admin panel, so the sitemap is regenerated
// every five minutes instead of being frozen at build time.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [officeSlugs, team, insights] = await Promise.all([getOfficeSlugs(), getTeamMembers(), getInsights()]);
  const buildDate = new Date();
  const entries: Entry[] = [
    ...STATIC_ROUTES,
    ...SERVICES.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...officeSlugs.map((slug) => ({
      path: `/offices/${slug}`,
      priority: 0.6,
      changeFrequency: "yearly" as const,
    })),
    ...team.map((member) => ({
      path: `/team/${member.slug}`,
      priority: 0.5,
      changeFrequency: "yearly" as const,
      images: [member.photo, ...(member.gallery ?? []).map((photo) => photo.src)].filter(Boolean).map(imageUrl),
    })),
    ...insights.map((post) => ({
      path: `/insights/${post.slug}`,
      priority: 0.6,
      changeFrequency: "yearly" as const,
      // The real publication date, not the build date: a lastmod that moves on every deployment
      // without the text changing is noise, and crawlers discount it.
      lastModified: post.updated ?? post.date,
      images: post.image ? [imageUrl(post.image)] : [],
    })),
  ];

  return entries.map(({ path, priority, changeFrequency, lastModified, images }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastModified ? new Date(lastModified) : buildDate,
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
  }));
}
