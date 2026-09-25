import { PageHeader } from "@/components/admin/PageHeader";
import { pageShell } from "@/components/admin/ui";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { resolveMailConfig } from "@/lib/mail";
import { EmailSettingsForm } from "./EmailSettingsForm";

function valueOrFallback(value: string | null | undefined, fallback: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed || fallback || "";
}

export default async function EmailSettingsPage() {
  const session = await requireSuperAdmin();
  const [settings, resolved] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { singleton: true },
      select: {
        smtpHost: true,
        smtpPort: true,
        smtpSecure: true,
        smtpUser: true,
        smtpPasswordEnc: true,
        smtpFrom: true,
        contactTo: true,
      },
    }),
    resolveMailConfig(),
  ]);

  const port = settings?.smtpPort ?? resolved?.port ?? null;

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Administration"
        title="Email"
        description="Configure, verify, and test the SMTP service used by the contact form and admin emails."
      />
      <EmailSettingsForm
        adminEmail={session.email}
        settings={{
          host: valueOrFallback(settings?.smtpHost, resolved?.host),
          port,
          secure: settings?.smtpSecure ?? resolved?.secure ?? port === 465,
          user: valueOrFallback(settings?.smtpUser, resolved?.user),
          from: valueOrFallback(settings?.smtpFrom, resolved?.from),
          contactTo: valueOrFallback(settings?.contactTo, resolved?.contactTo),
        }}
        hasStoredPassword={Boolean(settings?.smtpPasswordEnc)}
        source={resolved?.source ?? null}
      />
    </div>
  );
}
