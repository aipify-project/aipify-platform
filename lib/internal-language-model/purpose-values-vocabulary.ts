/** Purpose & Values Engine — organizational purpose and values language (Phase A.82). */

export const PURPOSE_VALUES_MISSION =
  "Keep organizations connected to purpose and values during daily operations, growth, and change.";

export const PURPOSE_VALUES_ABOS_PRINCIPLE =
  "How you succeed matters as much as whether — purpose provides meaning, values provide direction.";

export const PURPOSE_VALUES_PHILOSOPHY =
  "Actions align with values — bridge intention and execution for meaningful progress, not mere efficiency.";

export const PURPOSE_VALUES_VISION =
  "The companion understands why the organization exists — technology strengthens identity, it does not replace it.";

export const PURPOSE_VALUES_DISTINCTION =
  "Distinct from Brand Identity & Personhood Standard (Aipify product naming), Business DNA Engine, Strategic Alignment A.55, and AI Ethics governance — tenant organizational purpose and values.";

export const EXAMPLE_ORGANIZATIONAL_VALUES = [
  { value_key: "integrity", label: "Integrity" },
  { value_key: "innovation", label: "Innovation" },
  { value_key: "inclusion", label: "Inclusion" },
  { value_key: "excellence", label: "Excellence" },
  { value_key: "transparency", label: "Transparency" },
  { value_key: "sustainability", label: "Sustainability" },
  { value_key: "customer_obsession", label: "Customer obsession" },
  { value_key: "continuous_learning", label: "Continuous learning" },
] as const;

export const VALUES_AWARE_ASSISTANCE_PATTERNS = [
  "Aipify recommends explaining trade-offs openly — aligned with your transparency value.",
  "Support readiness patterns suggest prioritizing customer care — aligned with your stated values.",
  "Before this decision proceeds, consider alignment with integrity and trust.",
  "Capacity signals suggest sustainable rhythms — ambition balanced with wellbeing.",
] as const;

export const VALUES_REFLECTION_PROMPTS = [
  "Does this decision align with your stated values?",
  "What trade-offs matter most here?",
  "How does trust factor into this choice?",
  "Are we evolving without compromising identity?",
] as const;

export function getPurposeValuesMission() {
  return PURPOSE_VALUES_MISSION;
}

export function getPurposeValuesDistinction() {
  return PURPOSE_VALUES_DISTINCTION;
}

export function getExampleOrganizationalValues() {
  return EXAMPLE_ORGANIZATIONAL_VALUES;
}
