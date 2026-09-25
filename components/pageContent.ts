import type { PageContentKey } from "@/lib/site-pages";

export type PageContentData = Record<string, unknown>;

const PROCESS_STEPS = [
  { number: "01", title: "Discover", copy: "Business, market and commercial goal before any proposal." },
  { number: "02", title: "Design & build", copy: "Strategy, product and brand built as one system." },
  { number: "03", title: "Launch", copy: "Ship, measure, correct - with reporting you can act on." },
  { number: "04", title: "Grow & scale", copy: "Acquisition, automation and entry into new markets." },
];

const VENTURE_STEPS = [
  { number: "01", title: "Submit your idea", copy: "The problem, the market, where you are today." },
  { number: "02", title: "Assessment", copy: "Opportunity, competition and what building it takes." },
  { number: "03", title: "Plan & terms", copy: "Scope, contribution, equity or revenue share, in writing." },
  { number: "04", title: "Launch", copy: "Product, brand and acquisition go live together." },
  { number: "05", title: "Grow together", copy: "We keep building, measuring and expanding." },
];

const REGIONS = ["UK", "Europe", "USA", "Australia", "Türkiye", "Middle East", "China"].map((label) => ({ label }));

const CTA = {
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&h=700&q=80",
  eyebrow: "Build · Grow · Scale",
  title: "Let’s talk about what you are building",
  lead: "Tell us where the business is today. We will tell you what it takes.",
  buttonLabel: "Start a Project",
};

const MORE_CAPABILITIES = [
  { title: "Technology & AI", description: "Software, applications, SaaS platforms and cloud.", href: "/technology-ai" },
  { title: "UMIN AI", description: "Agents, automation and document intelligence.", href: "/umin-ai" },
  { title: "Ventures", description: "Co-building new companies with founders.", href: "/ventures" },
  { title: "Global Strategy", description: "Market entry across seven regions.", href: "/global-strategy" },
];

export const PAGE_CONTENT_DEFAULTS: Record<PageContentKey, PageContentData> = {
  home: {
    hero: {
      image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&h=1080&q=80",
      eyebrow: "New York · Technology, Growth & Ventures",
      title: "From idea to global business",
      lead: "We don’t just build software. We build the technology, brand and growth engine a company needs to scale — in one team.",
      primaryLabel: "Start a Project",
      secondaryLabel: "Grow With UMIN",
    },
    journey: {
      items: ["Idea", "Strategy", "Build", "Launch", "Grow", "Scale"].map((label) => ({ label })),
      tagline: "One partner across the journey.",
    },
    collage: {
      items: [
        { image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&h=750&q=80", alt: "Engineers building software at UMIN Global", title: "Technology & AI", caption: "Software, applications and AI agents that carry real workload." },
        { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&h=750&q=80", alt: "Growth and marketing performance review", title: "Growth & Marketing", caption: "Brand, campaigns and lead generation measured on pipeline." },
      ],
    },
    intro: {
      eyebrow: "Who we are",
      title: "Higher thinking. Greater possibilities.",
      body: "A New York technology and growth company for founders and established businesses. Product, brand, marketing and expansion decisions are made once, by one senior team.",
      facts: [
        { label: "Founded in", value: "New York" },
        { label: "Working across", value: "6 regions" },
      ],
      buttonLabel: "About UMIN",
    },
    capabilities: {
      eyebrow: "What we do",
      title: "Five capabilities. One global partner.",
      items: [
        { image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&h=500&q=80", title: "Technology & AI", description: "Software, web and mobile apps, SaaS platforms and automation.", href: "/technology-ai" },
        { image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=500&q=80", title: "Growth & Marketing", description: "Brand, content, advertising, SEO and lead generation.", href: "/growth-marketing" },
        { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=500&q=80", title: "UMIN AI", description: "Agents, automation and document intelligence with a business case.", href: "/umin-ai" },
        { image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&h=500&q=80", title: "Ventures", description: "We co-build new companies with founders and operators.", href: "/ventures" },
        { image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=500&q=80", title: "Global Strategy", description: "Market entry and expansion across six regions.", href: "/global-strategy" },
      ],
    },
    regions: { items: REGIONS },
    numbers: {
      items: [
        { value: "5", label: "Capabilities", note: "Technology & AI, Growth, UMIN AI, Ventures, Global Strategy" },
        { value: "6", label: "Regions", note: "UK, Europe, USA, Australia, Türkiye, Middle East" },
        { value: "1", label: "Partner", note: "One team from first meeting to scale" },
      ],
    },
    process: { eyebrow: "How we work", title: "Build, grow, scale", lead: "Four stages, one team. Each stage ends with something you can use, not a document.", items: PROCESS_STEPS },
    cta: CTA,
  },
  about: {
    hero: { title: "About UMIN", breadcrumbLabel: "About", kicker: "New York based. Working across seven regions." },
    intro: {
      eyebrow: "Who we are",
      title: "One platform for technology, growth and ventures",
      body: "UMIN Global is a New York technology and growth company. We work with founders and established businesses that need to move faster than an agency or a consultancy allows.",
      items: [
        { title: "One team", copy: "Engineering, brand, marketing and expansion in the same room." },
        { title: "One decision", copy: "Nothing is scoped twice or rebuilt by a second supplier." },
        { title: "One accountability", copy: "Commercial outcomes, not a list of deliverables." },
      ],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=900&q=80",
      imageAlt: "The UMIN Global team working together",
    },
    stats: { items: [{ value: "5", label: "Capabilities" }, { value: "6", label: "Regions" }, { value: "5", label: "Offices" }, { value: "1", label: "Partner" }] },
    regions: { eyebrow: "Where we work", title: "Seven regions, one operating standard", lead: "Offices in New York, London, Melbourne, Istanbul, Dubai and Shanghai. Same team, same reporting, local execution.", items: REGIONS },
    mission: {
      items: [
        { image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&h=700&q=80", alt: "A UMIN Global strategy session", title: "Why UMIN", copy: "A senior team from the first meeting to launch.", detail: "Technology, brand and acquisition are decided together, so nothing gets rebuilt.", linkLabel: "" },
        { image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&h=700&q=80", alt: "International expansion planning at UMIN Global", title: "Global Strategy", copy: "Expansion is a business decision before it is a campaign.", detail: "Entity, pricing, partnerships and the operating model come first; the build follows.", linkLabel: "" },
        { image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&h=700&q=80", alt: "Founders building with UMIN Global", title: "Build with UMIN", copy: "Strong ideas can become companies we build with you.", detail: "We contribute product, brand and growth capability under written terms.", linkLabel: "Build With UMIN" },
      ],
    },
    team: { eyebrow: "Who you work with", title: "Who you work with", lead: "The founder owns the commercial side of every engagement; the CTO owns what gets built. There is no third layer." },
    cta: CTA,
  },
  "what-we-do": {
    hero: { title: "What we do", breadcrumbLabel: "What we do", kicker: "Five capabilities, delivered by one team." },
    capabilities: {
      eyebrow: "Our capabilities", title: "Five capabilities. One global partner.", lead: "We build the technology, then the brand and acquisition engine around it.",
      items: [
        { image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&h=500&q=80", title: "Technology & AI", description: "Custom software, web and mobile apps, SaaS, integrations and cloud.", href: "/technology-ai" },
        { image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=500&q=80", title: "Growth & Marketing", description: "Brand, site, campaigns, SEO and CRM run as one system.", href: "/growth-marketing" },
        { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=500&q=80", title: "UMIN AI", description: "Agents, automation and document intelligence with a business case.", href: "/umin-ai" },
        { image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&h=500&q=80", title: "Ventures", description: "We co-build companies and contribute product, brand and growth.", href: "/ventures" },
        { image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=500&q=80", title: "Global Strategy", description: "Market entry across the UK, Europe, USA, Australia, Türkiye and the Gulf.", href: "/global-strategy" },
      ],
    },
    technology: { eyebrow: "Technology & AI", title: "Technology that solves a business problem", lead: "Every engagement starts from the workflow and the cost attached to it, not from a stack preference.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&h=750&q=80", imageAlt: "A UMIN Global engineering team planning technology work" },
    growth: { eyebrow: "Growth & Marketing", title: "Presence, acquisition and retention", lead: "Run as one system on top of technology we can change when the numbers say so.", image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1000&h=750&q=80", imageAlt: "A UMIN Global growth and marketing review" },
    process: { eyebrow: "How we work", title: "Four stages, one team", items: PROCESS_STEPS },
    cta: CTA,
  },
  "technology-ai": {
    hero: { title: "Technology & AI", breadcrumbLabel: "Technology & AI", kicker: "Software that solves a business problem, not a stack preference." },
    intro: { eyebrow: "Technology & AI", title: "Built around the workflow, then the cost", bodyOne: "Every engagement starts with the process the business actually runs and what it costs today — hours, error rate, headcount attached to the task. The architecture decision comes after that, never before it.", bodyTwo: "The same team then builds the brand and acquisition engine around the product, so the software ships into a market rather than into a repository.", buttonLabel: "Start a Project", image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&h=900&q=80", imageAlt: "UMIN Global engineers building custom software" },
    services: { eyebrow: "Technology & AI services", title: "Fifteen services, each with its own page", lead: "Pick the one you came for - every entry explains what it is, when it is worth doing and how we run it." },
    process: { eyebrow: "How we work", title: "Four stages, one team", items: PROCESS_STEPS },
    faq: { eyebrow: "Technology & AI questions", title: "What clients ask before a build", items: [
      { question: "How long does a first version take?", answer: "Most first releases land in six to twelve weeks. The variable is not engineering speed but how quickly decisions about scope and process get made, which is why we agree what version one must do before starting." },
      { question: "Do we own the code?", answer: "Yes. On a project engagement the deliverables, repositories and infrastructure belong to your business on completion. Ongoing maintenance is a separate, optional arrangement." },
      { question: "Build custom or buy off the shelf?", answer: "Buy when the process is generic and the tool does not force you to work differently. Build when the process is what makes you competitive. We will tell you which case you are in before quoting a build." },
      { question: "Can you work with our existing stack and team?", answer: "Yes. Most engagements start inside an existing system rather than on a clean slate, including taking over a codebase written by someone else." },
    ] },
    cta: CTA,
  },
  "growth-marketing": {
    hero: { title: "Growth & Marketing", breadcrumbLabel: "Growth", kicker: "Presence, acquisition and retention as one system." },
    intro: { eyebrow: "Growth & Marketing", title: "Build your presence. Grow your business.", body: "A strong digital presence means very little if nobody sees it. Two ways to work with us: an ongoing Growth Partnership, or a Complete Package you own outright.", primaryLabel: "Compare the two models", secondaryLabel: "Start a Project", items: [
      { title: "Presence", copy: "Brand, site and content as one system." },
      { title: "Acquisition", copy: "Paid, SEO and lead gen on cost per qualified lead." },
      { title: "Retention", copy: "CRM, email and automation after the first sale." },
    ] },
    services: { eyebrow: "Included", title: "What Growth & Marketing covers", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&h=750&q=80", imageAlt: "A UMIN Global growth and marketing planning session" },
    gallery: { title: "Marketing on top of technology we can change", bodyOne: "Campaigns that sit on a product nobody can edit stall within a quarter. We own both, so a pricing test, a new landing route or a CRM field is a day of work, not a new supplier.", bodyTwo: "Reporting shows cost per qualified lead, conversion and pipeline — the three numbers a board actually asks about.", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&h=1000&q=80", imageAlt: "A UMIN Global growth review session" },
    models: {
      eyebrow: "Two ways to work with UMIN", title: "Partner with us, or own the build", lead: "One shares the upside and the risk. The other hands you an asset outright.",
      partnershipEyebrow: "Option A", partnershipTitle: "UMIN Growth Partnership", partnershipLead: "We build. We grow. We share.", partnershipBody: "For selected businesses we become the ongoing technology and growth partner, and manage the whole digital ecosystem around the company.", partnershipButton: "Apply for a Partnership",
      partnershipIncludes: ["Brand", "Website", "Technology", "Social", "Content", "Advertising", "Lead gen", "Automation", "Growth strategy"].map((label) => ({ label })),
      partnershipTerms: [{ term: "UMIN share", value: "20% of an agreed revenue basis" }, { term: "Agreed up front", value: "Revenue definition, attribution, ad spend, costs, reporting, duration" }, { term: "Availability", value: "Selective, after assessment of the business" }],
      packageEyebrow: "Option B", packageTitle: "UMIN Complete Package", packageLead: "Build it. Own it.", packageBody: "Prefer a straightforward project? We build the complete digital infrastructure for an agreed project price.", packageButton: "Request a Proposal",
      packageIncludes: ["Branding", "Website", "Social setup", "Marketing strategy", "Ad setup", "SEO", "Content", "CRM", "AI & automation", "Analytics"].map((label) => ({ label })),
      packageTerms: [{ term: "Price", value: "One agreed project price" }, { term: "Revenue share", value: "None" }, { term: "Ownership", value: "Final deliverables belong to your business on completion" }, { term: "Optional", value: "Ongoing marketing, technology and management, quoted separately" }],
    },
    more: { eyebrow: "More from UMIN", title: "The rest of what we do", items: MORE_CAPABILITIES },
    faq: { eyebrow: "Growth & Marketing questions", title: "What clients ask before a growth engagement", items: [
      { question: "How soon do results show?", answer: "Paid channels give a readable signal within two to four weeks. SEO and content compound over three to six months. We report on cost per qualified lead throughout rather than on impressions." },
      { question: "What is the difference between the two models?", answer: "A Growth Partnership is ongoing and shares the upside through an agreed revenue basis. A Complete Package is a one-off project price and the deliverables are yours outright on completion." },
      { question: "Do you replace our marketing team?", answer: "No. We take the capabilities you do not have in-house and work alongside the people you do, with the reporting shared rather than held by us." },
      { question: "Can you work with our current CRM and ads accounts?", answer: "Yes. We work in your accounts, so the history, the audiences and the data stay with your business if the engagement ends." },
    ] },
    cta: CTA,
  },
  "umin-ai": {
    hero: { title: "UMIN AI", breadcrumbLabel: "UMIN AI", kicker: "Applied where it reduces cost or wins revenue." },
    intro: { eyebrow: "UMIN AI", title: "Intelligence that works for business", body: "Artificial intelligence should create measurable value. We start with the process, the cost and the data that already exist — then decide what is worth automating.", buttonLabel: "Start a Project", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=900&q=80", imageAlt: "Engineers reviewing an AI workflow at UMIN Global" },
    questions: { eyebrow: "Before we build", title: "Three questions, in this order", items: [
      { question: "What does the work cost today? ", answer: "Hours, error rate, response time, headcount attached to the task." },
      { question: "What part is genuinely repeatable? ", answer: "The steps with stable inputs and a checkable output." },
      { question: "What happens when it is wrong? ", answer: "The review path, the audit trail and who signs off." },
    ] },
    capabilities: { eyebrow: "AI capabilities", title: "Where we apply AI", statement: "We don’t add AI because it’s fashionable. We implement it where it makes commercial sense." },
    more: { eyebrow: "More from UMIN", title: "The rest of what we do", items: MORE_CAPABILITIES },
    faq: { eyebrow: "AI questions", title: "What clients ask before an AI project", items: [
      { question: "Where does AI actually pay back?", answer: "On tasks that repeat many times a day with stable inputs and a checkable output. If the work needs judgement on every instance, automation usually costs more than it saves." },
      { question: "What happens when the AI is wrong?", answer: "Every implementation we ship has a review path, a confidence threshold and a logged audit trail, agreed before any of it goes live." },
      { question: "Is our data used to train public models?", answer: "No. Data boundaries and credentials are defined explicitly per engagement, and retrieval runs against your own material rather than adding it to a shared model." },
      { question: "Can you start small?", answer: "Yes, and we prefer it: one process, measured, before the surface widens. That keeps the first invoice tied to a result you can check." },
    ] },
    cta: CTA,
  },
  ventures: {
    hero: { title: "Ventures", breadcrumbLabel: "Ventures", kicker: "We co-build companies with founders and operators." },
    intro: { eyebrow: "Ventures", title: "Capability instead of a cheque", bodyOne: "Most early companies do not fail for lack of an idea. They fail because the product, the brand and the acquisition engine are built by three different parties at three different speeds.", bodyTwo: "We take on the whole technical and commercial build with the founder, for equity or an agreed revenue share, and the contribution on both sides is written down before any work starts.", primaryLabel: "Submit Your Idea", secondaryLabel: "Build With UMIN", items: [
      { term: "Product", value: "Architecture, build and the first shipped version - not a prototype." },
      { term: "Brand", value: "Positioning, identity and the site the first customers will judge." },
      { term: "Growth", value: "Acquisition, lifecycle and the reporting that shows what is working." },
      { term: "AI", value: "Automation where it removes real operating cost from day one." },
    ] },
    process: { eyebrow: "How it works", title: "From submitted idea to a company that grows", lead: "Equity, revenue share and contribution are agreed in writing before any work begins.", items: VENTURE_STEPS },
    cta: CTA,
  },
  "global-strategy": {
    hero: { title: "Global Strategy", breadcrumbLabel: "Global Strategy", kicker: "Expansion is a business decision before it is a campaign." },
    intro: { eyebrow: "Seven regions", title: "Entering a market, not translating a website", bodyOne: "Most failed expansions were never strategy failures. The offer was localised at the surface — language, currency, a new landing page — while the pricing, the buying process and the acquisition channels stayed the ones that worked at home.", bodyTwo: "We work the demand, the entry route and the proof points first, then run the technology and growth execution from the office that sits in that region.", primaryLabel: "Start a Project", secondaryLabel: "Our offices", items: [
      { term: "Demand", value: "Whether the demand you have at home exists in the target market at all." },
      { term: "Entry", value: "Which route in: direct, partner, acquisition or local entity." },
      { term: "Proof", value: "What has to be true in the first ninety days to justify the second phase." },
    ] },
    regions: { items: REGIONS },
    offices: { eyebrow: "Where we execute", title: "Six offices, one operating standard", lead: "Each office has its own page: what it covers and what is run from there." },
    cta: CTA,
  },
  services: {
    hero: { title: "All Services", breadcrumbLabel: "Services", kicker: "Every service, with its own page and a straight answer on what it does." },
    categories: { lead: "Each one is a page, not a bullet - what it is, when it is worth doing, and how we run it." },
    cta: CTA,
  },
  contact: {
    hero: { title: "Contact", breadcrumbLabel: "Contact", kicker: "We reply from New York within one business day." },
    contact: { routes: [{ label: "Email", value: "info@uminglobal.com" }, { label: "New business", value: "Send a project brief" }], headquartersLabel: "Headquarters", headquarters: "New York", offices: "Offices: New York · London · Melbourne · Istanbul · Dubai · Shanghai" },
    form: {
      eyebrow: "Get in touch", title: "How can we help? ", lead: "Start a project, apply for a Growth Partnership, request a package proposal or submit a venture idea.",
      nameLabel: "Name", namePlaceholder: "Your name", emailLabel: "Email", emailPlaceholder: "you@company.com", companyLabel: "Company", companyPlaceholder: "Company name", countryLabel: "Country", countryPlaceholder: "Where you operate", needLabel: "What do you need?", needPlaceholder: "Select one", messageLabel: "Message", messagePlaceholder: "Where the business is today, and where it needs to be", buttonLabel: "Start a Project", sendingLabel: "Sending…", successMessage: "Sent. We reply from New York within one business day.",
      needs: ["Technology & AI", "Growth & Marketing", "UMIN AI", "Growth Partnership", "Complete Package", "Venture idea"].map((label) => ({ label })),
    },
    next: { eyebrow: "What happens next", title: "Three steps, one business day apart", items: [
      { number: "01", title: "Reply within one business day", copy: "From New York, with the questions we need answered to quote." },
      { number: "02", title: "A 30-minute call", copy: "Goal, constraints, budget range and timing - no deck." },
      { number: "03", title: "Written scope and price", copy: "Model, milestones and what each side owns, in writing." },
    ] },
  },
  "build-with-umin": {
    hero: { title: "Build with UMIN", breadcrumbLabel: "Build with UMIN", kicker: "Ventures we co-build, and the team building them." },
    intro: { eyebrow: "Ventures", title: "Your idea could become the next business", body: "You don’t need to be technical or to have a team in place. If the idea is strong, we provide the product, brand and growth capability and build it with you.", buttonLabel: "Submit Your Idea", items: [
      { term: "A real problem", value: "Something a business already pays to work around." },
      { term: "A market that can pay", value: "Named buyers, not a category." },
      { term: "A committed founder", value: "Someone in the work every week." },
    ] },
    process: { eyebrow: "How it works", title: "From submitted idea to a company that grows", lead: "Equity, revenue share and contribution are agreed in writing before any work begins.", items: VENTURE_STEPS },
    jobs: { eyebrow: "Open roles", title: "Join the team building them", items: [
      { title: "Senior Full-Stack Engineer", location: "New York / Remote", experience: "5+ years", focus: "TypeScript, Next.js, Node, cloud", copy: "Own client products and UMIN ventures end to end, including the AI parts that earn their place. You will be asked about cost, risk and what to ship first, not only about tickets.", buttonLabel: "Apply" },
      { title: "Growth Marketing Lead", location: "New York / Remote", experience: "4+ years", focus: "Paid, SEO, lifecycle, analytics", copy: "Own acquisition across clients and ventures, reporting on cost per qualified lead and pipeline rather than impressions.", buttonLabel: "Apply" },
    ] },
    culture: { items: [
      { image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=800&q=80", alt: "Founders and the UMIN team planning a venture", title: "How we work with founders", body: "A venture is not an agency project. Product decisions, pricing, positioning and the first customers are worked through together, weekly.\n\nWhat each side contributes - engineering, design, brand, marketing, AI, capital of time - is written down before the build starts." },
      { image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=800&q=80", alt: "Working at UMIN Global in New York", title: "Working at UMIN", body: "Small senior teams and short decision chains: the person who designs the solution ships it.\n\nWe work across seven regions, so written clarity matters more than hours at a desk." },
    ] },
    cta: CTA,
  },
};
