import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DatabaseNotConfigured } from "@/components/admin/DatabaseNotConfigured";
import { getAdminSession } from "@/lib/admin-auth";
import { hasAuthSecret, hasDatabase } from "@/lib/env";

/** Never prerendered: every screen below this layout is session-gated and
 * reads live database rows. */
export const dynamic = "force-dynamic";

/** The single auth gate for every `/manage` screen. `/manage/login` is a
 * sibling route outside this group and is deliberately not wrapped.
 * Individual mutations re-resolve the admin context themselves — this gate
 * decides what is *offered*, not what is *allowed*. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!hasDatabase() || !hasAuthSecret()) return <DatabaseNotConfigured context="the admin panel" />;

  const session = await getAdminSession();
  if (!session) redirect("/manage/login");

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
