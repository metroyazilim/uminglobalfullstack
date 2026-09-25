import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getRecentAuditEntries } from "@/lib/manage-audit";

export default async function AuditPage() {
  await requireAdmin();
  const entries = await getRecentAuditEntries(100);

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Audit log" />

      <div className="overflow-hidden rounded-lg border border-black/40 bg-[#0b0f14] shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#161b22] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" aria-hidden="true" />
          <span className="ml-1 text-xs text-white/40">audit.log</span>
        </div>
        <div className="max-h-[70vh] space-y-1 overflow-y-auto p-4 font-mono text-[13px]">
          {entries.length === 0 ? (
            <span className="text-slate-500">{'// no audit entries yet'}</span>
          ) : (
            entries.map((entry) => (
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
  );
}
