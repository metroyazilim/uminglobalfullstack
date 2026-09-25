"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { PageBlockEditor } from "./PageBlockEditor";
import { savePageContentAction, type PageContentActionState } from "./actions";
import { fieldError, primaryButton, secondaryButton } from "@/components/admin/ui";
import type { PageBlock } from "@/lib/content/page-content";

const INITIAL_STATE: PageContentActionState = { ok: true, message: "" };

export function PageContentEditor({ keyName, version, blocks }: { keyName: string; version: number; blocks: PageBlock[] }) {
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [state, formAction, pending] = useActionState(savePageContentAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="key" value={keyName} />
      <input type="hidden" name="version" value={version} />
      <PageBlockEditor initialValue={blocks} />
      <div className="flex flex-wrap items-center gap-3 border-t border-brand-border pt-5">
        <button type="submit" name="status" value="DRAFT" className={secondaryButton} disabled={pending} onClick={() => setStatus("DRAFT")}><Save className="size-4" />{pending && status === "DRAFT" ? "Kaydediliyor..." : "Taslak kaydet"}</button>
        <button type="submit" name="status" value="PUBLISHED" className={primaryButton} disabled={pending} onClick={() => setStatus("PUBLISHED")}><Save className="size-4" />{pending && status === "PUBLISHED" ? "Yayınlanıyor..." : "Yayınla"}</button>
        <div className="min-h-6 text-sm" role="status">{state.ok ? state.message : <span className={fieldError}>{state.error}</span>}</div>
      </div>
    </form>
  );
}
