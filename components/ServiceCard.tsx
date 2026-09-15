import Image from "next/image";
import Link from "next/link";
import ServiceIcon, { type ServiceIconName } from "./icons/ServiceIcon";

// Capability card. Left-aligned rather than centred, 8px corners, one hairline rule under the
// icon: a repeated centred card stack with identical shadows was the most template-looking part
// of the page. Copy is capped at two lines so cards in a row stay the same height visually.
interface ServiceCardProps {
  icon?: ServiceIconName;
  image?: string;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
}

export default function ServiceCard({
  icon,
  image,
  title,
  description,
  href,
  linkLabel = "Explore",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-card bg-white transition-colors duration-200"
    >
      {image && (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={image}
            alt={`${title} at UMIN Global`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        {icon && <ServiceIcon name={icon} className="h-9 w-9 text-accent" />}
        <h3 className="t-h3 pt-5 text-ink">{title}</h3>
        <p className="t-body pt-2 text-body">{description}</p>
        <span className="t-eyebrow mt-auto flex items-center gap-2 pt-6 text-accent">
          {linkLabel}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
