import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";

// "The rest of what we do" row at the foot of the Growth and UMIN AI pages.
const CAPABILITIES = [
  {
    icon: "tech" as const,
    title: "Technology & AI",
    description: "Software, applications, SaaS platforms and cloud.",
    href: "/technology-ai",
  },
  {
    icon: "ai" as const,
    title: "UMIN AI",
    description: "Agents, automation and document intelligence.",
    href: "/umin-ai",
  },
  {
    icon: "ventures" as const,
    title: "Ventures",
    description: "Co-building new companies with founders.",
    href: "/ventures",
  },
  {
    icon: "globe" as const,
    title: "Global Strategy",
    description: "Market entry across seven regions.",
    href: "/global-strategy",
  },
];

export default function DetailMoreServices() {
  return (
    <div className= "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CAPABILITIES.map((capability, index) => (
        <Reveal key={capability.title} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className= "h-full">
          <ServiceCard {...capability} />
        </Reveal>
      ))}
    </div>
  );
}
