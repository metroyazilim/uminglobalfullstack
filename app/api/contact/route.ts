import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

function requiredEnv() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);
  return {
    host,
    port,
    // Port 465 is implicit TLS; 587 and 25 start plaintext and upgrade with STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    user,
    pass,
    from: process.env.SMTP_FROM ?? user,
    // Where enquiries are read. Defaults to the authenticated mailbox, because that address is
    // guaranteed to exist on this SMTP account.
    to: process.env.CONTACT_TO ?? process.env.SMTP_USER ?? user,
  };
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

  const config = requiredEnv();
  if (!config) {
    console.error("Contact form: SMTP_HOST/SMTP_USER/SMTP_PASS are not configured");
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
      to: config.to,
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
