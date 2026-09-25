import Image from "next/image";
import Link from "next/link";
import { getPublishedPageBlocks } from "@/lib/content/page-source";
import type { PageBlock } from "@/lib/content/page-content";
import type { PageContentKey } from "@/lib/site-pages";

function Block({ block }: { block: PageBlock }) {
  switch (block.kind) {
    case "hero":
      return (
        <section className="bg-brand-ink px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-6xl">
            {block.eyebrow ? <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">{block.eyebrow}</p> : null}
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{block.title}</h1>
            {block.body ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{block.body}</p> : null}
          </div>
        </section>
      );
    case "heading":
      return (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          {block.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">{block.eyebrow}</p> : null}
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-brand-ink sm:text-5xl">{block.title}</h2>
          {block.lead ? <p className="mt-5 max-w-3xl text-lg leading-8 text-brand-muted">{block.lead}</p> : null}
        </section>
      );
    case "paragraph":
      return <p className="mx-auto max-w-3xl px-6 py-5 text-lg leading-8 text-brand-muted sm:px-10 lg:px-16">{block.text}</p>;
    case "list":
      return (
        <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
          {block.title ? <h3 className="mb-5 text-2xl font-semibold text-brand-ink">{block.title}</h3> : null}
          <ul className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item) => <li key={item} className="rounded border border-brand-border bg-brand-surface px-5 py-4 text-brand-text">{item}</li>)}
          </ul>
        </section>
      );
    case "cards":
      return (
        <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
          {block.title ? <h3 className="mb-6 text-2xl font-semibold text-brand-ink">{block.title}</h3> : null}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <article key={`${item.title}-${item.text}`} className="rounded border border-brand-border bg-brand-surface p-6">
                <h3 className="text-xl font-semibold text-brand-ink">{item.title}</h3>
                <p className="mt-3 leading-7 text-brand-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      );
    case "stats":
      return (
        <section className="border-y border-brand-border bg-brand-surface px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((item) => <div key={`${item.value}-${item.label}`}><strong className="block text-3xl font-semibold text-brand-ink">{item.value}</strong><span className="mt-2 block text-sm text-brand-muted">{item.label}</span></div>)}
          </div>
        </section>
      );
    case "image":
      return (
        <figure className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
          <div className="relative aspect-[16/7] overflow-hidden rounded">
            <Image src={block.src} alt={block.alt} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" unoptimized />
          </div>
          {block.caption ? <figcaption className="mt-2 text-sm text-brand-muted">{block.caption}</figcaption> : null}
        </figure>
      );
    case "cta":
      return (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <div className="rounded bg-brand-ink px-6 py-10 text-white sm:px-10">
            <h2 className="text-3xl font-semibold">{block.title}</h2>
            {block.text ? <p className="mt-3 max-w-2xl leading-7 text-white/75">{block.text}</p> : null}
            <Link href={block.href} className="mt-6 inline-flex rounded bg-brand-gold px-5 py-3 text-sm font-bold text-brand-ink">{block.label}</Link>
          </div>
        </section>
      );
  }
}

export function PageContentBlocks({ blocks }: { blocks: readonly PageBlock[] }) {
  return <div aria-label="Published page content">{blocks.map((block, index) => <Block key={`${block.kind}-${index}`} block={block} />)}</div>;
}

export async function PageContentSlot({ pageKey }: { pageKey: PageContentKey }) {
  const blocks = await getPublishedPageBlocks(pageKey);
  return blocks && blocks.length > 0 ? <PageContentBlocks blocks={blocks} /> : null;
}
