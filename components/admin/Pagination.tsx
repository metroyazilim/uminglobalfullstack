import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { secondaryButton, helpText, cn } from "./ui";

export function Pagination({ page, pageSize, total, basePath }: { page: number; pageSize: number; total: number; basePath: string }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => `${basePath}?page=${target}`;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-brand-border px-5 py-3.5">
      <p className={helpText}>
        Page {page} of {pageCount} · {total} records
      </p>
      <div className="flex items-center gap-2">
        <Link href={hrefFor(Math.max(1, page - 1))} aria-disabled={page <= 1} className={cn(secondaryButton, page <= 1 && "pointer-events-none opacity-40")}>
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Previous
        </Link>
        <Link href={hrefFor(Math.min(pageCount, page + 1))} aria-disabled={page >= pageCount} className={cn(secondaryButton, page >= pageCount && "pointer-events-none opacity-40")}>
          Next
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
