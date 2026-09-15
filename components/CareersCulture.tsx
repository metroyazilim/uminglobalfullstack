import Image from "next/image";
import Reveal from "./Reveal";

// Image + copy panel used twice on the Build With UMIN page, image side alternating.
interface CareersCultureProps {
  image: string;
  alt: string;
  title: string;
  paragraphs: string[];
  reverse?: boolean;
}

export default function CareersCulture({ image, alt, title, paragraphs, reverse }: CareersCultureProps) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <Reveal variant="fade" className={reverse ? "lg:order-1" : "lg:order-2"}>
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card">
          <Image src={image} alt={alt} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
        </div>
      </Reveal>
      <Reveal delay={1} className={reverse ? "lg:order-2" : "lg:order-1"}>
        <h3 className="t-h2 text-ink">{title}</h3>
        {paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={`t-body ${index === 0 ? "pt-4" : "pt-3"} text-body`}>
            {paragraph}
          </p>
        ))}
      </Reveal>
    </div>
  );
}
