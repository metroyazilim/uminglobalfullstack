import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { openSecret } from "@/lib/secret-box";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  contactTo: string;
  source: "database" | "environment";
};

export type MailMessage = Readonly<{
  to: string;
  subject: string;
  text: string;
  html: string;
}>;

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function environmentConfig(): MailConfig | null {
  const host = nonEmpty(process.env.SMTP_HOST);
  const user = nonEmpty(process.env.SMTP_USER);
  const pass = process.env.SMTP_PASS && process.env.SMTP_PASS.length > 0
    ? process.env.SMTP_PASS
    : null;
  const port = Number.parseInt(process.env.SMTP_PORT?.trim() || "465", 10);

  if (!host || !user || !pass || !Number.isInteger(port) || port < 1 || port > 65_535) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE.trim().toLowerCase() === "true"
      : port === 465,
    user,
    pass,
    from: nonEmpty(process.env.SMTP_FROM) ?? user,
    contactTo: nonEmpty(process.env.CONTACT_TO) ?? user,
    source: "environment",
  };
}

export async function resolveMailConfig(): Promise<MailConfig | null> {
  if (hasDatabase()) {
    try {
      const row = await prisma.siteSettings.findUnique({
        where: { singleton: true },
        select: {
          smtpHost: true,
          smtpPort: true,
          smtpSecure: true,
          smtpUser: true,
          smtpPasswordEnc: true,
          smtpFrom: true,
          contactTo: true,
          email: true,
        },
      });
      const host = nonEmpty(row?.smtpHost);
      const user = nonEmpty(row?.smtpUser);

      if (row && host && user) {
        const storedPass = openSecret(row.smtpPasswordEnc);
        const pass = storedPass && storedPass.length > 0
          ? storedPass
          : process.env.SMTP_PASS && process.env.SMTP_PASS.length > 0
            ? process.env.SMTP_PASS
            : null;
        if (pass) {
          const port =
            row.smtpPort && row.smtpPort >= 1 && row.smtpPort <= 65_535
              ? row.smtpPort
              : 465;
          return {
            host,
            port,
            secure: row.smtpSecure ?? port === 465,
            user,
            pass,
            from: nonEmpty(row.smtpFrom) ?? user,
            contactTo:
              nonEmpty(row.contactTo) ??
              nonEmpty(row.email) ??
              nonEmpty(process.env.CONTACT_TO) ??
              user,
            source: "database",
          };
        }
      }
    } catch (error) {
      console.error(
        "[mail] database configuration could not be read; falling back to environment",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return environmentConfig();
}

function createTransport(config: MailConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
}

export async function isMailConfigured(): Promise<boolean> {
  return (await resolveMailConfig()) !== null;
}

async function deliverMail(message: MailMessage): Promise<void> {
  const config = await resolveMailConfig();
  if (!config) throw new Error("Mail is not configured on the server.");

  await createTransport(config).sendMail({
    from: config.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

export async function sendMail(message: MailMessage): Promise<boolean> {
  try {
    await deliverMail(message);
    return true;
  } catch (error) {
    console.error("[mail] send failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function sendMailOrThrow(message: MailMessage): Promise<void> {
  await deliverMail(message);
}

export async function verifyMailConnection(): Promise<
  { ok: true; source: MailConfig["source"] } | { ok: false; error: string }
> {
  const config = await resolveMailConfig();
  if (!config) return { ok: false, error: "Mail is not configured on the server." };

  try {
    await createTransport(config).verify();
    return { ok: true, source: config.source };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
