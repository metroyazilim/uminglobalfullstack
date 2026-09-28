"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { parsePageBlocks } from "@/lib/content/page-content";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type CustomPageActionState = { error?: string; success?: string; version?: number };

const pageSchema = z.object({
  id: z.string().min(1),
  version: z.coerce.number().int().nonnegative(),
  title: z.string().trim().min(1, "Title is required.").max(240),
  slug: z.string().trim().min(1, "Slug is required.").max(240).transform(slugify).refine(Boolean, "Slug is required."),
  blocks: z.string().transform((value, context) => {
    try {
      const blocks = parsePageBlocks(JSON.parse(value));
      if (!blocks) throw new Error("invalid blocks");
      return blocks;
    } catch {
      context.addIssue({ code: "custom", message: "Page blocks are invalid." });
      return z.NEVER;
    }
  }),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

function value(formData: FormData, key: string): string {
  const input = formData.get(key);
  return typeof input === "string" ? input : "";
}

export async function createCustomPageAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const title = value(formData, "title").trim();
  const slug = slugify(value(formData, "slug") || title);
  if (!title || !slug) redirect("/manage/pages?error=title");

  try {
    const page = await prisma.customPage.create({ data: { title, slug, blocks: [], status: "DRAFT" } });
    await recordAudit({ action: "create", entity: "CustomPage", entityId: page.id, userId: admin.id, metadata: { slug } });
    revalidatePath("/manage/pages");
    redirect(`/manage/pages/custom/${page.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") redirect("/manage/pages?error=slug");
    redirect("/manage/pages?error=create");
  }
}

export async function saveCustomPageAction(_previous: CustomPageActionState, formData: FormData): Promise<CustomPageActionState> {
  const admin = await requireAdmin();
  const parsed = pageSchema.safeParse({
    id: value(formData, "id"),
    version: value(formData, "version"),
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    blocks: value(formData, "blocks"),
    status: value(formData, "status") || "DRAFT",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the page fields." };

  try {
    const result = await prisma.customPage.updateMany({
      where: { id: parsed.data.id, version: parsed.data.version },
      data: { title: parsed.data.title, slug: parsed.data.slug, blocks: parsed.data.blocks, status: parsed.data.status, version: { increment: 1 } },
    });
    if (result.count !== 1) return { error: "Page was changed elsewhere. Refresh and try again." };
    await recordAudit({ action: parsed.data.status === "PUBLISHED" ? "publish" : "update", entity: "CustomPage", entityId: parsed.data.id, userId: admin.id, metadata: { slug: parsed.data.slug } });
    revalidatePath("/manage/pages");
    revalidatePath(`/manage/pages/custom/${parsed.data.id}`);
    revalidatePath(`/pages/${parsed.data.slug}`);
    return { success: parsed.data.status === "PUBLISHED" ? "Page published." : "Draft saved.", version: parsed.data.version + 1 };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { error: "This slug is already used." };
    return { error: "Page could not be saved." };
  }
}
