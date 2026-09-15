import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Every service, one page each - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Services", title: "Every service, one page each", subtitle: "Software, AI, brand, advertising, SEO, CRM, automation." });
}
