const CLIENT_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(rebook|booking|appointment|schedule)\b/i, key: "rebooking" },
  { pattern: /\b(lapsed|churn|inactive|win.?back)\b/i, key: "retention" },
  { pattern: /\b(loyal|points|tier|reward)\b/i, key: "loyalty" },
  { pattern: /\b(referr|growth partner)\b/i, key: "referrals" },
  { pattern: /\b(feedback|review|complaint)\b/i, key: "feedback" },
  { pattern: /\b(recover|service recovery|apolog)\b/i, key: "service_recovery" },
  { pattern: /\b(consent|marketing|suppress)\b/i, key: "consent" },
  { pattern: /\b(campaign|outreach|message)\b/i, key: "campaigns" },
  { pattern: /\b(journey|milestone|timeline)\b/i, key: "journeys" },
  { pattern: /\b(client|customer|relationship)\b/i, key: "clients" },
];

export function detectClientAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of CLIENT_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getClientAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "rebooking":
      return "/app/client-relationships/rebooking";
    case "retention":
      return "/app/client-relationships/retention";
    case "loyalty":
      return "/app/client-relationships/loyalty";
    case "referrals":
      return "/app/client-relationships/referrals";
    case "feedback":
      return "/app/client-relationships/feedback";
    case "service_recovery":
      return "/app/client-relationships/service-recovery";
    case "consent":
      return "/app/client-relationships/consent";
    case "campaigns":
      return "/app/client-relationships/campaigns";
    case "journeys":
      return "/app/client-relationships/journeys";
    case "clients":
      return "/app/client-relationships/clients";
    default:
      return "/app/client-relationships";
  }
}
