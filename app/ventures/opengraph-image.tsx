import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "We co-build companies - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Ventures", title: "We co-build companies", subtitle: "Product, brand and growth for equity or revenue share." });
}
