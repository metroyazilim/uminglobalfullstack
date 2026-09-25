// Seeds the database with the content that ships in the codebase
// (components/teamMembers.ts, components/offices.ts, components/insights.ts)
// so the admin panel opens on the site's real content instead of an empty
// shell. Idempotent: rows are upserted by slug, so re-running never
// duplicates and never clobbers an admin's later edits to fields it does
// not own — it rewrites the row to the bundled content, which is the
// documented "reset to shipped content" path.
//
//   DATABASE_URL=... npm run content:import
import { PrismaClient } from "@prisma/client";
import { TEAM_MEMBERS } from "../components/teamMembers";
import { OFFICES } from "../components/offices";
import { INSIGHTS } from "../components/insights";
import { SITE_SETTINGS_DEFAULTS } from "../lib/content/site-settings-defaults";
import { PAGE_CONTENT_KEYS, SITE_PAGES } from "../lib/site-pages";
import type { PageBlock } from "../lib/content/page-content";

const prisma = new PrismaClient();

async function importTeam(): Promise<number> {
  for (const [index, member] of TEAM_MEMBERS.entries()) {
    const data = {
      name: member.name,
      role: member.role,
      photo: member.photo,
      photoAlt: member.photoAlt,
      bioShort: member.bioShort,
      bio: member.bio,
      worksOn: member.worksOn,
      sortOrder: index,
      status: "PUBLISHED" as const,
    };
    await prisma.teamMember.upsert({ where: { slug: member.slug }, create: { slug: member.slug, ...data }, update: data });
  }
  return TEAM_MEMBERS.length;
}

async function importOffices(): Promise<number> {
  for (const [index, office] of OFFICES.entries()) {
    const data = {
      city: office.city,
      country: office.country,
      region: office.region,
      summary: office.summary,
      detail: office.detail,
      headquarters: office.headquarters ?? false,
      sortOrder: index,
      status: "PUBLISHED" as const,
    };
    await prisma.office.upsert({ where: { slug: office.slug }, create: { slug: office.slug, ...data }, update: data });
  }
  return OFFICES.length;
}

async function importInsights(): Promise<number> {
  for (const post of INSIGHTS) {
    const data = {
      title: post.title,
      metaTitle: post.metaTitle,
      description: post.description,
      excerpt: post.excerpt,
      date: new Date(post.date),
      dateDisplay: post.dateDisplay,
      updated: post.updated ?? null,
      readingMinutes: post.readingMinutes,
      topic: post.topic,
      keywords: post.keywords,
      image: post.image,
      imageAlt: post.imageAlt,
      ogTitle: post.ogTitle,
      ogSubtitle: post.ogSubtitle,
      body: post.body,
      related: post.related,
      status: "PUBLISHED" as const,
    };
    await prisma.post.upsert({ where: { slug: post.slug }, create: { slug: post.slug, ...data }, update: data });
  }
  return INSIGHTS.length;
}

/** Creates the singleton row only when missing: an existing row already
 * carries admin edits and must not be reset by a re-run. */
async function ensureSiteSettings(): Promise<void> {
  const existing = await prisma.siteSettings.findFirst({ where: { singleton: true } });
  if (existing) return;
  await prisma.siteSettings.create({
    data: {
      singleton: true,
      organizationName: SITE_SETTINGS_DEFAULTS.organizationName,
      legalName: SITE_SETTINGS_DEFAULTS.legalName,
      alternateName: SITE_SETTINGS_DEFAULTS.alternateName,
      slogan: SITE_SETTINGS_DEFAULTS.slogan,
      description: SITE_SETTINGS_DEFAULTS.description,
      locality: SITE_SETTINGS_DEFAULTS.locality,
      countryCode: SITE_SETTINGS_DEFAULTS.countryCode,
      email: SITE_SETTINGS_DEFAULTS.email,
    },
  });
}

/** Creates editable draft blocks without changing the public fallback. */
async function ensurePageContent(): Promise<number> {
  let created = 0;
  for (const page of SITE_PAGES) {
    if (!(PAGE_CONTENT_KEYS as readonly string[]).includes(page.key)) continue;
    const existing = await prisma.pageContent.findUnique({ where: { key: page.key }, select: { id: true } });
    if (existing) continue;
    const blocks: PageBlock[] = [{ kind: "hero", eyebrow: "UMIN Global", title: page.label, body: "" }];
    await prisma.pageContent.create({ data: { key: page.key, blocks, status: "DRAFT" } });
    created += 1;
  }
  return created;
}

async function main(): Promise<void> {
  const [team, offices, insights] = [await importTeam(), await importOffices(), await importInsights()];
  await ensureSiteSettings();
  const pages = await ensurePageContent();
  console.log(`content:import — team: ${team}, offices: ${offices}, insights: ${insights}, pages created: ${pages}, site settings ensured`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
