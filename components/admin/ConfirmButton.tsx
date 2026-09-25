"use client";

import { useState, type ReactNode } from "react";
import { cn, dangerLinkButton, secondaryButton } from "./ui";

/** A button that requires a second click within the same render (a small
 * inline "emin misiniz?" swap) before its `onConfirm` runs — the same
 * one-click-away-from-destructive guard every archive/delete action in the
 * panel uses, without a separate modal component per screen. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Onayla",
  tone = "danger",
  disabled = false,
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "neutral";
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <button type="button" disabled={disabled} onClick={onConfirm} className={cn(tone === "danger" ? dangerLinkButton : secondaryButton, "font-bold")}>
          {confirmLabel}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-xs font-medium text-brand-muted hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={() => setConfirming(true)} className={tone === "danger" ? dangerLinkButton : secondaryButton}>
      {children}
    </button>
  );
}
