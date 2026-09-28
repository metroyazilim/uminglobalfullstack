import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { card, fieldInput, fieldLabel, helpText, pageShell, primaryButton, secondaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureDefaultNavigation } from "@/lib/content/navigation";
import { prisma } from "@/lib/db";
import { createNavigationItemAction, deleteNavigationItemAction } from "./actions";

export const dynamic = "force-dynamic";

type NavigationRow = { id: string; label: string; href: string; parentId: string | null; sortOrder: number };

function descendants(rows: readonly NavigationRow[], parentId: string | null, depth = 0): { row: NavigationRow; depth: number }[] {
  return rows.filter((row) => row.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder).flatMap((row) => [{ row, depth }, ...descendants(rows, row.id, depth + 1)]);
}

export default async function NavigationPage() {
  await requireAdmin();
  await ensureDefaultNavigation();
  const rows = await prisma.navigationItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, label: true, href: true, parentId: true, sortOrder: true } });
  const rootCount = rows.filter((row) => row.parentId === null).length;
  const parentOptions = descendants(rows, null);

  return (
    <div className={pageShell}>
      <PageHeader eyebrow="Site Structure" title="Navigation" description="Add links as root items or nest them under another item. Root navigation is limited to seven items." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={`${card} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-brand-border px-4 py-3"><div><h2 className="text-sm font-bold text-brand-text">Navigation tree</h2><p className={`${helpText} mt-1`}>{rootCount}/7 root items</p></div><Link href="/manage/pages/custom/new" className={`${secondaryButton} rounded-none`}>New page</Link></div>
          <div className="divide-y divide-brand-border">{descendants(rows, null).map(({ row, depth }) => <div key={row.id} className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ paddingLeft: `${16 + depth * 20}px` }}><div className="min-w-0"><p className="truncate text-sm font-semibold text-brand-text">{row.label}</p><p className="truncate font-mono text-[11px] text-brand-muted">{row.href}</p></div><form action={deleteNavigationItemAction}><input type="hidden" name="id" value={row.id} /><button type="submit" className="text-[10px] font-bold uppercase tracking-wider text-brand-muted hover:text-brand-danger">Delete</button></form></div>)}</div>
        </section>
        <section className={`${card} p-4`}>
          <h2 className="text-sm font-bold text-brand-text">Add navigation item</h2>
          <p className={`${helpText} mt-1`}>Use a custom page path such as <code>/pages/about-us</code> or any existing site URL.</p>
          <form action={createNavigationItemAction} className="mt-4 space-y-3">
            <label className={fieldLabel}>Label<input name="label" className={fieldInput} required /></label>
            <label className={fieldLabel}>URL<input name="href" className={fieldInput} placeholder="/pages/about-us" required /></label>
            <label className={fieldLabel}>Parent heading<select name="parentId" className={fieldInput}><option value="">Root item</option>{parentOptions.map(({ row, depth }) => <option key={row.id} value={row.id}>{"— ".repeat(depth)}{row.label}</option>)}</select></label>
            <label className={fieldLabel}>Order<input name="sortOrder" type="number" min="0" max="999" defaultValue="0" className={fieldInput} /></label>
            <button type="submit" className={`${primaryButton} w-full rounded-none`}>Add item</button>
          </form>
        </section>
      </div>
    </div>
  );
}
