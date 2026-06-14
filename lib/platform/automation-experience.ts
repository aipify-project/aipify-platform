import type { PlatformAutomation } from "./types";
import { computeAutomationHealthSummary } from "./executive-intelligence";

export type AutomationHealthBand = "healthy" | "needs_attention" | "at_risk" | "critical";

export type AipifyInsightState = "healthy" | "needs_attention" | "critical" | "improving";

export type AutomationFilterKey =
  | "all"
  | "active"
  | "warning"
  | "failed"
  | "self_healing"
  | "admin_approved";

const LONG_EXECUTION_MS = 2000;
const VERY_LONG_EXECUTION_MS = 4000;

/** Replace visible "AI" product prefixes with Aipify — display only, not backend keys. */
export function formatAipifyProductLabel(text: string): string {
  return text
    .replace(/^AI Customer/i, "Aipify Customer")
    .replace(/^AI /i, "Aipify ")
    .replace(/\bAI Assistant\b/gi, "Aipify Assistant")
    .replace(/\bAI Follow-Up\b/gi, "Aipify Follow-Up")
    .replace(/\bAI Insight\b/gi, "Aipify Insight")
    .replace(/\bAI Recommendation\b/gi, "Aipify Recommendation")
    .replace(/\bAI Recommendations\b/gi, "Aipify Recommendations");
}

export function computeAutomationItemHealthScore(
  automation: PlatformAutomation
): number {
  let score = 100;

  if (automation.status === "failed") score -= 40;
  else if (automation.status === "warning") score -= 22;
  else if (automation.status === "paused") score -= 6;

  if (automation.failure_count > 0) {
    score -= Math.min(28, automation.failure_count * 4);
  }

  if (automation.total_executions > 0) {
    const failRate = automation.failure_count / automation.total_executions;
    if (failRate > 0.1) score -= 12;
    else if (failRate > 0.05) score -= 6;
  }

  if (automation.avg_execution_ms >= VERY_LONG_EXECUTION_MS) score -= 14;
  else if (automation.avg_execution_ms >= LONG_EXECUTION_MS) score -= 8;

  if (
    automation.last_run_at &&
    automation.last_success_at &&
    new Date(automation.last_run_at).getTime() >
      new Date(automation.last_success_at).getTime()
  ) {
    score -= 12;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getAutomationHealthBand(score: number): AutomationHealthBand {
  if (score >= 90) return "healthy";
  if (score >= 70) return "needs_attention";
  if (score >= 40) return "at_risk";
  return "critical";
}

export function computePlatformAutomationHealthScore(
  automations: PlatformAutomation[]
): number {
  if (automations.length === 0) return 100;
  const total = automations.reduce(
    (sum, automation) => sum + computeAutomationItemHealthScore(automation),
    0
  );
  return Math.round((total / automations.length) * 10) / 10;
}

export function countSelfHealingActionsToday(
  automations: PlatformAutomation[]
): number {
  const today = new Date().toDateString();
  return automations.filter((automation) => {
    if ((automation.category_key ?? "admin_approved") !== "self_healing") {
      return false;
    }
    if (!automation.last_run_at) return false;
    return new Date(automation.last_run_at).toDateString() === today;
  }).length;
}

export function filterAutomations(
  automations: PlatformAutomation[],
  filter: AutomationFilterKey,
  query: string
): PlatformAutomation[] {
  const normalizedQuery = query.trim().toLowerCase();

  return automations.filter((automation) => {
    const category = automation.category_key ?? "admin_approved";

    if (filter === "active" && automation.status !== "active") return false;
    if (filter === "warning" && automation.status !== "warning") return false;
    if (filter === "failed" && automation.status !== "failed") return false;
    if (filter === "self_healing" && category !== "self_healing") return false;
    if (filter === "admin_approved" && category !== "admin_approved") return false;

    if (!normalizedQuery) return true;

    const haystack = [
      automation.name,
      automation.description ?? "",
      automation.trigger_type,
      formatAipifyProductLabel(automation.name),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function buildAutomationPageInsight(
  automations: PlatformAutomation[],
  platformScore: number
): { state: AipifyInsightState; focusName: string | null } {
  if (automations.length === 0) {
    return { state: "healthy", focusName: null };
  }

  const failed = automations.filter((a) => a.status === "failed");
  const warnings = automations.filter((a) => a.status === "warning");

  if (failed.length > 0) {
    return {
      state: "critical",
      focusName: formatAipifyProductLabel(failed[0].name),
    };
  }

  if (warnings.length > 0) {
    return {
      state: "needs_attention",
      focusName: formatAipifyProductLabel(warnings[0].name),
    };
  }

  if (platformScore >= 90) {
    return { state: "healthy", focusName: null };
  }

  if (platformScore >= 70) {
    return { state: "improving", focusName: null };
  }

  return { state: "needs_attention", focusName: null };
}

export function getGreetingPeriod(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function enrichAutomationHealthSummary(automations: PlatformAutomation[]) {
  const base = computeAutomationHealthSummary(automations);
  const platformHealthScore = computePlatformAutomationHealthScore(automations);
  const activeCount = automations.filter((a) => a.status === "active").length;
  const needsAttentionCount = base.needsAttention.length;
  const selfHealingToday = countSelfHealingActionsToday(automations);
  const insight = buildAutomationPageInsight(automations, platformHealthScore);

  return {
    ...base,
    platformHealthScore,
    activeCount,
    needsAttentionCount,
    selfHealingToday,
    insight,
  };
}
