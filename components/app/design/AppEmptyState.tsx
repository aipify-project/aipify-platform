import Link from "next/link";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type AppEmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  /** Compact calm state when nothing needs attention — full card reserved for real items. */
  variant?: "default" | "compact";
};

export function AppEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  variant = "default",
}: AppEmptyStateProps) {
  const compact = variant === "compact";
  return (
    <div
      className={`${AppPremiumShell.elevatedCard} flex flex-col items-center text-center ${
        compact ? "gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:text-left" : "px-6 py-12"
      }`}
    >
      <div className={compact ? "min-w-0 space-y-1" : ""}>
        <AipifyStatusBadge kind="completed" label={title} className="text-sm" />
        {description ? (
          <p
            className={`${compact ? "mt-1" : "mt-4"} max-w-lg text-sm leading-relaxed text-aipify-text-secondary`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={`${compact ? "mt-0 shrink-0" : "mt-6"} inline-flex min-h-10 items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
