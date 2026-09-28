"use client";

import { Save } from "lucide-react";
import { useActionState, useState } from "react";
import { PageBlockEditor } from "@/app/manage/(panel)/pages/[key]/PageBlockEditor";
import { fieldError, fieldInput, fieldLabel, primaryButton, secondaryButton } from "@/components/admin/ui";
import type { PageBlock } from "@/lib/content/page-content";
import { saveCustomPageAction, type CustomPageActionState } from "./actions";

const INITIAL_STATE: CustomPageActionState = {};

export function CustomPageEditor({ id, version, title, slug, blocks }: { id: string; version: number; title: string; slug: string; blocks: PageBlock[] }) {
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [state, formAction, pending] = useActionState(saveCustomPageAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="version" value={version} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={fieldLabel}>Page title<input name="title" defaultValue={title} className={fieldInput} required /></label>
        <label className={fieldLabel}>Slug<input name="slug" defaultValue={slug} className={fieldInput} required /></label>
      </div>
      <PageBlockEditor initialValue={blocks} />
      <div className="flex flex-wrap items-center gap-2 border-t border-brand-border pt-4">
        <button type="submit" name="status" value="DRAFT" className={`${secondaryButton} rounded-none`} disabled={pending} onClick={() => setStatus("DRAFT")}><Save className="size-4" />{pending && status === "DRAFT" ? "Saving…" : "Save draft"}</button>
        <button type="submit" name="status" value="PUBLISHED" className={`${primaryButton} rounded-none`} disabled={pending} onClick={() => setStatus("PUBLISHED")}><Save className="size-4" />{pending && status === "PUBLISHED" ? "Publishing…" : "Publish"}</button>
        <div className="min-h-6 text-sm" role="status">{state.success ? state.success : state.error ? <span className={fieldError}>{state.error}</span> : null}</div>
      </div>
    </form>
  );
}
