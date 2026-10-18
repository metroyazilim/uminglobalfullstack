import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import Button from "./ui/Button";
import { RichText } from "./RichText";
import Section from "./ui/Section";
import type { TeamMember } from "./teamMembers";
import type { InsightPost } from "./insights";

function profileLabel(href: string): string {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.endsWith("linkedin.com")) return "LinkedIn";
    if (host.endsWith("github.com")) return "GitHub";
    if (host === "x.com" || host.endsWith("twitter.com")) return "X";
    return host;
  } catch {
    return href;
  }
}

// Shared body for the individual team page: photo, role, bio paragraphs, and links out to the
// capabilities this person owns. The route supplies its own Header/PageHeroBanner/Footer and
// metadata - `alternates.canonical` has to live in the page file, not a shared component.
export default function TeamMemberProfile({ member, articles = [] }: { member: TeamMember; articles?: InsightPost[] }) {
  return (
    <Section space="lg">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card">
            <Image
              src={member.photo}
              alt={member.photoAlt}
              fill
              // The portrait is the largest element in the first viewport of this page, so it is
              // the LCP candidate: preloaded rather than lazy-loaded.
              priority
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover grayscale"
            />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <span className="t-eyebrow flex items-center gap-3 text-label">
            <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
            {member.role}
          </span>
          {member.bio.map((paragraph) => (
            <RichText key={paragraph} html={paragraph} className="t-lead pt-4 text-body" />
          ))}

          <h2 className="t-h3 pt-8 text-ink">Capabilities</h2>
          <ul className="pt-2">
            {member.worksOn.map((capability) => (
              <li key={capability.href}>
                <Link
                  href={capability.href}
                  className="t-body block py-1.5 text-body transition-colors duration-200 hover:text-accent"
                >
                  {capability.label}
                </Link>
              </li>
            ))}
          </ul>

          {articles.length > 0 ? (
            <>
              <h2 className="t-h3 pt-8 text-ink">Articles by {member.name}</h2>
              <ul className="pt-2">
                {articles.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="t-body block py-1.5 text-body transition-colors duration-200 hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {member.sameAs?.length ? (
            <p className="t-small pt-6 text-body">
              Elsewhere:{" "}
              {member.sameAs.map((href, index) => (
                <span key={href}>
                  {index > 0 ? ", " : null}
                  <a href={href} rel="me noopener" target="_blank" className="text-ink underline hover:text-accent">
                    {profileLabel(href)}
                  </a>
                </span>
              ))}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-8 sm:flex-row">
            <Button href="/contact">Start a Project</Button>
            <Button href="/what-we-do" variant="outlineDark">
              What we do
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
