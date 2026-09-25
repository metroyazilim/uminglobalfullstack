"use client";

import type { ContentStatus } from "@prisma/client";
import { Archive, Plus, Save, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useRef, useState } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { MediaField } from "@/components/admin/MediaField";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  cardPadded,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  helpText,
  primaryButton,
  secondaryButton,
  sectionTitle,
} from "@/components/admin/ui";
import {
  deleteArchivedPostAction,
  publishPostAction,
  savePostDraftAction,
  togglePostArchiveAction,
  type PostActionState,
} from "../actions";
import { BlockEditor, type Block } from "./BlockEditor";

export type RelatedLink = { label: string; href: string };

export type PostEditorData = {
  id: string;
  version: number;
  status: ContentStatus;
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  date: string;
  dateDisplay: string;
  updated: string;
  readingMinutes: number;
  topic: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  ogTitle: string;
  ogSubtitle: string;
  body: Block[];
  related: RelatedLink[];
};

const initialActionState: PostActionState = {};

export function PostEditorPanel({ post }: { post: PostEditorData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [version, setVersion] = useState(post.version);
  const [status, setStatus] = useState<ContentStatus>(post.status);
  const [keywordsText, setKeywordsText] = useState(post.keywords.join(", "));
  const [body, setBody] = useState<Block[]>(post.body);
  const [related, setRelated] = useState<RelatedLink[]>(post.related);
  const reportMutation = useCallback(
    (result: PostActionState) => {
      if (result.error) {
        toast(result.error, "error");
        return;
      }
      if (result.success) toast(result.success);
      if (typeof result.version === "number") setVersion(result.version);
      if (result.status) setStatus(result.status);
      if (result.success) router.refresh();
    },
    [router, toast],
  );
  const runDraftAction = useCallback(
    async (previous: PostActionState, formData: FormData) => {
      const result = await savePostDraftAction(previous, formData);
      reportMutation(result);
      return result;
    },
    [reportMutation],
  );
  const runPublishAction = useCallback(
    async (previous: PostActionState, formData: FormData) => {
      const result = await publishPostAction(previous, formData);
      reportMutation(result);
      return result;
    },
    [reportMutation],
  );
  const runArchiveAction = useCallback(
    async (previous: PostActionState, formData: FormData) => {
      const result = await togglePostArchiveAction(previous, formData);
      reportMutation(result);
      return result;
    },
    [reportMutation],
  );
  const runDeleteAction = useCallback(
    async (previous: PostActionState, formData: FormData) => {
      const result = await deleteArchivedPostAction(previous, formData);
      if (result.error) toast(result.error, "error");
      if (result.deleted) {
        toast(result.success ?? "Post deleted.");
        router.push("/manage/posts");
        router.refresh();
      }
      return result;
    },
    [router, toast],
  );
  const [, draftAction, savingDraft] = useActionState(runDraftAction, initialActionState);
  const [, publishAction, publishing] = useActionState(runPublishAction, initialActionState);
  const [, archiveAction, archiving] = useActionState(runArchiveAction, initialActionState);
  const [, deleteAction, deleting] = useActionState(runDeleteAction, initialActionState);
  const archiveFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const pending = savingDraft || publishing || archiving || deleting;
  const keywordValues = keywordsText
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Content management" title={post.title || "New post"} description="Manage the Insights article’s content, search appearance, and publication status." backHref="/manage/posts">
        <StatusBadge status={status} />
        <form ref={archiveFormRef} action={archiveAction}>
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="version" value={version} />
          <ConfirmButton
            onConfirm={() => archiveFormRef.current?.requestSubmit()}
            confirmLabel={status === "ARCHIVED" ? "Move to draft" : "Archive"}
            tone={status === "ARCHIVED" ? "neutral" : "danger"}
            disabled={pending}
          >
            <Archive className="size-3.5" aria-hidden="true" />
            {status === "ARCHIVED" ? "Move to draft" : "Archive"}
          </ConfirmButton>
        </form>
        {status === "ARCHIVED" ? (
          <form ref={deleteFormRef} action={deleteAction}>
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="version" value={version} />
            <ConfirmButton onConfirm={() => deleteFormRef.current?.requestSubmit()} confirmLabel="Delete permanently" disabled={pending}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Delete
            </ConfirmButton>
          </form>
        ) : null}
      </PageHeader>

      <form action={draftAction} className="space-y-5">
        <input type="hidden" name="id" value={post.id} />
        <input type="hidden" name="version" value={version} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywordValues)} />
        <input type="hidden" name="related" value={JSON.stringify(related)} />

        <section className={cardPadded}>
          <h2 className={sectionTitle}>Post details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={fieldLabel}>Title</span>
              <input name="title" defaultValue={post.title} className={fieldInput} required />
            </label>
            <label>
              <span className={fieldLabel}>Slug</span>
              <input name="slug" defaultValue={post.slug} className={fieldInput} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
              <span className={fieldHint}>Use lowercase letters, numbers, and hyphens.</span>
            </label>
            <label>
              <span className={fieldLabel}>Topic</span>
              <input name="topic" defaultValue={post.topic} className={fieldInput} required />
            </label>
            <label>
              <span className={fieldLabel}>Publication date</span>
              <input type="date" name="date" defaultValue={post.date} className={fieldInput} required />
            </label>
            <label>
              <span className={fieldLabel}>Display date</span>
              <input name="dateDisplay" defaultValue={post.dateDisplay} className={fieldInput} placeholder="24 September 2026" required />
              <span className={fieldHint}>This text is not generated automatically from the date.</span>
            </label>
            <label>
              <span className={fieldLabel}>Updated</span>
              <input name="updated" defaultValue={post.updated} className={fieldInput} placeholder="Optional" />
            </label>
            <label>
              <span className={fieldLabel}>Reading time (minutes)</span>
              <input type="number" name="readingMinutes" min={1} defaultValue={post.readingMinutes} className={fieldInput} required />
            </label>
            <label className="md:col-span-2">
              <span className={fieldLabel}>Short excerpt</span>
              <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className={fieldTextarea} required />
            </label>
            <label className="md:col-span-2">
              <span className={fieldLabel}>Keywords</span>
              <input value={keywordsText} onChange={(event) => setKeywordsText(event.target.value)} className={fieldInput} placeholder="strategy, growth, artificial intelligence" />
              <span className={fieldHint}>Separate keywords with commas.</span>
            </label>
          </div>
        </section>

        <section className={cardPadded}>
          <h2 className={sectionTitle}>Search and social media</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={fieldLabel}>Meta title</span>
              <input name="metaTitle" defaultValue={post.metaTitle} className={fieldInput} required />
            </label>
            <label className="md:col-span-2">
              <span className={fieldLabel}>Meta description</span>
              <textarea name="description" defaultValue={post.description} rows={3} className={fieldTextarea} required />
            </label>
            <label>
              <span className={fieldLabel}>Social title</span>
              <input name="ogTitle" defaultValue={post.ogTitle} className={fieldInput} required />
            </label>
            <label>
              <span className={fieldLabel}>Social subtitle</span>
              <input name="ogSubtitle" defaultValue={post.ogSubtitle} className={fieldInput} required />
            </label>
          </div>
        </section>

        <section className={cardPadded}>
          <h2 className={sectionTitle}>Cover image</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <MediaField name="image" label="Image" value={post.image} />
            </div>
            <label className="md:col-span-2">
              <span className={fieldLabel}>Image alt text</span>
              <input name="imageAlt" defaultValue={post.imageAlt} className={fieldInput} required />
            </label>
          </div>
        </section>

        <section className={cardPadded}>
          <div className="mb-4">
            <h2 className={sectionTitle}>Article body</h2>
            <p className={`mt-1 ${helpText}`}>Add blocks, change their types, or reorder them using the arrows.</p>
          </div>
          <BlockEditor value={body} onChange={setBody} />
        </section>

        <section className={cardPadded}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className={sectionTitle}>Related links</h2>
              <p className={`mt-1 ${helpText}`}>Pages displayed at the end of the article.</p>
            </div>
            <button type="button" onClick={() => setRelated((current) => [...current, { label: "", href: "" }])} className={secondaryButton}>
              <Plus className="size-4" aria-hidden="true" />
              Add link
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {related.map((link, index) => (
              <div key={index} className="grid gap-3 rounded-[var(--radius-sm)] border border-brand-border p-3 md:grid-cols-[1fr_1fr_auto]">
                <label>
                  <span className={fieldLabel}>Label</span>
                  <input
                    value={link.label}
                    onChange={(event) => setRelated((current) => current.map((item, currentIndex) => (currentIndex === index ? { ...item, label: event.target.value } : item)))}
                    className={fieldInput}
                  />
                </label>
                <label>
                  <span className={fieldLabel}>URL</span>
                  <input
                    value={link.href}
                    onChange={(event) => setRelated((current) => current.map((item, currentIndex) => (currentIndex === index ? { ...item, href: event.target.value } : item)))}
                    className={fieldInput}
                    placeholder="/services/..."
                  />
                </label>
                <button type="button" onClick={() => setRelated((current) => current.filter((_, currentIndex) => currentIndex !== index))} className="mt-6 flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-brand-muted hover:bg-brand-danger/10 hover:text-brand-danger" aria-label="Remove link">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
            {related.length === 0 ? <p className={helpText}>No related links added yet.</p> : null}
          </div>
        </section>

        <div className={`${cardPadded} flex flex-wrap items-center justify-between gap-3`}>
          <p className={helpText}>Publishing validates all fields and publishes this version immediately.</p>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={pending} className={secondaryButton}>
              <Save className="size-4" aria-hidden="true" />
              Save draft
            </button>
            <button type="submit" formAction={publishAction} disabled={pending} className={primaryButton}>
              <Send className="size-4" aria-hidden="true" />
              Publish
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
