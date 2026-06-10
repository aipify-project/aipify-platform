export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export function confidenceLevelFromScore(score: number): ConfidenceLevel {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function confidenceExplanation(
  level: ConfidenceLevel,
  similarCount: number,
  labels: Record<ConfidenceLevel, string>
): string {
  if (similarCount > 0 && level === "high") {
    return `Based on ${similarCount} similar approvals, Aipify is highly confident.`;
  }
  if (similarCount > 0 && level === "medium") {
    return `Based on ${similarCount} similar outcomes, Aipify has moderate confidence.`;
  }
  return labels[level];
}
