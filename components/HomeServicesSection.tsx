import SectionHeading from "./ui/SectionHeading";
import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";

const CAPABILITIES = [
  {
    icon: "tech" as const,
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Technology & AI",
    description: "Software, web and mobile apps, SaaS platforms and automation.",
    href: "/technology-ai",
  },
  {
    icon: "growth" as const,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Growth & Marketing",
    description: "Brand, content, advertising, SEO and lead generation.",
    href: "/growth-marketing",
  },
  {
    icon: "ai" as const,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=500&q=80",
    title: "UMIN AI",
    description: "Agents, automation and document intelligence with a business case.",
    href: "/umin-ai",
  },
  {
    icon: "ventures" as const,
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Ventures",
    description: "We co-build new companies with founders and operators.",
    href: "/ventures",
  },
  {
    icon: "globe" as const,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Global Strategy",
    description: "Market entry and expansion across six regions.",
    href: "/global-strategy",
  },
];

export default function HomeServicesSection() {
  return (
    <>
      <SectionHeading eyebrow= "What we do" title= "Five capabilities. One global partner." />
      <div className="grid grid-cols-1 gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((capability, index) => (
          <Reveal key={capability.title} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className= "h-full">
            <ServiceCard {...capability} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
