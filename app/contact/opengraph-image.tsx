import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Talk to UMIN Global - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Contact", title: "Talk to UMIN Global", subtitle: "We reply from New York within one business day." });
}
