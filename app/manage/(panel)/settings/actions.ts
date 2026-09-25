"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit, requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sendMailOrThrow, verifyMailConnection } from "@/lib/mail";
import { sealSecret } from "@/lib/secret-box";

export type EmailActionState = { ok: boolean | null; message: string };

function blankAsUndefined(value: unknown): unknown {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

const optionalEmail = z.preprocess(
  blankAsUndefined,
  z.string().trim().email("Enter a valid email address.").optional(),
);

const EmailSettingsSchema = z.object({
  host: z.preprocess(
    blankAsUndefined,
    z
      .string()
      .trim()
      .max(253, "SMTP host is too long.")
      .regex(
        /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)*[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i,
        "Enter a valid SMTP hostname.",
      )
      .optional(),
  ),
  port: z.preprocess(
    blankAsUndefined,
    z.coerce.number().int("Port must be a whole number.").min(1, "Port must be at least 1.").max(65_535, "Port must be at most 65535.").optional(),
  ),
  secure: z.boolean(),
  user: z.preprocess(
    blankAsUndefined,
    z.string().trim().max(320, "SMTP username is too long.").optional(),
  ),
  password: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.string().max(1_000, "SMTP password is too long.").optional(),
  ),
  from: optionalEmail,
  contactTo: optionalEmail,
});

const RecipientSchema = z.object({
  recipient: z.string().trim().email("Enter a valid recipient email address."),
});

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form and try again.";
}

export async function saveEmailSettingsAction(
  _previous: EmailActionState,
  formData: FormData,
): Promise<EmailActionState> {
  const actor = await requireSuperAdmin();
  const input = EmailSettingsSchema.safeParse({
    host: formData.get("host"),
    port: formData.get("port"),
    secure: formData.get("secure") === "on",
    user: formData.get("user"),
    password: formData.get("password"),
    from: formData.get("from"),
    contactTo: formData.get("contactTo"),
  });
  if (!input.success) return { ok: false, message: firstIssue(input.error) };

  try {
    const passwordSealed = input.data.password ? sealSecret(input.data.password) : null;
    const passwordUpdate = passwordSealed ? { smtpPasswordEnc: passwordSealed } : {};
    await prisma.siteSettings.upsert({
      where: { singleton: true },
      create: {
        singleton: true,
        smtpHost: input.data.host ?? null,
        smtpPort: input.data.port ?? null,
        smtpSecure: input.data.secure,
        smtpUser: input.data.user ?? null,
        smtpPasswordEnc: passwordSealed,
        smtpFrom: input.data.from ?? null,
        contactTo: input.data.contactTo ?? null,
        updatedById: actor.id,
      },
      update: {
        smtpHost: input.data.host ?? null,
        smtpPort: input.data.port ?? null,
        smtpSecure: input.data.secure,
        smtpUser: input.data.user ?? null,
        smtpFrom: input.data.from ?? null,
        contactTo: input.data.contactTo ?? null,
        updatedById: actor.id,
        ...passwordUpdate,
      },
    });
    await recordAudit({
      action: "update",
      entity: "SiteSettings",
      userId: actor.id,
      metadata: { section: "email" },
    });
    revalidatePath("/manage/settings");
    return { ok: true, message: "Email settings saved." };
  } catch (error) {
    console.error("[manage/settings] email settings update failed", error instanceof Error ? error.message : error);
    return { ok: false, message: "Email settings could not be saved." };
  }
}

export async function clearEmailPasswordAction(): Promise<EmailActionState> {
  const actor = await requireSuperAdmin();

  try {
    await prisma.siteSettings.upsert({
      where: { singleton: true },
      create: {
        singleton: true,
        smtpPasswordEnc: null,
        updatedById: actor.id,
      },
      update: {
        smtpPasswordEnc: null,
        updatedById: actor.id,
      },
    });
    await recordAudit({
      action: "update",
      entity: "SiteSettings",
      userId: actor.id,
      metadata: { section: "email", field: "password", cleared: true },
    });
    revalidatePath("/manage/settings");
    return { ok: true, message: "Stored SMTP password cleared." };
  } catch (error) {
    console.error("[manage/settings] SMTP password clear failed", error instanceof Error ? error.message : error);
    return { ok: false, message: "The stored SMTP password could not be cleared." };
  }
}

export async function testMailConnectionAction(): Promise<EmailActionState> {
  await requireSuperAdmin();
  const result = await verifyMailConnection();
  if (!result.ok) return { ok: false, message: result.error };
  return {
    ok: true,
    message: `Connection succeeded using ${result.source} settings.`,
  };
}

export async function sendTestEmailAction(
  _previous: EmailActionState,
  formData: FormData,
): Promise<EmailActionState> {
  const actor = await requireSuperAdmin();
  const input = RecipientSchema.safeParse({ recipient: formData.get("recipient") });
  if (!input.success) return { ok: false, message: firstIssue(input.error) };

  let result: EmailActionState;
  try {
    await sendMailOrThrow({
      to: input.data.recipient,
      subject: "UMIN Global — SMTP test",
      text: "This is a test email from the UMIN Global admin panel. Your SMTP settings are working.",
      html: "<p>This is a test email from the UMIN Global admin panel.</p><p>Your SMTP settings are working.</p>",
    });
    result = { ok: true, message: `Test email sent to ${input.data.recipient}.` };
  } catch (error) {
    result = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  try {
    await recordAudit({
      action: "email.test",
      entity: "SiteSettings",
      userId: actor.id,
      metadata: { recipient: input.data.recipient, ok: result.ok },
    });
  } catch (error) {
    console.error("[manage/settings] email test audit failed", error instanceof Error ? error.message : error);
  }

  return result;
}
