import { DatabaseZap } from "lucide-react";
import { card } from "./ui";

/** Shared "the environment isn't ready yet" surface. Every `/manage` route
 * bails to this before touching the database when `hasDatabase()` /
 * `hasAuthSecret()` fail, instead of each page duplicating this markup. */
export function DatabaseNotConfigured({ context }: { context: string }) {
  return (
    <main className="admin-root mx-auto flex min-h-screen max-w-2xl items-center px-5 py-16">
      <section className={`${card} w-full p-8`}>
        <div className="flex items-center gap-2 text-brand-danger">
          <DatabaseZap className="h-5 w-5" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide">Admin panel</p>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-brand-text">Database not configured</h1>
        <p className="mt-3 text-sm leading-6 text-brand-muted">
          Set <code className="rounded bg-brand-page px-1.5 py-0.5 text-brand-text">DATABASE_URL</code> and an{" "}
          <code className="rounded bg-brand-page px-1.5 py-0.5 text-brand-text">AUTH_SECRET</code> of at least 32 characters for {context}.
        </p>
      </section>
    </main>
  );
}
