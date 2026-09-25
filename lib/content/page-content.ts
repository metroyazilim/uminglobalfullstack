import { z } from "zod";
import { PAGE_CONTENT_KEYS, type PageContentKey } from "@/lib/site-pages";

const text = z.string().trim().min(1);

const pageBlockSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("hero"),
    eyebrow: z.string().trim().max(120).optional(),
    title: text.max(240),
    body: z.string().trim().max(1000).optional(),
  }),
  z.object({
    kind: z.literal("heading"),
    eyebrow: z.string().trim().max(120).optional(),
    title: text.max(240),
    lead: z.string().trim().max(1000).optional(),
  }),
  z.object({ kind: z.literal("paragraph"), text: text.max(5000) }),
  z.object({
    kind: z.literal("list"),
    title: z.string().trim().max(240).optional(),
    items: z.array(text.max(500)).min(1).max(30),
  }),
  z.object({
    kind: z.literal("cards"),
    title: z.string().trim().max(240).optional(),
    items: z.array(z.object({ title: text.max(240), text: text.max(1000) })).min(1).max(12),
  }),
  z.object({
    kind: z.literal("stats"),
    items: z.array(z.object({ value: text.max(80), label: text.max(240) })).min(1).max(12),
  }),
  z.object({
    kind: z.literal("image"),
    src: text.max(1000),
    alt: text.max(240),
    caption: z.string().trim().max(500).optional(),
  }),
  z.object({
    kind: z.literal("cta"),
    title: text.max(240),
    text: z.string().trim().max(1000).optional(),
    label: text.max(120),
    href: text.max(1000),
  }),
]);

export type PageBlock = z.infer<typeof pageBlockSchema>;

export const pageBlocksSchema = z.array(pageBlockSchema).max(80);

export function parsePageBlocks(value: unknown): PageBlock[] | null {
  const parsed = pageBlocksSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function isPageContentKey(value: string): value is PageContentKey {
  return (PAGE_CONTENT_KEYS as readonly string[]).includes(value);
}

export const PAGE_BLOCK_KIND_LABELS: Readonly<Record<PageBlock["kind"], string>> = {
  hero: "Hero",
  heading: "Heading",
  paragraph: "Paragraph",
  list: "List",
  cards: "Cards",
  stats: "Stats",
  image: "Image",
  cta: "Call to action",
};
