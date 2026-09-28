"use server";

import { Prisma, type ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type PostActionState = {
  error?: string;
  success?: string;
  id?: string;
  version?: number;
  status?: ContentStatus;
  deleted?: boolean;
};

const createSchema = z.object({ intent: z.literal("create") });
const identitySchema = z.object({
  id: z.string().min(1),
  version: z.coerce.number().int().nonnegative(),
});
const blockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lead"), text: z.string().min(1) }),
  z.object({ kind: z.literal("p"), text: z.string().min(1) }),
  z.object({ kind: z.literal("h2"), text: z.string().min(1) }),
  z.object({ kind: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ kind: z.literal("callout"), text: z.string().min(1) }),
  z.object({ kind: z.literal("image"), src: z.string().trim().min(1), alt: z.string().trim().min(1), caption: z.string().trim().optional() }),
]);

const bodySchema = z.array(blockSchema);
const relatedSchema = z.array(
  z.object({
    label: z.string().trim().min(1, "Related link label is required."),
    href: z.string().trim().min(1, "Related link URL is required."),
  }),
);
const keywordsSchema = z.array(z.string().trim().min(1));

function parseJson(value: string, context: z.RefinementCtx): unknown {
  try {
    return JSON.parse(value);
  } catch {
    context.addIssue({ code: "custom", message: "Invalid JSON data." });
    return z.NEVER;
  }
}

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, "Select a valid date.")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

const postSchema = z.object({
  id: z.string().min(1),
  version: z.coerce.number().int().nonnegative(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(240)
    .transform(slugify)
    .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Slug must contain lowercase letters, numbers, and hyphens.")
    .refine((value) => value.length > 0, "Slug must contain at least one letter or number."),
  title: z.string().trim().min(1, "Title is required.").max(240),
  metaTitle: z.string().trim().min(1, "Meta title is required.").max(240),
  description: z.string().trim().min(1, "Description is required.").max(1000),
  excerpt: z.string().trim().min(1, "Excerpt is required.").max(1000),
  date: dateSchema,
  dateDisplay: z.string().trim().min(1, "Display date is required.").max(120),
  updated: z
    .string()
    .trim()
    .max(120)
    .transform((value) => value || null),
  readingMinutes: z.coerce.number().int().min(1, "Reading time must be at least 1 minute."),
  topic: z.string().trim().min(1, "Topic is required.").max(160),
  keywords: z.string().transform(parseJson).pipe(keywordsSchema),
  image: z.string().trim().min(1, "Image URL is required.").max(2000),
  imageAlt: z.string().trim().min(1, "Image alt text is required.").max(500),
  ogTitle: z.string().trim().min(1, "Social title is required.").max(240),
  ogSubtitle: z.string().trim().min(1, "Social subtitle is required.").max(500),
  body: z.string().transform(parseJson).pipe(bodySchema),
  related: z.string().transform(parseJson).pipe(relatedSchema),
});

type ValidPostInput = z.infer<typeof postSchema>;

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function postInput(formData: FormData): Record<keyof z.input<typeof postSchema>, string> {
  return {
    id: formValue(formData, "id"),
    version: formValue(formData, "version"),
    slug: formValue(formData, "slug"),
    title: formValue(formData, "title"),
    metaTitle: formValue(formData, "metaTitle"),
    description: formValue(formData, "description"),
    excerpt: formValue(formData, "excerpt"),
    date: formValue(formData, "date"),
    dateDisplay: formValue(formData, "dateDisplay"),
    updated: formValue(formData, "updated"),
    readingMinutes: formValue(formData, "readingMinutes"),
    topic: formValue(formData, "topic"),
    keywords: formValue(formData, "keywords"),
    image: formValue(formData, "image"),
    imageAlt: formValue(formData, "imageAlt"),
    ogTitle: formValue(formData, "ogTitle"),
    ogSubtitle: formValue(formData, "ogSubtitle"),
    body: formValue(formData, "body"),
    related: formValue(formData, "related"),
  };
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form fields.";
}

function mutationError(error: unknown): PostActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { error: "This slug is already used by another post." };
  }
  return { error: "The action could not be completed. Please try again." };
}

function revalidatePost(id: string): void {
  revalidatePath("/manage/posts");
  revalidatePath(`/manage/posts/${id}`);
}

function revalidatePublicPost(slug: string): void {
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
}

async function savePost(input: ValidPostInput, status: Extract<ContentStatus, "PUBLISHED"> | undefined, userId: string): Promise<PostActionState> {
  const slug = input.slug.startsWith("post-") ? slugify(input.title) || input.slug : input.slug;
  try {
    const result = await prisma.post.updateMany({
      where: { id: input.id, version: input.version },
      data: {
        slug,
        title: input.title,
        metaTitle: input.metaTitle,
        description: input.description,
        excerpt: input.excerpt,
        date: input.date,
        dateDisplay: input.dateDisplay,
        updated: input.updated,
        readingMinutes: input.readingMinutes,
        topic: input.topic,
        keywords: input.keywords,
        image: input.image,
        imageAlt: input.imageAlt,
        ogTitle: input.ogTitle,
        ogSubtitle: input.ogSubtitle,
        body: input.body,
        related: input.related,
        ...(status ? { status } : {}),
        version: { increment: 1 },
      },
    });

    if (result.count !== 1) return { error: "Post was modified in another session. Refresh the page and try again." };

    const version = input.version + 1;
    await recordAudit({
      action: status === "PUBLISHED" ? "publish" : "update",
      entity: "Post",
      entityId: input.id,
      userId,
      metadata: { slug, ...(status ? { status } : {}), version },
    });
    revalidatePost(input.id);
    revalidatePublicPost(slug);
    return {
      success: status === "PUBLISHED" ? "Post published." : "Draft saved.",
      id: input.id,
      version,
      ...(status ? { status } : {}),
    };
  } catch (error) {
    return mutationError(error);
  }
}

export async function createPostAction(_previous: PostActionState, formData: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  const parsed = createSchema.safeParse({ intent: formValue(formData, "intent") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    const post = await prisma.post.create({
      data: {
        slug: `post-${crypto.randomUUID().slice(0, 8)}`,
        title: "",
        metaTitle: "",
        description: "",
        excerpt: "",
        date: new Date(),
        dateDisplay: "",
        updated: null,
        readingMinutes: 1,
        topic: "",
        keywords: [],
        image: "",
        imageAlt: "",
        ogTitle: "",
        ogSubtitle: "",
        body: [],
        related: [],
      },
    });

    await recordAudit({ action: "create", entity: "Post", entityId: post.id, userId: admin.id, metadata: { slug: post.slug } });
    revalidatePost(post.id);
    return { success: "New post draft created.", id: post.id, version: post.version, status: post.status };
  } catch (error) {
    return mutationError(error);
  }
}

export async function savePostDraftAction(_previous: PostActionState, formData: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  const parsed = postSchema.safeParse(postInput(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  return savePost(parsed.data, undefined, admin.id);
}

export async function publishPostAction(_previous: PostActionState, formData: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  const parsed = postSchema.safeParse(postInput(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  return savePost(parsed.data, "PUBLISHED", admin.id);
}

export async function togglePostArchiveAction(_previous: PostActionState, formData: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  const parsed = identitySchema.safeParse({ id: formValue(formData, "id"), version: formValue(formData, "version") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    const current = await prisma.post.findUnique({ where: { id: parsed.data.id }, select: { status: true, slug: true } });
    if (!current) return { error: "Post not found." };

    const status: ContentStatus = current.status === "ARCHIVED" ? "DRAFT" : "ARCHIVED";
    const result = await prisma.post.updateMany({
      where: { id: parsed.data.id, version: parsed.data.version, status: current.status },
      data: { status, version: { increment: 1 } },
    });
    if (result.count !== 1) {
      return { error: "Post was modified in another session. Refresh the page and try again." };
    }

    const version = parsed.data.version + 1;
    await recordAudit({
      action: status === "ARCHIVED" ? "archive" : "unarchive",
      entity: "Post",
      entityId: parsed.data.id,
      userId: admin.id,
      metadata: { previousStatus: current.status, status, version },
    });
    revalidatePost(parsed.data.id);
    revalidatePublicPost(current.slug);
    return {
      success: status === "ARCHIVED" ? "Post archived." : "Post unarchived.",
      id: parsed.data.id,
      version,
      status,
    };
  } catch (error) {
    return mutationError(error);
  }
}

export async function deleteArchivedPostAction(_previous: PostActionState, formData: FormData): Promise<PostActionState> {
  const admin = await requireAdmin();
  const parsed = identitySchema.safeParse({ id: formValue(formData, "id"), version: formValue(formData, "version") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    const current = await prisma.post.findUnique({ where: { id: parsed.data.id }, select: { slug: true } });
    if (!current) {
      return { error: "Only the current archived post can be deleted." };
    }

    const result = await prisma.post.deleteMany({ where: { id: parsed.data.id, version: parsed.data.version, status: "ARCHIVED" } });
    if (result.count !== 1) {
      return { error: "Only the current archived post can be deleted." };
    }

    await recordAudit({ action: "delete", entity: "Post", entityId: parsed.data.id, userId: admin.id });
    revalidatePost(parsed.data.id);
    revalidatePublicPost(current.slug);
    return { success: "Post permanently deleted.", id: parsed.data.id, deleted: true };
  } catch (error) {
    return mutationError(error);
  }
}
