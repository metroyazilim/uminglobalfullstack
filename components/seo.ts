// Single source for the canonical origin and for meta-description shaping. Descriptions that
// run past ~160 characters get cut in the SERP mid-sentence, so they are composed from parts and
// clamped at a word boundary here instead of being hand-counted in thirteen page files.

// The production origin is what every canonical URL, OG URL, sitemap entry and JSON-LD `@id`
// resolves against, so it must be the domain the site is actually served from. Set
// NEXT_PUBLIC_SITE_URL in the Vercel project to change it without touching code; the literal is
// the fallback so a local build still produces absolute URLs.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://uminglobal.com").replace(/\/+$/, "");

// Vercel sets this on every deployment. Preview and development deployments get their own
// hostname, and a crawler that reaches one would index a duplicate of the whole site - so they
// are excluded from robots.txt instead (see app/robots.ts).
export const IS_PRODUCTION_DEPLOYMENT = process.env.VERCEL_ENV !== "preview" && process.env.VERCEL_ENV !== "development";

const MAX_DESCRIPTION = 158;

export function description(...parts: string[]): string {
  const text = parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
  if (text.length <= MAX_DESCRIPTION) return text;

  const cut = text.slice(0, MAX_DESCRIPTION);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : MAX_DESCRIPTION).replace(/[,;:\-–—]$/, "")}.`.replace(/\.\.$/, ".");
}

// Absolute URL for a site-relative path. JSON-LD has no equivalent of `metadataBase`: every
// identifier and every `url` in a graph has to be absolute or Google drops the node.
export function absoluteUrl(path: string): string {
  return path === "/" || path === "" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
