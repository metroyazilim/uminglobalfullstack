import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { parsePageBlocks, type PageBlock } from "@/lib/content/page-content";

export type PublishedCustomPage = Readonly<{ slug: string; title: string; blocks: PageBlock[] }>;

export async function getPublishedCustomPage(slug: string): Promise<PublishedCustomPage | undefined> {
  if (!hasDatabase()) return undefined;
  try {
    const row = await prisma.customPage.findFirst({ where: { slug, status: "PUBLISHED" }, select: { slug: true, title: true, blocks: true } });
    if (!row) return undefined;
    const blocks = parsePageBlocks(row.blocks);
    return blocks ? { slug: row.slug, title: row.title, blocks } : undefined;
  } catch (error) {
    console.error("[content/custom-pages] database content unavailable", error);
    return undefined;
  }
}
