// The six stages UMIN covers, directly under the hero. A single thin band: it carries the
// sequence and nothing else, which is what keeps the hero and the first content section apart.
const STAGES = ["Idea", "Strategy", "Build", "Launch", "Grow", "Scale"];

export default function JourneyBand() {
  return (
    <section className= "border-b border-divider bg-white">
      <div className= "mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-6 py-6 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-7">
        <ol className= "flex flex-wrap items-center gap-x-3 gap-y-2">
          {STAGES.map((stage, index) => (
            <li key={stage} className= "flex items-center gap-3">
              <span className= "t-eyebrow text-ink">{stage}</span>
              {index < STAGES.length - 1 && (
                <span aria-hidden= "true" className= "text-[11px] text-label">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className= "t-small text-body">One partner across the journey.</p>
      </div>
    </section>
  );
}
