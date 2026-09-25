"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { fieldLabel, primaryButton } from "@/components/admin/ui";
import { applyPasswordResetAction } from "../password-reset-actions";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [state, action, pending] = useActionState(applyPasswordResetAction, {});

  return (
    <>
      <div className="mb-8">
        <span className="mb-5 flex size-12 items-center justify-center rounded-[var(--radius-sm)] bg-brand-invert text-base font-extrabold text-brand-on-invert">U</span>
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">Set a new password</h1>
        <p className="mt-1 text-sm text-brand-muted">Your password must be at least 12 characters.</p>
      </div>

      {token ? (
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />
          <div className="flex flex-col">
            <label htmlFor="password" className={fieldLabel}>New password</label>
            <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={12} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="passwordConfirm" className={fieldLabel}>Confirm new password</label>
            <PasswordInput id="passwordConfirm" name="passwordConfirm" autoComplete="new-password" required minLength={12} />
          </div>

          {state.error ? (
            <p role="alert" className="rounded-[var(--radius-sm)] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-sm text-brand-danger">{state.error}</p>
          ) : null}
          {state.success ? (
            <p role="status" className="rounded-[var(--radius-sm)] border border-brand-success/30 bg-brand-success/5 px-3 py-2 text-sm text-brand-success">{state.success}</p>
          ) : null}

          <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full py-2.5`}>
            {pending ? "Saving…" : "Update password"}
          </button>
        </form>
      ) : (
        <p role="alert" className="rounded-[var(--radius-sm)] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-sm text-brand-danger">
          The reset link is missing or invalid. Please request a new link.
        </p>
      )}

      <Link href="/manage/login" className="mt-6 block text-center text-sm font-semibold text-brand-primary hover:underline">Back to sign in</Link>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<p className="text-sm text-brand-muted">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
