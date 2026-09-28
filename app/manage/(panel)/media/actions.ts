"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteMediaAsset } from "@/lib/media/service";

const IdSchema = z.string().trim().min(1);

export type MediaActionState =
  | { status: "idle" }
  | { status: "success"; success: string }
  | { status: "error"; error: string };

export async function deleteMediaAssetAction(id: string): Promise<MediaActionState> {
  const admin = await requireAdmin();
  const input = IdSchema.safeParse(id);
  if (!input.success) return { status: "error", error: "Invalid media record." };

  try {
    const deleted = await deleteMediaAsset(prisma, input.data);
    if (!deleted) return { status: "error", error: "Media record not found." };

    await recordAudit({
      action: "delete",
      entity: "MediaAsset",
      entityId: input.data,
      userId: admin.id,
    });
    revalidatePath("/manage/media");
    return { status: "success", success: "Media permanently deleted." };
  } catch (error) {
    return { status: "error", error: error instanceof Error ? error.message : "Media could not be deleted." };
  }
}
