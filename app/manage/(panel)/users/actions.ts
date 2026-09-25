"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export type UserActionState = { error?: string; success?: string };

const ROLES = ["SUPER_ADMIN", "ADMIN", "AUTHOR"] as const;

const CreateAdminUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  name: z.string().trim().min(1, "Name is required."),
  password: z.string().min(12, "Password must be at least 12 characters."),
  role: z.enum(ROLES),
});

const ChangeRoleSchema = z.object({
  targetId: z.string().min(1),
  nextRole: z.enum(ROLES),
});

const ResetPasswordSchema = z.object({
  targetId: z.string().min(1),
  newPassword: z.string().min(12, "Password must be at least 12 characters."),
});

const DeleteUserSchema = z.object({ targetId: z.string().min(1) });

export async function createAdminUserAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const actor = await requireSuperAdmin();
  const input = CreateAdminUserSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Invalid input." };

  try {
    const passwordHash = await bcrypt.hash(input.data.password, 12);
    const created = await prisma.adminUser.create({
      data: {
        email: input.data.email,
        name: input.data.name,
        passwordHash,
        role: input.data.role,
      },
      select: { id: true },
    });

    await recordAudit({ action: "create", entity: "AdminUser", entityId: created.id, userId: actor.id });
    revalidatePath("/manage/users");
    return { success: "User created." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "This email address is already registered." };
    }
    console.error("[manage/users] create failed", error);
    return { error: "Could not create user." };
  }
}

export async function changeAdminUserRoleAction(targetId: string, nextRole: string): Promise<UserActionState> {
  const actor = await requireSuperAdmin();
  const input = ChangeRoleSchema.safeParse({ targetId, nextRole });
  if (!input.success) return { error: "Invalid user or role." };
  if (input.data.targetId === actor.id) return { error: "You cannot change your own role." };

  try {
    const target = await prisma.adminUser.findUnique({
      where: { id: input.data.targetId },
      select: { id: true, email: true, role: true },
    });
    if (!target) return { error: "User not found." };
    if (target.role === input.data.nextRole) return { success: "Role is already up to date." };

    if (target.role === "SUPER_ADMIN" && input.data.nextRole !== "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
      if (superAdminCount <= 1) return { error: "At least one SUPER_ADMIN must remain." };
    }

    await prisma.adminUser.update({
      where: { id: target.id },
      data: { role: input.data.nextRole },
    });
    await recordAudit({
      action: "update",
      entity: "AdminUser",
      entityId: target.id,
      userId: actor.id,
      metadata: { field: "role", from: target.role, to: input.data.nextRole },
    });
    revalidatePath("/manage/users");
    return { success: "User role updated." };
  } catch (error) {
    console.error("[manage/users] role update failed", error);
    return { error: "Could not update user role." };
  }
}

export async function resetAdminUserPasswordAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const actor = await requireSuperAdmin();
  const input = ResetPasswordSchema.safeParse({
    targetId: formData.get("targetId"),
    newPassword: formData.get("newPassword"),
  });
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Invalid input." };

  try {
    const passwordHash = await bcrypt.hash(input.data.newPassword, 12);
    const target = await prisma.adminUser.update({
      where: { id: input.data.targetId },
      data: { passwordHash, tokenVersion: { increment: 1 } },
      select: { id: true },
    });
    await recordAudit({
      action: "password.reset.admin",
      entity: "AdminUser",
      entityId: target.id,
      userId: actor.id,
    });
    revalidatePath("/manage/users");
    return { success: "Password reset." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "User not found." };
    }
    console.error("[manage/users] password reset failed", error);
    return { error: "Could not reset password." };
  }
}

export async function deleteAdminUserAction(targetId: string): Promise<UserActionState> {
  const actor = await requireSuperAdmin();
  const input = DeleteUserSchema.safeParse({ targetId });
  if (!input.success) return { error: "Invalid user." };
  if (input.data.targetId === actor.id) return { error: "You cannot delete your own account." };

  try {
    const target = await prisma.adminUser.findUnique({
      where: { id: input.data.targetId },
      select: { id: true, email: true, role: true },
    });
    if (!target) return { error: "User not found." };

    if (target.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
      if (superAdminCount <= 1) return { error: "At least one SUPER_ADMIN must remain." };
    }

    await recordAudit({
      action: "delete",
      entity: "AdminUser",
      entityId: target.id,
      userId: actor.id,
      metadata: { deletedEmail: target.email },
    });
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: target.id } }),
      prisma.adminUser.delete({ where: { id: target.id } }),
    ]);
    revalidatePath("/manage/users");
    return { success: "User deleted." };
  } catch (error) {
    console.error("[manage/users] delete failed", error);
    return { error: "Could not delete user." };
  }
}
