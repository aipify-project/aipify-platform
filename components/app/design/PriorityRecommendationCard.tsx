import Link from "next/link";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type PriorityRecommendationCardProps = {
  category: string;
  title: string;
  description: string;
  statusKind: AipifyStatusKind;
  statusLabel: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PriorityRecommendationCard({
  category,
  title,
  description,
  statusKind,
  statusLabel,
  actionHref,
  actionLabel,
}: PriorityRecommendationCardProps) {
  return (
    <article
      className={`${AppPremiumShell.elevatedCard} border-l-4 p-5 ${
        statusKind === "needs_attention"
          ? "border-l-amber-400 bg-amber-50/30"
          : statusKind === "not_allowed"
            ? "border-l-red-400 bg-red-50/20"
            : "border-l-aipify-companion bg-aipify-surface"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-aipify-surface-muted px-2.5 py-0.5 text-xs font-medium text-aipify-text-secondary">
          {category}
        </span>
        <AipifyStatusBadge kind={statusKind} label={statusLabel} />
      </div>
      <h3 className="mt-3 text-base font-semibold text-aipify-text">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={`mt-4 inline-flex min-h-10 items-center rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white transition hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
        >
          {actionLabel}
        </Link>
      ) : null}
    </article>
  );
}
