import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Anthon Ikram Umit, Founder - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Founder", title: "Anthon Ikram Umit", subtitle: "Founder of UMIN Global." });
}
