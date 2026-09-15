import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import type { Service } from "./services";

// A titled capability list: heading, one line of context, then the services themselves as a
// multi-column index of links. Every entry has its own page at /services/<slug>, so this is
// navigation rather than decoration - which is also why the rows carry no border or shadow.
interface CapabilityListProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  services: Service[];
  columns?: 2 | 3;
  image?: string;
  imageAlt?: string;
}

export default function CapabilityList({
  eyebrow,
  title,
  lead,
  services,
  columns = 3,
  image,
  imageAlt,
}: CapabilityListProps) {
  const columnClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  const heading = (
    <div className="max-w-[720px]">
      {eyebrow && (
        <span className="t-eyebrow flex items-center gap-3 text-label">
          <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="t-h2 pt-4 text-ink">{title}</h2>
      {lead && <p className="t-lead pt-4 text-body">{lead}</p>}
    </div>
  );

  return (
    <Reveal>
      {image ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16">
          {heading}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        heading
      )}
      <ul className={`mt-10 grid grid-cols-1 gap-x-10 ${columnClass}`}>
        {services.map((service) => (
          <li key={service.slug}>
            <Link href={`/services/${service.slug}`} className="group block py-2.5">
              <span className="t-body flex items-center gap-2 font-medium text-ink group-hover:text-accent">
                {service.name}
                <span
                  aria-hidden="true"
                  className="text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
