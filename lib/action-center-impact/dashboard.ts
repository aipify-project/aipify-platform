import type { ActionCenter, AipifyAction } from "@/lib/aipify/execution/types";
import { enrichActionImpactAnalysis } from "./enrichment";
import type { ImpactDashboardWidget } from "./types";

function impactScoreForAction(action: AipifyAction): number {
  const riskPenalty =
    action.risk_level === "critical"
      ? 30
      : action.risk_level === "high"
        ? 20
        : action.risk_level === "medium"
          ? 8
          : 0;
  const approvalBoost = action.requires_approval ? 5 : 0;
  const impactTextBoost = action.estimated_impact?.trim() ? 12 : 0;
  return Math.max(10, 88 - riskPenalty + approvalBoost + impactTextBoost);
}

function widgetItem(action: AipifyAction, badge?: string) {
  return {
    id: action.id,
    title: action.title,
    subtitle: action.preview_text || action.description,
    badge: badge ?? action.risk_level,
    score: impactScoreForAction(action),
  };
}

export function buildImpactDashboardWidgets(center: ActionCenter | null): ImpactDashboardWidget[] {
  const pending = center?.pending_actions ?? [];
  const executed = center?.recent_executed ?? [];
  const byScore = [...pending].sort(
    (a, b) => impactScoreForAction(b) - impactScoreForAction(a)
  );

  const highImpact = pending.filter(
    (a) => impactScoreForAction(a) >= 75 || Boolean(a.estimated_impact?.trim())
  );
  const highRisk = pending.filter((a) => a.risk_level === "high" || a.risk_level === "critical");
  const awaitingReview = pending.filter((a) => a.status === "pending_approval");
  const executiveApproval = pending.filter(
    (a) =>
      a.status === "pending_approval" &&
      (a.risk_level === "high" || a.risk_level === "critical")
  );
  const recentlyValidated = executed
    .filter((a) => a.status === "executed")
    .slice(0, 5);

  return [
    {
      id: "recommendedByImpact",
      titleKey: "recommendedByImpact",
      emptyKey: "empty",
      items: byScore.slice(0, 5).map((a) => widgetItem(a)),
    },
    {
      id: "highImpactOpportunities",
      titleKey: "highImpactOpportunities",
      emptyKey: "empty",
      items: highImpact.slice(0, 5).map((a) => widgetItem(a, "high-impact")),
    },
    {
      id: "highRiskRecommendations",
      titleKey: "highRiskRecommendations",
      emptyKey: "empty",
      items: highRisk.slice(0, 5).map((a) => widgetItem(a, a.risk_level)),
    },
    {
      id: "recentlyValidatedOutcomes",
      titleKey: "recentlyValidatedOutcomes",
      emptyKey: "empty",
      items: recentlyValidated.map((a) => widgetItem(a, "validated")),
    },
    {
      id: "awaitingReview",
      titleKey: "awaitingReview",
      emptyKey: "empty",
      items: awaitingReview.slice(0, 5).map((a) => widgetItem(a, "review")),
    },
    {
      id: "executiveApproval",
      titleKey: "executiveApproval",
      emptyKey: "empty",
      items: executiveApproval.slice(0, 5).map((a) => widgetItem(a, "executive")),
    },
  ];
}
