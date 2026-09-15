import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Brand, ads, SEO, CRM - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Growth & Marketing", title: "Brand, ads, SEO, CRM", subtitle: "Run as one system, measured on pipeline." });
}
