// Every individual service UMIN sells, each with its own page at /services/<slug>. The three
// capability pages (Technology & AI, Growth & Marketing, UMIN AI) read their lists from here, so
// a service is written down once and the link, the copy and the sitemap all follow.
export type ServiceCategory = "technology" | "growth" | "ai";

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  /** One line, used on the capability lists and as the page's meta description base. */
  summary: string;
  /** Page body. Two paragraphs: what it is, and how UMIN runs it. */
  detail: [string, string];
}

export const CATEGORIES: Record<ServiceCategory, { label: string; href: string }> = {
  technology: { label: "Technology & AI", href: "/technology-ai" },
  growth: { label: "Growth & Marketing", href: "/growth-marketing" },
  ai: { label: "UMIN AI", href: "/umin-ai" },
};

export const SERVICES: Service[] = [
  {
    slug: "custom-software-development",
    name: "Custom Software Development",
    category: "technology",
    summary: "Software built around the workflow your business actually runs, not around a template.",
    detail: [
      "Custom development is the right answer when an off-the-shelf tool forces the business to work in a way it does not want to, or when the process being automated is the thing that makes the company competitive.",
      "We start from the workflow and the cost attached to it, agree what the first shipped version has to do, and build it as one system with the brand and growth work rather than as an isolated IT project.",
    ],
  },
  {
    slug: "web-applications",
    name: "Web Applications",
    category: "technology",
    summary: "Browser-based products and internal tools that hold up under real use.",
    detail: [
      "A web application is the fastest route to a product people can use on any device without installing anything - client portals, booking and quoting systems, dashboards, internal operations tools.",
      "We build with TypeScript and modern React frameworks, ship the first usable version early, and keep the architecture simple enough that the second and third release do not cost more than the first.",
    ],
  },
  {
    slug: "mobile-applications",
    name: "Mobile Applications",
    category: "technology",
    summary: "iOS and Android apps built once, shipped to both stores, maintained properly.",
    detail: [
      "Mobile earns its place when the product needs the camera, notifications, offline use or a home-screen presence. When it does not, we will tell you a web app is the cheaper answer.",
      "We build cross-platform so one codebase serves both stores, handle release and review logistics, and plan the update path before the first submission rather than after the first rejection.",
    ],
  },
  {
    slug: "saas-platforms",
    name: "SaaS Platforms",
    category: "technology",
    summary: "Multi-tenant products with billing, roles and onboarding designed in from the start.",
    detail: [
      "A SaaS platform is a business model before it is a codebase: pricing tiers, trials, seats, usage limits and churn all have to exist in the data model, not be bolted on in year two.",
      "We build the tenancy, authentication, billing and admin layers properly at the start, then iterate on the product surface, which is the part that actually differentiates you.",
    ],
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions",
    category: "technology",
    summary: "Applied AI where it reduces cost or wins revenue - and nowhere else.",
    detail: [
      "Most AI projects fail on scope, not on models. The work that pays back is narrow: a repeatable task with stable inputs, a checkable output and a person who signs off when it is wrong.",
      "We assess what the work costs today, which part of it is genuinely repeatable, and what happens when the system is wrong - then implement only the parts that survive those three questions.",
    ],
  },
  {
    slug: "ai-agents",
    name: "AI Agents",
    category: "ai",
    summary: "Agents that carry real workload end to end, with an audit trail and a human sign-off.",
    detail: [
      "An agent is worth building when a task runs many times a day, follows rules that can be written down, and currently occupies someone senior enough for that to be expensive.",
      "We scope the tools the agent may call, the data it may read, the escalation path and the logging before writing any of it, so the result is something you can audit rather than a demo that impresses once.",
    ],
  },
  {
    slug: "business-automation",
    name: "Business Automation",
    category: "technology",
    summary: "Removing the manual steps between systems that already exist.",
    detail: [
      "Most companies do not need new software so much as they need the five systems they already pay for to talk to each other without a person copying fields between them.",
      "We map the process as it runs today, automate the handoffs that are safe to automate, and leave the judgement calls with the people who should be making them.",
    ],
  },
  {
    slug: "crm-erp-systems",
    name: "CRM & ERP Systems",
    category: "technology",
    summary: "Implementing, extending or replacing the systems your operation runs on.",
    detail: [
      "CRM and ERP projects go wrong when the tool is configured to match a process nobody has agreed on. The decision about how the business wants to operate has to come first.",
      "We implement and extend the major platforms, build the integrations they are missing, and migrate data with a rollback plan - or tell you when a custom system is genuinely cheaper than the licence.",
    ],
  },
  {
    slug: "e-commerce",
    name: "E-Commerce",
    category: "technology",
    summary: "Storefronts built to convert, integrated with the systems behind the sale.",
    detail: [
      "An online store is a technology project and a growth project at once: catalogue, checkout, payments and fulfilment on one side, acquisition and lifecycle on the other.",
      "We build both sides together, connect stock, invoicing and shipping to the storefront, and measure the funnel from first click to repeat order rather than to first session.",
    ],
  },
  {
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    category: "technology",
    summary: "Infrastructure sized for what you run now, ready for what happens if it works.",
    detail: [
      "Cloud spend gets out of hand when infrastructure is provisioned for an imagined scale. It gets dangerous when there is no path to that scale at all.",
      "We deploy on managed services, keep the environments reproducible, and put the monitoring, backups and cost alerts in place at launch rather than after the first incident or the first surprising invoice.",
    ],
  },
  {
    slug: "api-systems-integration",
    name: "API & Systems Integration",
    category: "technology",
    summary: "Making separate systems behave like one, reliably and observably.",
    detail: [
      "Integration is where most business-critical software quietly breaks: a rate limit, a schema change, a retry that fires twice and duplicates an order.",
      "We build integrations with explicit contracts, idempotent writes, retries and alerting, so a failure is something you find out about from a notification rather than from a customer.",
    ],
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    category: "technology",
    summary: "One set of numbers the whole business agrees on.",
    detail: [
      "Analytics only helps when everyone is reading the same definition of revenue, lead and active customer. Until then, reporting is an argument rather than a decision tool.",
      "We consolidate the sources, agree the definitions in writing, and build the reporting on top - so the dashboard answers questions instead of generating them.",
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    category: "technology",
    summary: "Interfaces designed around the decision the user is trying to make.",
    detail: [
      "Design work is cheapest before anything is built and most expensive once a workflow has shipped, so we resolve the hard screens - the ones with real data, empty states and errors - first.",
      "We design in the same system the engineers build in, which removes the gap between a polished mockup and what actually ships.",
    ],
  },
  {
    slug: "legacy-modernisation",
    name: "Legacy Modernisation",
    category: "technology",
    summary: "Replacing systems that still work but cost too much to change.",
    detail: [
      "A legacy system is not old code; it is code nobody is willing to change. The cost shows up as delayed releases and workarounds rather than as a line on a budget.",
      "We modernise incrementally - carve out one capability at a time behind a stable interface - so the business keeps running while the risky parts get replaced.",
    ],
  },
  {
    slug: "technology-consulting",
    name: "Technology Consulting",
    category: "technology",
    summary: "A senior opinion on build, buy, sequence and cost - before the spend.",
    detail: [
      "Sometimes the useful deliverable is a decision: build or buy, now or after the next funding round, one platform or two, and what the real cost of each option is.",
      "We assess the stack, the team and the commercial goal, then put a recommendation in writing with the trade-offs stated plainly - including the option where you do not hire us to build it.",
    ],
  },

  {
    slug: "website-design-development",
    name: "Website Design & Development",
    category: "growth",
    summary: "A site built to be found, to convert and to be changed without a developer.",
    detail: [
      "A marketing site has three jobs: rank for the terms your buyers search, make the offer obvious, and let the team publish without a ticket. Most sites do one of the three.",
      "We build fast, accessible, technically sound sites with the SEO groundwork in place from the first deploy, and hand over something the marketing team can actually operate.",
    ],
  },
  {
    slug: "brand-strategy",
    name: "Brand Strategy",
    category: "growth",
    summary: "Deciding what you are to whom, before designing anything.",
    detail: [
      "Brand strategy is a commercial exercise: which buyers you are for, what you are claiming, and why that claim is credible coming from you rather than from the competitor next to you.",
      "We work through positioning, audience and messaging with the people who own the numbers, and write it down in a form the rest of the marketing work can be held against.",
    ],
  },
  {
    slug: "brand-identity",
    name: "Brand Identity",
    category: "growth",
    summary: "The visual and verbal system that makes the strategy recognisable.",
    detail: [
      "Identity work is where strategy becomes something a customer can see: the mark, the type, the colour, the photography, and the tone the company writes in.",
      "We deliver a system with the rules that make it hold together across a website, an ad, a deck and an invoice - not a logo file and a hope.",
    ],
  },
  {
    slug: "social-media",
    name: "Social Media",
    category: "growth",
    summary: "Channels run as a pipeline contributor, not as a posting schedule.",
    detail: [
      "Social works when it is tied to a commercial motion - demand for a launch, credibility for a sales conversation, recruitment for a venture - and drifts when it is measured on followers.",
      "We set the objective per channel, produce to a calendar the business can sustain, and report on what it contributed to pipeline.",
    ],
  },
  {
    slug: "content-strategy",
    name: "Content Strategy",
    category: "growth",
    summary: "Publishing against the questions your buyers actually search for.",
    detail: [
      "Content compounds only when it maps to real demand: the problems buyers type into a search box before they know your category exists.",
      "We build the topic map from search data and sales conversations, prioritise by commercial intent, and keep the publishing cadence realistic enough to survive a busy quarter.",
    ],
  },
  {
    slug: "digital-advertising",
    name: "Digital Advertising",
    category: "growth",
    summary: "Paid media run on cost per qualified lead, not impressions.",
    detail: [
      "Paid channels are the fastest way to test an offer and the fastest way to waste a budget, and the difference is almost always measurement rather than creative.",
      "We set up conversion tracking that survives browser privacy changes first, then build, test and cut campaigns against pipeline contribution.",
    ],
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    category: "growth",
    summary: "Search, Performance Max and remarketing built around buying intent.",
    detail: [
      "Search advertising is the one channel where the customer states their intent. It rewards structure - tight themes, honest landing pages, negative keywords maintained weekly.",
      "We manage accounts against cost per qualified lead, keep the query reports clean, and land traffic on pages we also built, so the ad and the page make the same promise.",
    ],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    category: "growth",
    summary: "Facebook and Instagram campaigns for demand you have to create.",
    detail: [
      "Meta is a demand-creation channel: the buyer is not searching, so the creative and the audience carry the result rather than the keyword.",
      "We run structured creative testing, keep the conversion signal clean through the API rather than the pixel alone, and scale only what holds its cost per lead.",
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    category: "growth",
    summary: "Technical, content and authority work that earns durable search traffic.",
    detail: [
      "Search is the only acquisition channel that keeps delivering after you stop paying, which is also why it takes longer to show up than a paid campaign.",
      "We fix the technical foundation - crawlability, structure, speed, schema - then build topical depth against commercial keywords and measure rankings against revenue, not vanity positions.",
    ],
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    category: "growth",
    summary: "A pipeline of qualified conversations, measured end to end.",
    detail: [
      "Lead generation fails on definitions more often than on volume: marketing counts forms, sales counts conversations worth having, and nobody reconciles the two.",
      "We agree the qualification criteria first, build the channel mix around it, and report the whole path from click to closed so the cost per customer is knowable.",
    ],
  },
  {
    slug: "email-marketing",
    name: "Email Marketing",
    category: "growth",
    summary: "Lifecycle email that converts the audience you already paid for.",
    detail: [
      "Email is where the money left on the table usually sits: the list is already yours, and the sequences that recover carts, onboard trials and reactivate lapsed customers are rarely built.",
      "We set up the lifecycle flows, keep deliverability healthy, and test on revenue per recipient instead of open rate.",
    ],
  },
  {
    slug: "crm",
    name: "CRM",
    category: "growth",
    summary: "A sales system the team actually updates, reporting you can trust.",
    detail: [
      "A CRM is only as good as the discipline around it. Pipeline reporting built on fields nobody fills in produces confident, wrong forecasts.",
      "We configure the stages around how the deal really progresses, automate the data entry that can be automated, and connect it to the marketing channels so attribution survives.",
    ],
  },
  {
    slug: "marketing-automation",
    name: "Marketing Automation",
    category: "growth",
    summary: "The follow-up that happens whether anyone remembers or not.",
    detail: [
      "Automation is the difference between a lead being worked in ten minutes and being worked in three days, which is usually the difference between a conversation and a lost one.",
      "We build the routing, scoring and nurture logic into the systems you already run, and keep it simple enough to audit when a deal is lost to silence.",
    ],
  },
  {
    slug: "creative-campaigns",
    name: "Creative Campaigns",
    category: "growth",
    summary: "One idea, produced properly, running across every channel at once.",
    detail: [
      "Campaigns beat always-on activity when there is something to say: a launch, a market entry, a repositioning. They need a single idea, not a channel plan.",
      "We develop the idea, produce the assets, and run it across paid, owned and earned channels with one measurement frame so its effect is visible.",
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    category: "growth",
    summary: "Marketing measurement that survives privacy changes and scrutiny.",
    detail: [
      "Most marketing dashboards quietly stopped being accurate when consent and tracking rules changed, and the decisions made on them did not stop.",
      "We implement server-side and consent-aware tracking, reconcile channel numbers against the CRM, and document the definitions so two people reading the report reach the same conclusion.",
    ],
  },
  {
    slug: "conversion-optimisation",
    name: "Conversion Optimisation",
    category: "growth",
    summary: "Getting more out of the traffic you already have.",
    detail: [
      "Raising conversion is usually cheaper than raising traffic, and it makes every channel above it more profitable at the same spend.",
      "We find where the funnel leaks using real session and funnel data, change the highest-cost step first, and test rather than redesign on instinct.",
    ],
  },
  {
    slug: "growth-strategy",
    name: "Growth Strategy",
    category: "growth",
    summary: "Where the next customers come from, in what order, at what cost.",
    detail: [
      "Growth strategy is a sequencing problem: which channel, which segment, which offer, and what has to be true before the next one is worth funding.",
      "We build the model with your numbers - margin, cycle length, retention - and commit to the two or three moves that the model says can actually move the business.",
    ],
  },

  {
    slug: "customer-service-ai",
    name: "Customer Service AI",
    category: "ai",
    summary: "Resolving the repeat questions without making customers fight a bot.",
    detail: [
      "Support automation earns its place on the questions that repeat with stable answers. Everything else needs to reach a person quickly, and the handover is where most implementations fail.",
      "We ground the system in your own documentation, keep an explicit escalation path, and measure resolution and satisfaction rather than deflection alone.",
    ],
  },
  {
    slug: "ai-chatbots",
    name: "AI Chatbots",
    category: "ai",
    summary: "Assistants that answer from your content, not from guesswork.",
    detail: [
      "A chatbot is only useful if it is answering from a source you control and can correct. Unverified answers cost more trust than the widget saves in tickets.",
      "We retrieve from your own material, show where an answer came from, and log the questions it could not handle so the content gets fixed rather than the model blamed.",
    ],
  },
  {
    slug: "sales-automation",
    name: "Sales Automation",
    category: "ai",
    summary: "Removing the admin between a lead arriving and a human replying.",
    detail: [
      "Sales teams lose time to research, data entry and follow-up scheduling - work that is repeatable and does not need judgement.",
      "We automate enrichment, routing, note-taking and follow-up so the selling time goes back to selling, and keep every automated action visible in the CRM.",
    ],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    category: "ai",
    summary: "Automating the multi-step processes that cross systems and people.",
    detail: [
      "The expensive processes in a business are rarely single tasks; they are chains of steps with handoffs, approvals and exceptions.",
      "We model the chain including the exceptions, automate the deterministic steps, and route the rest to the right person with the context already attached.",
    ],
  },
  {
    slug: "document-intelligence",
    name: "Document Intelligence",
    category: "ai",
    summary: "Turning contracts, invoices and forms into structured, checkable data.",
    detail: [
      "Document work is where AI is least glamorous and most profitable: extraction that used to take a person an hour per batch, done in seconds with a confidence score.",
      "We build extraction with validation rules and a review queue for low-confidence cases, so throughput rises without the error rate quietly rising with it.",
    ],
  },
  {
    slug: "ai-powered-applications",
    name: "AI-Powered Applications",
    category: "ai",
    summary: "Products where the intelligence is the feature, not a bolt-on.",
    detail: [
      "When AI is central to the product, it has to be designed into the interface, the pricing and the error handling - not added as a chat panel in the corner.",
      "We build the application and the model integration together, including how the product behaves when the model is slow, uncertain or wrong.",
    ],
  },
  {
    slug: "knowledge-systems",
    name: "Knowledge Systems",
    category: "ai",
    summary: "Making what the company already knows searchable and answerable.",
    detail: [
      "Institutional knowledge sits in drives, threads and a few people's heads, which is why the same questions get asked and re-answered every week.",
      "We consolidate the sources, keep permissions intact, and put a retrieval layer over them so answers come with a citation into the original document.",
    ],
  },
  {
    slug: "data-analysis",
    name: "Data Analysis",
    category: "ai",
    summary: "Answering specific commercial questions with the data you have.",
    detail: [
      "Before any dashboard, there is usually a short list of questions the business actually needs answered: which customers churn, which channel pays back, where margin leaks.",
      "We answer those directly against your data, state the confidence and the caveats, and only then decide what deserves to become permanent reporting.",
    ],
  },
  {
    slug: "ai-integration",
    name: "AI Integration",
    category: "ai",
    summary: "Putting AI inside the systems your team already uses.",
    detail: [
      "Adoption fails when a capability lives in a separate tool. The same capability inside the CRM, the helpdesk or the internal portal gets used by default.",
      "We integrate into the existing systems, keep the credentials and data boundaries explicit, and instrument usage so the value is measurable rather than assumed.",
    ],
  },
  {
    slug: "custom-ai-solutions",
    name: "Custom AI Solutions",
    category: "ai",
    summary: "Purpose-built AI for a process no vendor sells a product for.",
    detail: [
      "The processes worth automating with custom AI are usually the ones specific enough that no vendor addresses them - which is also what makes them defensible.",
      "We scope narrowly, prove the business case on one process, and only then widen the surface, so the first invoice is tied to a measured result.",
    ],
  },
];

export const SERVICES_BY_CATEGORY = (category: ServiceCategory): Service[] =>
  SERVICES.filter((service) => service.category === category);
