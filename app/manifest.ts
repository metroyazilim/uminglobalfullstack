import type { MetadataRoute } from "next";

// Web app manifest, served at /manifest.webmanifest and linked from the root layout. This is not
// a PWA - there is no service worker and no offline mode - but the manifest is what supplies the
// name, theme colour and icon when the site is pinned to an Android home screen or installed from
// Chrome, and Lighthouse's SEO/PWA audits check for it.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UMIN Global",
    short_name: "UMIN",
    description:
      "Technology, AI, growth and market entry - UMIN Global turns ideas into scalable companies.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a1a2f",
    lang: "en",
    categories: ["business", "technology", "consulting"],
    icons: [
      { src: "/brand/umin-badge-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/umin-badge-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
