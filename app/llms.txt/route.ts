import { SERVICES } from "@/components/services";
import { SITE_URL } from "@/components/seo";
import { getInsights } from "@/lib/content/insights";
import { getTeamMembers } from "@/lib/content/team";

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI search tools. Built from
// the same catalogues as the sitemap, so it cannot list a page that does not exist.
// Same reason as the sitemap: built from live data on every request.
export const dynamic = "force-dynamic";

export async function GET() {
  const [team, insights] = await Promise.all([getTeamMembers(), getInsights()]);
  const link = (label: string, path: string, note?: string) => `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

  const text = [
    "# UMIN Global",
    "",
    "> UMIN Global takes businesses from idea to international company: custom software, applied AI, growth marketing and market expansion, delivered from New York, London, Melbourne, Istanbul, Dubai and Shanghai.",
    "",
    "## Company",
    link("What we do", "/what-we-do"),
    link("About", "/about"),
    link("Offices", "/offices"),
    link("Contact", "/contact"),
    "",
    "## Team",
    ...team.map((member) => link(member.name, `/team/${member.slug}`, `${member.role}. ${member.bioShort}`)),
    "",
    "## Services",
    ...SERVICES.map((service) => link(service.name, `/services/${service.slug}`, service.summary)),
    "",
    "## Insights",
    ...insights.map((post) => link(post.title, `/insights/${post.slug}`, post.description)),
    "",
  ].join("\n");

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
