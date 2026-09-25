"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { cardPadded, primaryButton, secondaryButton } from "@/components/admin/ui";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className={cardPadded}>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-danger/10 text-brand-danger">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-danger">Panel error</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-brand-text">Something went wrong</h1>
            <p className="mt-2 text-sm text-brand-muted">
              The requested admin screen could not be loaded. Try again, or return to the overview.
            </p>
            {process.env.NODE_ENV !== "production" ? (
              <pre className="mt-4 overflow-x-auto rounded-[var(--radius-sm)] bg-brand-muted-surface p-3 text-xs whitespace-pre-wrap text-brand-text">
                {error.message}
              </pre>
            ) : null}
            {error.digest ? (
              <p className="mt-3 text-xs text-brand-muted">
                Error reference: <code className="font-mono text-brand-text">{error.digest}</code>
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className={primaryButton} onClick={reset}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Try again
              </button>
              <Link href="/manage" className={secondaryButton}>
                Back to overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
