import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { TEAM_MEMBERS, type TeamMember, type TeamPhoto } from "@/components/teamMembers";

/**
 * The public site's single source for team data.
 *
 * Resolution order, applied per call:
 *   1. No `DATABASE_URL` (the site's zero-database deployment mode) → the
 *      content bundled in `components/teamMembers.ts`.
 *   2. Database reachable but no published rows → the bundled content, so a
 *      freshly migrated database never blanks the live site.
 *   3. Published rows → the database wins outright (never merged with the
 *      bundled list, which would resurrect members an admin deleted).
 * Any database error degrades to the bundled content and is logged.
 */
function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "") : [];
}

function photoArray(value: unknown): TeamPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { src, alt, caption } = item as Record<string, unknown>;
    if (typeof src !== "string" || !src.trim() || typeof alt !== "string") return [];
    return [{ src, alt, ...(typeof caption === "string" && caption.trim() ? { caption } : {}) }];
  });
}

function toTeamMember(row: {
  slug: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bioShort: string;
  bio: unknown;
  worksOn: unknown;
  sameAs: unknown;
  knowsAbout: unknown;
  alternateName: string | null;
  gallery: unknown;
}): TeamMember {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role,
    photo: row.photo,
    photoAlt: row.photoAlt,
    bioShort: row.bioShort,
    bio: Array.isArray(row.bio) ? (row.bio as string[]) : [],
    worksOn: Array.isArray(row.worksOn) ? (row.worksOn as { label: string; href: string }[]) : [],
    sameAs: stringArray(row.sameAs),
    knowsAbout: stringArray(row.knowsAbout),
    ...(row.alternateName?.trim() ? { alternateName: row.alternateName.trim() } : {}),
    gallery: photoArray(row.gallery),
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!hasDatabase()) return TEAM_MEMBERS;
  try {
    const rows = await prisma.teamMember.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return TEAM_MEMBERS;
    return rows.map(toTeamMember);
  } catch (error) {
    console.error("[content/team] falling back to bundled team content", error);
    return TEAM_MEMBERS;
  }
}

export async function getTeamMember(slug: string): Promise<TeamMember | undefined> {
  const members = await getTeamMembers();
  return members.find((member) => member.slug === slug);
}

export async function getTeamSlugs(): Promise<string[]> {
  const members = await getTeamMembers();
  return members.map((member) => member.slug);
}
