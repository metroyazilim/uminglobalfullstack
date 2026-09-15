import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "About UMIN Global - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "About", title: "About UMIN Global", subtitle: "New York based, working across six regions." });
}
