import type { ReactNode } from "react";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type ExecutiveMetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
  statusKind: AipifyStatusKind;
  statusLabel: string;
  featured?: boolean;
  href?: string;
};

export function ExecutiveMetricCard({
  icon,
  label,
  value,
  description,
  statusKind,
  statusLabel,
  featured = false,
}: ExecutiveMetricCardProps) {
  return (
    <article
      className={`${AppPremiumShell.elevatedCard} flex h-full min-h-[148px] flex-col p-5 ${
        featured ? "border-aipify-accent-muted bg-gradient-to-br from-violet-50/80 to-aipify-surface lg:col-span-2 lg:row-span-1" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aipify-accent-soft text-aipify-companion">
          {icon}
        </div>
        <AipifyStatusBadge kind={statusKind} label={statusLabel} />
      </div>
      <p className={`mt-4 ${AppPremiumShell.metricLabel}`}>{label}</p>
      <p className={`mt-1 ${featured ? "text-4xl sm:text-5xl" : AppPremiumShell.metricValue}`}>{value}</p>
      <p className={`mt-auto pt-3 ${AppPremiumShell.metricDescription}`}>{description}</p>
    </article>
  );
}
