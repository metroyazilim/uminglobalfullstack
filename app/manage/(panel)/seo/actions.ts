"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { findSitePage, isSitePageKey } from "@/lib/site-pages";
import { IMAGE_REF_MESSAGE, isAllowedImageRef } from "@/lib/image-url";

export type SeoActionState = { error?: string; success?: string };
export type WorkspaceActionResult = { ok: boolean; message: string };

const seoSchema = z.object({
  title: z.string().trim().max(70, "Keep the SEO title under 70 characters.").optional().or(z.literal("")),
  description: z.string().trim().max(200, "Keep the meta description under 200 characters.").optional().or(z.literal("")),
  ogTitle: z.string().trim().max(70).optional().or(z.literal("")),
  ogDescription: z.string().trim().max(200).optional().or(z.literal("")),
  ogImage: z.string().trim().refine(isAllowedImageRef, IMAGE_REF_MESSAGE).optional().or(z.literal("")),
});

const pageDraftSchema = z.object({
  title: z.string().trim().max(70, "Keep the SEO title under 70 characters."),
  description: z.string().trim().max(200, "Keep the meta description under 200 characters."),
  ogImage: z.string().trim().refine(isAllowedImageRef, IMAGE_REF_MESSAGE),
});

const postDraftSchema = z.object({
  title: z.string().trim().max(70, "Keep the SEO title under 70 characters."),
  description: z.string().trim().max(200, "Keep the meta description under 200 characters."),
});

const organizationSchema = z.object({
  organizationName: z.string().trim().max(160),
  legalName: z.string().trim().max(160),
  alternateName: z.string().trim().max(160),
  slogan: z.string().trim().max(240),
  description: z.string().trim().max(1000),
  foundingDate: z.string().trim().max(40),
  locality: z.string().trim().max(160),
  countryCode: z.string().trim().refine((value) => value === "" || /^[A-Z]{2}$/.test(value), "Country code must be two uppercase letters."),
  email: z.string().trim().refine((value) => value === "" || z.string().email().safeParse(value).success, "Enter a valid email address."),
  phone: z.string().trim().max(80),
});

const socialUrlSchema = z.string().trim().refine((value) => {
  if (value === "") return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}, "Enter a valid http:// or https:// URL.");

const socialsSchema = z.object({
  linkedin: socialUrlSchema,
  x: socialUrlSchema,
  facebook: socialUrlSchema,
  instagram: socialUrlSchema,
  youtube: socialUrlSchema,
});

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function nullableOr(value: string): string | null {
  return value.length > 0 ? value : null;
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form fields.";
}

export async function saveSeoOverrideAction(key: string, _previous: SeoActionState, formData: FormData): Promise<SeoActionState> {
  const session = await requireAdmin();
  const entry = findSitePage(key);
  if (!isSitePageKey(key) || !entry) return { error: "Unknown page." };

  const input = seoSchema.safeParse({
    title: text(formData, "title"),
    description: text(formData, "description"),
    ogTitle: text(formData, "ogTitle"),
    ogDescription: text(formData, "ogDescription"),
    ogImage: text(formData, "ogImage"),
  });
  if (!input.success) return { error: firstIssue(input.error) };

  await prisma.pageSeo.upsert({
    where: { key },
    create: {
      key,
      title: nullableOr(input.data.title ?? ""),
      description: nullableOr(input.data.description ?? ""),
      ogTitle: nullableOr(input.data.ogTitle ?? ""),
      ogDescription: nullableOr(input.data.ogDescription ?? ""),
      ogImage: nullableOr(input.data.ogImage ?? ""),
      updatedById: session.id,
    },
    update: {
      title: nullableOr(input.data.title ?? ""),
      description: nullableOr(input.data.description ?? ""),
      ogTitle: nullableOr(input.data.ogTitle ?? ""),
      ogDescription: nullableOr(input.data.ogDescription ?? ""),
      ogImage: nullableOr(input.data.ogImage ?? ""),
      updatedById: session.id,
    },
  });

  await recordAudit({ action: "update", entity: "PageSeo", entityId: key, userId: session.id });
  revalidatePath("/manage/seo");
  revalidatePath(`/manage/seo/${key}`);
  revalidatePath("/manage/pages");
  revalidatePath(entry.path);
  return { success: "SEO settings saved. Live on the site now." };
}

export async function resetSeoOverrideAction(key: string): Promise<SeoActionState> {
  const session = await requireAdmin();
  const entry = findSitePage(key);
  if (!isSitePageKey(key) || !entry) return { error: "Unknown page." };

  await prisma.pageSeo.deleteMany({ where: { key } });
  await recordAudit({ action: "reset", entity: "PageSeo", entityId: key, userId: session.id });
  revalidatePath("/manage/seo");
  revalidatePath(`/manage/seo/${key}`);
  revalidatePath("/manage/pages");
  revalidatePath(entry.path);
  return { success: "Reverted to the page's shipped defaults." };
}

export async function savePageSeoAction(
  key: string,
  draft: { title: string; description: string; ogImage: string },
): Promise<WorkspaceActionResult> {
  const session = await requireAdmin();
  const entry = findSitePage(key);
  if (!isSitePageKey(key) || !entry) return { ok: false, message: "Unknown page." };
  const input = pageDraftSchema.safeParse(draft);
  if (!input.success) return { ok: false, message: firstIssue(input.error) };

  try {
    await prisma.pageSeo.upsert({
      where: { key },
      create: {
        key,
        title: nullableOr(input.data.title),
        description: nullableOr(input.data.description),
        ogTitle: null,
        ogDescription: null,
        ogImage: nullableOr(input.data.ogImage),
        updatedById: session.id,
      },
      update: {
        title: nullableOr(input.data.title),
        description: nullableOr(input.data.description),
        ogTitle: null,
        ogDescription: null,
        ogImage: nullableOr(input.data.ogImage),
        updatedById: session.id,
      },
    });
    await recordAudit({ action: "update", entity: "PageSeo", entityId: key, userId: session.id });
    revalidatePath("/manage/seo");
    revalidatePath("/manage/pages");
    revalidatePath(entry.path);
    return { ok: true, message: "Page SEO saved. It is live on the site now." };
  } catch {
    return { ok: false, message: "Page SEO could not be saved. Please try again." };
  }
}

export async function savePostSeoAction(
  id: string,
  draft: { title: string; description: string },
): Promise<WorkspaceActionResult> {
  const session = await requireAdmin();
  const idInput = z.string().trim().min(1).safeParse(id);
  const input = postDraftSchema.safeParse(draft);
  if (!idInput.success || !input.success) {
    return { ok: false, message: input.success ? "Unknown post." : firstIssue(input.error) };
  }

  try {
    const post = await prisma.post.update({
      where: { id: idInput.data },
      data: {
        metaTitle: input.data.title,
        description: input.data.description,
        version: { increment: 1 },
      },
      select: { slug: true, version: true },
    });
    await recordAudit({
      action: "update",
      entity: "Post",
      entityId: idInput.data,
      userId: session.id,
      metadata: { slug: post.slug, version: post.version, source: "seo-workspace" },
    });
    revalidatePath("/manage/seo");
    revalidatePath("/manage/posts");
    revalidatePath(`/manage/posts/${idInput.data}`);
    revalidatePath("/insights");
    revalidatePath(`/insights/${post.slug}`);
    return { ok: true, message: "Insight SEO saved. It is live on the site now." };
  } catch {
    return { ok: false, message: "Insight SEO could not be saved. Please try again." };
  }
}

export async function saveSiteSettingsAction(
  organization: Record<string, string>,
  socials: Record<string, string>,
): Promise<WorkspaceActionResult> {
  const session = await requireAdmin();
  const organizationInput = organizationSchema.safeParse(organization);
  const socialsInput = socialsSchema.safeParse(socials);
  if (!organizationInput.success) return { ok: false, message: firstIssue(organizationInput.error) };
  if (!socialsInput.success) return { ok: false, message: firstIssue(socialsInput.error) };

  const values = organizationInput.data;
  const socialValues = socialsInput.data;
  try {
    await prisma.siteSettings.upsert({
      where: { singleton: true },
      create: {
        singleton: true,
        organizationName: nullableOr(values.organizationName),
        legalName: nullableOr(values.legalName),
        alternateName: nullableOr(values.alternateName),
        slogan: nullableOr(values.slogan),
        description: nullableOr(values.description),
        foundingDate: nullableOr(values.foundingDate),
        locality: nullableOr(values.locality),
        countryCode: nullableOr(values.countryCode),
        email: nullableOr(values.email),
        phone: nullableOr(values.phone),
        linkedin: nullableOr(socialValues.linkedin),
        x: nullableOr(socialValues.x),
        facebook: nullableOr(socialValues.facebook),
        instagram: nullableOr(socialValues.instagram),
        youtube: nullableOr(socialValues.youtube),
        updatedById: session.id,
      },
      update: {
        organizationName: nullableOr(values.organizationName),
        legalName: nullableOr(values.legalName),
        alternateName: nullableOr(values.alternateName),
        slogan: nullableOr(values.slogan),
        description: nullableOr(values.description),
        foundingDate: nullableOr(values.foundingDate),
        locality: nullableOr(values.locality),
        countryCode: nullableOr(values.countryCode),
        email: nullableOr(values.email),
        phone: nullableOr(values.phone),
        linkedin: nullableOr(socialValues.linkedin),
        x: nullableOr(socialValues.x),
        facebook: nullableOr(socialValues.facebook),
        instagram: nullableOr(socialValues.instagram),
        youtube: nullableOr(socialValues.youtube),
        updatedById: session.id,
      },
    });
    await recordAudit({ action: "update", entity: "SiteSettings", userId: session.id });
    revalidatePath("/", "layout");
    revalidatePath("/manage/seo");
    return { ok: true, message: "Organisation details saved. They are live across the site now." };
  } catch {
    return { ok: false, message: "Organisation details could not be saved. Please try again." };
  }
}
