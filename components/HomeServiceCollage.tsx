import Image from "next/image";
import Reveal from "./Reveal";

// Two photographs with a caption each: the work UMIN is hired for most. Captions are one line -
// the detail belongs on the capability pages, not under a thumbnail.
const ITEMS = [
  {
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&h=750&q=80",
    alt: "Engineers building software at UMIN Global",
    title: "Technology & AI",
    caption: "Software, applications and AI agents that carry real workload.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&h=750&q=80",
    alt: "Growth and marketing performance review",
    title: "Growth & Marketing",
    caption: "Brand, campaigns and lead generation measured on pipeline.",
  },
];

export default function HomeServiceCollage() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {ITEMS.map((item, index) => (
        <Reveal key={item.title} delay={index === 1 ? 1 : 0} className={index === 1 ? "sm:mt-10" : ""}>
          <figure className="overflow-hidden rounded-card bg-white shadow-card">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-6 py-5">
              <h3 className="t-h3 text-ink">{item.title}</h3>
              <p className="t-body pt-2 text-body">{item.caption}</p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
