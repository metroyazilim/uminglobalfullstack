import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Market entry & expansion - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Global Strategy", title: "Market entry & expansion", subtitle: "Six regions, five offices, one operating standard." });
}
