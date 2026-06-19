const TRUTH_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(latest|approved|authoritative|current process)\b/i, key: "latest_process" },
  { pattern: /\b(which policy|authoritative|official)\b/i, key: "authoritative" },
  { pattern: /\b(conflict|contradict|duplicate|outdated)\b/i, key: "conflicts" },
  { pattern: /\b(review|needs review|unreviewed|decay)\b/i, key: "review_needed" },
  { pattern: /\b(trust|verified|reliable)\b/i, key: "trust" },
  { pattern: /\b(lineage|source|ownership|origin)\b/i, key: "lineage" },
  { pattern: /\b(wisdom|lesson|playbook|best practice)\b/i, key: "wisdom" },
  { pattern: /\b(truth report|report|knowledge health)\b/i, key: "report" },
];

export function detectTruthAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of TRUTH_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getTruthAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "latest_process":
    case "wisdom":
      return "/app/knowledge-fabric/knowledge";
    case "authoritative":
    case "trust":
      return "/app/knowledge-fabric/trust";
    case "conflicts":
      return "/app/knowledge-fabric/conflicts";
    case "review_needed":
    case "lineage":
      return "/app/knowledge-fabric/reviews";
    default:
      return "/app/knowledge-fabric/reports";
  }
}
