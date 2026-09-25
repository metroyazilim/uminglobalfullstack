import { PageHeader } from "@/components/admin/PageHeader";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const session = await requireSuperAdmin();
  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Admin users"
        description="Manage admin panel accounts, roles, and passwords."
      />
      <UsersManager
        currentUserId={session.id}
        users={users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))}
      />
    </div>
  );
}
