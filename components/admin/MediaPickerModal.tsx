"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FileDropzone } from "@/components/admin/FileDropzone";
import { fieldError, fieldHint, fieldInput, fieldLabel, primaryButton, secondaryButton } from "@/components/admin/ui";
import type { MediaAssetDto } from "@/lib/media/types";

export type MediaSelectPayload = {
  url: string;
  assetId: string | null;
  altText?: string;
};

type MediaPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (payload: MediaSelectPayload) => void;
};

type MediaListResponse =
  | { ok: true; assets: MediaAssetDto[]; total: number; page: number; pageSize: number }
  | { ok: false; error?: string };

type MediaUploadResponse =
  | { ok: true; asset: MediaAssetDto }
  | { ok: false; error?: string; code?: string };

function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function toPayload(asset: MediaAssetDto): MediaSelectPayload {
  return {
    url: asset.url,
    assetId: asset.id,
    altText: asset.altText || undefined,
  };
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const [assets, setAssets] = useState<MediaAssetDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [total, setTotal] = useState(0);
  // Starts `true`: the modal only mounts open, and the first list request
  // is in flight from that first render. Page changes flip it back on from
  // their own click handler, so no effect ever writes state synchronously.
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [listError, setListError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();

    fetch(`/api/manage/media/list?page=${page}`, { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as MediaListResponse;
        if (!response.ok || !result.ok) {
          throw new Error(result.ok ? "The media library could not be loaded." : result.error || "The media library could not be loaded.");
        }
        setAssets(result.assets.filter((asset) => asset.kind === "IMAGE" && !asset.archived));
        setTotal(result.total);
        setPageSize(result.pageSize);
        setListError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setListError(error instanceof Error ? error.message : "The media library could not be loaded.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [open, page, reloadToken]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setUploadError(null);

    try {
      const response = await fetch("/api/manage/media/upload", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as MediaUploadResponse;
      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "The image could not be uploaded." : result.error || "The image could not be uploaded.");
      }

      uploadFormRef.current?.reset();
      setLoading(true);
      setReloadToken((current) => current + 1);
      onSelect(toPayload(result.asset));
      onClose();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  if (!open || typeof document === "undefined") return null;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-invert/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
      onMouseDown={closeFromBackdrop}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[var(--radius-md)] border border-brand-border bg-brand-surface shadow-xl outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-brand-border px-5 py-4">
          <div>
            <h2 id="media-picker-title" className="text-base font-bold text-brand-text">Choose an image</h2>
            <p className="mt-1 text-xs text-brand-muted">Select an existing image or upload a new one.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-[var(--radius-sm)] p-2 text-brand-muted hover:bg-brand-muted-surface hover:text-brand-text" aria-label="Close media picker">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="flex min-h-0 flex-col" aria-label="Media library">
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex min-h-64 items-center justify-center text-sm text-brand-muted" role="status">
                  <Loader2 className="mr-2 size-5 animate-spin" aria-hidden="true" />
                  Loading images…
                </div>
              ) : listError ? (
                <div className={fieldError} role="alert">{listError}</div>
              ) : assets.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-brand-border p-8 text-center">
                  <ImageIcon className="mb-3 size-9 text-brand-muted" aria-hidden="true" />
                  <p className="text-sm font-bold text-brand-text">No images found</p>
                  <p className="mt-1 text-xs text-brand-muted">Upload an image to add it to the library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        onSelect(toPayload(asset));
                        onClose();
                      }}
                      className="overflow-hidden rounded-[var(--radius-sm)] border border-brand-border bg-brand-surface text-left transition-colors hover:border-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <span className="relative block aspect-square overflow-hidden bg-brand-muted-surface">
                        <Image
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 12rem"
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                      <span className="block p-2.5">
                        <span className="block truncate text-xs font-bold text-brand-text" title={asset.filename}>{asset.filename}</span>
                        <span className="mt-1 block text-[11px] text-brand-muted">
                          {asset.width && asset.height ? `${asset.width} × ${asset.height}px · ` : ""}{formatBytes(asset.byteSize)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {pageCount > 1 ? (
              <footer className="flex items-center justify-between gap-3 border-t border-brand-border px-5 py-3">
                <p className="text-xs text-brand-muted">Page {page} of {pageCount} · {total} files</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setLoading(true); setPage((current) => Math.max(1, current - 1)); }} disabled={page <= 1 || loading} className={secondaryButton}>
                    <ChevronLeft className="size-3.5" aria-hidden="true" />
                    Previous
                  </button>
                  <button type="button" onClick={() => { setLoading(true); setPage((current) => Math.min(pageCount, current + 1)); }} disabled={page >= pageCount || loading} className={secondaryButton}>
                    Next
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </footer>
            ) : null}
          </section>

          <aside className="overflow-y-auto border-t border-brand-border bg-brand-muted-surface/40 p-5 lg:border-l lg:border-t-0">
            <h3 className="text-sm font-bold text-brand-text">Upload a new image</h3>
            <p className="mt-1 text-xs text-brand-muted">The uploaded file will be selected automatically.</p>
            <form ref={uploadFormRef} onSubmit={upload} className="mt-5 space-y-4">
              <FileDropzone name="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" />
              <label className={fieldLabel}>
                Alt text <span className="normal-case tracking-normal">(optional)</span>
                <input name="altText" maxLength={500} className={fieldInput} />
                <span className={fieldHint}>Describe the image for screen-reader users.</span>
              </label>
              <label className={fieldLabel}>
                Caption <span className="normal-case tracking-normal">(optional)</span>
                <input name="caption" maxLength={2_000} className={fieldInput} />
              </label>
              <button type="submit" disabled={uploading} className={`${primaryButton} w-full`}>
                {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
                {uploading ? "Uploading…" : "Upload and use"}
              </button>
              {uploadError ? <p className={fieldError} role="alert">{uploadError}</p> : null}
            </form>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
