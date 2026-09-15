import { SITE_URL, absoluteUrl } from "./seo";

// Builders for the schema.org shapes that repeat across pages. Hand-rolling these per page is how
// a graph ends up with three spellings of the same organisation reference and a breadcrumb whose
// positions are off by one, so every page composes them from here.
//
// Every node points `isPartOf`/`publisher` at the Organization and WebSite declared once in
// app/layout.tsx via their `@id`, which is what lets Google treat the site as one entity instead
// of sixty unrelated documents.

export type Crumb = { name: string; path: string };

/** Home is prepended automatically, so pass only the trail below it. */
export function breadcrumbJsonLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

interface CollectionArgs {
  path: string;
  name: string;
  description: string;
  /** Ordered entries of the listing. `type` is the schema type of the thing being listed. */
  items: { name: string; path: string; description?: string }[];
  itemType?: "WebPage" | "Service" | "LocalBusiness" | "Person" | "BlogPosting";
  /** Blog index uses `Blog`; the others are collections of pages. */
  pageType?: "CollectionPage" | "Blog" | "AboutPage" | "ContactPage";
}

export function collectionPageJsonLd({
  path,
  name,
  description,
  items,
  itemType = "WebPage",
  pageType = "CollectionPage",
}: CollectionArgs) {
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${absoluteUrl(path)}#page`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
        ...(item.description
          ? { item: { "@type": itemType, name: item.name, description: item.description, url: absoluteUrl(item.path) } }
          : {}),
      })),
    },
  };
}

/** A single content page with no list on it - About, Contact, a capability page. */
export function webPageJsonLd({
  path,
  name,
  description,
  pageType = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${absoluteUrl(path)}#page`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
