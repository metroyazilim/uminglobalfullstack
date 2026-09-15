import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOYMENT, SITE_URL } from "@/components/seo";

export default function robots(): MetadataRoute.Robots {
  // A preview deployment serves the entire site on its own hostname. Left crawlable it becomes a
  // full duplicate of production competing for the same queries, so only the production
  // deployment invites crawlers.
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
