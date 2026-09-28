import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";

export type NavigationNode = Readonly<{
  id: string;
  label: string;
  href: string;
  children: readonly NavigationNode[];
}>;

type NavigationSeed = Readonly<{ label: string; href: string; children?: readonly NavigationSeed[] }>;

export const DEFAULT_NAVIGATION: readonly NavigationSeed[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "What We Do",
    href: "/what-we-do",
    children: [
      { label: "Technology & AI", href: "/technology-ai" },
      { label: "Growth & Marketing", href: "/growth-marketing" },
      { label: "UMIN AI", href: "/umin-ai" },
      { label: "Ventures", href: "/ventures" },
      { label: "Global Strategy", href: "/global-strategy" },
      { label: "All Services", href: "/services" },
    ],
  },
  { label: "Team", href: "/team" },
  { label: "Offices", href: "/offices" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export async function getNavigation(): Promise<readonly NavigationNode[]> {
  if (!hasDatabase()) return DEFAULT_NAVIGATION.map((item, index) => seedToNode(item, `default-${index}`));

  try {
    const rows = await prisma.navigationItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    if (rows.length === 0) return DEFAULT_NAVIGATION.map((item, index) => seedToNode(item, `default-${index}`));

    const nodes = new Map(rows.map((row) => [row.id, { id: row.id, label: row.label, href: row.href, children: [] as NavigationNode[] }]));
    const roots: NavigationNode[] = [];
    for (const row of rows) {
      const node = nodes.get(row.id);
      if (!node) continue;
      if (row.parentId) nodes.get(row.parentId)?.children.push(node);
      else roots.push(node);
    }
    return roots;
  } catch (error) {
    console.error("[content/navigation] database navigation unavailable", error);
    return DEFAULT_NAVIGATION.map((item, index) => seedToNode(item, `default-${index}`));
  }
}

export async function ensureDefaultNavigation(): Promise<void> {
  const existing = await prisma.navigationItem.count();
  if (existing > 0) return;

  await prisma.$transaction(async (transaction) => {
    for (const [index, item] of DEFAULT_NAVIGATION.entries()) {
      const parent = await transaction.navigationItem.create({ data: { label: item.label, href: item.href, sortOrder: index } });
      for (const [childIndex, child] of (item.children ?? []).entries()) {
        await transaction.navigationItem.create({ data: { label: child.label, href: child.href, parentId: parent.id, sortOrder: childIndex } });
      }
    }
  });
}

function seedToNode(item: NavigationSeed, id: string): NavigationNode {
  return {
    id,
    label: item.label,
    href: item.href,
    children: (item.children ?? []).map((child, index) => seedToNode(child, `${id}-${index}`)),
  };
}
