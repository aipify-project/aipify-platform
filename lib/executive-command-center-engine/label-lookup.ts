import type { Translator } from "@/lib/i18n/translate";

const STATIC_LABEL_KEYS = [
  "customerApp.executiveCommandCenter.tabs.shared.items",
  "customerApp.executiveCommandCenter.tabs.shared.type",
  "customerApp.executiveCommandCenter.tabs.shared.timestamp",
  "customerApp.executiveCommandCenter.tabs.shared.open",
  "customerApp.executiveCommandCenter.tabs.approvals.requester",
  "customerApp.executiveCommandCenter.tabs.approvals.blocked",
  "customerApp.executiveCommandCenter.tabs.approvals.actions.review",
  "customerApp.executiveCommandCenter.tabs.opportunities.value",
  "customerApp.executiveCommandCenter.tabs.opportunities.confidence",
  "customerApp.executiveCommandCenter.tabs.opportunities.nextStep",
  "customerApp.executiveCommandCenter.tabs.opportunities.actions.review",
  "customerApp.executiveCommandCenter.tabs.alerts.actions.reviewApproval",
  "customerApp.executiveCommandCenter.tabs.alerts.actions.viewCustomerRisk",
  "customerApp.executiveCommandCenter.tabs.alerts.actions.openSecurityReview",
  "customerApp.executiveCommandCenter.tabs.alerts.actions.openInvoice",
  "customerApp.executiveCommandCenter.tabs.risks.actions.reviewRisk",
  "customerApp.executiveCommandCenter.tabs.performance.actions.viewHealth",
  "customerApp.executiveCommandCenter.tabs.briefing.actions.openReport",
  "customerApp.executiveCommandCenter.tabs.briefing.actions.generateReport",
  "customerApp.executiveCommandCenter.tabs.briefing.actions.openBriefing",
  "common.status.semantic.severity.critical",
  "common.status.semantic.severity.high",
  "common.status.semantic.severity.medium",
  "common.status.semantic.severity.low",
  "common.status.semantic.severity.info",
  "common.status.semantic.workflow.open",
  "common.status.semantic.workflow.pending",
  "common.status.semantic.workflow.awaitingApproval",
  "common.status.semantic.workflow.inProgress",
  "common.status.semantic.workflow.completed",
  "common.status.semantic.workflow.blocked",
] as const;

const OPPORTUNITY_STATUSES = [
  "identified",
  "recommended",
  "reviewRequired",
  "qualified",
  "inProgress",
  "won",
  "declined",
  "expired",
] as const;

const REPORT_STATES = ["generated", "generating", "draft", "template", "failed", "outdated"] as const;

const HEALTH_STATES = ["healthy", "good", "moderate", "poor", "critical_health", "unknown"] as const;

/** Serializable label map for client-side Command Center item rendering (RSC-safe). */
export function buildCommandCenterLabelLookup(t: Translator): Record<string, string> {
  const lookup: Record<string, string> = {};

  for (const key of STATIC_LABEL_KEYS) {
    lookup[key] = t(key);
  }

  for (const status of OPPORTUNITY_STATUSES) {
    const key = `customerApp.executiveCommandCenter.tabs.opportunityStatus.${status}`;
    lookup[key] = t(key);
  }

  for (const state of REPORT_STATES) {
    const key = `customerApp.executiveCommandCenter.tabs.reportState.${state}`;
    lookup[key] = t(key);
  }

  for (const state of HEALTH_STATES) {
    const key = `common.status.semantic.health.${state}`;
    lookup[key] = t(key);
  }

  return lookup;
}
