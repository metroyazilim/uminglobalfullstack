import { PageHeader } from "@/components/admin/PageHeader";
import { card, fieldInput, fieldLabel, pageShell, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { createCustomPageAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCustomPage() {
  await requireAdmin();
  return (
    <div className={pageShell}>
      <PageHeader eyebrow="Site Content" title="New page" description="Create an admin-managed page, then add its blocks and publish it." />
      <section className={`${card} max-w-3xl p-5`}>
        <form action={createCustomPageAction} className="space-y-4">
          <label className={fieldLabel}>Page title<input name="title" className={fieldInput} required /></label>
          <label className={fieldLabel}>Slug <span className="normal-case tracking-normal">(optional; generated from title)</span><input name="slug" className={fieldInput} /></label>
          <button type="submit" className={`${primaryButton} rounded-none`}>Create page</button>
        </form>
      </section>
    </div>
  );
}
