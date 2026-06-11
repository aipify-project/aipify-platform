export type ConfidenceBand = "suggestion" | "recommended" | "strong";

export function confidenceBandFromScore(score: number): ConfidenceBand {
  if (score >= 81) return "strong";
  if (score >= 51) return "recommended";
  return "suggestion";
}

export function confidenceLabel(
  score: number,
  labels: Record<ConfidenceBand, string>
): string {
  return labels[confidenceBandFromScore(score)];
}
