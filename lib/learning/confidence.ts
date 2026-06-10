export type ConfidenceLevel = "low" | "medium" | "high";

export function confidenceLevelFromScore(score: number): ConfidenceLevel {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function explainConfidence(
  score: number,
  approvalCount: number,
  labels: {
    low: string;
    medium: string;
    high: (count: number) => string;
  }
): string {
  const level = confidenceLevelFromScore(score);
  if (level === "high") return labels.high(approvalCount);
  if (level === "medium") return labels.medium;
  return labels.low;
}
