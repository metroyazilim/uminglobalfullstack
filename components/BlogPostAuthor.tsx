import Link from "next/link";

// Byline block under an article.
export default function BlogPostAuthor() {
  return (
    <div className= "flex items-start gap-4 border-t border-divider pt-6">
      <span className= "flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-ink text-[12px] font-bold text-white">
        UMIN
      </span>
      <div>
        <Link href= "/about" className= "t-body font-bold text-ink hover:text-accent">
          UMIN Global
        </Link>
        <p className= "t-small pt-1 text-body">
          Written by the team in New York - engineers, strategists and marketers who build and grow
          the companies they write about.
        </p>
      </div>
    </div>
  );
}
