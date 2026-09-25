"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "../actions";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { fieldInput, fieldLabel, primaryButton } from "@/components/admin/ui";

const initialState = { error: "" };

export default function ManageLoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <AuthLayout>
      <div className="mb-8">
        <Image src="/brand/umin-logo.svg" alt="UMIN Global" width={188} height={60} className="mb-6 h-[30px] w-auto" unoptimized priority />
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">Sign in to the admin panel</h1>
        <p className="mt-1 text-sm text-brand-muted">Sign in to edit the site&apos;s content.</p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email" className={fieldLabel}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={fieldInput} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="password" className={fieldLabel}>Password</label>
            <Link href="/manage/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">Forgot password?</Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </div>

        {state.error ? (
          <p role="alert" className="rounded-[var(--radius-sm)] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-sm text-brand-danger">
            {state.error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full py-2.5`}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
