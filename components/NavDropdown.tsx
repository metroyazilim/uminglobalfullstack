"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import ChevronIcon from "./icons/ChevronIcon";

interface NavLink {
  label: string;
  href: string;
  children?: readonly NavLink[];
}

function MenuItem({ item, depth = 0, onSelect }: { item: NavLink; depth?: number; onSelect: () => void }) {
  return (
    <div>
      <Link
        href={item.href}
        role="menuitem"
        onClick={onSelect}
        className={`block px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors hover:bg-section-gray hover:text-brand ${depth > 0 ? "pl-8 text-[12px]" : ""}`}
      >
        {item.label}
      </Link>
      {item.children?.map((child) => <MenuItem key={child.href} item={child} depth={depth + 1} onSelect={onSelect} />)}
    </div>
  );
}

export default function NavDropdown({ label, href, items }: { label: string; href?: string; items: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, { capture: true, passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, { capture: true });
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const toggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((value) => !value);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex items-center gap-1 px-3 text-[12px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors duration-200 hover:text-brand lg:px-[14.4px] lg:text-[13px]"
      >
        {label}
        <ChevronIcon direction="right" className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open ? createPortal(
        <div ref={panelRef} role="menu" style={{ top: position.top, left: position.left }} className="fixed z-[80] w-[240px] overflow-hidden rounded-card border border-divider bg-white py-1 shadow-raised">
          {href ? <MenuItem item={{ label, href }} onSelect={() => setOpen(false)} /> : null}
          {items.map((item) => <MenuItem key={item.href} item={item} onSelect={() => setOpen(false)} />)}
        </div>,
        document.body,
      ) : null}
    </>
  );
}
