import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Who you work with - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Team", title: "Who you work with", subtitle: "No account managers between you and the work." });
}
