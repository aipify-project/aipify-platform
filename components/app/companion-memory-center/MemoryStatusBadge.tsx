import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import type { CompanionMemoryCenterLabels } from "@/lib/companion-memory-center/labels";

type MemoryStatusBadgeProps = {
  statusKey: string;
  labels: CompanionMemoryCenterLabels["status"];
  className?: string;
};

export function MemoryStatusBadge({ statusKey, labels, className = "" }: MemoryStatusBadgeProps) {
  const def = getOperationsStatusDefinition(statusKey);
  const label = labels[def.labelKey as keyof CompanionMemoryCenterLabels["status"]] ?? def.labelKey;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200 ${className}`}
      aria-label={label}
    >
      <span aria-hidden>{def.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
