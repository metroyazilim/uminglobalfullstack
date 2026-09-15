import Reveal from "./Reveal";
import Button from "./ui/Button";

// The two engagement models, side by side and deliberately unequal in surface: the partnership
// is the ink panel (the committed option), the package the light one. Terms are printed as a
// definition list so the commercial detail is scannable rather than buried in a paragraph.
const PARTNERSHIP = {
  includes: ["Brand", "Website", "Technology", "Social", "Content", "Advertising", "Lead gen", "Automation", "Growth strategy"],
  terms: [
    ["UMIN share", "20% of an agreed revenue basis"],
    ["Agreed up front", "Revenue definition, attribution, ad spend, costs, reporting, duration"],
    ["Availability", "Selective, after assessment of the business"],
  ],
};

const PACKAGE = {
  includes: ["Branding", "Website", "Social setup", "Marketing strategy", "Ad setup", "SEO", "Content", "CRM", "AI & automation", "Analytics"],
  terms: [
    ["Price", "One agreed project price"],
    ["Revenue share", "None"],
    ["Ownership", "Final deliverables belong to your business on completion"],
    ["Optional", "Ongoing marketing, technology and management, quoted separately"],
  ],
};

export default function PartnershipModels() {
  return (
    <div className= "grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Reveal className= "h-full">
        <article className= "flex h-full flex-col rounded-card bg-ink p-7 text-cta-copy lg:p-10">
          <span className= "t-eyebrow text-white/45">Option A</span>
          <h3 className= "t-h2 pt-3 text-white">UMIN Growth Partnership</h3>
          <p className= "t-lead pt-3 text-white/80">We build. We grow. We share.</p>
          <p className= "t-body pt-4 text-cta-copy">
            For selected businesses we become the ongoing technology and growth partner, and manage
            the whole digital ecosystem around the company.
          </p>
          <ul className= "flex flex-wrap gap-2 pt-6">
            {PARTNERSHIP.includes.map((item) => (
              <li key={item} className= "t-small rounded-control bg-white/10 px-3 py-1 text-white">
                {item}
              </li>
            ))}
          </ul>
          <dl className= "mt-7 divide-y divide-white/10 border-t border-white/15">
            {PARTNERSHIP.terms.map(([term, value]) => (
              <div key={term} className= "flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                <dt className= "t-eyebrow w-[130px] shrink-0 pt-1 text-white/45">{term}</dt>
                <dd className= "t-body text-cta-copy">{value}</dd>
              </div>
            ))}
          </dl>
          <Button href= "/contact" className= "mt-8 self-start">
            Apply for a Partnership
          </Button>
        </article>
      </Reveal>

      <Reveal delay={1} className= "h-full">
        <article className= "flex h-full flex-col rounded-card bg-white p-7 lg:p-10">
          <span className= "t-eyebrow text-label">Option B</span>
          <h3 className= "t-h2 pt-3 text-ink">UMIN Complete Package</h3>
          <p className= "t-lead pt-3 text-ink">Build it. Own it.</p>
          <p className= "t-body pt-4 text-body">
            Prefer a straightforward project? We build the complete digital infrastructure for an
            agreed project price.
          </p>
          <ul className= "flex flex-wrap gap-2 pt-6">
            {PACKAGE.includes.map((item) => (
              <li key={item} className= "t-small rounded-control bg-section-gray px-3 py-1 text-ink">
                {item}
              </li>
            ))}
          </ul>
          <dl className= "mt-7 divide-y divide-divider border-t border-divider">
            {PACKAGE.terms.map(([term, value]) => (
              <div key={term} className= "flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                <dt className= "t-eyebrow w-[130px] shrink-0 pt-1 text-label">{term}</dt>
                <dd className= "t-body text-body">{value}</dd>
              </div>
            ))}
          </dl>
          <Button href= "/contact" variant= "outlineDark" className= "mt-8 self-start">
            Request a Proposal
          </Button>
        </article>
      </Reveal>
    </div>
  );
}
