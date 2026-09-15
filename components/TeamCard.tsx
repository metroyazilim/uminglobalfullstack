import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import type { TeamMember } from "./teamMembers";

// Grayscale on the portrait - the one photograph UMIN actually has is black and white, and
// keeping the card matched to it reads as a deliberate editorial choice.
export default function TeamCard({ member, delay = 0 }: { member: TeamMember; delay?: 0 | 1 | 2 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/team/${member.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card bg-white transition-colors duration-200"
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={member.photo}
            alt={member.photoAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="object-cover grayscale"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 lg:p-7">
          <h3 className="t-h3 text-ink">{member.name}</h3>
          <p className="t-eyebrow pt-1 text-accent">{member.role}</p>
          <p className="t-body pt-3 text-body">{member.bioShort}</p>
          <span className="t-eyebrow mt-auto flex items-center gap-2 pt-6 text-accent">
            View profile
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
