// Continuously scrolling band of the regions UMIN operates in. Server component: the loop is
// pure CSS (marquee-track in globals.css), so it never competes with the scroll reveals.
const REGIONS = ["UK", "Europe", "USA", "Australia", "Türkiye", "Middle East", "China"];

export default function RegionStrip() {
  const items = [...REGIONS, ...REGIONS];

  return (
    <section className= "overflow-hidden border-y border-divider bg-white py-5">
      <div className= "marquee-track flex w-max items-center gap-10">
        {items.map((region, index) => (
          <span key={`${region}-${index}`} className= "flex items-center gap-10">
            <span className= "t-eyebrow text-ink">{region}</span>
            <span aria-hidden= "true" className= "h-[3px] w-[3px] rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </section>
  );
}
