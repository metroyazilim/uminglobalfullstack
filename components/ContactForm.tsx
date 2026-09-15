"use client";

// Enquiry form. The need selector mirrors how work is routed internally, so the first reply can
// be specific instead of asking what you meant.
//
// Submission posts to /api/contact, which sends the mail over SMTP. It used to compose a mailto:
// link instead: that only works for a visitor with a configured mail client, and for everyone
// else the enquiry was simply lost. The form keeps its values on failure so nothing typed is
// thrown away, and the email address stays visible as the fallback route.
import { useState, type FormEvent } from "react";
import ArrowRightIcon from "./icons/ArrowRightIcon";

const NEEDS = [
  "Technology & AI",
  "Growth & Marketing",
  "UMIN AI",
  "Growth Partnership",
  "Complete Package",
  "Venture idea",
];

const FIELD =
  "w-full rounded-control border border-divider bg-white px-5 py-3.5 t-body text-ink transition-colors duration-200 placeholder:text-body/70 hover:border-accent/40";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ state: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          country: data.get("country"),
          need: data.get("need"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!response.ok || !body.ok) {
        setStatus({
          state: "error",
          message: body.error ?? "The message could not be sent. Email info@uminglobal.com instead.",
        });
        return;
      }

      form.reset();
      setStatus({ state: "sent" });
    } catch {
      setStatus({
        state: "error",
        message: "No connection to the server. Email info@uminglobal.com instead.",
      });
    }
  };

  const sending = status.state === "sending";

  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-label">Name</span>
        <input type="text" name="name" placeholder="Your name" autoComplete="name" required className={FIELD} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-label">Email</span>
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          className={FIELD}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-label">Company</span>
        <input type="text" name="company" placeholder="Company name" autoComplete="organization" className={FIELD} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-label">Country</span>
        <input type="text" name="country" placeholder="Where you operate" className={FIELD} />
      </label>
      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="t-eyebrow text-label">What do you need?</span>
        <select name="need" defaultValue="" className={FIELD} aria-label="What do you need?">
          <option value="" disabled>
            Select one
          </option>
          {NEEDS.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="t-eyebrow text-label">Message</span>
        <textarea
          name="message"
          placeholder="Where the business is today, and where it needs to be"
          rows={6}
          required
          className={FIELD}
        />
      </label>

      {/* Honeypot: off-screen and hidden from assistive tech, so only a bot fills it. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2.5 self-start rounded-control border-2 border-accent bg-accent px-7 py-4 text-[15px] font-semibold leading-[20px] text-white transition-colors duration-200 hover:border-brand-hover hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Sending…" : "Start a Project"}
          {!sending && <ArrowRightIcon className="h-[15px] w-[15px]" />}
        </button>

        {status.state === "sent" && (
          <p role="status" className="t-small font-medium text-ink">
            Sent. We reply from New York within one business day.
          </p>
        )}
        {status.state === "error" && (
          <p role="alert" className="t-small font-medium text-accent">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
