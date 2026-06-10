import type { HealthScoreBand } from "@/lib/app/customer-app";

const BAND_STYLES: Record<HealthScoreBand, string> = {
  excellent: "border-emerald-200 bg-emerald-50 text-emerald-900",
  healthy: "border-green-200 bg-green-50 text-green-900",
  needs_attention: "border-amber-200 bg-amber-50 text-amber-900",
  action_recommended: "border-rose-200 bg-rose-50 text-rose-900",
};

type HealthScoreCardProps = {
  score: number;
  label: HealthScoreBand;
  labels: Record<HealthScoreBand, string>;
  title: string;
};

export function HealthScoreCard({ score, label, labels, title }: HealthScoreCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${BAND_STYLES[label]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight">{score}</p>
      <p className="mt-1 text-sm font-medium">{labels[label]}</p>
    </div>
  );
}
