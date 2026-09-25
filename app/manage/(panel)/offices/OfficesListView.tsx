"use client";

import type { ContentStatus } from "@prisma/client";
import { Archive, ArrowDown, ArrowUp, Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  cn,
  iconButton,
  table,
  tableBody,
  tableCell,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableWrap,
} from "@/components/admin/ui";
import { archiveOfficeAction, moveOfficeAction } from "./actions";

export type OfficeListRow = {
  id: string;
  city: string;
  country: string;
  region: string;
  headquarters: boolean;
  status: ContentStatus;
};

export function OfficesListView({ offices }: { offices: readonly OfficeListRow[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const move = (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await moveOfficeAction(id, direction);
      if (result.error) toast(result.error, "error");
      else if (result.success) toast(result.success);
    });
  };

  const toggleArchive = (office: OfficeListRow) => {
    const shouldArchive = office.status !== "ARCHIVED";
    startTransition(async () => {
      const result = await archiveOfficeAction(office.id, shouldArchive);
      if (result.error) toast(result.error, "error");
      else if (result.success) toast(result.success);
    });
  };

  return (
    <div className={tableWrap} aria-busy={isPending}>
      <table className={table}>
        <thead>
          <tr className={tableHeadRow}>
            <th className={tableHeadCell}>Order</th>
            <th className={tableHeadCell}>City / country</th>
            <th className={tableHeadCell}>Region</th>
            <th className={tableHeadCell}>Headquarters</th>
            <th className={tableHeadCell}>Status</th>
            <th className={`${tableHeadCell} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody className={tableBody}>
          {offices.map((office, index) => (
            <tr key={office.id} className={tableRow}>
              <td className={tableCell}>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className={cn(iconButton, "disabled:cursor-not-allowed disabled:opacity-30")}
                    aria-label={`${office.city || "Untitled office"} move up`}
                    disabled={isPending || index === 0}
                    onClick={() => move(office.id, "up")}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={cn(iconButton, "disabled:cursor-not-allowed disabled:opacity-30")}
                    aria-label={`${office.city || "Untitled office"} move down`}
                    disabled={isPending || index === offices.length - 1}
                    onClick={() => move(office.id, "down")}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
              <td className={tableCell}>
                <div className="min-w-44">
                  <p className="font-bold text-brand-text">{office.city.trim() || "Untitled office"}</p>
                  <p className="mt-0.5 text-xs text-brand-muted">{office.country.trim() || "No country set"}</p>
                </div>
              </td>
              <td className={tableCell}>{office.region.trim() || "—"}</td>
              <td className={tableCell}>
                {office.headquarters ? (
                  <span className="inline-flex rounded-[var(--radius-sm)] bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Headquarters
                  </span>
                ) : (
                  <span className="text-brand-muted">—</span>
                )}
              </td>
              <td className={tableCell}>
                <StatusBadge status={office.status} />
              </td>
              <td className={tableCell}>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/manage/offices/${office.id}`} className={iconButton} aria-label="Edit">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                  <ConfirmButton
                    onConfirm={() => toggleArchive(office)}
                    confirmLabel={office.status === "ARCHIVED" ? "Move to draft" : "Archive"}
                    tone={office.status === "ARCHIVED" ? "neutral" : "danger"}
                    disabled={isPending}
                  >
                    {office.status === "ARCHIVED" ? (
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Archive className="size-3.5" aria-hidden="true" />
                    )}
                    {office.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                  </ConfirmButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
