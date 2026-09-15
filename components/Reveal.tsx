"use client";

// Scroll-reveal wrapper used around every section that animates in on scroll across all pages.
// Client because it reads element position via getBoundingClientRect and reacts to scroll/resize.
//
// Content is visible by default in CSS. Only sections measured below the fold on mount get
// armed (hidden) via a class, and a single shared scroll/resize listener re-checks every
// registered section instead of one IntersectionObserver per section - a per-section observer
// left two of nine sections permanently at opacity 0 when it attached after layout had settled.
import { useEffect, useRef, type ReactNode } from "react";

// Only two variants exist on purpose: a vertical rise and a plain fade. Horizontal slides
// inflated document.scrollWidth on mobile and made neighbouring sections animate against each
// other. `delay` gives at most two 80ms steps for grouped items.
type RevealVariant = "up" | "fade";

interface Entry {
  el: HTMLElement;
  release: () => void;
}

const registry: Entry[] = [];
let listenerAttached = false;

function checkRegistry() {
  const vh = window.innerHeight;
  for (const entry of registry) {
    const rect = entry.el.getBoundingClientRect();
    if (rect.top < vh * 0.92) {
      entry.release();
    }
  }
}

function ensureListener() {
  if (listenerAttached) return;
  listenerAttached = true;
  window.addEventListener("scroll", checkRegistry, { passive: true });
  window.addEventListener("resize", checkRegistry, { passive: true });
}

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: 0 | 1 | 2;
  className?: string;
}

export default function Reveal({ children, variant = "up", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const release = () => el.classList.remove("reveal-armed");
    const rect = el.getBoundingClientRect();
    if (rect.top >= window.innerHeight * 0.92) {
      el.classList.add("reveal-armed");
    }

    const entry: Entry = { el, release };
    registry.push(entry);
    ensureListener();
    checkRegistry();

    return () => {
      const i = registry.indexOf(entry);
      if (i !== -1) registry.splice(i, 1);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal reveal-${variant} ${delay ? `reveal-d${delay}` : ""} ${className}`}>
      {children}
    </div>
  );
}
