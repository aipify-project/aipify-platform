import {
  COMPANION_INTELLIGENCE_DIMENSIONS,
  type CompanionIntelligenceDimensionKey,
} from "./companion-golden-rule-vocabulary";

export type CompanionInsight = {
  observation: string;
  explanation?: string;
  impact?: string | readonly string[];
  recommendation: string;
  effort?: string;
  value?: string;
  ifIgnored?: string;
};

export type CompanionInsightValidation = {
  valid: boolean;
  missing: CompanionIntelligenceDimensionKey[];
  score: number;
};

const INFORMATION_ONLY_PATTERNS: RegExp[] = [
  /^(?:task|item|request|ticket|case|approval|invoice|message|alert|reminder)\s+(?:is\s+)?overdue\.?$/i,
  /^you have \d+ notifications?\.?$/i,
  /^(?:customer|client|contact) has not been contacted\.?$/i,
  /^support requests (?:increased|decreased)\.?$/i,
  /^\d+\s+(?:approval|notification|task|item|message)s?\s+pending\.?$/i,
  /^(?:new|updated|pending)\s+(?:alert|notification|item)\.?$/i,
];

const REQUIRED_DIMENSIONS: CompanionIntelligenceDimensionKey[] = [
  "observation",
  "recommendation",
];

const RECOMMENDED_DIMENSIONS: CompanionIntelligenceDimensionKey[] = [
  "explanation",
  "impact",
  "effort",
  "value",
];

function normalizeImpact(impact: CompanionInsight["impact"]): string[] {
  if (!impact) return [];
  if (typeof impact === "string") return [impact];
  return [...impact];
}

function hasText(value: string | undefined): value is string {
  return Boolean(value?.trim());
}

function dimensionPresent(
  insight: CompanionInsight,
  key: CompanionIntelligenceDimensionKey
): boolean {
  switch (key) {
    case "observation":
      return hasText(insight.observation);
    case "explanation":
      return hasText(insight.explanation);
    case "impact":
      return normalizeImpact(insight.impact).some(hasText);
    case "recommendation":
      return hasText(insight.recommendation);
    case "effort":
      return hasText(insight.effort);
    case "value":
      return hasText(insight.value);
    default:
      return false;
  }
}

/** Flag bare awareness-only messages that violate the Companion Golden Rule. */
export function detectInformationOnlyPattern(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const firstLine = trimmed.split(/\n/)[0]?.trim() ?? trimmed;
  return INFORMATION_ONLY_PATTERNS.some((pattern) => pattern.test(firstLine));
}

/** Validate structured insight against the Companion Intelligence Standard. */
export function validateCompanionInsight(insight: CompanionInsight): CompanionInsightValidation {
  const missing = COMPANION_INTELLIGENCE_DIMENSIONS.map((d) => d.key).filter(
    (key) => !dimensionPresent(insight, key)
  );

  const requiredMissing = REQUIRED_DIMENSIONS.filter((key) => missing.includes(key));
  const valid = requiredMissing.length === 0;

  const presentCount = COMPANION_INTELLIGENCE_DIMENSIONS.length - missing.length;
  const score = Math.round((presentCount / COMPANION_INTELLIGENCE_DIMENSIONS.length) * 100);

  return { valid, missing, score };
}

/** True when insight meets required fields and at least one recommended dimension. */
export function meetsCompanionGoldenRule(insight: CompanionInsight): boolean {
  const result = validateCompanionInsight(insight);
  if (!result.valid) return false;
  return RECOMMENDED_DIMENSIONS.some((key) => dimensionPresent(insight, key));
}

/** Render structured insight as customer-facing Companion copy. */
export function formatCompanionInsight(
  insight: CompanionInsight,
  options?: { includeIfIgnored?: boolean }
): string {
  const lines: string[] = [];

  if (hasText(insight.observation)) {
    lines.push(insight.observation.trim());
  }

  const explanation = insight.explanation;
  if (hasText(explanation)) {
    lines.push(explanation.trim());
  }

  const impactItems = normalizeImpact(insight.impact).filter(hasText);
  if (impactItems.length === 1) {
    lines.push(`Impact: ${impactItems[0]}`);
  } else if (impactItems.length > 1) {
    lines.push("This affects:");
    impactItems.forEach((item) => lines.push(`- ${item}`));
  }

  if (hasText(insight.recommendation)) {
    lines.push(`Recommended action: ${insight.recommendation.trim()}`);
  }

  const effort = insight.effort;
  if (hasText(effort)) {
    lines.push(`Estimated effort: ${effort.trim()}`);
  }

  const value = insight.value;
  if (hasText(value)) {
    lines.push(`Potential impact: ${value.trim()}`);
  }

  const ifIgnored = insight.ifIgnored;
  if (options?.includeIfIgnored && hasText(ifIgnored)) {
    lines.push(`If ignored: ${ifIgnored.trim()}`);
  }

  return lines.join("\n");
}

/** Append explanation framework when base copy is information-only. */
export function enrichInformationOnlyCopy(
  text: string,
  enrichment: Partial<Pick<CompanionInsight, "explanation" | "impact" | "recommendation" | "effort" | "value">>
): string {
  if (!detectInformationOnlyPattern(text)) return text;
  const insight: CompanionInsight = {
    observation: text.trim(),
    explanation: enrichment.explanation,
    impact: enrichment.impact,
    recommendation: enrichment.recommendation ?? "Review when you have a moment.",
    effort: enrichment.effort,
    value: enrichment.value,
  };
  return formatCompanionInsight(insight);
}

export function getCompanionInsightLabels(): Record<CompanionIntelligenceDimensionKey, string> {
  return Object.fromEntries(
    COMPANION_INTELLIGENCE_DIMENSIONS.map((d) => [d.key, d.label])
  ) as Record<CompanionIntelligenceDimensionKey, string>;
}
