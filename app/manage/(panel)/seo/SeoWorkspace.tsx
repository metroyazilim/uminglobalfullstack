"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Info,
  Newspaper,
  Pencil,
  RotateCcw,
  Save,
} from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { useToast } from "@/components/admin/Toast";
import {
  card,
  cn,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  helpText,
  primaryButton,
  secondaryButton,
} from "@/components/admin/ui";
import type { SiteSettingsView } from "@/lib/content/site-settings-defaults";
import { savePageSeoAction, savePostSeoAction, saveSiteSettingsAction } from "./actions";

export type SeoEntry = Readonly<{
  kind: "page" | "post";
  id: string;
  label: string;
  path: string;
  title: string;
  description: string;
  image: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  editHref: string;
}>;

type Draft = Readonly<{ title: string; description: string; image: string }>;
type SocialKey = keyof SiteSettingsView["socials"];
type OrganizationKey = Exclude<keyof SiteSettingsView, "socials">;
type SiteDraft = Readonly<{
  organization: Readonly<Record<OrganizationKey, string>>;
  socials: Readonly<Record<SocialKey, string>>;
}>;
type Check = Readonly<{ label: string; ok: boolean; optional?: boolean }>;

const SITE_KEY = "site:organization";
const TITLE_MIN = 20;
const TITLE_LIMIT = 60;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_LIMIT = 160;

const ORGANIZATION_FIELDS: readonly Readonly<{
  key: OrganizationKey;
  label: string;
  hint?: string;
  multiline?: boolean;
  inputMode?: "email" | "tel";
}>[] = [
  { key: "organizationName", label: "Organisation name" },
  { key: "legalName", label: "Legal name" },
  { key: "alternateName", label: "Alternate name", hint: "The short name or brand Google should associate with the organisation." },
  { key: "slogan", label: "Slogan" },
  { key: "description", label: "Organisation description", multiline: true },
  { key: "foundingDate", label: "Founding date", hint: "A year or full date, for example 2020 or 2020-03-01." },
  { key: "locality", label: "Locality" },
  { key: "countryCode", label: "Country code", hint: "Two-letter ISO code, for example US or GB." },
  { key: "email", label: "Email", inputMode: "email" },
  { key: "phone", label: "Phone", inputMode: "tel" },
];

const SOCIAL_FIELDS: readonly Readonly<{ key: SocialKey; label: string }>[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X (Twitter)" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
];

const keyOf = (entry: SeoEntry) => `${entry.kind}:${entry.id}`;
const draftOf = (entry: SeoEntry): Draft => ({ title: entry.title, description: entry.description, image: entry.image });
const isHttpUrl = (value: string) => /^https?:\/\/\S+\.\S+/i.test(value.trim());

function checksFor(entry: SeoEntry, draft: Draft): readonly Check[] {
  const title = draft.title.trim();
  const description = draft.description.trim();
  return [
    { label: `SEO title is ${TITLE_MIN}–${TITLE_LIMIT} characters`, ok: title.length >= TITLE_MIN && title.length <= TITLE_LIMIT },
    {
      label: `Meta description is ${DESCRIPTION_MIN}–${DESCRIPTION_LIMIT} characters`,
      ok: description.length >= DESCRIPTION_MIN && description.length <= DESCRIPTION_LIMIT,
    },
    {
      label: entry.kind === "page" ? "Share image is set" : "Post has a cover image for sharing",
      ok: Boolean(draft.image.trim()),
    },
  ];
}

function siteChecks(draft: SiteDraft): readonly Check[] {
  const organization = draft.organization;
  return [
    {
      label: "Organisation name and alternate name are filled in",
      ok: Boolean(organization.organizationName.trim() && organization.alternateName.trim()),
    },
    {
      label: "Organisation description is 70–320 characters",
      ok: organization.description.trim().length >= 70 && organization.description.trim().length <= 320,
    },
    {
      label: "Locality and a valid two-letter country code are filled in",
      ok: Boolean(organization.locality.trim() && /^[A-Z]{2}$/.test(organization.countryCode.trim())),
    },
    { label: "Email is filled in", ok: Boolean(organization.email.trim()) },
    {
      label: "At least one social profile (recommended)",
      ok: Object.values(draft.socials).some(isHttpUrl),
      optional: true,
    },
  ];
}

const isComplete = (entry: SeoEntry, draft: Draft) => checksFor(entry, draft).every((check) => check.ok);
const siteIsComplete = (draft: SiteDraft) => siteChecks(draft).every((check) => check.ok || check.optional);

function Counter({ value, min, limit }: { value: number; min: number; limit: number }) {
  const tone = value > limit ? "text-brand-danger" : value >= min ? "text-brand-success" : "text-brand-muted";
  return <span className={cn("font-normal normal-case tracking-normal", tone)}>{value}/{limit}</span>;
}

function SidebarItem({
  label,
  active,
  complete,
  dirty,
  onSelect,
}: {
  label: string;
  active: boolean;
  complete: boolean;
  dirty: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm transition-colors",
          active ? "bg-brand-primary/10 font-semibold text-brand-text" : "text-brand-muted hover:bg-brand-muted-surface hover:text-brand-text",
        )}
      >
        {complete ? (
          <CheckCircle2 className="size-4 shrink-0 text-brand-success" aria-label="Complete" />
        ) : (
          <AlertCircle className="size-4 shrink-0 text-brand-warning" aria-label="Needs attention" />
        )}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {dirty ? <span className="size-2 shrink-0 rounded-full bg-brand-warning" title="Unsaved changes" aria-label="Unsaved changes" /> : null}
      </button>
    </li>
  );
}

function Checklist({ checks }: { checks: readonly Check[] }) {
  return (
    <div className={cn(card, "p-4")}>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Checklist</p>
      <ul className="space-y-1.5 text-sm">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2">
            {check.ok ? (
              <CheckCircle2 className="size-4 shrink-0 text-brand-success" aria-hidden="true" />
            ) : check.optional ? (
              <Info className="size-4 shrink-0 text-brand-muted" aria-hidden="true" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-brand-warning" aria-hidden="true" />
            )}
            <span className={check.ok ? "text-brand-text" : "text-brand-muted"}>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function organizationJsonLd(draft: SiteDraft, siteUrl: string): string {
  const organization = draft.organization;
  const origin = siteUrl.replace(/\/+$/, "");
  const sameAs = Object.values(draft.socials).map((value) => value.trim()).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: organization.organizationName,
    alternateName: organization.alternateName,
    legalName: organization.legalName,
    identifier: { "@type": "PropertyValue", name: "ABN", value: "29 615 356 539" },
    url: origin,
    logo: `${origin}/icon`,
    image: `${origin}/opengraph-image`,
    slogan: organization.slogan,
    description: organization.description,
    ...(organization.foundingDate ? { foundingDate: organization.foundingDate } : {}),
    founder: { "@type": "Person", name: "Anthon Ikram Umit", url: `${origin}/team/anthon-ikram-umit` },
    address: {
      "@type": "PostalAddress",
      addressLocality: organization.locality,
      addressCountry: organization.countryCode,
    },
    areaServed: ["United Kingdom", "Europe", "United States", "Australia", "Türkiye", "Middle East", "China"],
    knowsAbout: [
      "Custom software development",
      "SaaS platforms",
      "Applied artificial intelligence",
      "Growth marketing",
      "SEO",
      "Market entry and international expansion",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: organization.email,
        ...(organization.phone ? { telephone: organization.phone } : {}),
        availableLanguage: ["English", "Turkish"],
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
  return JSON.stringify(data, null, 2);
}

function SiteDetail({
  draft,
  saved,
  siteUrl,
  onChange,
  onSaved,
}: {
  draft: SiteDraft;
  saved: SiteDraft;
  siteUrl: string;
  onChange: (draft: SiteDraft) => void;
  onSaved: (draft: SiteDraft) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const badSocials = SOCIAL_FIELDS.filter(({ key }) => {
    const value = draft.socials[key].trim();
    return value !== "" && !isHttpUrl(value);
  });

  const save = () =>
    startTransition(async () => {
      const result = await saveSiteSettingsAction({ ...draft.organization }, { ...draft.socials });
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        onSaved(draft);
        router.refresh();
      }
    });

  return (
    <div className="space-y-4">
      <div className={cn(card, "p-5")}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">Site-wide</p>
        <h2 className="mt-1 text-lg font-bold text-brand-text">Organisation details and structured data</h2>
        <p className={cn(helpText, "mt-1 max-w-2xl")}>These details identify UMIN Global to search engines and generate the Organization JSON-LD published across the site.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className={cn(card, "space-y-5 p-5")}>
          <div className="grid gap-4 md:grid-cols-2">
            {ORGANIZATION_FIELDS.map((field) => (
              <div key={field.key} className={field.multiline ? "md:col-span-2" : undefined}>
                <label className={fieldLabel} htmlFor={`org-${field.key}`}>{field.label}</label>
                {field.multiline ? (
                  <textarea
                    id={`org-${field.key}`}
                    className={fieldTextarea}
                    rows={4}
                    value={draft.organization[field.key]}
                    onChange={(event) => onChange({ ...draft, organization: { ...draft.organization, [field.key]: event.target.value } })}
                  />
                ) : (
                  <input
                    id={`org-${field.key}`}
                    className={fieldInput}
                    inputMode={field.inputMode}
                    value={draft.organization[field.key]}
                    onChange={(event) => {
                      const value = field.key === "countryCode" ? event.target.value.toUpperCase() : event.target.value;
                      onChange({ ...draft, organization: { ...draft.organization, [field.key]: value } });
                    }}
                  />
                )}
                {field.hint ? <p className={cn(helpText, "mt-1")}>{field.hint}</p> : null}
              </div>
            ))}
          </div>

          <div className="border-t border-brand-border pt-4">
            <p className={fieldLabel}>Official social profiles</p>
            <p className={cn(helpText, "mt-1")}>These URLs are published as the organisation&apos;s sameAs profiles. Leave unused networks blank.</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {SOCIAL_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className={fieldLabel} htmlFor={`social-${field.key}`}>{field.label}</label>
                  <input
                    id={`social-${field.key}`}
                    className={fieldInput}
                    inputMode="url"
                    placeholder="https://"
                    value={draft.socials[field.key]}
                    onChange={(event) => onChange({ ...draft, socials: { ...draft.socials, [field.key]: event.target.value } })}
                  />
                </div>
              ))}
            </div>
            {badSocials.length > 0 ? (
              <p className="mt-2 text-xs font-semibold text-brand-danger">Enter a valid http:// or https:// URL for: {badSocials.map((field) => field.label).join(", ")}.</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-brand-border pt-4">
            {dirty ? <span className="mr-auto text-xs font-bold text-brand-warning">Unsaved changes</span> : null}
            {dirty ? <button type="button" className={secondaryButton} onClick={() => onChange(saved)} disabled={pending}>Discard</button> : null}
            <button type="button" className={primaryButton} onClick={save} disabled={pending || !dirty || badSocials.length > 0}>
              <Save className="size-3.5" aria-hidden="true" />
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Checklist checks={siteChecks(draft)} />
          <div className={cn(card, "p-4")}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Organization JSON-LD preview</p>
            <pre className="max-h-[520px] overflow-auto rounded-[var(--radius-sm)] bg-brand-invert p-3 font-mono text-[11px] leading-5 text-brand-on-invert">{organizationJsonLd(draft, siteUrl)}</pre>
            <p className={cn(helpText, "mt-2")}>This preview updates as you type. Save to publish it.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeoDetail({
  entry,
  draft,
  saved,
  host,
  onChange,
  onSaved,
  previous,
  next,
  onNavigate,
}: {
  entry: SeoEntry;
  draft: Draft;
  saved: Draft;
  host: string;
  onChange: (draft: Draft) => void;
  onSaved: (draft: Draft) => void;
  previous: SeoEntry | null;
  next: SeoEntry | null;
  onNavigate: (entry: SeoEntry) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const isPage = entry.kind === "page";
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const shownTitle = draft.title.trim() || entry.defaultTitle;
  const shownDescription = draft.description.trim() || entry.defaultDescription;
  const shownImage = draft.image.trim() || entry.defaultImage;
  const checks = checksFor(entry, draft);
  const isDefault = draft.title === entry.defaultTitle && draft.description === entry.defaultDescription && draft.image === entry.defaultImage;

  const save = () =>
    startTransition(async () => {
      const result = isPage
        ? await savePageSeoAction(entry.id, { title: draft.title, description: draft.description, ogImage: draft.image })
        : await savePostSeoAction(entry.id, { title: draft.title, description: draft.description });
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        onSaved(draft);
        router.refresh();
      }
    });

  return (
    <div className="space-y-4">
      <div className={cn(card, "flex flex-wrap items-start justify-between gap-3 p-5")}>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{isPage ? "Page" : "Insight"}</p>
          <h2 className="mt-1 text-lg font-bold text-brand-text">{entry.label}</h2>
          <p className="font-mono text-xs text-brand-muted">{entry.path}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={entry.path} target="_blank" rel="noopener noreferrer" className={secondaryButton} aria-label={`View ${entry.label} live in a new tab`}>
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View live
          </a>
          <Link href={entry.editHref} className={secondaryButton}>
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit content
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className={cn(card, "space-y-5 p-5")}>
          <div>
            <label className={cn(fieldLabel, "flex justify-between")} htmlFor="seo-title">
              SEO title <Counter value={draft.title.length} min={TITLE_MIN} limit={TITLE_LIMIT} />
            </label>
            <input
              id="seo-title"
              className={fieldInput}
              value={draft.title}
              placeholder={entry.defaultTitle}
              onChange={(event) => onChange({ ...draft, title: event.target.value })}
            />
            <p className={cn(helpText, "mt-1")}>Shown in the browser tab and as the blue heading in Google. Put the subject first and the brand last.</p>
          </div>

          <div>
            <label className={cn(fieldLabel, "flex justify-between")} htmlFor="seo-description">
              Meta description <Counter value={draft.description.length} min={DESCRIPTION_MIN} limit={DESCRIPTION_LIMIT} />
            </label>
            <textarea
              id="seo-description"
              className={fieldTextarea}
              rows={4}
              value={draft.description}
              placeholder={entry.defaultDescription || "Describe this page in one or two sentences."}
              onChange={(event) => onChange({ ...draft, description: event.target.value })}
            />
            <p className={cn(helpText, "mt-1")}>The grey text below a Google result. Explain what visitors will find and why it is relevant.</p>
          </div>

          {isPage ? (
            <MediaField
              name="ogImage"
              label="Share image (Facebook, LinkedIn, WhatsApp and X)"
              value={draft.image}
              onChange={(payload) => onChange({ ...draft, image: payload.url })}
              description="Recommended size: 1200×630. Leave blank to use the site's default presentation."
            />
          ) : (
            <div className="rounded-[var(--radius-sm)] border border-brand-border bg-brand-page p-3 text-xs text-brand-muted">
              Insights use the post&apos;s cover image as the share image. {" "}
              <Link href={entry.editHref} className="font-semibold text-brand-primary hover:underline">Change the cover image in the post editor</Link>.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-brand-border pt-4">
            {dirty ? <span className="mr-auto text-xs font-bold text-brand-warning">Unsaved changes</span> : null}
            {dirty ? <button type="button" className={secondaryButton} onClick={() => onChange(saved)} disabled={pending}>Discard</button> : null}
            {!isDefault ? (
              <button
                type="button"
                className={secondaryButton}
                onClick={() => onChange({ title: entry.defaultTitle, description: entry.defaultDescription, image: entry.defaultImage })}
                disabled={pending}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Use suggested defaults
              </button>
            ) : null}
            <button type="button" className={primaryButton} onClick={save} disabled={pending || !dirty}>
              <Save className="size-3.5" aria-hidden="true" />
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className={cn(card, "p-4")} aria-label="Google SERP preview">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Google SERP preview</p>
            <p className="truncate text-xs text-brand-muted">{host}{entry.path === "/" ? "" : ` › ${entry.path.replace(/^\//, "").split("/").join(" › ")}`}</p>
            <p className="mt-1 line-clamp-2 text-base leading-snug text-brand-primary">{shownTitle}</p>
            <p className="mt-1 line-clamp-3 text-sm text-brand-muted">{shownDescription || "No description — Google may choose text from the page."}</p>
          </div>

          <div className={cn(card, "overflow-hidden")} aria-label="Social card preview">
            <p className="px-4 pt-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Social card preview</p>
            <div className="m-4 overflow-hidden rounded-[var(--radius-sm)] border border-brand-border">
              {shownImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shownImage} alt="" className="aspect-[1200/630] w-full object-cover" />
              ) : (
                <div className="flex aspect-[1200/630] items-center justify-center bg-brand-page text-xs text-brand-muted">No share image</div>
              )}
              <div className="space-y-0.5 bg-brand-page p-3">
                <p className="text-[11px] uppercase text-brand-muted">{host}</p>
                <p className="line-clamp-2 text-sm font-semibold text-brand-text">{shownTitle}</p>
                <p className="line-clamp-2 text-xs text-brand-muted">{shownDescription}</p>
              </div>
            </div>
          </div>

          <Checklist checks={checks} />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {previous ? (
          <button type="button" className={secondaryButton} onClick={() => onNavigate(previous)}>
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            {previous.label}
          </button>
        ) : <span />}
        {next ? (
          <button type="button" className={secondaryButton} onClick={() => onNavigate(next)}>
            {next.label}
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function SeoWorkspace({
  site,
  pages,
  posts,
  initialItem,
  siteUrl,
}: {
  site: SiteSettingsView;
  pages: readonly SeoEntry[];
  posts: readonly SeoEntry[];
  initialItem: string | null;
  siteUrl: string;
}) {
  const all = useMemo(() => [...pages, ...posts], [pages, posts]);
  const initialSite = useMemo<SiteDraft>(() => {
    const { socials, ...organization } = site;
    return { organization, socials };
  }, [site]);
  const [selectedKey, setSelectedKey] = useState(() =>
    initialItem === SITE_KEY || (initialItem && all.some((entry) => keyOf(entry) === initialItem))
      ? initialItem
      : all[0]
        ? keyOf(all[0])
        : SITE_KEY,
  );
  const [siteSaved, setSiteSaved] = useState<SiteDraft>(initialSite);
  const [siteDraft, setSiteDraft] = useState<SiteDraft>(initialSite);
  const [saved, setSaved] = useState<Record<string, Draft>>(() => Object.fromEntries(all.map((entry) => [keyOf(entry), draftOf(entry)])));
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() => Object.fromEntries(all.map((entry) => [keyOf(entry), draftOf(entry)])));
  const siteDirty = JSON.stringify(siteDraft) !== JSON.stringify(siteSaved);
  const siteComplete = siteIsComplete(siteDraft);
  const dirtyKeys = useMemo(
    () => new Set(all.map(keyOf).filter((key) => JSON.stringify(drafts[key]) !== JSON.stringify(saved[key]))),
    [all, drafts, saved],
  );

  useEffect(() => {
    if (dirtyKeys.size === 0 && !siteDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys, siteDirty]);

  const selectKey = (key: string) => {
    setSelectedKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set("item", key);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const select = (entry: SeoEntry) => selectKey(keyOf(entry));
  const index = all.findIndex((entry) => keyOf(entry) === selectedKey);
  const current = index >= 0 ? all[index] : null;
  const completeCount = (entries: readonly SeoEntry[]) => entries.filter((entry) => isComplete(entry, drafts[keyOf(entry)] ?? draftOf(entry))).length;

  const group = (title: string, Icon: typeof FileText, entries: readonly SeoEntry[]) => (
    <div>
      <p className="flex items-center justify-between px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
        <span className="flex items-center gap-1.5"><Icon className="size-3.5" aria-hidden="true" />{title}</span>
        <span>{completeCount(entries)}/{entries.length}</span>
      </p>
      {entries.length === 0 ? <p className="px-2.5 text-xs text-brand-muted">No entries.</p> : null}
      <ul className="space-y-0.5">
        {entries.map((entry) => {
          const key = keyOf(entry);
          return (
            <SidebarItem
              key={key}
              label={entry.label}
              active={key === selectedKey}
              complete={isComplete(entry, drafts[key] ?? draftOf(entry))}
              dirty={dirtyKeys.has(key)}
              onSelect={() => select(entry)}
            />
          );
        })}
      </ul>
    </div>
  );

  let previewHost = "uminglobal.com";
  try {
    previewHost = new URL(siteUrl).host || previewHost;
  } catch {
    previewHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "") || previewHost;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside aria-label="SEO entries" className="lg:sticky lg:top-[72px] lg:self-start">
        <label className="mb-3 block lg:hidden">
          <span className="sr-only">Entry to edit</span>
          <select className={fieldInput} value={selectedKey} onChange={(event) => selectKey(event.target.value)}>
            <option value={SITE_KEY}>{siteComplete ? "✓ " : "• "}Organisation details</option>
            <optgroup label="Pages">
              {pages.map((entry) => <option key={keyOf(entry)} value={keyOf(entry)}>{isComplete(entry, drafts[keyOf(entry)] ?? draftOf(entry)) ? "✓ " : "• "}{entry.label}</option>)}
            </optgroup>
            <optgroup label="Insights">
              {posts.map((entry) => <option key={keyOf(entry)} value={keyOf(entry)}>{isComplete(entry, drafts[keyOf(entry)] ?? draftOf(entry)) ? "✓ " : "• "}{entry.label}</option>)}
            </optgroup>
          </select>
        </label>

        <nav className={cn(card, "hidden max-h-[calc(100vh-110px)] space-y-4 overflow-y-auto p-3 lg:block")}>
          <div>
            <p className="flex items-center justify-between px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              <span className="flex items-center gap-1.5"><Building2 className="size-3.5" aria-hidden="true" />Site-wide</span>
              <span>{siteComplete ? 1 : 0}/1</span>
            </p>
            <ul>
              <SidebarItem label="Organisation details" active={selectedKey === SITE_KEY} complete={siteComplete} dirty={siteDirty} onSelect={() => selectKey(SITE_KEY)} />
            </ul>
          </div>
          {group("Pages", FileText, pages)}
          {group("Insights", Newspaper, posts)}
        </nav>
      </aside>

      <div className="min-w-0">
        {selectedKey === SITE_KEY ? (
          <SiteDetail draft={siteDraft} saved={siteSaved} siteUrl={siteUrl} onChange={setSiteDraft} onSaved={setSiteSaved} />
        ) : current ? (
          <SeoDetail
            key={selectedKey}
            entry={current}
            draft={drafts[selectedKey] ?? draftOf(current)}
            saved={saved[selectedKey] ?? draftOf(current)}
            host={previewHost}
            onChange={(draft) => setDrafts((entries) => ({ ...entries, [selectedKey]: draft }))}
            onSaved={(draft) => setSaved((entries) => ({ ...entries, [selectedKey]: draft }))}
            previous={index > 0 ? all[index - 1] : null}
            next={index < all.length - 1 ? all[index + 1] : null}
            onNavigate={select}
          />
        ) : (
          <p className="text-sm text-brand-muted">There are no SEO entries to edit.</p>
        )}
      </div>
    </div>
  );
}
