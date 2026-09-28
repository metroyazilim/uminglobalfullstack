"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { ensureDefaultNavigation } from "@/lib/content/navigation";
import { prisma } from "@/lib/db";

const itemSchema = z.object({
  label: z.string().trim().min(1, "Label is required.").max(120),
  href: z.string().trim().min(1, "URL is required.").max(1000),
  parentId: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

function value(formData: FormData, key: string): string {
  const input = formData.get(key);
  return typeof input === "string" ? input : "";
}

export async function createNavigationItemAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const input = itemSchema.safeParse({ label: value(formData, "label"), href: value(formData, "href"), parentId: value(formData, "parentId") || undefined, sortOrder: value(formData, "sortOrder") || "0" });
  if (!input.success) redirect("/manage/navigation?error=invalid");

  await ensureDefaultNavigation();
  try {
    const parentId = input.data.parentId || null;
    if (parentId) {
      const parent = await prisma.navigationItem.findUnique({ where: { id: parentId }, select: { id: true } });
      if (!parent) redirect("/manage/navigation?error=parent");
    } else {
      const rootCount = await prisma.navigationItem.count({ where: { parentId: null } });
      if (rootCount >= 7) redirect("/manage/navigation?error=max");
    }

    const item = await prisma.navigationItem.create({ data: { label: input.data.label, href: input.data.href, parentId, sortOrder: input.data.sortOrder } });
    await recordAudit({ action: "create", entity: "NavigationItem", entityId: item.id, userId: admin.id, metadata: { label: item.label, href: item.href, parentId } });
  } catch {
    redirect("/manage/navigation?error=create");
  }
  revalidatePath("/manage/navigation");
  revalidatePath("/", "layout");
  redirect("/manage/navigation?saved=1");
}

export async function deleteNavigationItemAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = value(formData, "id");
  if (!id) redirect("/manage/navigation?error=invalid");
  try {
    await prisma.navigationItem.delete({ where: { id } });
    await recordAudit({ action: "delete", entity: "NavigationItem", entityId: id, userId: admin.id });
  } catch {
    redirect("/manage/navigation?error=delete");
  }
  revalidatePath("/manage/navigation");
  revalidatePath("/", "layout");
  redirect("/manage/navigation?saved=1");
}
