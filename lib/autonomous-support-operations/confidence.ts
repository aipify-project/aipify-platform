import type { ConfidenceBand } from "./types";

export function scoreToBand(score: number): ConfidenceBand {
  if (score >= 90) return "autonomous";
  if (score >= 70) return "draft";
  if (score >= 50) return "review";
  return "escalate";
}

export function bandLabel(band: ConfidenceBand): string {
  switch (band) {
    case "autonomous":
      return "90–100% — Autonomous reply possible";
    case "draft":
      return "70–89% — Draft with optional approval";
    case "review":
      return "50–69% — Human review recommended";
    default:
      return "Below 50% — Escalation required";
  }
}
