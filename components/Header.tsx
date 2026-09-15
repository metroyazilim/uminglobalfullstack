import Link from "next/link";
import Button from "./ui/Button";
import NavDropdown from "./NavDropdown";
import MobileSidebar from "./MobileSidebar";

// Fixed top navigation bar (wordmark, primary menu, Start a Project CTA + email) used on every
// page. At `lg` and up the links sit on one centred row; below that they move into
// MobileSidebar, because seven top-level entries plus seven capability links do not fit a row.
// The five capability pages group under one "What We Do" dropdown rather than sitting as five
// top-level items, with the full service index as the last entry.
const WHAT_WE_DO_ITEMS = [
  { label: "What We Do", href: "/what-we-do" },
  { label: "Technology & AI", href: "/technology-ai" },
  { label: "Growth & Marketing", href: "/growth-marketing" },
  { label: "UMIN AI", href: "/umin-ai" },
  { label: "Ventures", href: "/ventures" },
  { label: "Global Strategy", href: "/global-strategy" },
  { label: "All Services", href: "/services" },
];

// Ordered top-level nav entries. A plain entry has `href`; "What We Do" has `dropdown` instead
// and renders as NavDropdown with WHAT_WE_DO_ITEMS.
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Do", dropdown: WHAT_WE_DO_ITEMS },
  { label: "Team", href: "/team" },
  // The five office pages were reachable only from the footer, which put them three clicks from
  // the home page. They are a location-intent entry point, so they belong in the nav.
  { label: "Offices", href: "/offices" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col border-b border-divider bg-white shadow-card">
      <div className="relative mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-16">
        <div className="flex h-[72px] items-center justify-between gap-6 lg:h-[104px] lg:justify-start">
          <Link href="/" className="block shrink-0" aria-label="UMIN Global">
            <span className="text-[18px] font-bold tracking-tight text-ink transition-opacity duration-200 hover:opacity-70 lg:text-[26px]">
              UMIN <span className="font-medium text-body">GLOBAL</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 lg:block lg:flex-none">
            <ul className="flex items-center lg:justify-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="shrink-0">
                  {"dropdown" in item ? (
                    <NavDropdown label={item.label} items={item.dropdown} />
                  ) : (
                    <Link
                      href={item.href}
                      className="inline-flex items-center px-3 text-[12px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors duration-200 hover:text-brand lg:px-[14.4px] lg:text-[13px]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-6 lg:flex">
            <a
              href="mailto:info@uminglobal.com"
              className="text-[15px] font-bold text-brand transition-colors duration-200 hover:text-ink"
            >
              info@uminglobal.com
            </a>
            <Button href="/contact" withArrow={false} className="text-[13px] uppercase tracking-[0.5px]">
              Start a Project
            </Button>
          </div>

          <MobileSidebar items={NAV_ITEMS} />
        </div>
      </div>
    </div>
  );
}
