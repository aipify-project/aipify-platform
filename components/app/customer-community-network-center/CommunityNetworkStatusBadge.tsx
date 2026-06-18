"use client";

import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import type { CommunityNetworkCenterLabels } from "@/lib/customer-community-network-center/labels";

export function CommunityNetworkStatusBadge({
  statusKey,
  labels,
}: {
  statusKey: OperationsStatusKey | string;
  labels: CommunityNetworkCenterLabels["status"];
}) {
  const def = getOperationsStatusDefinition(statusKey);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
      <span aria-hidden>{def.symbol}</span>
      <span>{labels[def.labelKey]}</span>
    </span>
  );
}
