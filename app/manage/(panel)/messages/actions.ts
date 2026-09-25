"use server";

import type { MessageStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const MESSAGE_STATUSES = ["UNREAD", "READ", "REPLIED", "ARCHIVED", "SPAM"] as const;

const UpdateMessageStatusSchema = z.object({
  id: z.string().trim().min(1),
  expectedVersion: z.number().int().min(0),
  nextStatus: z.enum(MESSAGE_STATUSES),
});

export type MessageActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "conflict"; current: { status: MessageStatus; version: number } | null }
  | { status: "error"; error: string };

export async function updateMessageStatusAction(
  id: string,
  expectedVersion: number,
  nextStatus: MessageStatus,
): Promise<MessageActionState> {
  const admin = await requireAdmin();
  const input = UpdateMessageStatusSchema.safeParse({ id, expectedVersion, nextStatus });
  if (!input.success) return { status: "error", error: "Invalid status update." };

  try {
    const result = await prisma.contactMessage.updateMany({
      where: { id: input.data.id, version: input.data.expectedVersion },
      data: { status: input.data.nextStatus, version: { increment: 1 } },
    });

    if (result.count === 0) {
      const current = await prisma.contactMessage.findUnique({
        where: { id: input.data.id },
        select: { status: true, version: true },
      });
      revalidatePath("/manage/messages");
      revalidatePath(`/manage/messages/${input.data.id}`);
      return { status: "conflict", current };
    }

    await recordAudit({
      action: "update",
      entity: "ContactMessage",
      entityId: input.data.id,
      userId: admin.id,
      metadata: { status: input.data.nextStatus },
    });
    revalidatePath("/manage/messages");
    revalidatePath(`/manage/messages/${input.data.id}`);
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Message status could not be updated.",
    };
  }
}
