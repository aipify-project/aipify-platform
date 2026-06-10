import { getSuccessScoreStatus, type SuccessScoreStatus } from "@/lib/platform/executive-intelligence";

const STATUS_STYLES: Record<SuccessScoreStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  good: "bg-sky-50 text-sky-700 ring-sky-100",
  needs_attention: "bg-amber-50 text-amber-700 ring-amber-100",
  at_risk: "bg-rose-50 text-rose-700 ring-rose-100",
};

type SuccessScoreBadgeProps = {
  score: number;
  labels: Record<string, string>;
};

export default function SuccessScoreBadge({ score, labels }: SuccessScoreBadgeProps) {
  const status = getSuccessScoreStatus(score);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[status]}`}
    >
      {labels[status]} · {score}
    </span>
  );
}
