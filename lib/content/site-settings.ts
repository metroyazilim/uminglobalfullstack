import "server-only";
import { prisma } from "@/lib/db";
import { hasDatabase } from "@/lib/env";
import { SITE_SETTINGS_DEFAULTS, type SiteSettingsView } from "./site-settings-defaults";

export { SITE_SETTINGS_DEFAULTS };
export type { SiteSettingsView };

function pick(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

/** Site-wide organisation facts for the Organization/WebSite JSON-LD and
 * the footer's social links. Admin edits override field by field; an empty
 * field falls back to the shipped default rather than blanking it. */
export async function getSiteSettings(): Promise<SiteSettingsView> {
  if (!hasDatabase()) return SITE_SETTINGS_DEFAULTS;
  try {
    const row = await prisma.siteSettings.findFirst({ where: { singleton: true } });
    if (!row) return SITE_SETTINGS_DEFAULTS;
    return {
      organizationName: pick(row.organizationName, SITE_SETTINGS_DEFAULTS.organizationName),
      legalName: pick(row.legalName, SITE_SETTINGS_DEFAULTS.legalName),
      alternateName: pick(row.alternateName, SITE_SETTINGS_DEFAULTS.alternateName),
      slogan: pick(row.slogan, SITE_SETTINGS_DEFAULTS.slogan),
      description: pick(row.description, SITE_SETTINGS_DEFAULTS.description),
      foundingDate: pick(row.foundingDate, SITE_SETTINGS_DEFAULTS.foundingDate),
      locality: pick(row.locality, SITE_SETTINGS_DEFAULTS.locality),
      countryCode: pick(row.countryCode, SITE_SETTINGS_DEFAULTS.countryCode),
      email: pick(row.email, SITE_SETTINGS_DEFAULTS.email),
      phone: pick(row.phone, SITE_SETTINGS_DEFAULTS.phone),
      socials: {
        linkedin: pick(row.linkedin, SITE_SETTINGS_DEFAULTS.socials.linkedin),
        x: pick(row.x, SITE_SETTINGS_DEFAULTS.socials.x),
        facebook: pick(row.facebook, SITE_SETTINGS_DEFAULTS.socials.facebook),
        instagram: pick(row.instagram, SITE_SETTINGS_DEFAULTS.socials.instagram),
        youtube: pick(row.youtube, SITE_SETTINGS_DEFAULTS.socials.youtube),
      },
    };
  } catch (error) {
    console.error("[content/site-settings] falling back to shipped defaults", error);
    return SITE_SETTINGS_DEFAULTS;
  }
}
