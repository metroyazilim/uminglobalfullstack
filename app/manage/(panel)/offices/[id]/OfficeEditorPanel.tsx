"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  cardPadded,
  checkboxInput,
  fieldError,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  helpText,
  invertButton,
  primaryButton,
  sectionTitle,
} from "@/components/admin/ui";
import {
  deleteOfficeAction,
  publishOfficeAction,
  saveOfficeDraftAction,
  type OfficeActionState,
} from "../actions";

type OfficeEditorData = {
  id: string;
  slug: string;
  city: string;
  country: string;
  region: string;
  summary: string;
  detail: unknown;
  headquarters: boolean;
  status: string;
  version: number;
};

const initialActionState: OfficeActionState = {};

function readDetail(value: unknown): [string, string] {
  if (!Array.isArray(value)) return ["", ""];
  return [typeof value[0] === "string" ? value[0] : "", typeof value[1] === "string" ? value[1] : ""];
}

export function OfficeEditorPanel({ office }: { office: OfficeEditorData }) {
  const detail = readDetail(office.detail);
  const [lastAction, setLastAction] = useState<"draft" | "publish">("draft");
  const [isDeleting, startDeleteTransition] = useTransition();
  const [draftState, draftAction, isSaving] = useActionState(
    saveOfficeDraftAction.bind(null, office.id),
    initialActionState,
  );
  const [publishState, publishAction, isPublishing] = useActionState(
    publishOfficeAction.bind(null, office.id),
    initialActionState,
  );
  const { toast } = useToast();

  useEffect(() => {
    if (draftState.error) toast(draftState.error, "error");
    else if (draftState.success) toast(draftState.success);
  }, [draftState, toast]);

  useEffect(() => {
    if (publishState.error) toast(publishState.error, "error");
    else if (publishState.success) toast(publishState.success);
  }, [publishState, toast]);

  const feedback = lastAction === "publish" ? publishState : draftState;
  const isPending = isSaving || isPublishing || isDeleting;

  const deleteOffice = () => {
    startDeleteTransition(async () => {
      const result = await deleteOfficeAction(office.id);
      if (result.error) toast(result.error, "error");
      else if (result.success) toast(result.success);
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Global network"
        title={office.city.trim() || "New office"}
        description={`Version ${office.version}. Save as a draft or publish it on the site.`}
        backHref="/manage/offices"
        backLabel="Back to offices"
      >
        <StatusBadge status={office.status} />
      </PageHeader>

      <form action={draftAction} className="space-y-5">
        <input type="hidden" name="version" value={office.version} />

        <section className={cardPadded}>
          <div className="mb-5">
            <h2 className={sectionTitle}>Office information</h2>
            <p className={`mt-1 ${helpText}`}>Basic information used in the office list and detail view.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className={fieldLabel}>
              Slug
              <input
                name="slug"
                defaultValue={office.slug}
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                className={fieldInput}
              />
              <span className={fieldHint}>Lowercase letters, numbers and hyphens only.</span>
            </label>
            <label className={fieldLabel}>
              City
              <input name="city" defaultValue={office.city} required className={fieldInput} />
            </label>
            <label className={fieldLabel}>
              Country
              <input name="country" defaultValue={office.country} required className={fieldInput} />
            </label>
            <label className={fieldLabel}>
              Region
              <input name="region" defaultValue={office.region} required className={fieldInput} />
            </label>
            <label className={`${fieldLabel} md:col-span-2`}>
              Summary
              <textarea name="summary" defaultValue={office.summary} required rows={4} className={fieldTextarea} />
            </label>
            <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-brand-border p-3 md:col-span-2">
              <input
                name="headquarters"
                type="checkbox"
                defaultChecked={office.headquarters}
                className={checkboxInput}
              />
              <span>
                <span className="block text-sm font-bold text-brand-text">Headquarters</span>
                <span className={fieldHint}>For reference only; more than one office can be marked.</span>
              </span>
            </label>
          </div>
        </section>

        <section className={cardPadded}>
          <div className="mb-5">
            <h2 className={sectionTitle}>Detail copy</h2>
            <p className={`mt-1 ${helpText}`}>Edit the two fixed paragraphs shown in the office details.</p>
          </div>
          <div className="space-y-4">
            <RichTextEditor name="detail0" defaultValue={detail[0]} label="First paragraph" />
            <RichTextEditor name="detail1" defaultValue={detail[1]} label="Second paragraph" />
          </div>
        </section>

        <section className={`${cardPadded} flex flex-wrap items-center justify-between gap-4`}>
          <div className="min-h-10 flex-1">
            {feedback.error ? <p className={fieldError}>{feedback.error}</p> : null}
            {feedback.success ? (
              <p className="rounded-[var(--radius-sm)] border border-brand-success/30 bg-brand-success/5 px-3 py-2 text-sm text-brand-success">
                {feedback.success}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ConfirmButton onConfirm={deleteOffice} confirmLabel="Delete permanently" disabled={isPending}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Delete
            </ConfirmButton>
            <button
              type="submit"
              className={primaryButton}
              disabled={isPending}
              onClick={() => setLastAction("draft")}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <button
              type="submit"
              formAction={publishAction}
              className={invertButton}
              disabled={isPending}
              onClick={() => setLastAction("publish")}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </section>
      </form>
    </>
  );
}
