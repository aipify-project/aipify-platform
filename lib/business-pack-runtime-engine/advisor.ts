const RUNTIME_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(instance|installed|pack|runtime)\b/i, key: "installedPacks" },
  { pattern: /\b(deploy|deployment|strategy|rollout|canary)\b/i, key: "deployments" },
  { pattern: /\b(version|upgrade|update)\b/i, key: "versions" },
  { pattern: /\b(health|quota|circuit|degraded)\b/i, key: "health" },
  { pattern: /\b(permission|capability|sandbox|suspend)\b/i, key: "permissions" },
  { pattern: /\b(domain|license|verify)\b/i, key: "domains" },
  { pattern: /\b(rollback|snapshot|revert)\b/i, key: "rollbacks" },
  { pattern: /\b(incident|outage|mitigation)\b/i, key: "incidents" },
  { pattern: /\b(report|audit|briefing)\b/i, key: "reports" },
];

export function detectRuntimeAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of RUNTIME_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getRuntimeAdvisorRoute(intent: string | null, audience: "platform" | "organization" = "platform"): string {
  if (audience === "organization") {
    switch (intent) {
      case "health":
        return "/app/settings/business-packs/health";
      case "permissions":
        return "/app/settings/business-packs/permissions";
      case "versions":
      case "deployments":
        return "/app/settings/business-packs/updates";
      case "domains":
        return "/app/settings/business-packs/billing";
      default:
        return "/app/settings/business-packs";
    }
  }

  switch (intent) {
    case "installedPacks":
      return "/platform/business-pack-runtime/installed-packs";
    case "deployments":
      return "/platform/business-pack-runtime/deployments";
    case "versions":
      return "/platform/business-pack-runtime/versions";
    case "health":
      return "/platform/business-pack-runtime/health";
    case "permissions":
      return "/platform/business-pack-runtime/permissions";
    case "domains":
      return "/platform/business-pack-runtime/domains";
    case "rollbacks":
      return "/platform/business-pack-runtime/rollbacks";
    case "incidents":
      return "/platform/business-pack-runtime/incidents";
    default:
      return "/platform/business-pack-runtime/reports";
  }
}
