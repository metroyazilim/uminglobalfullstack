import "server-only";
import type { Metadata } from "next";
import { prisma } from "./db";
import { hasDatabase } from "./env";

/** One row per static page, matched by the same key the admin's SEO editor
 * lists it under (see PAGE_SEO_ENTRIES in app/manage/(panel)/seo/page.tsx).
 * A field left empty in the admin editor means "use the shipped default" —
 * the merge below only overwrites a field when the stored value is a
 * non-empty string, so an unconfigured/partially-filled row never blanks
 * out a page's title or description. */
export type PageSeoOverride = Readonly<{
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}>;

/**
 * Reads the admin-managed SEO override for a page, if any. Safe to call
 * from every static page's `generateMetadata` regardless of whether the
 * admin panel is configured for this deployment: with no `DATABASE_URL` set
 * (the public site's default, zero-database state) this returns `null`
 * instantly without importing Prisma, and any database error is caught and
 * logged rather than breaking the page's metadata.
 */
export async function getPageSeoOverride(key: string): Promise<PageSeoOverride | null> {
  if (!hasDatabase()) return null;
  try {
    const row = await prisma.pageSeo.findUnique({ where: { key } });
    if (!row) return null;
    return {
      title: row.title,
      description: row.description,
      ogTitle: row.ogTitle,
      ogDescription: row.ogDescription,
      ogImage: row.ogImage,
    };
  } catch (error) {
    console.error(`[seo-overrides] failed to load override for "${key}"`, error);
    return null;
  }
}

/** Merges an admin override on top of a page's shipped default metadata.
 * `base.openGraph`/`base.twitter` are spread first so fields the admin
 * hasn't touched (type, url, card) survive untouched. */
export function mergePageSeoOverride(base: Metadata, override: PageSeoOverride | null): Metadata {
  if (!override) return base;

  const title = override.title?.trim() || base.title;
  const description = override.description?.trim() || base.description;
  const ogTitle = override.ogTitle?.trim() || override.title?.trim() || (typeof base.openGraph?.title === "string" ? base.openGraph.title : undefined);
  const ogDescription = override.ogDescription?.trim() || override.description?.trim() || (typeof base.openGraph?.description === "string" ? base.openGraph.description : undefined);
  const ogImage = override.ogImage?.trim();

  return {
    ...base,
    title,
    description,
    openGraph: {
      ...base.openGraph,
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: base.twitter
      ? {
          ...base.twitter,
          title: ogTitle,
          description: ogDescription,
          ...(ogImage ? { images: [ogImage] } : {}),
        }
      : base.twitter,
  };
}

/** One-call convenience for a static page's `generateMetadata`: `return applyPageSeoOverride(BASE_METADATA, "about");` */
export async function applyPageSeoOverride(base: Metadata, key: string): Promise<Metadata> {
  return mergePageSeoOverride(base, await getPageSeoOverride(key));
}
