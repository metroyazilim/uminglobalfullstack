"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { IMAGE_REF_MESSAGE, isAllowedImageRef } from "@/lib/image-url";

type ActionState = { error?: string; success?: string };

const idSchema = z.string().min(1);
const directionSchema = z.enum(["up", "down"]);
const archiveInputSchema = z.object({ id: idSchema, archived: z.boolean() });
const createInputSchema = z.object({});
const worksOnItemSchema = z.object({
  label: z.string().trim(),
  href: z.string().trim(),
});
const teamMemberSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  name: z.string().trim().min(1, "Full name is required."),
  role: z.string().trim().min(1, "Role is required."),
  photo: z.string().trim().refine(isAllowedImageRef, IMAGE_REF_MESSAGE),
  photoAlt: z.string().trim(),
  bioShort: z.string().trim(),
  bio: z.array(z.string()),
  worksOn: z.array(worksOnItemSchema),
});


function formText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function parseTeamMemberForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    slug: formText(formData, "slug"),
    name: formText(formData, "name"),
    role: formText(formData, "role"),
    photo: formText(formData, "photo"),
    photoAlt: formText(formData, "photoAlt"),
    bioShort: formText(formData, "bioShort"),
    bio: parseJson(formText(formData, "bio")),
    worksOn: parseJson(formText(formData, "worksOn")),
  });
}

function validationError(result: { error: z.ZodError }): ActionState {
  return { error: result.error.issues[0]?.message ?? "Check the fields and try again." };
}

function isSlugCollision(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function revalidateTeamMember(id: string): void {
  revalidatePath("/manage/team");
  revalidatePath(`/manage/team/${id}`);
}

function revalidatePublicTeamMember(slug: string): void {
  revalidatePath("/team");
  revalidatePath(`/team/${slug}`);
}

export async function createTeamMemberAction(): Promise<void> {
  const user = await requireAdmin();
  createInputSchema.parse({});

  const aggregate = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });
  const member = await prisma.teamMember.create({
    data: {
      slug: `member-${randomUUID().slice(0, 8)}`,
      name: "",
      role: "",
      photo: "",
      photoAlt: "",
      bioShort: "",
      bio: [],
      worksOn: [],
      sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
      status: "DRAFT",
    },
  });

  await recordAudit({ action: "create", entity: "TeamMember", entityId: member.id, userId: user.id });
  revalidatePath("/manage/team");
  redirect(`/manage/team/${member.id}`);
}

export async function saveTeamMemberDraftAction(id: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsed = parseTeamMemberForm(formData);
  if (!parsedId.success) return { error: "Invalid team member." };
  if (!parsed.success) return validationError(parsed);

  try {
    await prisma.teamMember.update({
      where: { id: parsedId.data },
      data: { ...parsed.data, version: { increment: 1 } },
    });
    await recordAudit({ action: "update", entity: "TeamMember", entityId: parsedId.data, userId: user.id });
  } catch (error) {
    if (isSlugCollision(error)) return { error: "This slug is already in use." };
    return { error: "Draft could not be saved." };
  }

  revalidateTeamMember(parsedId.data);
  revalidatePublicTeamMember(parsed.data.slug);
  return { success: "Draft saved." };
}

export async function publishTeamMemberAction(id: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsed = parseTeamMemberForm(formData);
  if (!parsedId.success) return { error: "Invalid team member." };
  if (!parsed.success) return validationError(parsed);

  try {
    await prisma.teamMember.update({
      where: { id: parsedId.data },
      data: { ...parsed.data, status: "PUBLISHED", version: { increment: 1 } },
    });
    await recordAudit({ action: "publish", entity: "TeamMember", entityId: parsedId.data, userId: user.id });
  } catch (error) {
    if (isSlugCollision(error)) return { error: "This slug is already in use." };
    return { error: "Team member could not be published." };
  }

  revalidateTeamMember(parsedId.data);
  revalidatePublicTeamMember(parsed.data.slug);
  return { success: "Team member published." };
}

export async function archiveTeamMemberAction(id: string, archived: boolean): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = archiveInputSchema.safeParse({ id, archived });
  if (!parsed.success) return { error: "Invalid archive request." };

  let memberSlug = "";

  try {
    const member = await prisma.teamMember.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.archived ? "ARCHIVED" : "DRAFT",
        version: { increment: 1 },
      },
      select: { slug: true },
    });
    await recordAudit({
      action: parsed.data.archived ? "archive" : "unarchive",
      entity: "TeamMember",
      entityId: parsed.data.id,
      userId: user.id,
    });
    memberSlug = member.slug;
  } catch {
    return { error: "Archiving could not be completed." };
  }

  revalidateTeamMember(parsed.data.id);
  revalidatePublicTeamMember(memberSlug);
  return { success: parsed.data.archived ? "Team member archived." : "Team member moved to draft." };
}

export async function deleteTeamMemberAction(id: string): Promise<ActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid team member." };

  let deletedSlug = "";

  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: parsedId.data },
      select: { status: true, slug: true },
    });
    if (!member) return { error: "Team member not found." };
    if (member.status !== "ARCHIVED") return { error: "Archive it first." };

    await prisma.teamMember.delete({ where: { id: parsedId.data } });
    await recordAudit({ action: "delete", entity: "TeamMember", entityId: parsedId.data, userId: user.id });
    deletedSlug = member.slug;
  } catch {
    return { error: "Team member could not be deleted." };
  }

  revalidatePath("/manage/team");
  revalidatePublicTeamMember(deletedSlug);
  redirect("/manage/team");
}

export async function moveTeamMemberAction(id: string, direction: "up" | "down"): Promise<ActionState> {
  const user = await requireAdmin();
  const parsed = z.object({ id: idSchema, direction: directionSchema }).safeParse({ id, direction });
  if (!parsed.success) return { error: "Invalid reorder request." };

  let currentSlug = "";
  let adjacentSlug = "";

  try {
    const orderedMembers = await prisma.teamMember.findMany({
      select: { id: true, slug: true, sortOrder: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    const index = orderedMembers.findIndex((member) => member.id === parsed.data.id);
    const adjacentIndex = parsed.data.direction === "up" ? index - 1 : index + 1;
    if (index < 0 || adjacentIndex < 0 || adjacentIndex >= orderedMembers.length) {
      return { error: "Team member cannot be moved in this direction." };
    }

    const current = orderedMembers[index];
    const adjacent = orderedMembers[adjacentIndex];
    currentSlug = current.slug;
    adjacentSlug = adjacent.slug;
    await prisma.$transaction([
      prisma.teamMember.update({ where: { id: current.id }, data: { sortOrder: adjacent.sortOrder } }),
      prisma.teamMember.update({ where: { id: adjacent.id }, data: { sortOrder: current.sortOrder } }),
    ]);
    await recordAudit({
      action: "reorder",
      entity: "TeamMember",
      entityId: current.id,
      userId: user.id,
      metadata: { direction: parsed.data.direction },
    });
  } catch {
    return { error: "Order could not be changed." };
  }

  revalidatePath("/manage/team");
  revalidatePublicTeamMember(currentSlug);
  revalidatePath(`/team/${adjacentSlug}`);
  return { success: "Order updated." };
}
