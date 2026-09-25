import { Plus, UsersRound } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { pageShell, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { createTeamMemberAction } from "./actions";
import { TeamListView } from "./TeamListView";

export default async function TeamPage() {
  await requireAdmin();
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Content"
        title="Team"
        description="Manage team members, their publication status, and their order on the site."
        action={
          <form action={createTeamMemberAction}>
            <button type="submit" className={primaryButton}>
              <Plus className="size-4" aria-hidden="true" />
              New team member
            </button>
          </form>
        }
      />

      {members.length > 0 ? (
        <TeamListView members={members} />
      ) : (
        <EmptyState
          icon={UsersRound}
          title="No team members yet"
          description="Use the “New team member” button to create the first team member."
        />
      )}
    </div>
  );
}
