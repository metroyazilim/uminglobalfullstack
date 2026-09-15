import type { NextConfig } from "next";

// Deployment target is Vercel: no custom server, every route prerenders at build time, and the
// only runtime work is the generated OG images. What is configured here is therefore limited to
// what Vercel cannot infer - response headers, and redirects for the URLs this site used to have.

// Sent on every HTML response. Cheap, and each one closes a real default-open behaviour:
// MIME sniffing, framing by a third party, a full referrer leaking the visited path to external
// links, and the browser handing camera/microphone/geolocation to the page without being asked.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Only meaningful over HTTPS, which is the only way Vercel serves a production domain.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Photography is served from Unsplash and goes through next/image, so the optimizer has to be
  // allowed to fetch that host. Nothing else is permitted: an open image proxy would let anyone
  // serve arbitrary bytes from this domain. AVIF first, WebP for the browsers without it.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
    formats: ["image/avif", "image/webp"],
    // Photos live in content columns and full-bleed bands; these are the widths those actually
    // resolve to, so the optimizer is not asked for sizes nothing requests.
    deviceSizes: [420, 640, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
  },
  // The default `X-Powered-By: Next.js` announces the stack to every scanner for no benefit.
  poweredByHeader: false,
  // One canonical spelling per URL. Next already redirects `/path/` to `/path`; stating it keeps
  // that from silently changing and keeps canonical tags, the sitemap and analytics in agreement.
  trailingSlash: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Author-chosen filenames under /public never change contents without changing name, and
        // the fonts are hashed by next/font. A year of immutable caching removes the revalidation
        // round-trip on repeat visits.
        source: "/:all*(png|jpg|jpeg|svg|webp|avif|ico|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    // Plausible alternative spellings of real sections, so a typed or guessed URL lands on the
    // page it meant instead of a 404. Nothing here refers to the scaffold this project started
    // from: those paths were never served on a public domain, so redirecting them would only
    // publish the fact that they once existed.
    const legacy: Record<string, string> = {
      "/careers": "/build-with-umin",
      "/blog": "/insights",
      "/our-team": "/team",
      "/locations": "/offices",
    };
    return Object.entries(legacy).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
