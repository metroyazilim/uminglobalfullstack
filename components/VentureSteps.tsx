import Reveal from "./Reveal";

// The five stages of a venture collaboration, as filled cards rather than bare ruled rows.
const STEPS = [
  { number: "01", title: "Submit your idea", copy: "The problem, the market, where you are today." },
  { number: "02", title: "Assessment", copy: "Opportunity, competition and what building it takes." },
  { number: "03", title: "Plan & terms", copy: "Scope, contribution, equity or revenue share, in writing." },
  { number: "04", title: "Launch", copy: "Product, brand and acquisition go live together." },
  { number: "05", title: "Grow together", copy: "We keep building, measuring and expanding." },
];

export default function VentureSteps() {
  return (
    <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((step, index) => (
        <Reveal key={step.number} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className="h-full">
          <li className="h-full rounded-card bg-white p-6 transition-colors duration-200">
            <span className="text-[13px] font-bold tracking-[2px] text-accent">{step.number}</span>
            <h3 className="t-h3 pt-2 text-ink">{step.title}</h3>
            <p className="t-body pt-2 text-body">{step.copy}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
