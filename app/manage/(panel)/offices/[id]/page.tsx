import { notFound } from "next/navigation";
import { pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { OfficeEditorPanel } from "./OfficeEditorPanel";

type Params = Promise<{ id: string }>;

export default async function OfficeEditorPage({ params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const office = await prisma.office.findUnique({ where: { id } });
  if (!office) notFound();

  return (
    <div className={pageShell}>
      <OfficeEditorPanel office={office} />
    </div>
  );
}
