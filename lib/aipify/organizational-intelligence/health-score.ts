export type HealthScoreInputs = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  overdueWorkflowPenalty: number;
  responseTimePenalty: number;
};

export function calculateHealthScore(inputs: HealthScoreInputs): number {
  let score = 100;
  score -= inputs.critical * 20;
  score -= inputs.high * 10;
  score -= inputs.medium * 5;
  score -= inputs.low * 1;
  score -= Math.min(20, inputs.overdueWorkflowPenalty);
  score -= Math.min(15, inputs.responseTimePenalty);
  return Math.max(0, Math.min(100, score));
}

export function healthBandFromScore(score: number): string {
  if (score >= 90) return "healthy";
  if (score >= 75) return "good";
  if (score >= 50) return "needs_attention";
  if (score >= 25) return "risky";
  return "critical";
}
