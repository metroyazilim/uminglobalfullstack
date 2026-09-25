"use server";

import { ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { parsePageBlocks, isPageContentKey } from "@/lib/content/page-content";
import { prisma } from "@/lib/db";
import { findSitePage } from "@/lib/site-pages";

export type PageContentActionState = { ok: true; message: string } | { ok: false; error: string };

const inputSchema = z.object({
  key: z.string().refine(isPageContentKey, "Unknown page."),
  version: z.coerce.number().int().nonnegative(),
  blocks: z.string().transform((value, context) => {
    try {
      return JSON.parse(value);
    } catch {
      context.addIssue({ code: "custom", message: "Invalid block data." });
      return z.NEVER;
    }
  }),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

function value(formData: FormData, key: string): string {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function revalidatePage(key: string): void {
  const page = findSitePage(key);
  revalidatePath("/manage/pages");
  revalidatePath(`/manage/pages/${key}`);
  if (page) revalidatePath(page.path);
}

export async function savePageContentAction(
  _previous: PageContentActionState,
  formData: FormData,
): Promise<PageContentActionState> {
  const session = await requireAdmin();
  const parsed = inputSchema.safeParse({
    key: value(formData, "key"),
    version: value(formData, "version"),
    blocks: value(formData, "blocks"),
    status: value(formData, "status") || "DRAFT",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the page content." };

  const blocks = parsePageBlocks(parsed.data.blocks);
  if (!blocks) return { ok: false, error: "Block içerikleri geçersiz. Her alanı kontrol edin." };

  try {
    const existing = await prisma.pageContent.findUnique({ where: { key: parsed.data.key } });
    if (!existing) {
      if (parsed.data.version !== 0) return { ok: false, error: "Sayfa değişti. Sayfayı yenileyip tekrar deneyin." };
      await prisma.pageContent.create({ data: { key: parsed.data.key, blocks, status: parsed.data.status as ContentStatus } });
    } else {
      const result = await prisma.pageContent.updateMany({
        where: { key: parsed.data.key, version: parsed.data.version },
        data: { blocks, status: parsed.data.status as ContentStatus, version: { increment: 1 } },
      });
      if (result.count !== 1) return { ok: false, error: "Sayfa başka bir oturumda değişti. Sayfayı yenileyip tekrar deneyin." };
    }

    await recordAudit({
      action: parsed.data.status === "PUBLISHED" ? "page.publish" : "page.update",
      entity: "PageContent",
      entityId: parsed.data.key,
      userId: session.id,
      metadata: { key: parsed.data.key, blockCount: blocks.length, status: parsed.data.status },
    });
    revalidatePage(parsed.data.key);
    return { ok: true, message: parsed.data.status === "PUBLISHED" ? "Sayfa yayınlandı." : "Taslak kaydedildi." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[manage/pages] page content mutation failed", error);
    }
    return { ok: false, error: "Sayfa içeriği kaydedilemedi." };
  }
}
