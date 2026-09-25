import { notFound } from "next/navigation";
import { pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { TeamEditorPanel } from "./TeamEditorPanel";

type Params = Promise<{ id: string }>;

export default async function TeamMemberEditorPage({ params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className={pageShell}>
      <TeamEditorPanel member={member} />
    </div>
  );
}
