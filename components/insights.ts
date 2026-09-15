// The Insights catalogue. Every article on the site is a record here: the index, the sidebar, the
// sitemap, the JSON-LD and the article page itself all read from this one array.
//
// This replaced four hardcoded cards that all linked to the same article - four different titles
// and dates pointing at one URL. That is a dead end for a reader and, for a crawler, four
// competing internal links to a single page with mismatched anchor text. One record per article,
// one page per record.

export type Block =
  /** Opening paragraph, set larger than the body. One per article. */
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  /** Pulled-out sentence: the one line worth remembering from the section above it. */
  | { kind: "callout"; text: string };

export interface InsightPost {
  slug: string;
  /** Full headline, used on the article page and in the cards. */
  title: string;
  /** Shorter form for <title>, which has ~60 characters before the SERP truncates it. */
  metaTitle: string;
  description: string;
  excerpt: string;
  /** ISO date, for <time> and for datePublished. */
  date: string;
  dateDisplay: string;
  updated?: string;
  readingMinutes: number;
  topic: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  /** Social-card copy - the headline is usually too long to set at 76px. */
  ogTitle: string;
  ogSubtitle: string;
  body: Block[];
  /** Pages the article actually refers to. Rendered as a "Related" block. */
  related: { label: string; href: string }[];
}

export const INSIGHTS: InsightPost[] = [
  {
    slug: "from-idea-to-global-business",
    title: "From idea to global business: what actually slows companies down",
    metaTitle: "What actually slows companies down",
    description:
      "The obstacles between an idea and a scalable company are rarely technical. Here is what actually slows businesses down, and how UMIN removes it.",
    excerpt:
      "Rarely the technology. Usually unclear ownership and a marketing plan written after launch.",
    date: "2026-02-12",
    dateDisplay: "12 Feb 2026",
    readingMinutes: 5,
    topic: "Global Strategy",
    keywords: ["scaling a business", "product and marketing alignment", "international expansion"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&h=675&q=80",
    imageAlt: "A product and growth team working through a roadmap",
    ogTitle: "From idea to global business",
    ogSubtitle: "What actually slows companies down.",
    body: [
      {
        kind: "lead",
        text: "Most businesses that stall between an idea and a scalable company do not stall for technical reasons. The build is rarely the hard part.",
      },
      {
        kind: "p",
        text: "What slows them down is the gap between the people deciding what to build, the people building it and the people responsible for selling it. A product is scoped in isolation, an agency is briefed months later to market it, and the two never share a definition of the customer. Every decision then gets made twice.",
      },
      { kind: "h2", text: "Sequencing is the second failure" },
      {
        kind: "p",
        text: "Brand, site, product and acquisition get treated as phases instead of one system. By the time advertising starts, the pricing page contradicts the sales conversation, the CRM has no owner, and nobody can say what a qualified lead costs.",
      },
      {
        kind: "callout",
        text: "If no one can state the cost of a qualified lead, the business is not ready to spend on acquisition - it is ready to instrument it.",
      },
      { kind: "h2", text: "Expansion exposes both faster" },
      {
        kind: "p",
        text: "Entity, pricing, payments, support hours and positioning all have to be decided before the first dollar of advertising is spent in a new market. Otherwise the campaign buys attention the business cannot service.",
      },
      {
        kind: "p",
        text: "None of this requires a larger team. It requires one partner accountable across the journey, and the discipline to write down who owns what before the work starts.",
      },
    ],
    related: [
      { label: "Global Strategy", href: "/global-strategy" },
      { label: "What We Do", href: "/what-we-do" },
    ],
  },
  {
    slug: "where-ai-creates-commercial-value",
    title: "Where AI creates real commercial value",
    metaTitle: "Where AI creates real commercial value",
    description:
      "A test for AI projects that pay for themselves: repetitive work, an existing cost, structured data and a measurable output. Everything else is a demo.",
    excerpt:
      "Start with repetitive work that already has a cost attached. No saving named, no project.",
    date: "2026-01-29",
    dateDisplay: "29 Jan 2026",
    readingMinutes: 6,
    topic: "Technology & AI",
    keywords: ["AI for business", "AI agents", "business process automation", "AI ROI"],
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=675&q=80",
    imageAlt: "Engineers reviewing an AI workflow",
    ogTitle: "Where AI creates value",
    ogSubtitle: "Repetitive work with a cost already attached.",
    body: [
      {
        kind: "lead",
        text: "Most AI projects that fail commercially did not fail technically. They were aimed at work that was never expensive enough to automate.",
      },
      {
        kind: "p",
        text: "The question that separates a useful AI project from an impressive one is not what the model can do. It is which recurring task currently consumes paid hours, happens often enough to measure, and produces an output someone can check. If a task fails that description, automating it saves nothing that shows up in a management account.",
      },
      { kind: "h2", text: "Four conditions worth checking first" },
      {
        kind: "list",
        items: [
          "The work repeats. Something done fifty times a week can be measured before and after; something done twice a year cannot.",
          "There is a cost attached today. Salaried hours, an outsourced team, a per-ticket fee - a number that already exists in a budget line.",
          "The inputs exist in a system. Email, a CRM, a document store, a database. If the information lives only in someone's head, the first project is capturing it, not automating it.",
          "The output is checkable. A draft reply, an extracted field, a classification - something a person can accept or reject, which is also what produces the training signal for the next iteration.",
        ],
      },
      {
        kind: "callout",
        text: "If nobody can name the cost the automation removes, there is no project - only a demo.",
      },
      { kind: "h2", text: "The work that usually qualifies" },
      {
        kind: "p",
        text: "In the businesses we build for, four categories come up repeatedly: first-line support triage, where volume is high and answers are bounded; document and invoice extraction, where the input is structured enough to validate; sales follow-up and qualification, where speed of response drives conversion more than wording does; and internal reporting, where the same numbers are assembled by hand every week.",
      },
      {
        kind: "p",
        text: "None of those are glamorous. All of them have a cost line that can be shown to shrink, which is the only argument that survives a second budget cycle.",
      },
      { kind: "h2", text: "Build the measurement before the model" },
      {
        kind: "p",
        text: "Before anything is automated, the current state needs a number: handling time, cost per ticket, error rate, hours spent. Without it, the project cannot be evaluated, only defended. With it, the decision to extend or stop is arithmetic.",
      },
      {
        kind: "p",
        text: "The same discipline applies to the technology choice. An AI agent that needs a human to approve its output is not a weaker system than an autonomous one; in most commercial processes it is the correct design, because the approval step is where liability sits.",
      },
      {
        kind: "p",
        text: "Where this leads is unglamorous and profitable: a handful of narrow, instrumented automations inside processes that already cost money, each one paying for itself before the next is started.",
      },
    ],
    related: [
      { label: "UMIN AI", href: "/umin-ai" },
      { label: "AI Agents", href: "/services/ai-agents" },
      { label: "Business Automation", href: "/services/business-automation" },
    ],
  },
  {
    slug: "growth-partnership-or-complete-package",
    title: "Growth Partnership or Complete Package: choosing a model",
    metaTitle: "Growth Partnership or Complete Package",
    description:
      "Two ways to work with UMIN Global: shared risk and shared upside, or a fixed scope you own outright. Runway, control and timing decide which one fits.",
    excerpt:
      "One shares the upside and the risk; the other hands you an asset. Runway decides.",
    date: "2026-01-15",
    dateDisplay: "15 Jan 2026",
    readingMinutes: 5,
    topic: "Growth",
    keywords: ["growth partnership", "agency pricing models", "revenue share marketing"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675&q=80",
    imageAlt: "A growth reporting session in progress",
    ogTitle: "Partnership or package",
    ogSubtitle: "Runway and control decide the model.",
    body: [
      {
        kind: "lead",
        text: "The two engagement models are not tiers. One trades cash for shared risk; the other trades risk for ownership. The right answer follows from the balance sheet, not from ambition.",
      },
      { kind: "h2", text: "Complete Package: fixed scope, you own it" },
      {
        kind: "p",
        text: "A written scope, a price, milestones, and an asset that belongs to the business at the end - code, brand, accounts, data. It is the right model when the work is definable, when the business is funded well enough to pay for delivery outright, and when control matters more than conserving cash.",
      },
      {
        kind: "p",
        text: "Its constraint is honest: a fixed scope is only as good as the definition behind it. Anything discovered mid-build becomes a change, and changes cost time.",
      },
      { kind: "h2", text: "Growth Partnership: shared risk, shared upside" },
      {
        kind: "p",
        text: "A reduced fee against an agreed share of the outcome. It suits businesses with a proven offer and limited runway, where the gap is execution capacity rather than product-market fit, and where both sides can agree on how the outcome is measured.",
      },
      {
        kind: "p",
        text: "It only works with instrumentation. A revenue share on numbers nobody trusts turns into a dispute in the second quarter, so the tracking, attribution and reporting definitions are agreed before the first campaign runs.",
      },
      {
        kind: "callout",
        text: "A partnership needs an agreed number before it needs an agreed percentage.",
      },
      { kind: "h2", text: "How to choose in one pass" },
      {
        kind: "list",
        items: [
          "Less than six months of runway and a validated offer: partnership, because cash preserved is the binding constraint.",
          "Funded, with a board expecting an owned asset: package, because the deliverable has to sit on the balance sheet.",
          "Unclear demand: neither yet - a paid discovery phase first, so the scope is written against evidence.",
          "Regulated or data-sensitive sector: package, because ownership and audit trail are usually non-negotiable.",
        ],
      },
      {
        kind: "p",
        text: "Both models produce the same artefacts - written scope, named owners, reporting a board can read. What differs is who carries the risk in the first two quarters.",
      },
    ],
    related: [
      { label: "Growth & Marketing", href: "/growth-marketing" },
      { label: "Build With UMIN", href: "/build-with-umin" },
      { label: "Ventures", href: "/ventures" },
    ],
  },
  {
    slug: "entering-the-us-market-from-europe",
    title: "Entering the US market from Europe: a practical checklist",
    metaTitle: "Entering the US market from Europe",
    description:
      "Entity, tax, payments, pricing, support hours and positioning - the decisions that have to be made before the first advertising dollar is spent in the US.",
    excerpt:
      "Entity, pricing, payments, support hours and positioning - before the first ad dollar.",
    date: "2026-01-06",
    dateDisplay: "6 Jan 2026",
    readingMinutes: 7,
    topic: "Global Strategy",
    keywords: ["US market entry", "international expansion checklist", "expanding to the USA"],
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&h=675&q=80",
    imageAlt: "The New York skyline at dusk",
    ogTitle: "Entering the US market",
    ogSubtitle: "A practical checklist, in order.",
    body: [
      {
        kind: "lead",
        text: "US entry fails on operations far more often than on demand. The product usually works; the invoice, the support hour and the positioning are what break.",
      },
      { kind: "h2", text: "Decide the entity question before the marketing question" },
      {
        kind: "p",
        text: "Selling into the US from a European entity is viable for some models and a barrier in others: enterprise procurement, state-level tax registration and payment processing all behave differently once there is a domestic entity. The decision changes pricing, cashflow and hiring, so it belongs at the start - not after the first campaign has generated leads that cannot be invoiced cleanly.",
      },
      { kind: "h2", text: "Price in dollars, and price for the market" },
      {
        kind: "p",
        text: "A converted European price list reads as arbitrary in the US, and it usually reads as cheap. Pricing has to be set against domestic competitors and the value delivered, in round dollar figures, with the tax treatment stated. Currency conversion is an accounting detail; positioning is not.",
      },
      { kind: "h2", text: "The operational checklist" },
      {
        kind: "list",
        items: [
          "Entity and tax: whether a US entity is required, and where sales tax or nexus obligations arise.",
          "Payments: a processor that settles in USD, with the card and ACH methods buyers expect.",
          "Contracting: terms, liability and data-processing language a US legal team will accept without a three-week negotiation.",
          "Support hours: coverage across US time zones, stated publicly. A European-only support window caps conversion on its own.",
          "Domain and content: one canonical site with US-specific pages where the offer genuinely differs - not a duplicated site competing with itself.",
          "Proof: references, case evidence or named clients that mean something to a US buyer.",
        ],
      },
      {
        kind: "callout",
        text: "Advertising into a market the business cannot invoice, support or contract in buys expensive proof that it was not ready.",
      },
      { kind: "h2", text: "Sequence the launch" },
      {
        kind: "p",
        text: "Operations first, then positioning, then a narrow paid test in one segment with a measurable cost per qualified lead, then expansion of the segment that works. Each stage produces the evidence that justifies the next, which is also what makes the spend defensible to a board.",
      },
      {
        kind: "p",
        text: "Done in that order, US entry is a sequence of decisions with known costs. Done in reverse, it is a marketing budget spent on discovering the decisions.",
      },
    ],
    related: [
      { label: "Global Strategy", href: "/global-strategy" },
      { label: "New York office", href: "/offices/new-york" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const INSIGHT_SLUGS = INSIGHTS.map((post) => post.slug);

export function findInsight(slug: string): InsightPost | undefined {
  return INSIGHTS.find((post) => post.slug === slug);
}

/** Newest first, excluding the article being read. */
export function otherInsights(slug?: string, limit = 3): InsightPost[] {
  return INSIGHTS.filter((post) => post.slug !== slug).slice(0, limit);
}
