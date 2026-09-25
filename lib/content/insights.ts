import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { INSIGHTS, type Block, type InsightPost } from "@/components/insights";

/** Same resolution contract as `lib/content/team.ts`: no database → bundled
 * `components/insights.ts`; database with no published rows → bundled;
 * published rows → database wins outright. Errors degrade to bundled. */
function toInsightPost(row: {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  date: Date;
  dateDisplay: string;
  updated: string | null;
  readingMinutes: number;
  topic: string;
  keywords: unknown;
  image: string;
  imageAlt: string;
  ogTitle: string;
  ogSubtitle: string;
  body: unknown;
  related: unknown;
}): InsightPost {
  return {
    slug: row.slug,
    title: row.title,
    metaTitle: row.metaTitle,
    description: row.description,
    excerpt: row.excerpt,
    date: row.date.toISOString().slice(0, 10),
    dateDisplay: row.dateDisplay,
    ...(row.updated ? { updated: row.updated } : {}),
    readingMinutes: row.readingMinutes,
    topic: row.topic,
    keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
    image: row.image,
    imageAlt: row.imageAlt,
    ogTitle: row.ogTitle,
    ogSubtitle: row.ogSubtitle,
    body: Array.isArray(row.body) ? (row.body as Block[]) : [],
    related: Array.isArray(row.related) ? (row.related as { label: string; href: string }[]) : [],
  };
}

export async function getInsights(): Promise<InsightPost[]> {
  if (!hasDatabase()) return INSIGHTS;
  try {
    const rows = await prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { date: "desc" } });
    if (rows.length === 0) return INSIGHTS;
    return rows.map(toInsightPost);
  } catch (error) {
    console.error("[content/insights] falling back to bundled insights content", error);
    return INSIGHTS;
  }
}

export async function getInsight(slug: string): Promise<InsightPost | undefined> {
  const posts = await getInsights();
  return posts.find((post) => post.slug === slug);
}

export async function getInsightSlugs(): Promise<string[]> {
  const posts = await getInsights();
  return posts.map((post) => post.slug);
}

/** Newest first, excluding the article being read — mirrors the bundled
 * `otherInsights()` helper so callers can swap without changing shape. */
export async function getOtherInsights(slug?: string, limit = 3): Promise<InsightPost[]> {
  const posts = await getInsights();
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
