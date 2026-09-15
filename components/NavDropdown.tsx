"use client";

// A primary nav item that reveals a short list of sub-links instead of linking directly.
// Click-to-toggle rather than hover-only so it works the same on touch and with a mouse; closes
// on an outside click, Escape, or any scroll. The panel renders through a portal at a fixed
// position computed from the trigger, so it is never clipped or stacked under the fixed header
// it hangs from, whatever overflow or z-index the header row itself carries.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import ChevronIcon from "./icons/ChevronIcon";

interface NavLink {
  label: string;
  href: string;
}

export default function NavDropdown({ label, items }: { label: string; items: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
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
    setOpen((v) => !v);
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
        <ChevronIcon
          direction="right"
          className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{ top: position.top, left: position.left }}
            className="fixed z-[80] w-[200px] overflow-hidden rounded-card border border-divider bg-white shadow-raised"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.5px] text-nav transition-colors duration-200 hover:bg-section-gray hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
