export default function PanelLoading() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading admin page">
      <div className="mb-6 border-b border-brand-border pb-5">
        <div className="h-2.5 w-20 rounded bg-brand-border" />
        <div className="mt-3 h-7 w-48 rounded bg-brand-border" />
        <div className="mt-3 h-3.5 w-full max-w-xl rounded bg-brand-muted-surface" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[var(--radius-md)] border border-brand-border bg-brand-surface p-5 shadow-xs">
            <div className="h-3 w-24 rounded bg-brand-border" />
            <div className="mt-4 h-8 w-16 rounded bg-brand-muted-surface" />
            <div className="mt-3 h-3 w-32 rounded bg-brand-border" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
