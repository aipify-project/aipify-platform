/** ABOS Resilience Engine — organizational resilience language (extends Phase A.50). */

export const RESILIENCE_ENGINE_PURPOSE =
  "Help organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis.";

export const RESILIENCE_ENGINE_MISSION =
  "Strengthen resilience through preparation, response, recovery, and learning.";

export const RESILIENCE_ENGINE_PHILOSOPHY =
  "Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.";

export const RESILIENCE_ENGINE_ABOS_PRINCIPLE =
  "Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.";

export const RESILIENCE_ENGINE_VISION =
  "A steady companion when circumstances are not — rising again, not never falling.";

export const RESILIENCE_ENGINE_DISTINCTION =
  "Extends Phase A.50 Organizational Resilience Engine (/app/organizational-resilience-engine). Distinct from Phase 80 Continuity (/app/continuity), Organizational Health A.56, and Growth & Evolution A.81.";

export const RESILIENCE_DIMENSIONS = {
  operational: {
    key: "operational" as const,
    label: "Operational",
    examples: [
      "Critical process continuity and fallback procedures",
      "Service recovery priorities during disruption",
      "Integration and workflow redundancy",
    ],
  },
  knowledge: {
    key: "knowledge" as const,
    label: "Knowledge",
    examples: [
      "Documented procedures and approved playbooks",
      "Role clarity and escalation paths",
      "Institutional memory capture after events",
    ],
  },
  human: {
    key: "human" as const,
    label: "Human",
    examples: [
      "Team capacity and backup role assignments",
      "Recovery periods after intense response",
      "Sustainable workload during prolonged disruption",
    ],
  },
  customer: {
    key: "customer" as const,
    label: "Customer",
    examples: [
      "Communication during disruption",
      "Service expectations and status transparency",
      "Coordinated customer-facing updates",
    ],
  },
  strategic: {
    key: "strategic" as const,
    label: "Strategic",
    examples: [
      "Priority decisions during crisis",
      "Adaptation choices under uncertainty",
      "Long-term recovery and capability rebuilding",
    ],
  },
} as const;

export type ResilienceDimensionKey = keyof typeof RESILIENCE_DIMENSIONS;

export const CRISIS_SUPPORT_GUIDANCE =
  "During disruption, Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while humans lead decisions.";

export const CRISIS_EXAMPLE_PHRASES = [
  "Here is what we know and what we are doing next.",
  "These are the approved procedures for this scenario.",
  "Human leadership retains decision authority — Aipify coordinates and informs.",
  "Roles and escalation paths are visible — reducing confusion during uncertainty.",
] as const;

export const RESILIENCE_FORBIDDEN_PHRASING = [
  "Resilience means never failing",
  "Aipify leads crisis response alone",
  "Ignore human leadership during incidents",
  "Pressure teams to recover without rest",
] as const;

export function getResilienceDimensions() {
  return Object.values(RESILIENCE_DIMENSIONS);
}

export function getResilienceDimension(key: ResilienceDimensionKey | string) {
  const dim = RESILIENCE_DIMENSIONS[key as ResilienceDimensionKey];
  return dim ?? RESILIENCE_DIMENSIONS.operational;
}

export function getCrisisExamplePhrases() {
  return [...CRISIS_EXAMPLE_PHRASES];
}
