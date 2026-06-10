import type { OpportunitySignal } from "@/lib/platform/types";

const STYLES: Record<OpportunitySignal, string> = {
  upgrade: "bg-violet-50 text-violet-700 ring-violet-100",
  expansion: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  retention_risk: "bg-rose-50 text-rose-700 ring-rose-100",
  low_engagement: "bg-amber-50 text-amber-700 ring-amber-100",
  advocate: "bg-sky-50 text-sky-700 ring-sky-100",
};

type OpportunityBadgeProps = {
  signal: OpportunitySignal;
  label: string;
};

export default function OpportunityBadge({ signal, label }: OpportunityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STYLES[signal]}`}
    >
      {label}
    </span>
  );
}
