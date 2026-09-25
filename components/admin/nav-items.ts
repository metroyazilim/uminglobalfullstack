import { FileText, Images, LayoutDashboard, MapPin, MessagesSquare, ScrollText, Search, Settings, Users, type LucideIcon } from "lucide-react";

export type AdminNavKey = "overview" | "pages" | "team" | "offices" | "posts" | "seo" | "messages" | "media" | "users" | "audit" | "settings";

export type AdminNavItem = Readonly<{
  key: AdminNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Public page this collection feeds, opened via the topbar's "View
   * live" link. `undefined` where no single public surface applies. */
  publicHref?: string;
}>;

export type AdminNavSection = Readonly<{ title: string | null; items: readonly AdminNavItem[] }>;

/**
 * Single source of truth for admin navigation, same role as anton/kadik's
 * components/admin/nav-items.ts. Every screen is a real route — the sidebar
 * derives its active state from `usePathname()`, never a query parameter.
 */
export const ADMIN_NAV_SECTIONS: readonly AdminNavSection[] = [
  {
    title: null,
    items: [{ key: "overview", label: "Overview", href: "/manage", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { key: "pages", label: "Pages", href: "/manage/pages", icon: FileText },
      { key: "team", label: "Team", href: "/manage/team", icon: Users, publicHref: "/team" },
      { key: "offices", label: "Offices", href: "/manage/offices", icon: MapPin, publicHref: "/offices" },
      { key: "posts", label: "Insights", href: "/manage/posts", icon: FileText, publicHref: "/insights" },
      { key: "seo", label: "SEO", href: "/manage/seo", icon: Search },
    ],
  },
  {
    title: "Inbox",
    items: [{ key: "messages", label: "Messages", href: "/manage/messages", icon: MessagesSquare, publicHref: "/contact" }],
  },
  {
    title: "Library",
    items: [{ key: "media", label: "Media", href: "/manage/media", icon: Images }],
  },
  {
    title: "Administration",
    items: [
      { key: "users", label: "Users", href: "/manage/users", icon: Users },
      { key: "audit", label: "Audit Log", href: "/manage/audit", icon: ScrollText },
      { key: "settings", label: "Settings", href: "/manage/settings", icon: Settings },
    ],
  },
];

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = ADMIN_NAV_SECTIONS.flatMap((section) => section.items);

/**
 * The nav item a pathname belongs to. `/manage` matches `overview` exactly;
 * every other item matches its own subtree so `/manage/team/<id>` still
 * highlights "Team".
 */
export function findNavItemByPath(pathname: string): AdminNavItem | null {
  if (pathname === "/manage") return ADMIN_NAV_ITEMS.find((item) => item.key === "overview") ?? null;
  return ADMIN_NAV_ITEMS.filter((item) => item.href !== "/manage" && pathname.startsWith(item.href)).sort((a, b) => b.href.length - a.href.length)[0] ?? null;
}
