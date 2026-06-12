/** ABOS Trust Engine — explainability and confidence language (extends Phase 76). */

export const TRUST_ENGINE_MISSION =
  "Every important decision can be understood, reviewed, audited, and trusted.";

export const TRUST_ENGINE_PHILOSOPHY =
  "Trust is earned continuously — through transparency, explainability, auditability, predictability, governance, and human oversight.";

export const TRUST_ENGINE_ABOS_PRINCIPLE =
  "Trust cannot be demanded — it is earned through consistent transparency and accountable assistance.";

export const TRUST_ENGINE_DISTINCTION =
  "Extends Phase 76 Trust Transparency & Explainability (/app/trust). Distinct from Trust & Reputation Engine A.72 (/app/trust-reputation-engine).";

export const EXPLAINABILITY_FRAMEWORK = {
  why: "Decision summary and reasoning — what happened and why Aipify recommends this path.",
  sources: "Information used — approved metadata, knowledge references, and contextual signals.",
  assumptions: "Rules applied and contextual assumptions — governance policies and module constraints.",
  alternatives: "Alternatives considered — other viable paths and why they were not selected.",
  confidence: "Confidence level with honest communication — escalation when evidence is limited.",
} as const;

export const CONFIDENCE_PHRASES = {
  high: {
    level: "high" as const,
    label: "High confidence",
    when: "Strong evidence, clear rules, and clear reasoning.",
    example:
      "Aipify is confident in this recommendation based on clear rules and strong supporting evidence.",
  },
  moderate: {
    level: "moderate" as const,
    label: "Moderate confidence",
    when: "Moderate evidence and partial certainty.",
    example: "Aipify has moderate confidence — review the reasoning and confirm before acting.",
  },
  low: {
    level: "low" as const,
    label: "Low confidence",
    when: "Limited information — escalation recommended.",
    example:
      "Confidence is limited — Aipify recommends human review or escalation before proceeding.",
  },
} as const;

export type ConfidencePhraseKey = keyof typeof CONFIDENCE_PHRASES;

export const TRANSPARENCY_REQUIREMENTS = [
  "No important decision without explanation",
  "Confidence communicated honestly — never false certainty",
  "Human override and escalation paths always visible",
  "Explanations never expose secrets, API keys, or cross-tenant data",
  "Governance and approval policies supplement explainability — never bypassed",
] as const;

export const ACCOUNTABILITY_PRINCIPLES = [
  "Humans retain responsibility for consequential decisions",
  "Overrides are logged and auditable",
  "Escalation is preferred over invented reasoning",
  "Feedback improves explainability — questioning is encouraged",
] as const;

export function getConfidencePhrase(level: ConfidencePhraseKey | string) {
  if (level === "medium") return CONFIDENCE_PHRASES.moderate;
  const key = level as ConfidencePhraseKey;
  return CONFIDENCE_PHRASES[key] ?? CONFIDENCE_PHRASES.moderate;
}

export function getConfidencePhrases() {
  return Object.values(CONFIDENCE_PHRASES);
}
