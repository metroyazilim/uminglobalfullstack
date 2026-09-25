import "server-only";

import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";

export type ContentCollectionStatus = {
  source: "database" | "bundled";
  published: number;
  draft: number;
  archived: number;
};

export type ContentStatus = {
  team: ContentCollectionStatus;
  offices: ContentCollectionStatus;
  insights: ContentCollectionStatus;
  database: boolean;
  siteSettings: boolean;
};

type StatusCount = {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  _count: { _all: number };
};

function bundledStatus(): ContentStatus {
  const collection = (): ContentCollectionStatus => ({
    source: "bundled",
    published: 0,
    draft: 0,
    archived: 0,
  });

  return {
    team: collection(),
    offices: collection(),
    insights: collection(),
    database: false,
    siteSettings: false,
  };
}

function collectionStatus(rows: readonly StatusCount[]): ContentCollectionStatus {
  const counts = { published: 0, draft: 0, archived: 0 };

  for (const row of rows) {
    if (row.status === "PUBLISHED") counts.published = row._count._all;
    if (row.status === "DRAFT") counts.draft = row._count._all;
    if (row.status === "ARCHIVED") counts.archived = row._count._all;
  }

  return {
    source: counts.published > 0 ? "database" : "bundled",
    ...counts,
  };
}

/**
 * Reports the source the public content readers will use, alongside the
 * database lifecycle counts an operator needs to explain that decision.
 */
export async function getContentStatus(): Promise<ContentStatus> {
  if (!hasDatabase()) return bundledStatus();

  try {
    const [team, offices, insights, siteSettings] = await Promise.all([
      prisma.teamMember.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.office.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.post.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.siteSettings.findUnique({ where: { singleton: true }, select: { id: true } }),
    ]);

    return {
      team: collectionStatus(team),
      offices: collectionStatus(offices),
      insights: collectionStatus(insights),
      database: true,
      siteSettings: siteSettings !== null,
    };
  } catch (error) {
    console.error("[content/status] unable to read database content status", error);
    return bundledStatus();
  }
}
