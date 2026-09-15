import { OG_SIZE, ogCard } from "@/components/ogCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Six offices, seven regions - UMIN Global";

export default function OgImage() {
  return ogCard({ eyebrow: "Offices", title: "Six offices, seven regions", subtitle: "New York, London, Melbourne, Istanbul, Dubai, Shanghai." });
}
