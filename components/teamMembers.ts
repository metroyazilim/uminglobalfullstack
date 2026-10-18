// The team: the founder and the CTO. Earlier revisions split "Anthon Ikram Umit" into three
// separate members with stock portraits - that was wrong, and the stock photos went with it.
// Every person here has a real photograph and their own page at /team/<slug>.
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bioShort: string;
  bio: string[];
  /** Capability pages this person owns - linked from the profile page. */
  worksOn: { label: string; href: string }[];
  /** The same person's profiles elsewhere - emitted as Person `sameAs`. */
  sameAs?: string[];
  /** Expertise beyond the capability pages - emitted as Person `knowsAbout`. */
  knowsAbout?: string[];
  /** Other names the person is searched by - emitted as Person `alternateName`. */
  alternateName?: string;
  /** More photos of the person, shown on the profile and listed in the image sitemap. */
  gallery?: TeamPhoto[];
}

// A type alias, not an interface, so it stays assignable to Prisma's JSON input type.
export type TeamPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export const ANTHON: TeamMember = {
  slug: "anthon-ikram-umit",
  name: "Anthon Ikram Umit",
  role: "Founder",
  photo: "/team/anthon-ikram-umit.png",
  photoAlt: "Anthon Ikram Umit, Founder of UMIN Global",
  bioShort:
    "Founded UMIN Global and runs every engagement personally - the first call, the commercial terms and the work that ships.",
  bio: [
    "Anthon Ikram Umit founded UMIN Global to do one thing properly: take a business from an idea to a company that operates in more than one market, without handing it to three different agencies on the way.",
    "He is on every engagement personally - the first call, the commercial terms, the build decisions and the reporting afterwards. That is the whole reason the company stays small and senior rather than layering account managers between a client and the work.",
    "His focus across the five capabilities is the same question in each: what does this cost the business today, and what changes when we ship.",
  ],
  worksOn: [
    { label: "Technology & AI", href: "/technology-ai" },
    { label: "Growth & Marketing", href: "/growth-marketing" },
    { label: "UMIN AI", href: "/umin-ai" },
    { label: "Ventures", href: "/ventures" },
    { label: "Global Strategy", href: "/global-strategy" },
  ],
};

export const BERAT: TeamMember = {
  slug: "muhammet-berat-arslan",
  name: "Muhammet Berat Arslan",
  role: "Chief Technology Officer",
  photo: "/team/muhammet-berat-arslan.png",
  photoAlt: "Muhammet Berat Arslan (Berat Arslan), Chief Technology Officer of UMIN Global",
  alternateName: "Berat Arslan",
  // File names, alt text and captions all carry the name: they are what image search indexes.
  gallery: [
    {
      src: "/team/muhammet-berat-arslan-cto-umin-global.jpg",
      alt: "Muhammet Berat Arslan, CTO of UMIN Global, in a black suit and white shirt",
      caption: "Muhammet Berat Arslan, Chief Technology Officer of UMIN Global.",
    },
    {
      src: "/team/berat-arslan-software-developer.jpg",
      alt: "Berat Arslan, software developer and CTO of UMIN Global, wearing glasses and a navy blazer",
      caption: "Berat Arslan (Muhammet Berat Arslan), software developer and technical SEO lead at UMIN Global.",
    },
  ],
  bioShort:
    "Software developer and CTO of UMIN Global. Leads architecture, technical SEO, custom admin systems and the AI systems UMIN puts into production.",
  bio: [
    "Muhammet Berat Arslan is a software developer and UMIN Global's Chief Technology Officer. He heads technology and digital development: architecture, the engineering standard and what actually goes to production are his decisions.",
    "His speciality is the part of a website most teams leave until after launch - technical SEO. Crawlable server-rendered pages, canonical URLs, XML sitemaps, structured data (Organization, Person, BlogPosting, BreadcrumbList) and Core Web Vitals are designed into the build from the first commit, not bolted on by an agency months later.",
    "He builds the systems behind that standard himself: custom admin panels that let each team publish its own content, media infrastructure on Cloudflare R2, and Next.js and PostgreSQL platforms such as <a href=\"https://wpfuk.org\">wpfuk.org</a> and <a href=\"https://kadiklondon.org\">kadiklondon.org</a>.",
    "He works on the same principle the company sells: a system is only worth building if someone can state what it costs the business today and what changes once it ships. That applies to a SaaS platform, an AI agent taking real support volume, and the automation nobody sees.",
  ],
  worksOn: [
    { label: "Technology & AI", href: "/technology-ai" },
    { label: "SEO", href: "/services/seo" },
    { label: "Website Design & Development", href: "/services/website-design-development" },
    { label: "Custom Software Development", href: "/services/custom-software-development" },
    { label: "AI Agents", href: "/services/ai-agents" },
    { label: "Cloud Solutions", href: "/services/cloud-solutions" },
  ],
  sameAs: ["https://www.linkedin.com/in/arslanberatt"],
  knowsAbout: [
    "Technical SEO",
    "Search engine optimization",
    "Structured data",
    "Core Web Vitals",
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Cloudflare R2",
    "Content management systems",
    "Software architecture",
  ],
};

export const TEAM_MEMBERS: TeamMember[] = [ANTHON, BERAT];

export function findTeamMember(slug: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((member) => member.slug === slug);
}
