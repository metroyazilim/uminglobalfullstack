"use client";

// Enquiry form. The need selector mirrors how work is routed internally, so the first reply can
// be specific instead of asking what you meant. No backend on a static site, so submit composes
// a mailto: to info@uminglobal.com with every field folded into the body and opens the visitor's
// own mail client - the only send path that works without a server.
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

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const company = String(data.get("company") ?? "");
    const country = String(data.get("country") ?? "");
    const need = String(data.get("need") ?? "");
    const message = String(data.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `Country: ${country}`,
      `What they need: ${need}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:info@uminglobal.com?subject=${encodeURIComponent(
      `New enquiry from ${name || "the website"}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <label className= "flex flex-col gap-2">
        <span className= "t-eyebrow text-label">Name</span>
        <input type= "text" name= "name" placeholder= "Your name" className={FIELD} />
      </label>
      <label className= "flex flex-col gap-2">
        <span className= "t-eyebrow text-label">Email</span>
        <input type= "email" name= "email" placeholder= "you@company.com" className={FIELD} />
      </label>
      <label className= "flex flex-col gap-2">
        <span className= "t-eyebrow text-label">Company</span>
        <input type= "text" name= "company" placeholder= "Company name" className={FIELD} />
      </label>
      <label className= "flex flex-col gap-2">
        <span className= "t-eyebrow text-label">Country</span>
        <input type= "text" name= "country" placeholder= "Where you operate" className={FIELD} />
      </label>
      <label className= "flex flex-col gap-2 sm:col-span-2">
        <span className= "t-eyebrow text-label">What do you need?</span>
        <select name= "need" defaultValue= "" className={FIELD} aria-label= "What do you need? ">
          <option value= "" disabled>
            Select one
          </option>
          {NEEDS.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </label>
      <label className= "flex flex-col gap-2 sm:col-span-2">
        <span className= "t-eyebrow text-label">Message</span>
        <textarea
          name= "message"
          placeholder= "Where the business is today, and where it needs to be"
          rows={6}
          className={FIELD}
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2.5 self-start rounded-control border-2 border-accent bg-accent px-7 py-4 text-[15px] font-semibold leading-[20px] text-white transition-colors duration-200 hover:border-brand-hover hover:bg-brand-hover"
        >
          Start a Project
          <ArrowRightIcon className="h-[15px] w-[15px]" />
        </button>
        {sent && (
          <p className="t-small text-body">
            Opening your mail client to send this to info@uminglobal.com&hellip;
          </p>
        )}
      </div>
    </form>
  );
}
