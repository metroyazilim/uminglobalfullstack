import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";

// Nested (non-root) layout: app/layout.tsx already owns <html>/<body> for
// every route on the site, including /manage — this layout only adds the
// admin-only font variable and stylesheet on top of it, it never repeats
// <html>/<body>.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-admin-inter" });

export const metadata: Metadata = { title: { default: "UMIN Global Admin Panel", template: "%s | UMIN Admin" } };

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
