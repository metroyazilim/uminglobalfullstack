import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Custom software, SaaS & AI - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Technology & AI", title: "Custom software, SaaS & AI", subtitle: "Built around the workflow and what it costs today." });
}
