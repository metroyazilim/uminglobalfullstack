import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";

// The five ways UMIN is engaged, on the What We Do page. Descriptions stay at one line each: the
// full service list for each capability is printed further down the same page.
const CAPABILITIES = [
  {
    icon: "tech" as const,
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Technology & AI",
    description: "Custom software, web and mobile apps, SaaS, integrations and cloud.",
    href: "/technology-ai",
  },
  {
    icon: "growth" as const,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Growth & Marketing",
    description: "Brand, site, campaigns, SEO and CRM run as one system.",
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
    description: "We co-build companies and contribute product, brand and growth.",
    href: "/ventures",
  },
  {
    icon: "globe" as const,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=500&q=80",
    title: "Global Strategy",
    description: "Market entry across the UK, Europe, USA, Australia, Türkiye and the Gulf.",
    href: "/global-strategy",
  },
];

export default function ServicesGridFive() {
  return (
    <div className= "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CAPABILITIES.map((capability, index) => (
        <Reveal key={capability.title} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className= "h-full">
          <ServiceCard {...capability} />
        </Reveal>
      ))}
    </div>
  );
}
