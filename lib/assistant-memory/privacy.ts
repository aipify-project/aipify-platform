/** Metadata-only summaries — never store raw chat transcripts. */
export function sanitizeMemorySummary(summary: string): string {
  return summary.trim().slice(0, 500);
}

export function shouldAskBeforeRemembering(
  source: "explicit" | "inferred",
  askBeforeRemembering: boolean
): boolean {
  return askBeforeRemembering || source === "inferred";
}
