import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { card, fieldLabel, helpText, pageShell, primaryButton, sectionTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { MessageStatusControls } from "../MessagesListView";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

type Params = Promise<{ id: string }>;

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className={fieldLabel}>{label}</dt>
      <dd className="mt-1.5 text-sm text-brand-text">{value?.trim() || "—"}</dd>
    </div>
  );
}

export default async function MessageDetailPage({ params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Messages"
        title={message.name}
        description={`${dateFormatter.format(message.createdAt)} — sent`}
        backHref="/manage/messages"
        backLabel="Back to inbox"
        action={
          <a href={`mailto:${message.email}`} className={primaryButton}>
            <Mail className="size-4" aria-hidden="true" />
            Send email
          </a>
        }
      />

      <article className={card}>
        <dl className="grid gap-5 border-b border-brand-border p-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Full name" value={message.name} />
          <DetailField label="Email" value={message.email} />
          <DetailField label="Company" value={message.company} />
          <DetailField label="Country" value={message.country} />
          <DetailField label="Need" value={message.need} />
          <div>
            <dt className={fieldLabel}>Status</dt>
            <dd className="mt-1.5"><StatusBadge status={message.status} /></dd>
          </div>
        </dl>

        <div className="p-5">
          <h2 className={sectionTitle}>Message</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-brand-text">{message.message}</p>
        </div>

        <dl className="grid gap-4 border-t border-brand-border px-5 py-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className={fieldLabel}>Record ID</dt>
            <dd className={`${helpText} mt-1 break-all`}>{message.id}</dd>
          </div>
          <div>
            <dt className={fieldLabel}>Version</dt>
            <dd className={`${helpText} mt-1`}>{message.version}</dd>
          </div>
          <div>
            <dt className={fieldLabel}>Created</dt>
            <dd className={`${helpText} mt-1`}><time dateTime={message.createdAt.toISOString()}>{dateFormatter.format(message.createdAt)}</time></dd>
          </div>
          <div>
            <dt className={fieldLabel}>Updated</dt>
            <dd className={`${helpText} mt-1`}><time dateTime={message.updatedAt.toISOString()}>{dateFormatter.format(message.updatedAt)}</time></dd>
          </div>
        </dl>
      </article>

      <section className={`${card} mt-5 p-5`}>
        <h2 className={sectionTitle}>Change status</h2>
        <div className="mt-3">
          <MessageStatusControls id={message.id} status={message.status} version={message.version} />
        </div>
      </section>
    </div>
  );
}
