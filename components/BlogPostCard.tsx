import Image from "next/image";
import Link from "next/link";
import type { InsightPost } from "./insights";

// Insights card. The title sits under the image instead of on top of it: overlaid headlines on a
// photograph were the hardest text on the site to read. Every card links to its own article -
// the card data and the article body come from the same record in components/insights.ts.
export default function BlogPostCard({ post }: { post: InsightPost }) {
  const href = `/insights/${post.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card bg-white transition-colors duration-200">
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <span className="relative block aspect-[16/10] w-full">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="object-cover"
          />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="t-eyebrow flex flex-wrap items-center gap-2 text-label">
          <time dateTime={post.date}>{post.dateDisplay}</time>
          <span aria-hidden="true">/</span>
          <span>{post.topic}</span>
        </p>
        <h3 className="t-h3 pt-3 text-ink">
          <Link href={href} className="transition-colors duration-200 hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="t-body pt-3 text-body">{post.excerpt}</p>
        <Link href={href} className="t-eyebrow mt-auto flex items-center gap-2 pt-6 text-accent">
          Read
          <span aria-hidden="true">&rarr;</span>
          <span className="sr-only">: {post.title}</span>
        </Link>
      </div>
    </article>
  );
}
