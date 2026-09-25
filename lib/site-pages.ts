/**
 * Catalog of the site's static top-level pages, used only by the admin
 * panel's Pages/SEO screens (app/manage/(panel)/pages,
 * app/manage/(panel)/seo). `key` is the identifier `lib/seo-overrides.ts`
 * and the `PageSeo` table match a page by — it must stay in sync with the
 * key each page's `generateMetadata` passes to `applyPageSeoOverride`.
 *
 * Dynamic detail routes (team/[slug], offices/[slug], insights/[slug],
 * services/[slug]) are not listed here: their own admin screens (Team,
 * Offices, Insights) are the place to manage them.
 */
export type SitePageKey =
  | "home"
  | "about"
  | "what-we-do"
  | "technology-ai"
  | "growth-marketing"
  | "umin-ai"
  | "ventures"
  | "global-strategy"
  | "services"
  | "team"
  | "offices"
  | "insights"
  | "contact"
  | "build-with-umin";

export const PAGE_CONTENT_KEYS = [
  "home",
  "about",
  "what-we-do",
  "technology-ai",
  "growth-marketing",
  "umin-ai",
  "ventures",
  "global-strategy",
  "services",
  "contact",
  "build-with-umin",
] as const satisfies readonly SitePageKey[];

export type PageContentKey = (typeof PAGE_CONTENT_KEYS)[number];

export type SitePageEntry = Readonly<{ key: SitePageKey; label: string; path: string }>;

export const SITE_PAGES: readonly SitePageEntry[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "what-we-do", label: "What We Do", path: "/what-we-do" },
  { key: "technology-ai", label: "Technology & AI", path: "/technology-ai" },
  { key: "growth-marketing", label: "Growth & Marketing", path: "/growth-marketing" },
  { key: "umin-ai", label: "UMIN AI", path: "/umin-ai" },
  { key: "ventures", label: "Ventures", path: "/ventures" },
  { key: "global-strategy", label: "Global Strategy", path: "/global-strategy" },
  { key: "services", label: "All Services", path: "/services" },
  { key: "team", label: "Team", path: "/team" },
  { key: "offices", label: "Offices", path: "/offices" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "build-with-umin", label: "Build With UMIN", path: "/build-with-umin" },
];

export function isSitePageKey(value: string): value is SitePageKey {
  return SITE_PAGES.some((page) => page.key === value);
}

export function isPageContentKey(value: string): value is PageContentKey {
  return (PAGE_CONTENT_KEYS as readonly string[]).includes(value);
}

export function findSitePage(key: string): SitePageEntry | undefined {
  return SITE_PAGES.find((page) => page.key === key);
}
