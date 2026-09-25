"use client";

import { FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { cn, secondaryButton } from "@/components/admin/ui";

type FileDropzoneProps = {
  name: string;
  accept: string;
  required?: boolean;
  /** Extra classes on the wrapper, so a caller can stretch the zone to its grid cell. */
  className?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function acceptHint(accept: string): string {
  return accept.includes("pdf")
    ? "JPG, PNG, WebP, GIF, SVG, or PDF"
    : "JPG, PNG, WebP, GIF, or SVG";
}

export function FileDropzone({ name, accept, required = true, className }: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const previewUrlRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!form) return;

    const reset = () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setFile(null);
      setPreviewUrl(null);
    };
    form.addEventListener("reset", reset);
    return () => {
      form.removeEventListener("reset", reset);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function browse() {
    inputRef.current?.click();
  }
  function selectFile(nextFile: File | null) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl =
      nextFile?.type.startsWith("image/") ? URL.createObjectURL(nextFile) : null;
    previewUrlRef.current = nextPreviewUrl;
    setFile(nextFile);
    setPreviewUrl(nextPreviewUrl);
  }


  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    selectFile(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    browse();
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);

    const input = inputRef.current;
    const droppedFile = event.dataTransfer.files[0];
    if (!input || !droppedFile) return;

    const transfer = new DataTransfer();
    transfer.items.add(droppedFile);
    input.files = transfer.files;
    selectFile(droppedFile);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        required={required}
        accept={accept}
        className="sr-only"
        onChange={(event) => selectFile(event.currentTarget.files?.[0] ?? null)}
      />
      <div
        role="button"
        tabIndex={0}
        aria-controls={inputId}
        onClick={browse}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-40 w-full flex-1 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border border-dashed bg-brand-muted-surface/40 p-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          dragging
            ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
            : "border-brand-border hover:border-brand-primary",
        )}
      >
        {file ? (
          <div className="flex w-full min-w-0 items-center gap-3 text-left">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-brand-border bg-brand-surface">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Selected file preview"
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <FileText className="size-7 text-brand-muted" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-text" title={file.name}>
                {file.name}
              </p>
              <p className="mt-1 text-xs text-brand-muted">{formatBytes(file.size)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`${secondaryButton} px-2.5 py-1.5`}
                  onClick={(event) => {
                    event.stopPropagation();
                    browse();
                  }}
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Replace
                </button>
                <button
                  type="button"
                  className={`${secondaryButton} px-2.5 py-1.5`}
                  onClick={(event) => {
                    event.stopPropagation();
                    clear();
                  }}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto size-7 text-brand-muted" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-brand-text">Drop a file here or click to browse</p>
            <p className="mt-1 text-xs text-brand-muted">{acceptHint(accept)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
