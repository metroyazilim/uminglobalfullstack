"use client";

// Mobile/tablet navigation: a hamburger that opens a sidebar, because the nav now carries six
// top-level entries plus seven capability links - too many for the single scrolling row the
// header uses at `lg` and up. Client component: it owns open/closed state, locks body scroll
// while open, and closes on Escape or on any link tap.
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./ui/Button";

interface NavLink {
  label: string;
  href: string;
}

interface MobileSidebarProps {
  items: readonly ({ label: string; href: string } | { label: string; dropdown: readonly NavLink[] })[];
}

export default function MobileSidebar({ items }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="flex h-full items-center lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] bg-ink"
      >
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
      </button>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/60 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // Inline transform on purpose: Tailwind v4 maps translate-x-* onto the separate
        // `translate` property, which left the panel parked at 100% even with translate-x-0
        // applied (measured: aside rendered at x = viewport width). `transform` also matches
        // what transition-transform animates.
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        className="fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[88vw] flex-col bg-white shadow-overlay transition-transform duration-300"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-[18px] font-bold tracking-tight text-ink">
            UMIN <span className="font-medium text-body">GLOBAL</span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center text-ink"
          >
            <span aria-hidden="true" className="text-[22px] leading-none">
              &times;
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          <ul className="flex flex-col">
            {items.map((item) =>
              "dropdown" in item ? (
                <li key={item.label} className="py-3">
                  <span className="t-eyebrow text-label">{item.label}</span>
                  <ul className="flex flex-col pt-1">
                    {item.dropdown.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-[14px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors duration-200 hover:text-brand"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[15px] font-semibold uppercase tracking-[0.5px] text-ink transition-colors duration-200 hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="px-6 pb-8">
          <Button
            href="/contact"
            withArrow={false}
            onClick={() => setOpen(false)}
            className="w-full text-[13px] uppercase tracking-[0.5px]"
          >
            Start a Project
          </Button>
          <span className="mt-5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-label">
            Email
          </span>
          <a href="mailto:info@uminglobal.com" className="mt-1 block text-[15px] font-bold text-ink">
            info@uminglobal.com
          </a>
        </div>
      </aside>
    </div>
  );
}
