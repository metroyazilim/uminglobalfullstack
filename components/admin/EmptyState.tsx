import type { LucideIcon } from "lucide-react";
import { dashedCard, helpText } from "./ui";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className={dashedCard}>
      <Icon className="mx-auto size-8 text-brand-muted" aria-hidden="true" />
      <p className="mt-3 text-sm font-bold text-brand-text">{title}</p>
      {description ? <p className={`mt-1 ${helpText}`}>{description}</p> : null}
    </div>
  );
}
