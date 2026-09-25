"use client";

import { PlugZap, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { useToast } from "@/components/admin/Toast";
import {
  cardPadded,
  checkboxInput,
  dangerLinkButton,
  fieldHint,
  fieldInput,
  fieldLabel,
  helpText,
  primaryButton,
  secondaryButton,
  sectionTitle,
} from "@/components/admin/ui";
import {
  clearEmailPasswordAction,
  saveEmailSettingsAction,
  sendTestEmailAction,
  testMailConnectionAction,
  type EmailActionState,
} from "./actions";

export type EmailSettingsValues = Readonly<{
  host: string;
  port: number | null;
  secure: boolean;
  user: string;
  from: string;
  contactTo: string;
}>;

type Props = Readonly<{
  settings: EmailSettingsValues;
  hasStoredPassword: boolean;
  source: "database" | "environment" | null;
  adminEmail: string;
}>;

const INITIAL_STATE: EmailActionState = { ok: null, message: "" };

function InlineResult({ result }: { result: EmailActionState }) {
  if (result.ok === null || !result.message) return null;
  return (
    <p
      role="status"
      className={
        result.ok
          ? "rounded-[var(--radius-sm)] border border-brand-success/30 bg-brand-success/5 px-3 py-2 text-sm text-brand-success"
          : "rounded-[var(--radius-sm)] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-sm text-brand-danger"
      }
    >
      {result.message}
    </p>
  );
}

function StatusChip({ source }: { source: Props["source"] }) {
  const label = source === "database"
    ? "Served from database settings"
    : source === "environment"
      ? "Served from environment variables"
      : "Email is unconfigured";
  const tone = source === "database"
    ? "bg-brand-success/10 text-brand-success"
    : source === "environment"
      ? "bg-brand-warning/10 text-brand-warning"
      : "bg-brand-danger/10 text-brand-danger";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>
      {label}
    </span>
  );
}

export function EmailSettingsForm({ settings, hasStoredPassword, source, adminEmail }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [saveState, saveAction, savePending] = useActionState(saveEmailSettingsAction, INITIAL_STATE);
  const [sendState, sendAction, sendPending] = useActionState(sendTestEmailAction, INITIAL_STATE);
  const [connectionResult, setConnectionResult] = useState<EmailActionState>(INITIAL_STATE);
  const [passwordResult, setPasswordResult] = useState<EmailActionState>(INITIAL_STATE);
  const [connectionPending, startConnectionTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();

  useEffect(() => {
    if (saveState.ok === null) return;
    toast(saveState.message, saveState.ok ? "success" : "error");
    if (saveState.ok) router.refresh();
  }, [router, saveState, toast]);

  useEffect(() => {
    if (sendState.ok === null) return;
    toast(sendState.message, sendState.ok ? "success" : "error");
  }, [sendState, toast]);

  function testConnection() {
    setConnectionResult(INITIAL_STATE);
    startConnectionTransition(async () => {
      const result = await testMailConnectionAction();
      setConnectionResult(result);
      toast(result.message, result.ok ? "success" : "error");
    });
  }

  function clearPassword() {
    setPasswordResult(INITIAL_STATE);
    startPasswordTransition(async () => {
      const result = await clearEmailPasswordAction();
      setPasswordResult(result);
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className={cardPadded}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={sectionTitle}>SMTP configuration</h2>
            <p className={`${helpText} mt-1`}>Database settings take precedence over environment variables.</p>
          </div>
          <StatusChip source={source} />
        </div>

        <form action={saveAction} className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className={fieldLabel}>
              SMTP host
              <input
                name="host"
                defaultValue={settings.host}
                placeholder="smtp.example.com"
                autoComplete="off"
                className={fieldInput}
              />
            </label>
            <label className={fieldLabel}>
              Port
              <input
                name="port"
                type="number"
                min={1}
                max={65535}
                step={1}
                defaultValue={settings.port ?? ""}
                placeholder="465"
                inputMode="numeric"
                className={fieldInput}
              />
            </label>
            <label className={fieldLabel}>
              Username
              <input
                name="user"
                defaultValue={settings.user}
                autoComplete="username"
                className={fieldInput}
              />
              <span className={fieldHint}>Usually the full email address used to authenticate.</span>
            </label>
            <label className={fieldLabel}>
              Password
              <PasswordInput
                name="password"
                autoComplete="new-password"
                placeholder="Leave blank to keep the stored password"
              />
              <span className={fieldHint}>
                {hasStoredPassword
                  ? "A password is stored securely. Enter a value only to replace it."
                  : "No encrypted password is stored. SMTP_PASS will be used when available."}
              </span>
            </label>
            <label className={fieldLabel}>
              From address
              <input
                name="from"
                type="email"
                defaultValue={settings.from}
                placeholder="mail@example.com"
                autoComplete="email"
                className={fieldInput}
              />
            </label>
            <label className={fieldLabel}>
              Send contact enquiries to
              <input
                name="contactTo"
                type="email"
                defaultValue={settings.contactTo}
                placeholder="inbox@example.com"
                autoComplete="email"
                className={fieldInput}
              />
            </label>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium text-brand-text">
            <input
              name="secure"
              type="checkbox"
              defaultChecked={settings.secure}
              className={checkboxInput}
            />
            Use implicit TLS (port 465)
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={savePending} className={primaryButton}>
              {savePending ? "Saving…" : "Save email settings"}
            </button>
            {hasStoredPassword ? (
              <button
                type="button"
                onClick={clearPassword}
                disabled={passwordPending}
                className={dangerLinkButton}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                {passwordPending ? "Clearing…" : "Clear stored password"}
              </button>
            ) : null}
          </div>
          <InlineResult result={saveState} />
          <InlineResult result={passwordResult} />
        </form>
      </section>

      <section className={`${cardPadded} space-y-5`}>
        <div>
          <h2 className={sectionTitle}>Test email delivery</h2>
          <p className={`${helpText} mt-1`}>
            Verify the active SMTP credentials, then send a real message through the same mail boundary.
          </p>
        </div>

        <div className="space-y-3 border-b border-brand-border pb-5">
          <button
            type="button"
            onClick={testConnection}
            disabled={connectionPending}
            className={secondaryButton}
          >
            <PlugZap className="size-3.5" aria-hidden="true" />
            {connectionPending ? "Testing…" : "Test connection"}
          </button>
          <InlineResult result={connectionResult} />
        </div>

        <form action={sendAction} className="space-y-3">
          <label className={fieldLabel}>
            Test recipient
            <input
              name="recipient"
              type="email"
              required
              defaultValue={adminEmail}
              autoComplete="email"
              className={fieldInput}
            />
          </label>
          <button type="submit" disabled={sendPending} className={secondaryButton}>
            <Send className="size-3.5" aria-hidden="true" />
            {sendPending ? "Sending…" : "Send test email"}
          </button>
          <InlineResult result={sendState} />
        </form>
      </section>
    </div>
  );
}
