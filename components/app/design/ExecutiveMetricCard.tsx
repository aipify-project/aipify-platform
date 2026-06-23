import type { ReactNode } from "react";
import Link from "next/link";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import type { SemanticBadgeType } from "@/lib/design/semantic-status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type ExecutiveMetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
  statusLabel: string;
  /** Explicit semantic badge (preferred). */
  semanticType?: SemanticBadgeType;
  semanticValue?: string;
  a11yLabel?: string;
  /** Legacy fallback when semanticType is omitted. */
  statusKind?: AipifyStatusKind;
  featured?: boolean;
  href?: string;
  hideBadge?: boolean;
  labelClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
};

export function ExecutiveMetricCard({
  icon,
  label,
  value,
  description,
  statusLabel,
  semanticType,
  semanticValue,
  a11yLabel,
  statusKind = "information",
  featured = false,
  href,
  hideBadge = false,
  labelClassName,
  valueClassName,
  descriptionClassName,
}: ExecutiveMetricCardProps) {
  const card = (
    <article
      className={`${AppPremiumShell.elevatedCard} flex h-full min-h-[108px] flex-col p-3.5 ${
        featured ? "border-aipify-accent-muted bg-gradient-to-br from-violet-50/80 to-aipify-surface lg:col-span-2 lg:row-span-1" : ""
      } ${href ? `${AppPremiumShell.elevatedCardHover} transition ${AppPremiumShell.focusRing}` : ""}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aipify-accent-soft text-aipify-companion">
          {icon}
        </div>
        {!hideBadge ? (
          semanticType && semanticValue ? (
            <SemanticBadge
              type={semanticType}
              value={semanticValue}
              label={statusLabel}
              a11yLabel={a11yLabel}
            />
          ) : (
            <AipifyStatusBadge kind={statusKind} label={statusLabel} />
          )
        ) : null}
      </div>
      <p className={`mt-2 ${labelClassName ?? AppPremiumShell.metricLabel}`}>{label}</p>
      <p
        className={`mt-0.5 line-clamp-2 ${valueClassName ?? (featured ? "text-4xl sm:text-5xl" : AppPremiumShell.metricValue)}`}
      >
        {value}
      </p>
      <p className={descriptionClassName ?? `mt-auto pt-1.5 ${AppPremiumShell.metricDescription}`}>{description}</p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
