import { cn } from "./ui";

const TONE_CLASS: Record<string, string> = {
  DRAFT: "bg-brand-muted-surface text-brand-muted",
  PUBLISHED: "bg-brand-success/10 text-brand-success",
  ARCHIVED: "bg-brand-warning/10 text-brand-warning",
  UNREAD: "bg-brand-primary/10 text-brand-primary",
  READ: "bg-brand-muted-surface text-brand-muted",
  REPLIED: "bg-brand-success/10 text-brand-success",
  SPAM: "bg-brand-danger/10 text-brand-danger",
};

const LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  SPAM: "Spam",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", TONE_CLASS[status] ?? "bg-brand-muted-surface text-brand-muted")}>
      {LABEL[status] ?? status}
    </span>
  );
}
