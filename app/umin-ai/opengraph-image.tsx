import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AI agents & automation - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "UMIN AI", title: "AI agents & automation", subtitle: "Applied where it reduces cost or wins revenue." });
}
