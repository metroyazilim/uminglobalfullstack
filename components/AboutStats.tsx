import Reveal from "./Reveal";

// Structural facts about how UMIN is set up. Filled cards on the ink surface so it reads as a
// fact sheet rather than four marketing counters.
const FACTS = [
  { value: "5", label: "Capabilities" },
  { value: "6", label: "Regions" },
  { value: "5", label: "Offices" },
  { value: "1", label: "Partner" },
];

export default function AboutStats() {
  return (
    <section className="bg-ink">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-12 md:px-10 lg:px-16 lg:py-16">
        <Reveal>
          <dl className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="rounded-card border border-white/15 bg-white/5 p-6">
                <dt className="text-[34px] font-extrabold leading-none tracking-[-1.4px] text-white lg:text-[44px]">
                  {fact.value}
                </dt>
                <dd className="t-eyebrow pt-3 text-white/55">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
