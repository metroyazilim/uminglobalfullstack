import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "./teamMembers";

// Byline block under an article. A credited team member gets their photo, role and a link to
// their profile - the visible half of the `author` Person node in the article's JSON-LD.
export default function BlogPostAuthor({ author }: { author?: TeamMember }) {
  if (author) {
    return (
      <div className="flex items-start gap-4 border-t border-divider pt-6">
        {author.photo ? (
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <Image src={author.photo} alt={author.photoAlt || author.name} fill sizes="56px" className="object-cover" unoptimized={/^https?:\/\//.test(author.photo)} />
          </span>
        ) : null}
        <div>
          <p className="t-small text-label">Written by</p>
          <Link href={`/team/${author.slug}`} rel="author" className="t-body font-bold text-ink hover:text-accent">
            {author.name}
          </Link>
          <p className="t-small text-body">{author.role}, UMIN Global</p>
          <p className="t-small pt-2 text-body">{author.bioShort}</p>
        </div>
      </div>
    );
  }

  return (
    <div className= "flex items-start gap-4 border-t border-divider pt-6">
      <span className= "flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-ink text-[12px] font-bold text-white">
        UMIN
      </span>
      <div>
        <Link href= "/about" className= "t-body font-bold text-ink hover:text-accent">
          UMIN Global
        </Link>
        <p className= "t-small pt-1 text-body">
          Written by the team in New York - engineers, strategists and marketers who build and grow
          the companies they write about.
        </p>
      </div>
    </div>
  );
}
