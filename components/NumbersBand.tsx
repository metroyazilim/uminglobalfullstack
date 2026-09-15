import Reveal from "./Reveal";

// Three figures describing how UMIN is set up - not client or revenue claims, which is why they
// are stated plainly rather than as marketing counters. Filled cards rather than a divided row.
const FIGURES = [
  { value: "5", label: "Capabilities", note: "Technology & AI, Growth, UMIN AI, Ventures, Global Strategy" },
  { value: "6", label: "Regions", note: "UK, Europe, USA, Australia, Türkiye, Middle East" },
  { value: "1", label: "Partner", note: "One team from first meeting to scale" },
];

export default function NumbersBand() {
  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {FIGURES.map((figure, index) => (
        <Reveal key={figure.label} delay={index === 0 ? 0 : index === 1 ? 1 : 2} className="h-full">
          <div className="h-full rounded-card bg-white p-7">
            <dt className="flex items-baseline gap-3">
              <span className="text-[38px] font-extrabold leading-none tracking-[-1.5px] text-accent lg:text-[46px]">
                {figure.value}
              </span>
              <span className="t-eyebrow text-ink">{figure.label}</span>
            </dt>
            <dd className="t-small pt-3 text-body">{figure.note}</dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
