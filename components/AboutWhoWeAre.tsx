import Image from "next/image";
import Reveal from "./Reveal";

// About page opener: photograph on the right, the claim and the three facts that qualify it on
// the left. The original three paragraphs said the same thing three ways.
export default function AboutWhoWeAre() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
      <Reveal>
        <span className="t-eyebrow flex items-center gap-3 text-label">
          <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
          Who we are
        </span>
        <h2 className="t-h2 pt-4 text-ink">
          One platform for technology, growth and ventures
        </h2>
        <p className="t-lead pt-4 text-body">
          UMIN Global is a New York technology and growth company. We work with founders and
          established businesses that need to move faster than an agency or a consultancy allows.
        </p>
        <ul className="mt-8 divide-y divide-divider border-y border-divider">
          {[
            ["One team", "Engineering, brand, marketing and expansion in the same room."],
            ["One decision", "Nothing is scoped twice or rebuilt by a second supplier."],
            ["One accountability", "Commercial outcomes, not a list of deliverables."],
          ].map(([title, copy]) => (
            <li key={title} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
              <span className="t-eyebrow w-[150px] shrink-0 pt-1 text-accent">{title}</span>
              <span className="t-body text-body">{copy}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal variant="fade" delay={1}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=900&q=80"
            alt="The UMIN Global team working together"
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
          />
        </div>
      </Reveal>
    </div>
  );
}
