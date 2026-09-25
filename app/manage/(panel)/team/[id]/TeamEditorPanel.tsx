"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { MediaField } from "@/components/admin/MediaField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  cardPadded,
  fieldError,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  helpText,
  invertButton,
  primaryButton,
  secondaryButton,
  sectionTitle,
} from "@/components/admin/ui";
import {
  deleteTeamMemberAction,
  publishTeamMemberAction,
  saveTeamMemberDraftAction,
} from "../actions";

type ActionState = { error?: string; success?: string };
type WorksOnItem = { label: string; href: string };
type TeamMemberEditorData = {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bioShort: string;
  bio: unknown;
  worksOn: unknown;
  status: string;
  version: number;
};

const INITIAL_ACTION_STATE: ActionState = {};

function readBio(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((paragraph): paragraph is string => typeof paragraph === "string") : [];
}

function readWorksOn(value: unknown): WorksOnItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || !("label" in item) || !("href" in item)) return [];
    const { label, href } = item;
    return typeof label === "string" && typeof href === "string" ? [{ label, href }] : [];
  });
}

export function TeamEditorPanel({ member }: { member: TeamMemberEditorData }) {
  const [bio, setBio] = useState<string[]>(() => readBio(member.bio));
  const [worksOn, setWorksOn] = useState<WorksOnItem[]>(() => readWorksOn(member.worksOn));
  const [lastAction, setLastAction] = useState<"draft" | "publish">("draft");
  const [isDeleting, startDeleteTransition] = useTransition();
  const [draftState, draftAction, isSaving] = useActionState(
    saveTeamMemberDraftAction.bind(null, member.id),
    INITIAL_ACTION_STATE,
  );
  const [publishState, publishAction, isPublishing] = useActionState(
    publishTeamMemberAction.bind(null, member.id),
    INITIAL_ACTION_STATE,
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

  const deleteMember = () => {
    startDeleteTransition(async () => {
      const result = await deleteTeamMemberAction(member.id);
      if (result.error) toast(result.error, "error");
      else if (result.success) toast(result.success);
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title={member.name.trim() || "New team member"}
        description={`Version ${member.version}. Save as draft or publish on the site.`}
        backHref="/manage/team"
        backLabel="Back to team list"
      >
        <StatusBadge status={member.status} />
      </PageHeader>

      <form action={draftAction} className="space-y-5">
        <input type="hidden" name="bio" value={JSON.stringify(bio)} />
        <input type="hidden" name="worksOn" value={JSON.stringify(worksOn)} />

        <section className={cardPadded}>
          <div className="mb-5">
            <h2 className={sectionTitle}>Profile information</h2>
            <p className={`mt-1 ${helpText}`}>Basic information displayed in the team list and member profile.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className={fieldLabel}>
              Slug
              <input
                name="slug"
                defaultValue={member.slug}
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                className={fieldInput}
              />
              <span className={fieldHint}>Use lowercase letters, numbers, and hyphens.</span>
            </label>
            <label className={fieldLabel}>
              Full name
              <input name="name" defaultValue={member.name} required className={fieldInput} />
            </label>
            <label className={fieldLabel}>
              Role / title
              <input name="role" defaultValue={member.role} required className={fieldInput} />
            </label>
            <MediaField name="photo" label="Image" value={member.photo} />
            <label className={`${fieldLabel} md:col-span-2`}>
              Image alt text
              <input name="photoAlt" defaultValue={member.photoAlt} className={fieldInput} />
            </label>
            <label className={`${fieldLabel} md:col-span-2`}>
              Short bio
              <textarea name="bioShort" defaultValue={member.bioShort} rows={3} className={fieldTextarea} />
            </label>
          </div>
        </section>

        <section className={cardPadded}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className={sectionTitle}>Biography</h2>
              <p className={`mt-1 ${helpText}`}>Edit the long biography in separate paragraphs.</p>
            </div>
            <button type="button" className={secondaryButton} onClick={() => setBio((current) => [...current, ""])}>
              <Plus className="size-4" aria-hidden="true" />
              Add paragraph
            </button>
          </div>

          {bio.length > 0 ? (
            <div className="space-y-3">
              {bio.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1">
                    <RichTextEditor
                      label={`Paragraph ${index + 1}`}
                      value={paragraph}
                      onChange={(html) =>
                        setBio((current) =>
                          current.map((item, itemIndex) => (itemIndex === index ? html : item)),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={`${secondaryButton} mt-5 px-2.5`}
                    aria-label={`${index + 1}. Remove paragraph`}
                    onClick={() => setBio((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={helpText}>No biography paragraphs have been added yet.</p>
          )}
        </section>

        <section className={cardPadded}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className={sectionTitle}>Focus areas</h2>
              <p className={`mt-1 ${helpText}`}>Add titles and links for the member&apos;s focus areas.</p>
            </div>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => setWorksOn((current) => [...current, { label: "", href: "" }])}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add focus area
            </button>
          </div>

          {worksOn.length > 0 ? (
            <div className="space-y-3">
              {worksOn.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-[var(--radius-sm)] border border-brand-border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
                >
                  <label className={fieldLabel}>
                    Title
                    <input
                      value={item.label}
                      className={fieldInput}
                      onChange={(event) =>
                        setWorksOn((current) =>
                          current.map((entry, itemIndex) =>
                            itemIndex === index ? { ...entry, label: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className={fieldLabel}>
                    Link
                    <input
                      value={item.href}
                      className={fieldInput}
                      placeholder="/services/example"
                      onChange={(event) =>
                        setWorksOn((current) =>
                          current.map((entry, itemIndex) =>
                            itemIndex === index ? { ...entry, href: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className={`${secondaryButton} px-2.5`}
                    aria-label={`${index + 1}. Remove focus area`}
                    onClick={() => setWorksOn((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={helpText}>No focus areas have been added yet.</p>
          )}
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
            <ConfirmButton onConfirm={deleteMember} confirmLabel="Delete permanently" disabled={isPending}>
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
