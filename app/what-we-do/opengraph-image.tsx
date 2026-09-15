import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "What we do - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Capabilities", title: "What we do", subtitle: "Five capabilities, 42 services, one senior team." });
}
