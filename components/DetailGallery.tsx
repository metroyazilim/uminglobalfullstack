import Image from "next/image";
import Reveal from "./Reveal";

// Growth page evidence band: one photograph, and the three sentences that say how the work is
// actually run. Anything longer belongs on the partnership panels below.
export default function DetailGallery() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
      <Reveal variant="fade">
        <div className="relative aspect-square w-full overflow-hidden rounded-card">
          <Image
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&h=1000&q=80"
            alt="A UMIN Global growth review session"
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={1}>
        <h3 className="t-h2 text-ink">Marketing on top of technology we can change</h3>
        <p className="t-lead pt-4 text-body">
          Campaigns that sit on a product nobody can edit stall within a quarter. We own both, so a
          pricing test, a new landing route or a CRM field is a day of work, not a new supplier.
        </p>
        <p className="t-body pt-4 text-body">
          Reporting shows cost per qualified lead, conversion and pipeline &mdash; the three numbers
          a board actually asks about.
        </p>
      </Reveal>
    </div>
  );
}
