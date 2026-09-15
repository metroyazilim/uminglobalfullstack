import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Build with UMIN - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Ventures", title: "Build with UMIN", subtitle: "Your idea could become the next business." });
}
