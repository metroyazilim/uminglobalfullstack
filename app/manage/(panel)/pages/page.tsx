import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  card,
  cn,
  table,
  tableBody,
  tableCell,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableWrap,
} from "@/components/admin/ui";
import { getContentStatus } from "@/lib/content/status";
import { prisma } from "@/lib/db";
import { SITE_PAGES } from "@/lib/site-pages";

const COLLECTIONS = [
  { key: "team", label: "Team", href: "/manage/team" },
  { key: "offices", label: "Offices", href: "/manage/offices" },
  { key: "insights", label: "Insights", href: "/manage/posts" },
] as const;

export default async function PagesIndexPage() {
  const [status, overrides, pageContents] = await Promise.all([
    getContentStatus(),
    prisma.pageSeo.findMany({
      select: { key: true, title: true, description: true, updatedAt: true },
    }),
    prisma.pageContent.findMany({
      select: { key: true, status: true, updatedAt: true },
    }),
  ]);
  const pageContentByKey = new Map(pageContents.map((content) => [content.key, content]));
  const overrideByKey = new Map(overrides.map((override) => [override.key, override]));
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Site Content"
        title="Pages"
        description="Check what is driving the live site, then manage search and social metadata for every static page."
      />

      <section className={cn(card, "overflow-hidden")} aria-labelledby="live-content-heading">
        <div className="border-b border-brand-border px-5 py-4">
          <h2 id="live-content-heading" className="text-sm font-bold text-brand-text">
            Live content source
          </h2>
          <p className="mt-1 text-xs text-brand-muted">
            A collection switches to the database as soon as it has at least one published item.
          </p>
        </div>
        <div className="grid divide-y divide-brand-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {COLLECTIONS.map((collection) => {
            const collectionStatus = status[collection.key];
            const fromDatabase = collectionStatus.source === "database";

            return (
              <Link
                key={collection.key}
                href={collection.href}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-brand-muted-surface/60"
              >
                <div>
                  <p className="text-sm font-bold text-brand-text">{collection.label}</p>
                  <p className="mt-1 text-xs text-brand-muted">
                    {collectionStatus.published} published · {collectionStatus.draft} draft
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 rounded-[var(--radius-sm)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
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

      <div className={tableWrap}>
        <table className={table}>
          <thead>
            <tr className={tableHeadRow}>
              <th className={tableHeadCell}>Page</th>
              <th className={tableHeadCell}>Path</th>
              <th className={tableHeadCell}>Title</th>
              <th className={tableHeadCell}>Description</th>
              <th className={tableHeadCell}>Last updated</th>
              <th className={tableHeadCell}>Actions</th>
            </tr>
          </thead>
          <tbody className={tableBody}>
            {SITE_PAGES.map((page) => {
              const override = overrideByKey.get(page.key);
              const pageContent = pageContentByKey.get(page.key);
              const customTitle = Boolean(override?.title?.trim());
              const customDescription = Boolean(override?.description?.trim());

              return (
                <tr key={page.key} className={tableRow}>
                  <td className={cn(tableCell, "font-semibold")}>{page.label}</td>
                  <td className={tableCell}>
                    <code className="font-mono text-xs text-brand-muted">{page.path}</code>
                  </td>
                  <td className={tableCell}>
                    <span
                      className={cn(
                        "inline-flex rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        customTitle
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "bg-brand-muted-surface text-brand-muted",
                      )}
                    >
                      {customTitle ? "Custom" : "Default"}
                    </span>
                  </td>
                  <td className={tableCell}>
                    <span
                      className={cn(
                        "inline-flex rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        customDescription
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "bg-brand-muted-surface text-brand-muted",
                      )}
                    >
                      {customDescription ? "Custom" : "Default"}
                    </span>
                  </td>
                  <td className={cn(tableCell, "whitespace-nowrap text-xs text-brand-muted")}>
                    {override ? (
                      <time dateTime={override.updatedAt.toISOString()}>
                        {dateFormat.format(override.updatedAt)}
                      </time>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={tableCell}>
                    <div className="flex flex-wrap items-center gap-3 whitespace-nowrap">
                      <Link
                        href={`/manage/pages/${page.key}`}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit content
                      </Link>
                      {pageContent ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                          {pageContent.status.toLowerCase()}
                        </span>
                      ) : null}
                      <Link
                        href={`/manage/seo?item=page:${page.key}`}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit SEO
                      </Link>
                      <Link
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-text"
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        View live
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={cn(card, "p-5 text-sm text-brand-muted")}>
        Team members, offices and Insights articles are managed from their own screens:{" "}
        <Link className="font-semibold text-brand-primary hover:underline" href="/manage/team">
          Team
        </Link>
        {" · "}
        <Link className="font-semibold text-brand-primary hover:underline" href="/manage/offices">
          Offices
        </Link>
        {" · "}
        <Link className="font-semibold text-brand-primary hover:underline" href="/manage/posts">
          Insights
        </Link>
      </div>
    </div>
  );
}
