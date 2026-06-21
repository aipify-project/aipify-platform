import type { PilotOrganizationSignal, PilotShadowRecommendation } from "./types";

export type ShadowRecommendationInput = {
  title: string;
  summary: string;
  sourceRefs: Array<{ signal: string; source: string }>;
  confidence: PilotShadowRecommendation["confidence"];
};

/** Shadow recommendation generator — metadata only, no execution. */
export function generateShadowRecommendations(
  signals: PilotOrganizationSignal[],
  shadowMode: boolean
): ShadowRecommendationInput[] {
  if (!shadowMode || signals.length === 0) return [];

  const supportSignals = signals.filter((s) => s.signal_type.includes("support"));
  if (supportSignals.length === 0) return [];

  return [
    {
      title: "Review support queue staffing",
      summary:
        "Aipify observed elevated support queue activity. Consider reviewing staffing during peak hours.",
      sourceRefs: [{ signal: "support_metric", source: "workflow_events" }],
      confidence: "moderate",
    },
  ];
}

export function shadowRecommendationLabelKey(): string {
  return "customerApp.unonightPilot621.shadowRecommendationPrepared";
}

/** Shadow recs never execute — explicit guard for action pipelines. */
export function assertShadowRecommendationNotExecutable(rec: { executed?: boolean }): void {
  if (rec.executed) {
    throw new Error("Shadow recommendations must not execute in Phase 621");
  }
}
