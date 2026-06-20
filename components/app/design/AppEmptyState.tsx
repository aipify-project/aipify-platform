import Link from "next/link";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type AppEmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AppEmptyState({ title, description, actionHref, actionLabel }: AppEmptyStateProps) {
  return (
    <div
      className={`${AppPremiumShell.elevatedCard} flex flex-col items-center px-6 py-12 text-center`}
    >
      <AipifyStatusBadge kind="completed" label={title} className="text-sm" />
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-aipify-text-secondary">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={`mt-6 inline-flex min-h-10 items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
