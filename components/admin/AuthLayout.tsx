import type { ReactNode } from "react";
import Image from "next/image";

/** Split sign-in shell: form on the left, branded panel on the right. The
 * branded half is presentation only and drops below `lg` so the form keeps
 * the full viewport on a phone. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root flex min-h-svh bg-brand-surface">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <div className="relative hidden flex-1 bg-brand-invert lg:block">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(var(--color-brand-primary) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          aria-hidden="true"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center justify-between gap-4">
            <Image src="/brand/umin-logo-light.svg" alt="UMIN Global" width={188} height={60} className="h-[34px] w-auto" unoptimized />
            <span className="rounded-[var(--radius-sm)] bg-brand-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Admin</span>
          </div>

          <div>
            <p className="text-[28px] font-extrabold leading-tight tracking-tight text-brand-on-invert">UMIN Global Content Management</p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-brand-on-invert-muted">
              Manage team, offices, Insights and incoming messages from one panel.
            </p>
            <p className="mt-8 text-[12px] font-bold uppercase tracking-wider text-brand-on-invert-muted">Secure admin access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
