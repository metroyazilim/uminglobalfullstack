import Reveal from "./Reveal";
import Button from "./ui/Button";

// Growth page opener: the claim on the left, the three things the work is measured on the right.
const MEASURES = [
  { title: "Presence", copy: "Brand, site and content as one system." },
  { title: "Acquisition", copy: "Paid, SEO and lead gen on cost per qualified lead." },
  { title: "Retention", copy: "CRM, email and automation after the first sale." },
];

export default function DetailIntro() {
  return (
    <div className= "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <Reveal>
        <span className= "t-eyebrow flex items-center gap-3 text-label">
          <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
          Growth & Marketing
        </span>
        <h2 className= "t-h2 pt-4 text-ink">Build your presence. Grow your business.</h2>
        <p className= "t-lead pt-4 text-body">
          A strong digital presence means very little if nobody sees it. Two ways to work with us:
          an ongoing Growth Partnership, or a Complete Package you own outright.
        </p>
        <div className= "flex flex-col gap-3 pt-8 sm:flex-row">
          <Button href= "#models">Compare the two models</Button>
          <Button href= "/contact" variant= "outlineDark">
            Start a Project
          </Button>
        </div>
      </Reveal>

      <Reveal delay={1}>
        <dl className= "divide-y divide-divider border-y border-divider">
          {MEASURES.map((measure) => (
            <div key={measure.title} className= "py-5">
              <dt className= "t-eyebrow text-accent">{measure.title}</dt>
              <dd className= "t-body pt-2 text-body">{measure.copy}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
