"use client";

// A reload must land at the top of the page.
//
// Browsers default to `history.scrollRestoration = "auto"`, which puts a refreshed page back at
// the pixel offset it was left at. On a long marketing page that reads as a bug: the visitor
// refreshes and arrives mid-section with no header context. The fix has two halves, because by
// the time React hydrates the browser has often already restored the offset:
//
//   1. app/layout.tsx runs a blocking head script that switches restoration to "manual" *before*
//      first paint, but only when the navigation type is a reload. That is what actually
//      suppresses the restore.
//   2. This component finishes the job after hydration - it pins the offset to the top (or to the
//      requested #hash target), then hands restoration back to the browser so that Back and
//      Forward still return to where the visitor was.
import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type !== "reload") return;

    const settle = () => {
      const hash = window.location.hash;
      if (hash.length > 1) {
        // A reloaded deep link still belongs at its section, not at the top.
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
        return;
      }
      window.scrollTo(0, 0);
    };

    settle();
    const frame = requestAnimationFrame(settle);

    const handOff = () => {
      settle();
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };

    if (document.readyState === "complete") {
      handOff();
      return () => cancelAnimationFrame(frame);
    }

    window.addEventListener("load", handOff, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", handOff);
    };
  }, []);

  return null;
}
