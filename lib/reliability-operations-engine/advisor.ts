const RELIABILITY_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(incident|sev-|outage|disruption)\b/i, key: "incidents" },
  { pattern: /\b(service|registry|availability|uptime)\b/i, key: "services" },
  { pattern: /\b(health signal|latency|error rate|monitoring)\b/i, key: "healthSignals" },
  { pattern: /\b(self[- ]?heal|recovery|auto[- ]?recover)\b/i, key: "selfHealing" },
  { pattern: /\b(dependenc|correlation|blast radius)\b/i, key: "dependencies" },
  { pattern: /\b(slo|error budget|service level)\b/i, key: "serviceLevels" },
  { pattern: /\b(maintenance|planned downtime)\b/i, key: "maintenance" },
  { pattern: /\b(status page|communication|customer notification)\b/i, key: "statusCommunication" },
  { pattern: /\b(reliability report|reliability briefing)\b/i, key: "reports" },
  { pattern: /\b(system health|connected app|business pack)\b/i, key: "systemHealth" },
];

export function detectReliabilityAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of RELIABILITY_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getReliabilityAdvisorRoute(intent: string | null, surface: "platform" | "customer" = "platform"): string {
  if (surface === "customer") {
    switch (intent) {
      case "connectedApps":
      case "systemHealth":
        return "/app/system-health/connected-apps";
      case "maintenance":
        return "/app/system-health/maintenance";
      case "recentIncidents":
        return "/app/system-health/recent-incidents";
      default:
        return "/app/system-health";
    }
  }

  switch (intent) {
    case "services":
      return "/platform/reliability/services";
    case "incidents":
      return "/platform/reliability/incidents";
    case "healthSignals":
      return "/platform/reliability/health-signals";
    case "selfHealing":
      return "/platform/reliability/self-healing";
    case "dependencies":
      return "/platform/reliability/dependencies";
    case "serviceLevels":
      return "/platform/reliability/service-levels";
    case "maintenance":
      return "/platform/reliability/maintenance";
    case "statusCommunication":
      return "/platform/reliability/status-communication";
    default:
      return "/platform/reliability/reports";
  }
}
