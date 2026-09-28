import type { PageBlock } from "@/lib/content/page-content";
import type { PageContentKey } from "@/lib/site-pages";

const rich = (text: string): string => `<p>${text}</p>`;
const paragraph = (text: string): PageBlock => ({ kind: "paragraph", text: rich(text) });
const image = (file: string, alt: string, caption: string): PageBlock => ({
  kind: "image",
  src: `/users/berat/${file}`,
  alt,
  caption,
});
const cards = (title: string, items: Array<{ title: string; text: string }>): PageBlock => ({
  kind: "cards",
  title,
  items: items.map((item) => ({ ...item, text: rich(item.text) })),
});
const cta = (title: string, text: string, label = "Start a Project", href = "/contact"): PageBlock => ({
  kind: "cta",
  title,
  text: rich(text),
  label,
  href,
});

export const PAGE_CONTENT_SEEDS: Readonly<Record<PageContentKey, PageBlock[]>> = {
  home: [
    { kind: "hero", eyebrow: "New York · Technology, Growth & Ventures", title: "From idea to global business", body: rich("UMIN Global turns ambitious ideas into technology, brands and scalable companies through one senior operating team.") },
    { kind: "heading", eyebrow: "What we do", title: "One partner across the journey", lead: rich("Strategy, product, AI, growth and market entry work better when the people making the decisions share the same view of the business.") },
    paragraph("We help founders and established teams move from a clear commercial question to a working product, a stronger market position and measurable growth."),
    image("01-home-hero-background.jpg", "UMIN Global team helping an ambitious business move from idea to global growth", "Ideas become businesses when strategy and execution stay connected."),
    cards("Five capabilities, one team", [
      { title: "Technology & AI", text: "Custom software, SaaS platforms, integrations and applied AI built around the workflow and the commercial goal." },
      { title: "Growth & Marketing", text: "Brand, content, advertising, SEO, CRM and lead generation run as one measurable system." },
      { title: "Global Strategy", text: "Market entry and expansion supported by local context, senior judgement and one reporting standard." },
    ]),
    { kind: "stats", items: [{ value: "6", label: "offices across key markets" }, { value: "7", label: "regions served by the network" }, { value: "1", label: "senior operating standard" }] },
    cta("Have a project, growth question or venture idea?", "Bring us the commercial question. We will help define the next useful step.")
  ],
  about: [
    { kind: "hero", eyebrow: "About UMIN Global", title: "A senior team for ambitious businesses", body: rich("UMIN Global works across technology, brands, growth and market entry from New York and a network of international offices.") },
    image("10-about-who-we-are.jpg", "The UMIN Global team working together on a technology and growth project", "The same team stays close to the decisions that shape the work."),
    { kind: "heading", eyebrow: "Who we are", title: "We build the operating layer behind growth", lead: rich("The founder, CTO and senior specialists work directly with the people responsible for the outcome. There is no third layer between the question and the work.") },
    paragraph("Our work spans software, applied AI, brand, demand generation, ventures and international expansion. The common thread is practical execution: understand the constraint, build the right system and measure what changes."),
    cards("Why clients work with UMIN", [
      { title: "Senior from the start", text: "The people shaping the strategy stay involved through delivery, launch and the next decision." },
      { title: "Commercial context", text: "Technology and marketing choices are tied to customers, revenue, operations and the cost of inaction." },
      { title: "Global perspective", text: "Local market knowledge is combined with a consistent standard for reporting and execution." },
    ]),
    cta("Tell us what you are trying to change", "We can start with a project, a market-entry question or a conversation about building something new.")
  ],
  "what-we-do": [
    { kind: "hero", eyebrow: "Five capabilities · One team", title: "What we do", body: rich("UMIN combines technology, AI, growth, ventures and global strategy for businesses that need more than a disconnected supplier list.") },
    cards("Capabilities", [
      { title: "Technology & AI", text: "Digital products, custom software, SaaS, cloud systems and applied AI." },
      { title: "Growth & Marketing", text: "Positioning, content, advertising, SEO, CRM and lead generation." },
      { title: "UMIN AI", text: "Agents and workflow automation that create measurable commercial value." },
      { title: "Ventures", text: "Co-building companies with founders and operators from first decision to first customers." },
      { title: "Global Strategy", text: "Market entry, expansion and local execution across the network." },
    ]),
    image("17-what-we-do-technology.jpg", "Technology team building software and AI products for a growing company", "The capability changes; the operating standard stays the same."),
    paragraph("Start with the business problem rather than a fixed service list. We will assemble the right combination of capabilities and define the work around a measurable outcome."),
    cta("Need the right capability for the next stage?", "Describe the opportunity and we will map the people, sequence and first useful deliverable.")
  ],
  "technology-ai": [
    { kind: "hero", eyebrow: "Technology & AI", title: "Build the system your business actually needs", body: rich("From a first product to a connected operating platform, UMIN builds software and AI around the workflow, the customer and the commercial goal.") },
    image("04-technology-ai-service-card.jpg", "Product team designing custom software and applied AI solutions", "Useful technology starts with the work that needs to change."),
    { kind: "heading", eyebrow: "Built for adoption", title: "Technology that earns its place in the workflow", lead: rich("We do not add software for its own sake. We clarify the decision, design the experience and build the smallest system that can create a measurable improvement.") },
    { kind: "list", title: "Typical engagements", items: ["Custom web and mobile applications", "SaaS products and customer portals", "Cloud architecture and integrations", "Applied AI, agents and document intelligence", "Product discovery, delivery and ongoing improvement"] },
    paragraph("The result should be easier to use, easier to operate and easier to improve. That means product decisions stay connected to the people who use the system every day."),
    cta("Have a product or workflow to improve?", "Bring the current process, the constraint and the outcome you need. We will help shape the build.")
  ],
  "growth-marketing": [
    { kind: "hero", eyebrow: "Growth & Marketing", title: "Make growth work as one system", body: rich("Brand, website, content, advertising, SEO, CRM and lead generation should reinforce one another. We connect the parts and measure the pipeline.") },
    image("15-growth-marketing-page-detail.jpg", "Growth marketing team planning brand, advertising and lead generation work", "Growth gets clearer when every activity is tied to the next commercial decision."),
    { kind: "heading", eyebrow: "Growth partnership", title: "From positioning to qualified demand", lead: rich("We help teams understand what to say, who to reach, where to show up and how to turn attention into a better sales conversation.") },
    cards("What the system can include", [
      { title: "Positioning and brand", text: "A clear point of view, message architecture and a brand people can recognise." },
      { title: "Content and SEO", text: "Useful pages and content that build authority and compound over time." },
      { title: "Demand and CRM", text: "Paid channels, lifecycle journeys and reporting that makes the pipeline readable." },
    ]),
    cta("Want a clearer growth system?", "Tell us where demand is getting stuck and we will identify the highest-leverage next step.")
  ],
  "umin-ai": [
    { kind: "hero", eyebrow: "UMIN AI", title: "Put AI where it creates commercial value", body: rich("AI should reduce friction, improve decisions and help teams move faster. We implement agents and automation inside the work that matters.") },
    image("16-umin-ai-page-detail.jpg", "Applied AI workflow turning business data into useful decisions", "Applied AI is strongest when it is connected to a real workflow and a measurable result."),
    { kind: "heading", eyebrow: "Applied, not abstract", title: "Automation with a reason to exist", lead: rich("We start with the process: what is repeated, what is delayed, what is hard to find and what a better decision would unlock.") },
    { kind: "list", title: "Where AI can help", items: ["Customer service and knowledge assistants", "Sales research and qualification", "Workflow and back-office automation", "Document intelligence and structured data", "Internal copilots for faster decisions"] },
    cta("Have an AI use case in mind?", "Bring the process and the expected outcome. We will test the opportunity before recommending a build.")
  ],
  ventures: [
    { kind: "hero", eyebrow: "Ventures", title: "Build the next business with the right partner", body: rich("UMIN co-builds companies with founders and operators, contributing product, brand, growth and AI capability for equity or an agreed revenue share.") },
    image("07-ventures-service-card.jpg", "Founders and operators building a new venture together", "A venture is a shared operating problem, not an agency handoff."),
    { kind: "heading", eyebrow: "From idea to first customers", title: "Turn a strong idea into a working company", lead: rich("We help test the problem, shape the proposition, build the first useful product and create the conditions for early demand.") },
    cards("What we bring", [
      { title: "Commercial clarity", text: "A sharper view of the customer, the problem and the first viable business model." },
      { title: "Product capability", text: "The technology and experience needed to move from concept to something people can use." },
      { title: "Growth momentum", text: "Positioning, market entry and demand generation that support the next stage." },
    ]),
    cta("Have a venture idea worth testing?", "Tell us what you see, what you have learned and where the opportunity could go.", "Start a Conversation")
  ],
  "global-strategy": [
    { kind: "hero", eyebrow: "Global Strategy", title: "Enter markets with context and momentum", body: rich("Market entry and expansion across the UK, Europe, USA, Australia, Türkiye and the Gulf, run by one senior team from six offices.") },
    image("08-global-strategy-service-card.jpg", "Global expansion planning across markets and regions", "Local context matters when the decision affects the whole business."),
    { kind: "heading", eyebrow: "Market entry and expansion", title: "One strategy, local execution", lead: rich("We help leadership teams decide where to go, how to enter, what to adapt and which operating rhythm will keep the expansion accountable.") },
    { kind: "stats", items: [{ value: "New York", label: "North American headquarters" }, { value: "London", label: "UK and European market entry" }, { value: "Melbourne", label: "Australia and New Zealand" }, { value: "Istanbul", label: "Türkiye and cross-border growth" }, { value: "Dubai", label: "Gulf and Middle East expansion" }, { value: "Shanghai", label: "China and supply-chain context" }] },
    paragraph("The work can cover market research, positioning, local partnerships, acquisition, launch planning and the operating model required after entry. The objective is not to expand everywhere; it is to make the right move with a clear view of the trade-offs."),
    cta("Planning a move into a new market?", "Share the market, the opportunity and the constraint. We will help structure the decision.")
  ],
  services: [
    { kind: "hero", eyebrow: "All Services", title: "The capabilities behind the work", body: rich("Explore the services UMIN Global uses to build technology, brands, demand and international growth for ambitious businesses.") },
    { kind: "heading", eyebrow: "A connected offer", title: "Choose the outcome, then the capability", lead: rich("Some problems need one specialist service. Others need a connected team. The service index helps you find the right starting point without losing the bigger picture.") },
    cards("Service groups", [
      { title: "Technology & AI", text: "Software, SaaS, cloud, integrations, product design and applied AI." },
      { title: "Growth & Marketing", text: "Brand, website, content, advertising, SEO, CRM and lead generation." },
      { title: "UMIN AI", text: "Agents, automation, customer service AI and document intelligence." },
      { title: "Ventures", text: "Product, brand, growth and AI capability for co-built companies." },
      { title: "Global Strategy", text: "Market entry, expansion, partnerships and local execution." },
    ]),
    image("19-detail-gallery.jpg", "UMIN Global team reviewing growth performance and next steps", "The right combination of services follows the decision that needs to be made."),
    cta("Not sure where to start?", "Describe the business problem in plain language. We will help find the right path.")
  ],
  contact: [
    { kind: "hero", eyebrow: "Talk to UMIN Global", title: "Start with the question behind the project", body: rich("Tell us what you are building, changing or entering. We reply from New York within one business day.") },
    image("09-cta-banner-background.jpg", "Abstract blue background for contacting UMIN Global", "A useful first conversation starts with the commercial context."),
    { kind: "heading", eyebrow: "What to include", title: "Give us enough context to make the next step useful", lead: rich("A short description of the business, the current challenge, the market and the outcome you want is enough to begin.") },
    { kind: "list", title: "Good starting points", items: ["A new product or software platform", "A growth or demand-generation challenge", "An AI or workflow automation opportunity", "A market-entry or expansion decision", "A venture idea you want to test"] },
    cta("Ready to talk?", "Send the outline and the team will come back with a clear next step.", "Send an Enquiry")
  ],
  "build-with-umin": [
    { kind: "hero", eyebrow: "Build With UMIN", title: "Turn the next idea into a real business", body: rich("We work with founders and operators to shape the product, brand, growth plan and operating system behind a new company.") },
    image("13-build-with-umin.jpg", "Founders collaborating with UMIN Global to shape a new business", "The best ventures are built through shared decisions and short feedback loops."),
    { kind: "heading", eyebrow: "How we work", title: "From the first commercial question to first customers", lead: rich("A venture is not an agency project. Product decisions, pricing, positioning and early customers are worked through together.") },
    cards("The venture path", [
      { title: "Define the opportunity", text: "Clarify the customer, the problem and the evidence that makes the opportunity worth pursuing." },
      { title: "Build the first system", text: "Create the product, brand and operating workflow needed to test the business in the real world." },
      { title: "Create momentum", text: "Find the first customers, learn from the market and build the next stage around what works." },
    ]),
    cta("Have an idea that could become a company?", "Bring the insight, the ambition and the constraint. We will help decide what to test first.", "Talk About the Idea")
  ],
};

export function isPlaceholderPageBlocks(pageLabel: string, blocks: PageBlock[]): boolean {
  if (blocks.length !== 1) return false;
  const [block] = blocks;
  return block.kind === "hero" && block.title === pageLabel && !block.body;
}
