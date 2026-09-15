// The six offices, each with its own page at /offices/<slug>. City level only - no street
// addresses anywhere on the site, deliberately.
export interface Office {
  slug: string;
  city: string;
  country: string;
  /** Headline region this office covers. */
  region: string;
  summary: string;
  detail: [string, string];
  headquarters?: boolean;
}

export const OFFICES: Office[] = [
  {
    slug: "new-york",
    city: "New York",
    country: "United States",
    region: "North America",
    summary: "UMIN Global's headquarters and the base for all North American work.",
    detail: [
      "New York is where UMIN Global is run from: the commercial terms, the delivery standard and the reporting every other office works to are set here.",
      "For North American clients it is also the operating base - US market entry, local acquisition and the time zone the senior team is reachable in for most of the working day.",
    ],
    headquarters: true,
  },
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    region: "UK & Europe",
    summary: "The base for UK and European engagements and for market entry into both.",
    detail: [
      "London covers the UK and European work: technology builds for businesses operating under UK and EU rules, and the acquisition side that goes with them.",
      "It is also the office most often involved when a US or Australian business is entering Europe, where the difference between a translated website and a market-ready one decides the result.",
    ],
  },
  {
    slug: "melbourne",
    city: "Melbourne",
    country: "Australia",
    region: "Australia & New Zealand",
    summary: "Australian and New Zealand delivery, in the region's own working hours.",
    detail: [
      "Melbourne serves clients across Australia and New Zealand, where being in the time zone matters more than in most regions because the alternative is a one-reply-per-day cadence.",
      "The work here spans the full range - custom software, growth programmes and ventures built with local founders and operators.",
    ],
  },
  {
    slug: "istanbul",
    city: "Istanbul",
    country: "Türkiye",
    region: "Türkiye",
    summary: "Engineering and growth delivery for Türkiye and cross-border expansion.",
    detail: [
      "Istanbul covers the Turkish market and is a frequent starting point for businesses expanding between Europe, Türkiye and the Gulf.",
      "It is also a delivery base: a significant share of engineering and production work across every region is run from here to the same standard as anywhere else in the network.",
    ],
  },
  {
    slug: "shanghai",
    city: "Shanghai",
    country: "China",
    region: "China & East Asia",
    summary: "China and East Asia delivery, sourcing and market entry.",
    detail: [
      "Shanghai covers China and the wider East Asian market, where entry is decided by things that never appear in a campaign plan: the platform a category actually sells on, the local partner structure, and what can be operated compliantly from outside the country.",
      "It is also the office closest to manufacturing and supply-chain work, which is why product businesses expanding in either direction - into China or out of it - are run from here alongside the engineering and growth side.",
    ],
  },
  {
    slug: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    summary: "Middle East engagements and Gulf market entry.",
    detail: [
      "Dubai covers UAE and wider Gulf work, where market entry is as much a structural question - entity, partner, licensing - as a marketing one.",
      "We handle the technology and growth side of that entry and stay involved after launch, rather than handing over a brand guide and leaving.",
    ],
  },
];
