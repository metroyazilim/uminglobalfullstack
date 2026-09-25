"use client";

import { Image as ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { fieldHint, fieldLabel, secondaryButton } from "@/components/admin/ui";
import { MediaPickerModal, type MediaSelectPayload } from "./MediaPickerModal";

export type MediaFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange?: (payload: { url: string; assetId: string | null; altText?: string }) => void;
  description?: string;
  hint?: string;
};

export function MediaField({ name, label, value, onChange, description, hint }: MediaFieldProps) {
  const labelId = useId();
  const descriptionId = useId();
  const hintId = useId();
  const [modalOpen, setModalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [altText, setAltText] = useState<string | undefined>();
  const isControlled = onChange !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const describedBy = [description ? descriptionId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  function change(payload: MediaSelectPayload) {
    setInternalValue(payload.url);
    setAltText(payload.altText);
    onChange?.(payload);
  }

  function remove() {
    change({ url: "", assetId: null, altText: undefined });
  }

  return (
    <div>
      <input type="hidden" name={name} value={currentValue} />
      <span id={labelId} className={fieldLabel}>{label}</span>
      {description ? <p id={descriptionId} className="mt-1 text-xs text-brand-muted">{description}</p> : null}

      {currentValue ? (
        <div className="mt-2 flex flex-col gap-3 rounded-[var(--radius-sm)] border border-brand-border bg-brand-muted-surface/40 p-3 sm:flex-row sm:items-center">
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-brand-border bg-brand-surface sm:w-28">
            <Image
              src={currentValue}
              alt={altText || `${label} preview`}
              fill
              sizes="112px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-brand-muted" title={currentValue}>{currentValue}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={secondaryButton}
                aria-labelledby={`${labelId} ${labelId}-replace`}
                aria-describedby={describedBy}
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                <span id={`${labelId}-replace`}>Replace</span>
              </button>
              <button type="button" onClick={remove} className={secondaryButton} aria-label={`Remove ${label}`}>
                <Trash2 className="size-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-brand-border bg-brand-muted-surface/40 px-4 py-6 text-xs font-bold uppercase tracking-wider text-brand-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
          aria-labelledby={`${labelId} ${labelId}-choose`}
          aria-describedby={describedBy}
        >
          <ImageIcon className="size-5" aria-hidden="true" />
          <span id={`${labelId}-choose`}>Choose image</span>
        </button>
      )}

      {hint ? <p id={hintId} className={fieldHint}>{hint}</p> : null}

      <MediaPickerModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={change} />
    </div>
  );
}
