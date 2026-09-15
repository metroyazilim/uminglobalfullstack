import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import ScrollReset from "@/components/ScrollReset";
import { SITE_URL, IS_PRODUCTION_DEPLOYMENT, description } from "@/components/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const TITLE = "UMIN Global | Higher Thinking. Greater Possibilities.";
const DESCRIPTION = description(
  "UMIN Global turns ideas into technology, brands and scalable companies -",
  "software, AI, growth and market entry from New York, London, Melbourne, Istanbul and Dubai.",
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s" },
  description: DESCRIPTION,
  applicationName: "UMIN Global",
  authors: [{ name: "UMIN Global", url: SITE_URL }],
  creator: "UMIN Global",
  publisher: "UMIN Global",
  category: "business",
  keywords: [
    "technology consulting",
    "growth marketing agency",
    "AI agents for business",
    "venture studio",
    "digital transformation",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  // Read by Safari and by Windows tiles; the rest of the icon set comes from app/icon.tsx and
  // app/apple-icon.tsx, which Next links automatically.
  appleWebApp: { capable: false, title: "UMIN Global" },
  // No phone number is published anywhere on the site, so there is nothing for iOS to linkify.
  formatDetection: { telephone: false, address: false, email: true },
  robots: IS_PRODUCTION_DEPLOYMENT
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      }
    : // Preview deployments are excluded in robots.txt as well; the meta tag covers a crawler
      // that reaches a preview URL directly without fetching robots.txt first.
      { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "UMIN Global",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Organization and WebSite structured data. No street address - see ContactInfoPanel.tsx for
// why - so `address` stays limited to the locality, not a suite number nobody has confirmed.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "UMIN Global",
  legalName: "UMIN Global",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  image: `${SITE_URL}/opengraph-image`,
  slogan: "Higher Thinking. Greater Possibilities.",
  description: DESCRIPTION,
  founder: { "@type": "Person", name: "Anthon Ikram Umit", url: `${SITE_URL}/team/anthon-ikram-umit` },
  address: { "@type": "PostalAddress", addressLocality: "New York", addressCountry: "US" },
  areaServed: ["United Kingdom", "Europe", "United States", "Australia", "Türkiye", "Middle East"],
  knowsAbout: [
    "Custom software development",
    "SaaS platforms",
    "Applied artificial intelligence",
    "Growth marketing",
    "SEO",
    "Market entry and international expansion",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@uminglobal.com",
      availableLanguage: ["English", "Turkish"],
    },
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "UMIN Global",
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Runs before first paint, which is the only point at which the browser's scroll restoration can
// still be suppressed. See components/ScrollReset.tsx for the whole mechanism.
const SUPPRESS_SCROLL_RESTORE = `try{if('scrollRestoration' in history&&performance.getEntriesByType('navigation')[0]&&performance.getEntriesByType('navigation')[0].type==='reload'){history.scrollRestoration='manual'}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Hero and section imagery is served from Unsplash, so the TLS handshake to that origin
            is on the critical path of the first contentful paint. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script dangerouslySetInnerHTML={{ __html: SUPPRESS_SCROLL_RESTORE }} />
      </head>
      <body className="bg-white font-sans text-body antialiased">
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <JsonLd data={WEBSITE_JSON_LD} />
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
