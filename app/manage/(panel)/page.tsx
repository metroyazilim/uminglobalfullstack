import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { card, cn, secondaryButton } from "@/components/admin/ui";
import { getContentStatus } from "@/lib/content/status";
import { hasMediaStorage } from "@/lib/env";
import { getRecentAuditEntries } from "@/lib/manage-audit";


const SITE_SHORTCUTS = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Offices", href: "/offices" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

const CONTENT_COLLECTIONS = [
  { key: "team", label: "Team", href: "/manage/team" },
  { key: "offices", label: "Offices", href: "/manage/offices" },
  { key: "insights", label: "Insights", href: "/manage/posts" },
] as const;

/** `/manage` overview. Every figure is a `count()` — opening the panel
 * costs a handful of index reads regardless of how much content exists. */
export default async function ManageOverviewPage() {
  const [teamCount, teamPublished, officeCount, postCount, postPublished, unreadMessages, mediaCount, recentAudit, contentStatus] = await Promise.all([
    prisma.teamMember.count(),
    prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
    prisma.office.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.mediaAsset.count({ where: { archived: false } }),
    getRecentAuditEntries(8),
    getContentStatus(),
  ]);
  const fallbackCollections = CONTENT_COLLECTIONS.filter(
    (collection) => contentStatus[collection.key].source === "bundled",
  );
  const warnings = [
    ...(!contentStatus.siteSettings
      ? [
          {
            issue: "Site settings have not been imported.",
            fix: "Run `npm run content:import` to create the site settings row.",
          },
        ]
      : []),
    ...(fallbackCollections.length > 0
      ? [
          {
            issue: `${fallbackCollections.map((collection) => collection.label).join(", ")} ${
              fallbackCollections.length === 1 ? "is" : "are"
            } still served from bundled fallback content.`,
            fix: "Run `npm run content:import` to load the site's current content into the database.",
          },
        ]
      : []),
    ...(!hasMediaStorage()
      ? [
          {
            issue: "Uploaded media is using temporary in-memory storage.",
            fix: "Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET in production so uploads survive restarts.",
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Overview" description="Current state of the UMIN Global admin panel.">
        {SITE_SHORTCUTS.map((shortcut) => (
          <Link key={shortcut.href} href={shortcut.href} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
            {shortcut.label}
          </Link>
        ))}
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Team" value={teamCount} hint={`${teamPublished} published`} href="/manage/team" />
        <StatCard label="Offices" value={officeCount} href="/manage/offices" />
        <StatCard label="Insights" value={postCount} hint={`${postPublished} published`} href="/manage/posts" />
        <StatCard label="Unread messages" value={unreadMessages} tone={unreadMessages > 0 ? "accent" : "neutral"} href="/manage/messages" />
        <StatCard label="Media" value={mediaCount} href="/manage/media" />
      </div>

      <section className={cn(card, "mt-6 overflow-hidden")} aria-labelledby="content-source-heading">
        <div className="border-b border-brand-border px-5 py-3.5">
          <h2 id="content-source-heading" className="text-sm font-bold text-brand-text">
            Live content source
          </h2>
        </div>
        <div className="divide-y divide-brand-border sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {CONTENT_COLLECTIONS.map((collection) => {
            const collectionStatus = contentStatus[collection.key];
            const fromDatabase = collectionStatus.source === "database";

            return (
              <Link
                key={collection.key}
                href={collection.href}
                className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-brand-muted-surface/60"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-text">{collection.label}</p>
                  <p className="text-xs text-brand-muted">
                    {collectionStatus.published} published · {collectionStatus.draft} draft
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    fromDatabase
                      ? "bg-brand-success/10 text-brand-success"
                      : "bg-brand-warning/10 text-brand-warning",
                  )}
                >
                  {fromDatabase ? "Database" : "Bundled fallback"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {warnings.length > 0 ? (
        <section className="mt-4 rounded-[var(--radius-md)] border border-brand-warning/30 bg-brand-warning/10 p-5" aria-labelledby="configuration-warnings-heading">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-brand-warning" aria-hidden="true" />
            <div className="min-w-0">
              <h2 id="configuration-warnings-heading" className="text-sm font-bold text-brand-text">
                Configuration needs attention
              </h2>
              <ul className="mt-3 space-y-3">
                {warnings.map((warning) => (
                  <li key={warning.issue} className="text-sm">
                    <p className="font-semibold text-brand-text">{warning.issue}</p>
                    <p className="mt-0.5 text-brand-muted">{warning.fix}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <div className={`${card} mt-6`}>
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <p className="text-sm font-bold text-brand-text">Recent activity</p>
          <Link href="/manage/audit" className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="m-5 overflow-hidden rounded-lg border border-black/40 bg-[#0b0f14] shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#161b22] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#ff5f56]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#27c93f]" aria-hidden="true" />
            <span className="ml-1 text-xs text-white/40">recent.log</span>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto p-4 font-mono text-[13px]">
            {recentAudit.length === 0 ? (
              <span className="text-slate-500">{"// no audit entries yet"}</span>
            ) : (
              recentAudit.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 whitespace-pre-wrap break-all"
                >
                  <span className="text-emerald-400">$</span>
                  <time className="text-slate-500" dateTime={entry.createdAt.toISOString()}>
                    [{entry.createdAt.toLocaleString("en-US")}]
                  </time>
                  <span className="text-cyan-400">{entry.actorEmail ?? "system"}</span>
                  <span className="text-yellow-300">{entry.action}</span>
                  <span className="text-fuchsia-400">
                    {entry.entity}
                    {entry.entityId ? `#${entry.entityId}` : ""}
                  </span>
                  {entry.metadata !== null ? (
                    <details className="inline-block text-slate-300">
                      <summary className="cursor-pointer select-none text-slate-300">show</summary>
                      <pre className="mt-1 max-w-full overflow-x-auto whitespace-pre-wrap rounded bg-white/5 p-2 text-xs text-slate-400">
                        <code>{JSON.stringify(entry.metadata, null, 2)}</code>
                      </pre>
                    </details>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
