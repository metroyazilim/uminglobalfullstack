"use client";

import type { MessageStatus } from "@prisma/client";
import { ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  cn,
  iconButton,
  primaryButton,
  secondaryButton,
  table,
  tableBody,
  tableCell,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableWrap,
} from "@/components/admin/ui";
import { updateMessageStatusAction, type MessageActionState } from "./actions";

const STATUS_OPTIONS: readonly MessageStatus[] = ["UNREAD", "READ", "REPLIED", "ARCHIVED", "SPAM"];

const STATUS_LABELS: Record<MessageStatus, string> = {
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
  SPAM: "Spam",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export type MessageListItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
};

function preview(value: string): string {
  const oneLine = value.replace(/\s+/g, " ").trim();
  return oneLine.length > 80 ? `${oneLine.slice(0, 77)}…` : oneLine;
}

export function MessagesListView({ messages }: { messages: readonly MessageListItem[] }) {
  if (messages.length === 0) {
    return <EmptyState icon={Mail} title="No messages found" description="No contact messages yet." />;
  }

  return (
    <div className={tableWrap}>
      <table className={table}>
        <thead>
          <tr className={tableHeadRow}>
            <th className={tableHeadCell}>From</th>
            <th className={tableHeadCell}>Message</th>
            <th className={tableHeadCell}>Status</th>
            <th className={tableHeadCell}>Date</th>
            <th className={cn(tableHeadCell, "w-12")}><span className="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody className={tableBody}>
          {messages.map((message) => (
            <tr key={message.id} className={cn(tableRow, message.status === "UNREAD" && "bg-brand-muted-surface/70")}>
              <td className={tableCell}>
                <Link href={`/manage/messages/${message.id}`} className="inline-flex items-center font-bold text-brand-text hover:underline">
                  {message.status === "UNREAD" ? <span className="mr-2 inline-block size-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" /> : null}
                  {message.name}
                </Link>
                <a href={`mailto:${message.email}`} className="mt-0.5 block text-xs text-brand-muted hover:text-brand-primary hover:underline">
                  {message.email}
                </a>
              </td>
              <td className={cn(tableCell, "max-w-md text-brand-muted")} title={message.message}>
                <span className="block truncate">{preview(message.message)}</span>
              </td>
              <td className={tableCell}><StatusBadge status={message.status} /></td>
              <td className={cn(tableCell, "whitespace-nowrap text-xs text-brand-muted")}>
                <time dateTime={message.createdAt.toISOString()}>{dateFormatter.format(message.createdAt)}</time>
              </td>
              <td className={tableCell}>
                <Link href={`/manage/messages/${message.id}`} className={iconButton} aria-label={`${message.name} message details`}>
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const initialState: MessageActionState = { status: "idle" };

function StatusChangeButton({
  id,
  expectedVersion,
  nextStatus,
  currentStatus,
}: {
  id: string;
  expectedVersion: number;
  nextStatus: MessageStatus;
  currentStatus: MessageStatus;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, pending] = useActionState(
    async (_previous: MessageActionState, _formData: FormData) =>
      updateMessageStatusAction(id, expectedVersion, nextStatus),
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast("Status updated");
      router.refresh();
    } else if (state.status === "conflict") {
      const current = state.current ? STATUS_LABELS[state.current.status] : "deleted record";
      toast(`Message was changed by another user. Current status: ${current}.`, "error");
      router.refresh();
    } else if (state.status === "error") {
      toast(state.error, "error");
    }
  }, [router, state, toast]);

  const active = nextStatus === currentStatus;
  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={active || pending}
        aria-current={active ? "true" : undefined}
        className={active ? primaryButton : secondaryButton}
      >
        {STATUS_LABELS[nextStatus]}
      </button>
    </form>
  );
}

export function MessageStatusControls({
  id,
  status,
  version,
}: {
  id: string;
  status: MessageStatus;
  version: number;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((nextStatus) => (
          <StatusChangeButton
            key={nextStatus}
            id={id}
            expectedVersion={version}
            nextStatus={nextStatus}
            currentStatus={status}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-brand-muted">The current status option is disabled.</p>
    </div>
  );
}
