import type { RiskLevel } from "@/lib/real-world-actions-execution-center/types";
import type { RealWorldActionsExecutionCenterLabels } from "@/lib/real-world-actions-execution-center/labels";
import { getRiskLevelLabel } from "@/lib/real-world-actions-execution-center/labels";

export function RiskLevelBadge({
  risk,
  labels,
}: {
  risk: RiskLevel;
  labels: RealWorldActionsExecutionCenterLabels["risk"];
}) {
  const label = getRiskLevelLabel(risk, labels);
  const tone =
    risk === "low" ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
    : risk === "high" ? "bg-rose-50 text-rose-800 ring-rose-200"
    : "bg-amber-50 text-amber-800 ring-amber-200";
  const symbol = risk === "low" ? "🟢" : risk === "high" ? "🔴" : "🟡";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <span aria-hidden>{symbol}</span>
      <span>{label}</span>
    </span>
  );
}
