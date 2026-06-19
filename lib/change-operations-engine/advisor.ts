const CHANGE_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(change request|pending change|pipeline)\b/i, key: "changeRequests" },
  { pattern: /\b(release|version|deploy window|calendar)\b/i, key: "releases" },
  { pattern: /\b(deployment|deploy|promotion)\b/i, key: "deployments" },
  { pattern: /\b(approval|approve|segregat)\b/i, key: "approvals" },
  { pattern: /\b(environment|staging|production|sandbox)\b/i, key: "environments" },
  { pattern: /\b(feature flag|rollout|canary|blue.?green)\b/i, key: "featureFlags" },
  { pattern: /\b(database|migration|schema)\b/i, key: "databaseChanges" },
  { pattern: /\b(emergency|hotfix|urgent)\b/i, key: "emergencyChanges" },
  { pattern: /\b(rollback|roll back|revert)\b/i, key: "rollback" },
  { pattern: /\b(evidence|audit|verification)\b/i, key: "evidence" },
  { pattern: /\b(report|briefing|governance)\b/i, key: "reports" },
  { pattern: /\b(freeze|collision|drift)\b/i, key: "calendar" },
];

export function detectChangeOperationsAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of CHANGE_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getChangeOperationsAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "changeRequests":
      return "/platform/change-operations/change-requests";
    case "releases":
      return "/platform/change-operations/releases";
    case "deployments":
      return "/platform/change-operations/deployments";
    case "approvals":
      return "/platform/change-operations/approvals";
    case "environments":
      return "/platform/change-operations/environments";
    case "featureFlags":
      return "/platform/change-operations/feature-flags";
    case "databaseChanges":
      return "/platform/change-operations/database-changes";
    case "emergencyChanges":
      return "/platform/change-operations/emergency-changes";
    case "rollback":
      return "/platform/change-operations/rollback";
    case "evidence":
      return "/platform/change-operations/evidence";
    case "calendar":
      return "/platform/change-operations/calendar";
    default:
      return "/platform/change-operations/advisory";
  }
}
