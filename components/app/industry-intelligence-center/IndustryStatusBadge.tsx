import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import type { IndustryIntelligenceCenterLabels } from "@/lib/industry-intelligence-center/labels";

export function IndustryStatusBadge({
  statusKey,
  labels,
}: {
  statusKey: string;
  labels: IndustryIntelligenceCenterLabels["status"];
}) {
  const def = getOperationsStatusDefinition(statusKey);
  const label = labels[def.labelKey as keyof IndustryIntelligenceCenterLabels["status"]] ?? def.labelKey;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
      <span aria-hidden>{def.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
