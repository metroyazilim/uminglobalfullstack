import Link from "next/link";
import { getOtherInsights } from "@/lib/content/insights";

// Insights aside: what the notes are, the other articles, and the topics they map to. The search
// box and the comment widgets went - neither had anything behind them.
//
// "Recent" used to be three hardcoded titles that all linked to one article. It now reads from
// the catalogue and links each title to its own page; `currentSlug` keeps an article out of its
// own sidebar.
const TOPICS: { label: string; href: string }[] = [
  { label: "Technology & AI", href: "/technology-ai" },
  { label: "Growth", href: "/growth-marketing" },
  { label: "Ventures", href: "/ventures" },
  { label: "Global Strategy", href: "/global-strategy" },
];

export default async function BlogSidebar({ currentSlug }: { currentSlug?: string }) {
  const recent = await getOtherInsights(currentSlug);

  return (
    <aside className="lg:sticky lg:top-[132px]">
      <span className="t-eyebrow flex items-center gap-3 text-label">
        <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
        About the insights
      </span>
      <p className="t-body pt-4 text-body">
        Practical notes on technology, AI, growth and expansion from the team in New York.
      </p>

      <h2 className="t-eyebrow pt-10 text-ink">{currentSlug ? "More articles" : "Recent"}</h2>
      <ul className="mt-3 divide-y divide-divider border-y border-divider">
        {recent.map((post) => (
          <li key={post.slug} className="py-4">
            <Link href={`/insights/${post.slug}`} className="group block">
              <span className="t-small text-label">{post.dateDisplay}</span>
              <span className="t-body block pt-1 font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="t-eyebrow pt-10 text-ink">Topics</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <li key={topic.href}>
            <Link
              href={topic.href}
              className="t-small inline-block rounded-control bg-section-gray px-3 py-1.5 text-body transition-colors duration-200 hover:bg-ink hover:text-white"
            >
              {topic.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
