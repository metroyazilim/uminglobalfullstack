import Reveal from "./Reveal";

// How an engagement runs, as four filled cards rather than bare ruled rows: the sequence still
// reads left to right, but each stage now has its own boxed surface instead of sitting directly
// on the section background.
const STEPS = [
  { number: "01", title: "Discover", copy: "Business, market and commercial goal before any proposal." },
  { number: "02", title: "Design & build", copy: "Strategy, product and brand built as one system." },
  { number: "03", title: "Launch", copy: "Ship, measure, correct - with reporting you can act on." },
  { number: "04", title: "Grow & scale", copy: "Acquisition, automation and entry into new markets." },
];

export default function ProcessSteps() {
  return (
    <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, index) => (
        <Reveal key={step.number} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className="h-full">
          <li className="h-full rounded-card bg-white p-6 transition-colors duration-200 lg:p-7">
            <span className="text-[13px] font-bold tracking-[2px] text-accent">{step.number}</span>
            <h3 className="t-h3 pt-3 text-ink">{step.title}</h3>
            <p className="t-body pt-2 text-body">{step.copy}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
