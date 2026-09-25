"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export type OfficeActionState = { error?: string; success?: string };

const idSchema = z.string().min(1);
const versionSchema = z.coerce.number().int().nonnegative();
const directionSchema = z.enum(["up", "down"]);
const archiveInputSchema = z.object({ id: idSchema, archived: z.boolean() });
const createInputSchema = z.object({});
const officeSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug can contain only lowercase letters, numbers, and hyphens."),
  city: z.string().trim().min(1, "City is required."),
  country: z.string().trim().min(1, "Country is required."),
  region: z.string().trim().min(1, "Region is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  detail: z.tuple([
    z.string().trim().min(1, "First detail paragraph is required."),
    z.string().trim().min(1, "Second detail paragraph is required."),
  ]),
  headquarters: z.boolean(),
  version: versionSchema,
});

function formText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseOfficeForm(formData: FormData) {
  return officeSchema.safeParse({
    slug: formText(formData, "slug"),
    city: formText(formData, "city"),
    country: formText(formData, "country"),
    region: formText(formData, "region"),
    summary: formText(formData, "summary"),
    detail: [formText(formData, "detail0"), formText(formData, "detail1")],
    headquarters: formData.get("headquarters") === "on",
    version: formText(formData, "version"),
  });
}

function validationError(result: { error: z.ZodError }): OfficeActionState {
  return { error: result.error.issues[0]?.message ?? "Check the fields and try again." };
}

function isSlugCollision(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function revalidateOffice(id: string): void {
  revalidatePath("/manage/offices");
  revalidatePath(`/manage/offices/${id}`);
}

function revalidatePublicOffice(slug: string): void {
  revalidatePath("/offices");
  revalidatePath(`/offices/${slug}`);
}

export async function createOfficeAction(): Promise<void> {
  const user = await requireAdmin();
  createInputSchema.parse({});

  const aggregate = await prisma.office.aggregate({ _max: { sortOrder: true } });
  const office = await prisma.office.create({
    data: {
      slug: `office-${randomUUID().slice(0, 8)}`,
      city: "",
      country: "",
      region: "",
      summary: "",
      detail: ["", ""],
      headquarters: false,
      sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
      status: "DRAFT",
    },
  });

  await recordAudit({ action: "create", entity: "Office", entityId: office.id, userId: user.id });
  revalidateOffice(office.id);
  redirect(`/manage/offices/${office.id}`);
}

export async function saveOfficeDraftAction(
  id: string,
  _previous: OfficeActionState,
  formData: FormData,
): Promise<OfficeActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsed = parseOfficeForm(formData);
  if (!parsedId.success) return { error: "Invalid office." };
  if (!parsed.success) return validationError(parsed);

  const { version, ...data } = parsed.data;
  try {
    const result = await prisma.office.updateMany({
      where: { id: parsedId.data, version },
      data: { ...data, status: "DRAFT", version: { increment: 1 } },
    });
    if (result.count !== 1) {
      return { error: "This record was changed while you were editing it. Refresh the page and try again." };
    }
    await recordAudit({ action: "update", entity: "Office", entityId: parsedId.data, userId: user.id });
  } catch (error) {
    if (isSlugCollision(error)) return { error: "This slug is already in use." };
    return { error: "Draft could not be saved." };
  }

  revalidateOffice(parsedId.data);
  revalidatePublicOffice(parsed.data.slug);
  return { success: "Draft saved." };
}

export async function publishOfficeAction(
  id: string,
  _previous: OfficeActionState,
  formData: FormData,
): Promise<OfficeActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsed = parseOfficeForm(formData);
  if (!parsedId.success) return { error: "Invalid office." };
  if (!parsed.success) return validationError(parsed);

  const { version, ...data } = parsed.data;
  try {
    const result = await prisma.office.updateMany({
      where: { id: parsedId.data, version },
      data: { ...data, status: "PUBLISHED", version: { increment: 1 } },
    });
    if (result.count !== 1) {
      return { error: "This record was changed while you were editing it. Refresh the page and try again." };
    }
    await recordAudit({ action: "publish", entity: "Office", entityId: parsedId.data, userId: user.id });
  } catch (error) {
    if (isSlugCollision(error)) return { error: "This slug is already in use." };
    return { error: "Office could not be published." };
  }

  revalidateOffice(parsedId.data);
  revalidatePublicOffice(parsed.data.slug);
  return { success: "Office published." };
}

export async function archiveOfficeAction(id: string, archived: boolean): Promise<OfficeActionState> {
  const user = await requireAdmin();
  const parsed = archiveInputSchema.safeParse({ id, archived });
  if (!parsed.success) return { error: "Invalid archive request." };

  let officeSlug = "";

  try {
    const office = await prisma.office.findUnique({
      where: { id: parsed.data.id },
      select: { version: true, slug: true },
    });
    if (!office) return { error: "Office not found." };
    officeSlug = office.slug;

    const result = await prisma.office.updateMany({
      where: { id: parsed.data.id, version: office.version },
      data: {
        status: parsed.data.archived ? "ARCHIVED" : "DRAFT",
        version: { increment: 1 },
      },
    });
    if (result.count !== 1) {
      return { error: "This record was changed while you were performing the action. Refresh the page and try again." };
    }
    await recordAudit({
      action: parsed.data.archived ? "archive" : "unarchive",
      entity: "Office",
      entityId: parsed.data.id,
      userId: user.id,
    });
  } catch {
    return { error: "Archiving could not be completed." };
  }

  revalidateOffice(parsed.data.id);
  revalidatePublicOffice(officeSlug);
  return { success: parsed.data.archived ? "Office archived." : "Office moved to draft." };
}

export async function deleteOfficeAction(id: string): Promise<OfficeActionState> {
  const user = await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid office." };

  let deletedSlug = "";

  try {
    const office = await prisma.office.findUnique({
      where: { id: parsedId.data },
      select: { status: true, version: true, slug: true },
    });
    if (!office) return { error: "Office not found." };
    if (office.status !== "ARCHIVED") return { error: "Archive it first." };

    const result = await prisma.office.deleteMany({
      where: { id: parsedId.data, version: office.version, status: "ARCHIVED" },
    });
    if (result.count !== 1) {
      return { error: "This record was changed while you were performing the action. Refresh the page and try again." };
    }
    await recordAudit({ action: "delete", entity: "Office", entityId: parsedId.data, userId: user.id });
    deletedSlug = office.slug;
  } catch {
    return { error: "Office could not be deleted." };
  }

  revalidateOffice(parsedId.data);
  revalidatePublicOffice(deletedSlug);
  redirect("/manage/offices");
}

export async function moveOfficeAction(id: string, direction: "up" | "down"): Promise<OfficeActionState> {
  const user = await requireAdmin();
  const parsed = z.object({ id: idSchema, direction: directionSchema }).safeParse({ id, direction });
  if (!parsed.success) return { error: "Invalid reorder request." };

  let adjacentId = "";
  let currentSlug = "";
  let adjacentSlug = "";
  try {
    const orderedOffices = await prisma.office.findMany({
      select: { id: true, slug: true, sortOrder: true },
      orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
    });
    const index = orderedOffices.findIndex((office) => office.id === parsed.data.id);
    const adjacentIndex = parsed.data.direction === "up" ? index - 1 : index + 1;
    if (index < 0 || adjacentIndex < 0 || adjacentIndex >= orderedOffices.length) {
      return { error: "Office cannot be moved in this direction." };
    }

    const current = orderedOffices[index];
    const adjacent = orderedOffices[adjacentIndex];
    adjacentId = adjacent.id;
    currentSlug = current.slug;
    adjacentSlug = adjacent.slug;
    await prisma.$transaction([
      prisma.office.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder, version: { increment: 1 } },
      }),
      prisma.office.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder, version: { increment: 1 } },
      }),
    ]);
    await recordAudit({
      action: "reorder",
      entity: "Office",
      entityId: current.id,
      userId: user.id,
      metadata: { direction: parsed.data.direction },
    });
  } catch {
    return { error: "Order could not be changed." };
  }

  revalidateOffice(parsed.data.id);
  revalidatePath(`/manage/offices/${adjacentId}`);
  revalidatePublicOffice(currentSlug);
  revalidatePath(`/offices/${adjacentSlug}`);
  return { success: "Order updated." };
}
