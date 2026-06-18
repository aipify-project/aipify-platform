"use client";

import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import type { RevenueGrowthCenterLabels } from "@/lib/revenue-growth-center/labels";

export function RevenueGrowthStatusBadge({
  statusKey,
  labels,
}: {
  statusKey: OperationsStatusKey | string;
  labels: RevenueGrowthCenterLabels["status"];
}) {
  const def = getOperationsStatusDefinition(statusKey);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
      <span aria-hidden>{def.symbol}</span>
      <span>{labels[def.labelKey]}</span>
    </span>
  );
}
