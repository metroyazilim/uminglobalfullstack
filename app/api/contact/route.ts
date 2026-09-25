import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { resolveMailConfig } from "@/lib/mail";

// The contact form used to hand the visitor a mailto: link, which only works if they have a mail
// client configured and silently loses the enquiry if they do not. This route sends the mail
// itself over SMTP, so a submission lands in the inbox regardless of the visitor's setup.
//
// Node runtime, not Edge: SMTP needs raw TCP, which the Edge runtime does not provide.
export const runtime = "nodejs";
// Nothing here is cacheable - each request has to actually send.
export const dynamic = "force-dynamic";

const MAX = { name: 120, email: 160, company: 160, country: 120, need: 60, message: 4000 } as const;

type Field = keyof typeof MAX;

function clean(value: unknown, field: Field): string {
  if (typeof value !== "string") return "";
  // Collapse CR/LF in the short fields: they end up in mail headers (subject, reply-to), where a
  // newline is a header-injection vector.
  const single = field === "message" ? value : value.replace(/[\r\n]+/g, " ");
  return single.trim().slice(0, MAX[field]);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field they find. This one is hidden from people, so anything in it is spam
  // and is answered with a success response so the sender learns nothing.
  if (clean(payload.website, "name")) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, "name");
  const email = clean(payload.email, "email");
  const company = clean(payload.company, "company");
  const country = clean(payload.country, "country");
  const need = clean(payload.need, "need");
  const message = clean(payload.message, "message");

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) missing.push("email");
  if (message.length < 10) missing.push("message");
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: "Please add your name, a valid email address and a short message.", missing },
      { status: 422 },
    );
  }
  if (hasDatabase()) {
    try {
      await prisma.contactMessage.create({
        data: { name, email, company, country, need, message },
      });
    } catch (error) {
      console.error("Contact form: database write failed", error);
    }
  }

  const config = await resolveMailConfig();
  if (!config) {
    console.error("Contact form: mail is not configured");
    return NextResponse.json(
      { ok: false, error: "Mail is not configured on the server. Email info@uminglobal.com instead." },
      { status: 503 },
    );
  }

  const lines = [
    `Name:     ${name}`,
    `Email:    ${email}`,
    company ? `Company:  ${company}` : null,
    country ? `Country:  ${country}` : null,
    need ? `Needs:    ${need}` : null,
    "",
    message,
  ].filter((line) => line !== null);

  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });

    await transport.sendMail({
      from: `UMIN Global Website <${config.from}>`,
      to: config.contactTo,
      // The envelope sender stays the authenticated mailbox so SPF/DKIM still pass; the visitor's
      // address goes in Reply-To, which is what makes replying to the enquiry work.
      replyTo: `${name} <${email}>`,
      subject: `New enquiry${need ? ` · ${need}` : ""} — ${name}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("Contact form: SMTP send failed", error);
    return NextResponse.json(
      { ok: false, error: "The message could not be sent. Email info@uminglobal.com instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
