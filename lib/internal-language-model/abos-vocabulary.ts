export const ABOS_FULL_NAME = "Aipify Business Operating System (ABOS)";

export const ABOS_SHORT_NAME = "ABOS";

export const ABOS_DEFINITION =
  "ABOS is the operational layer connecting existing business systems — not an AI chatbot.";

export const ABOS_PILLARS = [
  {
    key: "knowledge",
    label: "Knowledge",
    summary: "Trusted, approved information for people and AI.",
  },
  {
    key: "assistance",
    label: "Assistance",
    summary: "Human-centered help across admin, support, and personal work.",
  },
  {
    key: "automation",
    label: "Automation",
    summary: "Safe, approved execution of repeatable work.",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    summary: "Explainable insights and recommendations.",
  },
  {
    key: "governance",
    label: "Governance",
    summary: "Permissions, policies, audit, and trust.",
  },
  {
    key: "operations",
    label: "Operations",
    summary: "Integrations, visibility, install runtime, and health.",
  },
] as const;

export type AbosPillarKey = (typeof ABOS_PILLARS)[number]["key"];

/** Preferred ABOS phrasing for ILM-aware copy and assistant replies. */
export function getAbosPillarVocabulary(): ReadonlyArray<{
  key: AbosPillarKey;
  label: string;
  summary: string;
}> {
  return ABOS_PILLARS;
}
