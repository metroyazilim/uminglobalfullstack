/**
 * Plain (non-`server-only`) module so build scripts such as
 * `scripts/import-static-content.ts` can read the defaults without pulling
 * Prisma or Next.js server internals into their module graph.
 *
 * These are exactly the values that were hard-coded in `app/layout.tsx`'s
 * Organization JSON-LD, so with no database — or an empty `SiteSettings`
 * row — the rendered structured data is identical to what the site shipped
 * with.
 */
export type SiteSettingsView = Readonly<{
  organizationName: string;
  legalName: string;
  alternateName: string;
  slogan: string;
  description: string;
  foundingDate: string;
  locality: string;
  countryCode: string;
  email: string;
  phone: string;
  socials: Readonly<{ linkedin: string; x: string; facebook: string; instagram: string; youtube: string }>;
}>;

export const SITE_SETTINGS_DEFAULTS: SiteSettingsView = {
  organizationName: "UMIN Global",
  legalName: "Mevlam Pty Ltd",
  alternateName: "UMIN",
  slogan: "Higher Thinking. Greater Possibilities.",
  description:
    "UMIN Global turns ideas into technology, brands and scalable companies - software, AI, growth and market entry from New York, London, Melbourne, Istanbul, Dubai and Shanghai.",
  foundingDate: "",
  locality: "New York",
  countryCode: "US",
  email: "info@uminglobal.com",
  phone: "",
  socials: { linkedin: "", x: "", facebook: "", instagram: "", youtube: "" },
};
