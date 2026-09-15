import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Notes from the work - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Insights", title: "Notes from the work", subtitle: "Technology, AI, growth and international expansion." });
}
