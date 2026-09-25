"use client";

import type { ContentStatus } from "@prisma/client";
import { Archive, ArrowDown, ArrowUp, Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { RowThumbnail } from "@/components/admin/RowThumbnail";
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
import { archiveTeamMemberAction, moveTeamMemberAction } from "./actions";

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  status: ContentStatus;
};

export function TeamListView({ members }: { members: readonly TeamMemberRow[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const move = (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await moveTeamMemberAction(id, direction);
      if (result.error) toast(result.error, "error");
      else if (result.success) toast(result.success);
    });
  };

  const toggleArchive = (member: TeamMemberRow) => {
    const shouldArchive = member.status !== "ARCHIVED";
    startTransition(async () => {
      const result = await archiveTeamMemberAction(member.id, shouldArchive);
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
            <th className={tableHeadCell}>Image</th>
            <th className={tableHeadCell}>Team member</th>
            <th className={tableHeadCell}>Status</th>
            <th className={`${tableHeadCell} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody className={tableBody}>
          {members.map((member, index) => (
            <tr key={member.id} className={tableRow}>
              <td className={tableCell}>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className={cn(iconButton, "disabled:cursor-not-allowed disabled:opacity-30")}
                    aria-label={`${member.name || "Unnamed team member"} — Move up`}
                    disabled={isPending || index === 0}
                    onClick={() => move(member.id, "up")}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={cn(iconButton, "disabled:cursor-not-allowed disabled:opacity-30")}
                    aria-label={`${member.name || "Unnamed team member"} — Move down`}
                    disabled={isPending || index === members.length - 1}
                    onClick={() => move(member.id, "down")}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
              <td className={tableCell}>
                <RowThumbnail src={member.photo || null} alt={member.photoAlt || member.name || "Team member"} />
              </td>
              <td className={tableCell}>
                <div className="min-w-44">
                  <p className="font-bold text-brand-text">{member.name.trim() || "Unnamed team member"}</p>
                  <p className="mt-0.5 text-xs text-brand-muted">{member.role.trim() || "Role not provided"}</p>
                </div>
              </td>
              <td className={tableCell}>
                <StatusBadge status={member.status} />
              </td>
              <td className={tableCell}>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/manage/team/${member.id}`} className={iconButton} aria-label="Edit">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                  <ConfirmButton
                    onConfirm={() => toggleArchive(member)}
                    confirmLabel={member.status === "ARCHIVED" ? "Move to draft" : "Archive"}
                    tone={member.status === "ARCHIVED" ? "neutral" : "danger"}
                    disabled={isPending}
                  >
                    {member.status === "ARCHIVED" ? (
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Archive className="size-3.5" aria-hidden="true" />
                    )}
                    {member.status === "ARCHIVED" ? "Unarchive" : "Archive"}
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
