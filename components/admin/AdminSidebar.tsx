"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/manage/actions";
import { ADMIN_NAV_SECTIONS, findNavItemByPath } from "./nav-items";
import { cn } from "./ui";

function initialsOf(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "A";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + second).toUpperCase();
}

/** Fixed 256px navigation rail, translated off-canvas below `lg`. Active
 * state comes from `usePathname()` — every panel is a real route, so the
 * highlight survives a hard refresh and a shared link. */
export function AdminSidebar({ email, mobileOpen, onClose }: { email: string; mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const activeHref = findNavItemByPath(pathname)?.href ?? null;

  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-30 bg-brand-invert/40 lg:hidden" onClick={onClose} aria-hidden="true" /> : null}

      <aside
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={mobileOpen ? "Admin menu" : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape" && mobileOpen) onClose();
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-surface shadow-[1px_0_0_rgba(12,27,51,0.06)] transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 pb-3 pt-5">
          <Link href="/manage" className="flex items-center gap-2.5">
            <Image src="/brand/umin-logo.svg" alt="UMIN Global" width={132} height={42} className="h-[22px] w-auto" unoptimized />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Admin</span>
          </Link>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-brand-muted hover:bg-brand-muted-surface lg:hidden" aria-label="Close menu">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-1 flex flex-1 flex-col overflow-y-auto px-4 py-2" aria-label="Admin navigation">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title ?? "root"} className="mb-1 mt-3 first:mt-1">
              {section.title ? <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">{section.title}</p> : null}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === activeHref;
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                          active ? "bg-brand-primary/10 text-brand-primary" : "text-brand-text hover:bg-brand-muted-surface",
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-brand-border bg-brand-muted-surface/50 px-4 py-3">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-invert text-xs font-bold text-brand-on-invert">{initialsOf(email)}</span>
            <span className="truncate text-xs font-medium text-brand-text">{email}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-muted-surface hover:text-brand-text">
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
