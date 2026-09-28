"use client";

import { Archive, FileText, Image as ImageIcon, LayoutGrid, List as ListIcon, Save, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { FileDropzone } from "@/components/admin/FileDropzone";
import { Pagination } from "@/components/admin/Pagination";
import { useToast } from "@/components/admin/Toast";
import {
  card,
  cardPadded,
  fieldError,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  helpText,
  primaryButton,
  secondaryButton,
  sectionTitle,
} from "@/components/admin/ui";
import type { MediaAssetDto } from "@/lib/media/types";
import {
  archiveMediaAssetAction,
  deleteMediaAssetAction,
  updateMediaMetadataAction,
  type MediaActionState,
} from "./actions";

type MediaView = "grid" | "list";

const initialActionState: MediaActionState = { status: "idle" };

function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function AssetCard({ asset, view }: { asset: MediaAssetDto; view: MediaView }) {
  const router = useRouter();
  const { toast } = useToast();
  const [transitionPending, startTransition] = useTransition();
  const [metadataState, metadataAction, metadataPending] = useActionState(
    async (_previous: MediaActionState, formData: FormData) => updateMediaMetadataAction(asset.id, formData),
    initialActionState,
  );
  const [archiveState, runArchive, archivePending] = useActionState(
    async (_previous: MediaActionState, archived: boolean) => archiveMediaAssetAction(asset.id, archived),
    initialActionState,
  );
  const [deleteState, runDelete, deletePending] = useActionState(
    async (_previous: MediaActionState) => deleteMediaAssetAction(asset.id),
    initialActionState,
  );

  useEffect(() => {
    if (metadataState.status === "success") {
      toast(metadataState.success);
      router.refresh();
    } else if (metadataState.status === "error") {
      toast(metadataState.error, "error");
    }
  }, [metadataState, router, toast]);

  useEffect(() => {
    if (archiveState.status === "success") {
      toast(archiveState.success);
      router.refresh();
    } else if (archiveState.status === "error") {
      toast(archiveState.error, "error");
    }
  }, [archiveState, router, toast]);

  useEffect(() => {
    if (deleteState.status === "success") {
      toast(deleteState.success);
      router.refresh();
    } else if (deleteState.status === "error") {
      toast(deleteState.error, "error");
    }
  }, [deleteState, router, toast]);

  const dimensions = asset.width && asset.height ? `${asset.width} × ${asset.height}px` : "Dimensions unavailable";
  const mutationPending = transitionPending || archivePending || deletePending;

  return (
    <article className={view === "list" ? `${card} flex overflow-hidden` : `${card} overflow-hidden`}>
      <a
        href={asset.url}
        target="_blank"
        rel="noopener noreferrer"
        className={view === "list" ? "relative h-28 w-36 shrink-0 overflow-hidden bg-brand-muted-surface sm:h-32 sm:w-44" : "relative flex aspect-4/3 items-center justify-center overflow-hidden bg-brand-muted-surface"}
      >
        {asset.kind === "IMAGE" ? (
          <Image
            src={asset.url}
            alt={asset.altText || asset.filename}
            fill
            sizes={view === "list" ? "176px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-contain"
            unoptimized
          />
        ) : (
          <FileText className="size-14 text-brand-muted" aria-hidden="true" />
        )}
      </a>

      <div className={view === "list" ? "min-w-0 flex-1 p-3" : "border-t border-brand-border p-3"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-brand-text" title={asset.filename}>{asset.filename}</h2>
            <p className={`${helpText} mt-1`}>{dimensions} · {formatBytes(asset.byteSize)}</p>
          </div>
          {asset.kind === "IMAGE" ? <ImageIcon className="size-4 shrink-0 text-brand-muted" aria-label="Image" /> : <FileText className="size-4 shrink-0 text-brand-muted" aria-label="Document" />}
        </div>

        <form action={metadataAction} className="mt-4 space-y-3">
          <label className={fieldLabel}>
            Alt text
            <input name="altText" defaultValue={asset.altText ?? ""} maxLength={500} className={fieldInput} />
          </label>
          <label className={fieldLabel}>
            Description
            <textarea name="caption" defaultValue={asset.caption ?? ""} maxLength={2_000} rows={2} className={fieldTextarea} />
          </label>
          <button type="submit" disabled={metadataPending} className={secondaryButton}>
            <Save className="size-3.5" aria-hidden="true" />
            {metadataPending ? "Saving…" : "Save details"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-border pt-4">
          <ConfirmButton
            disabled={mutationPending}
            tone="neutral"
            confirmLabel={asset.archived ? "Restore" : "Archive"}
            onConfirm={() => startTransition(() => runArchive(!asset.archived))}
          >
            <Archive className="size-3.5" aria-hidden="true" />
            {asset.archived ? "Unarchive" : "Archive"}
          </ConfirmButton>
          <ConfirmButton
            disabled={!asset.archived || mutationPending}
            confirmLabel="Delete permanently"
            onConfirm={() => startTransition(() => runDelete())}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete
          </ConfirmButton>
          {!asset.archived ? <span className={fieldHint}>Archive it first to delete.</span> : null}
        </div>
      </div>
    </article>
  );
}

export function MediaLibraryView({
  assets,
  page,
  pageSize,
  total,
}: {
  assets: readonly MediaAssetDto[];
  page: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [view, setView] = useState<MediaView>("grid");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setUploadError(null);

    try {
      const response = await fetch("/api/manage/media/upload", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "File could not be uploaded.");

      formRef.current?.reset();
      toast("Uploaded");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "File could not be uploaded.";
      setUploadError(message);
      toast(message, "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className={cardPadded}>
        <h2 className={sectionTitle}>Upload file</h2>
        <p className={`${helpText} mt-1`}>Upload a JPG, PNG, WebP, GIF, SVG, or PDF file.</p>
        <form ref={formRef} onSubmit={upload} className="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
          <FileDropzone name="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.pdf" className="h-full" />
          <div className="flex flex-col gap-4">
            <label className={fieldLabel}>
              Alt text <span className="normal-case tracking-normal">(optional)</span>
              <input name="altText" maxLength={500} className={fieldInput} />
            </label>
            <label className={fieldLabel}>
              Description <span className="normal-case tracking-normal">(optional)</span>
              <input name="caption" maxLength={2_000} className={fieldInput} />
            </label>
            <div className="mt-auto">
              <button type="submit" disabled={uploading} className={primaryButton}>
                <Upload className="size-4" aria-hidden="true" />
                {uploading ? "Uploading…" : "Upload"}
              </button>
              {uploadError ? <p className={fieldError}>{uploadError}</p> : null}
            </div>
          </div>
        </form>
      </section>

      {assets.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media found" description="Upload your first file using the form above." />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">{total} assets</p>
            <div className="flex items-center gap-2" aria-label="Media view">
              <button type="button" className={view === "grid" ? primaryButton : secondaryButton} aria-pressed={view === "grid"} onClick={() => setView("grid")}>
                <LayoutGrid className="size-3.5" aria-hidden="true" />
                Grid
              </button>
              <button type="button" className={view === "list" ? primaryButton : secondaryButton} aria-pressed={view === "list"} onClick={() => setView("list")}>
                <ListIcon className="size-3.5" aria-hidden="true" />
                List
              </button>
            </div>
          </div>
          <div className={view === "list" ? "space-y-3" : "grid gap-3 sm:grid-cols-3 xl:grid-cols-4"}>
            {assets.map((asset) => <AssetCard key={asset.id} asset={asset} view={view} />)}
          </div>
        </>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} basePath="/manage/media" />
    </div>
  );
}
