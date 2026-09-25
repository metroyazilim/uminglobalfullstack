import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { OFFICES, type Office } from "@/components/offices";

/** Same resolution contract as `lib/content/team.ts`: no database → bundled
 * `components/offices.ts`; database with no published rows → bundled;
 * published rows → database wins outright. Errors degrade to bundled. */
function toOffice(row: {
  slug: string;
  city: string;
  country: string;
  region: string;
  summary: string;
  detail: unknown;
  headquarters: boolean;
}): Office {
  const detail = Array.isArray(row.detail) ? (row.detail as string[]) : [];
  return {
    slug: row.slug,
    city: row.city,
    country: row.country,
    region: row.region,
    summary: row.summary,
    detail: [detail[0] ?? "", detail[1] ?? ""],
    ...(row.headquarters ? { headquarters: true } : {}),
  };
}

export async function getOffices(): Promise<Office[]> {
  if (!hasDatabase()) return OFFICES;
  try {
    const rows = await prisma.office.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
    });
    if (rows.length === 0) return OFFICES;
    return rows.map(toOffice);
  } catch (error) {
    console.error("[content/offices] falling back to bundled office content", error);
    return OFFICES;
  }
}

export async function getOffice(slug: string): Promise<Office | undefined> {
  const offices = await getOffices();
  return offices.find((office) => office.slug === slug);
}

export async function getOfficeSlugs(): Promise<string[]> {
  const offices = await getOffices();
  return offices.map((office) => office.slug);
}
