"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./ui/Button";
import Logo from "./Logo";
import type { NavigationNode } from "@/lib/content/navigation";

function MobileItem({ item, onSelect, depth = 0 }: { item: NavigationNode; onSelect: () => void; depth?: number }) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onSelect}
        className={depth === 0 ? "block py-3 text-[15px] font-semibold uppercase tracking-[0.5px] text-ink transition-colors duration-200 hover:text-brand" : "block py-1.5 pl-4 text-[12px] font-medium uppercase tracking-[0.5px] text-body transition-colors duration-200 hover:text-brand"}
      >
        {item.label}
      </Link>
      {item.children.length > 0 ? <ul className="flex flex-col border-l border-divider pl-1">{item.children.map((child) => <MobileItem key={child.id} item={child} onSelect={onSelect} depth={depth + 1} />)}</ul> : null}
    </li>
  );
}

export default function MobileSidebar({ items }: { items: readonly NavigationNode[] }) {
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
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] bg-ink">
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
        <span aria-hidden="true" className="block h-[2px] w-4 bg-white" />
      </button>
      <div aria-hidden="true" onClick={() => setOpen(false)} className={`fixed inset-0 z-[60] bg-ink/60 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside role="dialog" aria-modal="true" aria-label="Menu" style={{ transform: open ? "translateX(0)" : "translateX(100%)" }} className="fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[88vw] flex-col bg-white shadow-overlay transition-transform duration-300">
        <div className="flex items-center justify-between px-6 py-5">
          <Logo height={56} className="h-[24px] w-auto" />
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center text-ink"><span aria-hidden="true" className="text-[22px] leading-none">&times;</span></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          <ul className="flex flex-col">{items.map((item) => <MobileItem key={item.id} item={item} onSelect={() => setOpen(false)} />)}</ul>
        </nav>
        <div className="px-6 pb-8"><Button href="/contact" withArrow={false} onClick={() => setOpen(false)} className="w-full text-[13px] uppercase tracking-[0.5px]">Start a Project</Button></div>
      </aside>
    </div>
  );
}
