"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { archiveMediaAsset, deleteMediaAsset, updateMediaAssetMetadata } from "@/lib/media/service";

const IdSchema = z.string().trim().min(1);
const MetadataSchema = z.object({
  id: IdSchema,
  altText: z.string().trim().max(500).transform((value) => value || null),
  caption: z.string().trim().max(2_000).transform((value) => value || null),
});
const ArchiveSchema = z.object({ id: IdSchema, archived: z.boolean() });

export type MediaActionState =
  | { status: "idle" }
  | { status: "success"; success: string }
  | { status: "error"; error: string };

export async function updateMediaMetadataAction(id: string, formData: FormData): Promise<MediaActionState> {
  const admin = await requireAdmin();
  const altText = formData.get("altText");
  const caption = formData.get("caption");
  const input = MetadataSchema.safeParse({
    id,
    altText: typeof altText === "string" ? altText : "",
    caption: typeof caption === "string" ? caption : "",
  });
  if (!input.success) return { status: "error", error: "Invalid media information." };

  try {
    await updateMediaAssetMetadata(prisma, input.data.id, {
      altText: input.data.altText,
      caption: input.data.caption,
    });
    await recordAudit({
      action: "update",
      entity: "MediaAsset",
      entityId: input.data.id,
      userId: admin.id,
      metadata: { fields: ["altText", "caption"] },
    });
    revalidatePath("/manage/media");
    return { status: "success", success: "Media information saved." };
  } catch (error) {
    return { status: "error", error: error instanceof Error ? error.message : "Media information could not be saved." };
  }
}

export async function archiveMediaAssetAction(id: string, archived: boolean): Promise<MediaActionState> {
  const admin = await requireAdmin();
  const input = ArchiveSchema.safeParse({ id, archived });
  if (!input.success) return { status: "error", error: "Invalid archive request." };

  try {
    await archiveMediaAsset(prisma, input.data.id, input.data.archived);
    await recordAudit({
      action: input.data.archived ? "archive" : "update",
      entity: "MediaAsset",
      entityId: input.data.id,
      userId: admin.id,
      metadata: { archived: input.data.archived },
    });
    revalidatePath("/manage/media");
    return { status: "success", success: input.data.archived ? "Media archived." : "Media unarchived." };
  } catch (error) {
    return { status: "error", error: error instanceof Error ? error.message : "Archive status could not be updated." };
  }
}

export async function deleteMediaAssetAction(id: string): Promise<MediaActionState> {
  const admin = await requireAdmin();
  const input = IdSchema.safeParse(id);
  if (!input.success) return { status: "error", error: "Invalid media record." };

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: input.data },
      select: { archived: true },
    });
    if (!asset) return { status: "error", error: "Media record not found." };
    if (!asset.archived) return { status: "error", error: "Archive it first." };

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
