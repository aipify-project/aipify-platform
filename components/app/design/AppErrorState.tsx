import Link from "next/link";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type AppErrorStateProps = {
  title: string;
  description: string;
  statusKind?: AipifyStatusKind;
  statusLabel?: string;
  onRetry?: () => void;
  retryLabel: string;
  returnHref?: string;
  returnLabel?: string;
};

export function AppErrorState({
  title,
  description,
  statusKind = "needs_attention",
  statusLabel,
  onRetry,
  retryLabel,
  returnHref,
  returnLabel,
}: AppErrorStateProps) {
  return (
    <div className={`${AppPremiumShell.elevatedCard} px-6 py-10`} role="alert">
      <AipifyStatusBadge kind={statusKind} label={statusLabel ?? title} />
      <p className="mt-4 text-base font-semibold text-aipify-text">{title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-aipify-text-secondary">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`inline-flex min-h-10 items-center rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white transition hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
          >
            {retryLabel}
          </button>
        ) : null}
        {returnHref && returnLabel ? (
          <Link
            href={returnHref}
            className={`inline-flex min-h-10 items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
          >
            {returnLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
