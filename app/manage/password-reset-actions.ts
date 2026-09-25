"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;
const NEUTRAL_REQUEST_SUCCESS = "If that address is registered, a password reset link has been sent. Check your inbox.";

export type RequestResetState = { error?: string; success?: string };
export type ApplyResetState = { error?: string; success?: string };

const RequestSchema = z.object({ email: z.string().trim().toLowerCase().email() });
const ApplySchema = z
  .object({
    token: z.string().trim().min(16),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    passwordConfirm: z.string().min(MIN_PASSWORD_LENGTH),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: "Passwords do not match.",
  });


export async function requestPasswordResetAction(
  _previous: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const neutral: RequestResetState = { success: NEUTRAL_REQUEST_SUCCESS };
  const input = RequestSchema.safeParse({ email: formData.get("email") });
  if (!input.success) return { error: "Enter a valid email address." };

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: input.data.email },
      select: { id: true, email: true },
    });
    if (!user) return neutral;

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const now = new Date();

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS),
        },
      }),
    ]);

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
    const link = `${baseUrl}/manage/reset-password?token=${encodeURIComponent(token)}`;
    await sendMail({
      to: user.email,
      subject: "UMIN Global Admin Panel — Password Reset",
      text: `Open this link to reset your password (valid for 1 hour):\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>Open the link below to reset your password. The link is valid for <strong>1 hour</strong>.</p><p><a href="${link}">Reset my password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
    await recordAudit({ action: "password.reset.requested", entity: "AdminUser", userId: user.id });
  } catch (error) {
    console.error("[manage/password-reset] request failed", error);
  }

  return neutral;
}

export async function applyPasswordResetAction(
  _previous: ApplyResetState,
  formData: FormData,
): Promise<ApplyResetState> {
  const input = ApplySchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!input.success) {
    const mismatch = input.error.issues.some((issue) => issue.message === "Passwords do not match.");
    return { error: mismatch ? "Passwords do not match." : `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const invalid = { error: "The link is invalid or has expired. Request a new reset link." };

  try {
    const tokenHash = createHash("sha256").update(input.data.token).digest("hex");
    const grant = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!grant || grant.usedAt || grant.expiresAt.getTime() < Date.now()) return invalid;

    const passwordHash = await bcrypt.hash(input.data.password, 12);
    const applied = await prisma.$transaction(async (transaction) => {
      const claimed = await transaction.passwordResetToken.updateMany({
        where: { id: grant.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) return false;

      await transaction.adminUser.update({
        where: { id: grant.userId },
        data: { passwordHash, tokenVersion: { increment: 1 } },
      });
      return true;
    });
    if (!applied) return invalid;

    await recordAudit({ action: "password.reset.applied", entity: "AdminUser", userId: grant.userId });
    revalidatePath("/manage/users");
    return { success: "Your password has been updated. You can now sign in." };
  } catch (error) {
    console.error("[manage/password-reset] apply failed", error);
    return invalid;
  }
}
