import Link from "next/link";
import Button from "./ui/Button";
import NavDropdown from "./NavDropdown";
import MobileSidebar from "./MobileSidebar";
import Logo from "./Logo";
import { getNavigation, type NavigationNode } from "@/lib/content/navigation";

function DesktopItem({ item }: { item: NavigationNode }) {
  if (item.children.length > 0) return <NavDropdown label={item.label} href={item.href} items={item.children} />;
  return (
    <Link href={item.href} className="inline-flex items-center px-3 text-[12px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors duration-200 hover:text-brand lg:px-[14.4px] lg:text-[13px]">
      {item.label}
    </Link>
  );
}

export default async function Header() {
  const items = await getNavigation();

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col border-b border-divider bg-white shadow-card">
      <div className="relative mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-16">
        <div className="flex h-[72px] items-center justify-between gap-6 lg:h-[104px] lg:justify-start">
          <Link href="/" className="block shrink-0 transition-opacity duration-200 hover:opacity-70" aria-label="UMIN Global">
            <Logo height={64} priority className="h-[26px] w-auto lg:h-[34px]" />
          </Link>

          <nav className="hidden min-w-0 flex-1 lg:block">
            <ul className="flex items-center justify-center">
              {items.map((item) => <li key={item.id} className="shrink-0"><DesktopItem item={item} /></li>)}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-6 lg:flex">
            <Button href="/contact" withArrow={false} className="text-[13px] uppercase tracking-[0.5px]">Start a Project</Button>
          </div>

          <MobileSidebar items={items} />
        </div>
      </div>
    </div>
  );
}
