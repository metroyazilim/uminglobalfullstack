import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

// Three panels: why UMIN, what global strategy actually covers, and the ventures invitation.
// Photograph plus two sentences each - the long argument lives on the capability pages.
interface Panel {
  img: string;
  alt: string;
  title: string;
  copy: string;
  detail: string;
  link?: { label: string; href: string };
}

const PANELS: Panel[] = [
  {
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&h=700&q=80",
    alt: "A UMIN Global strategy session",
    title: "Why UMIN",
    copy: "A senior team from the first meeting to launch.",
    detail: "Technology, brand and acquisition are decided together, so nothing gets rebuilt.",
  },
  {
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&h=700&q=80",
    alt: "International expansion planning at UMIN Global",
    title: "Global Strategy",
    copy: "Expansion is a business decision before it is a campaign.",
    detail: "Entity, pricing, partnerships and the operating model come first; the build follows.",
  },
  {
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&h=700&q=80",
    alt: "Founders building with UMIN Global",
    title: "Build with UMIN",
    copy: "Strong ideas can become companies we build with you.",
    detail: "We contribute product, brand and growth capability under written terms.",
    link: { label: "Build With UMIN", href: "/build-with-umin" },
  },
];

export default function AboutMissionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PANELS.map((panel, index) => (
        <Reveal key={panel.title} delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-card bg-white">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={panel.img}
                alt={panel.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="t-h3 text-ink">{panel.title}</h3>
              <p className="t-body pt-3 font-medium text-ink">{panel.copy}</p>
              <p className="t-body pt-2 text-body">{panel.detail}</p>
              {panel.link && (
                <Link
                  href={panel.link.href}
                  className="t-eyebrow mt-auto flex items-center gap-2 pt-6 text-accent transition-opacity duration-200 hover:opacity-70"
                >
                  {panel.link.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
