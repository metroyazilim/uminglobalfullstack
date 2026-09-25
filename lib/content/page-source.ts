import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { parsePageBlocks, type PageBlock } from "@/lib/content/page-content";

/**
 * Published page blocks are optional. A missing row or an unavailable database
 * deliberately returns null so the route can keep rendering its bundled page.
 */
export async function getPublishedPageBlocks(key: string): Promise<PageBlock[] | null> {
  if (!hasDatabase()) return null;

  try {
    const row = await prisma.pageContent.findUnique({
      where: { key },
      select: { status: true, blocks: true },
    });
    if (!row || row.status !== ContentStatus.PUBLISHED) return null;
    return parsePageBlocks(row.blocks);
  } catch (error) {
    console.error(`[page-content] ${key} okunamadı; paketlenmiş sayfa kullanılacak.`, error);
    return null;
  }
}
