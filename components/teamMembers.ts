// The team is one person. Earlier revisions of this file split "Anthon Ikram Umit" into three
// separate members with stock portraits - that was wrong, and the stock photos went with it.
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
}

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

export const TEAM_MEMBERS: TeamMember[] = [ANTHON];
