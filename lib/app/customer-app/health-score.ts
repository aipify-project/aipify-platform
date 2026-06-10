export type HealthScoreBand =
  | "excellent"
  | "healthy"
  | "needs_attention"
  | "action_recommended";

export type HealthScoreOverview = {
  score: number;
  label: HealthScoreBand;
};

export function healthBandFromScore(score: number): HealthScoreBand {
  if (score >= 95) return "excellent";
  if (score >= 80) return "healthy";
  if (score >= 60) return "needs_attention";
  return "action_recommended";
}
