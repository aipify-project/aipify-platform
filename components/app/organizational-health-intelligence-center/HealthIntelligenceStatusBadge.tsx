import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import type { OrganizationalHealthIntelligenceCenterLabels } from "@/lib/organizational-health-intelligence-center/labels";
import { getHealthLevelLabel } from "@/lib/organizational-health-intelligence-center/labels";

export function HealthIntelligenceStatusBadge({
  statusKey,
  labels,
  healthLevel,
  healthLevelLabels,
}: {
  statusKey: string;
  labels: OrganizationalHealthIntelligenceCenterLabels["status"];
  healthLevel?: string;
  healthLevelLabels?: OrganizationalHealthIntelligenceCenterLabels["healthLevel"];
}) {
  const def = getOperationsStatusDefinition(statusKey);
  const label = healthLevel && healthLevelLabels
    ? getHealthLevelLabel(healthLevel, healthLevelLabels)
    : (labels[def.labelKey as keyof OrganizationalHealthIntelligenceCenterLabels["status"]] ?? def.labelKey);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
      <span aria-hidden>{def.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
