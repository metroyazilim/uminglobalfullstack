import Button from "./ui/Button";

// Open roles. Both roles print their own detail - a collapsed accordion where only the first row
// has content reads like missing data.
const JOBS = [
  {
    title: "Senior Full-Stack Engineer",
    location: "New York / Remote",
    experience: "5+ years",
    stack: "TypeScript, Next.js, Node, cloud",
    copy: "Own client products and UMIN ventures end to end, including the AI parts that earn their place. You will be asked about cost, risk and what to ship first, not only about tickets.",
  },
  {
    title: "Growth Marketing Lead",
    location: "New York / Remote",
    experience: "4+ years",
    stack: "Paid, SEO, lifecycle, analytics",
    copy: "Own acquisition across clients and ventures, reporting on cost per qualified lead and pipeline rather than impressions.",
  },
];

export default function CareersJobList() {
  return (
    <ul className="flex flex-col gap-5">
      {JOBS.map((job) => (
        <li key={job.title} className="rounded-card bg-white p-6 transition-colors duration-200 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[620px]">
              <h3 className="t-h3 text-ink">{job.title}</h3>
              <p className="t-body pt-2 text-body">{job.copy}</p>
              <dl className="flex flex-wrap gap-x-8 gap-y-2 pt-4">
                {[
                  ["Location", job.location],
                  ["Experience", job.experience],
                  ["Focus", job.stack],
                ].map(([term, value]) => (
                  <div key={term} className="flex items-baseline gap-2">
                    <dt className="t-eyebrow text-label">{term}</dt>
                    <dd className="t-small text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Button href="/contact" variant="outlineDark" className="shrink-0">
              Apply
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
