import { Building2, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { pageShell, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { createOfficeAction } from "./actions";
import { OfficesListView } from "./OfficesListView";

export default async function OfficesPage() {
  await requireAdmin();
  const offices = await prisma.office.findMany({
    orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
  });

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Global network"
        title="Offices"
        description="Edit office information, manage publishing status, and set the order shown on the site."
        action={
          <form action={createOfficeAction}>
            <button type="submit" className={primaryButton}>
              <Plus className="size-4" aria-hidden="true" />
              New office
            </button>
          </form>
        }
      />

      {offices.length > 0 ? (
        <OfficesListView offices={offices} />
      ) : (
        <EmptyState
          icon={Building2}
          title="No offices yet"
          description="Use the “New office” button to create the first office."
        />
      )}
    </div>
  );
}
