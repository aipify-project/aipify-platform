/** Relationship Intelligence Engine (A.78 — organizational) — distinct from personal RSI. */

export const RELATIONSHIP_INTELLIGENCE_CATEGORIES = [
  {
    key: "internal",
    label: "Internal",
    summary: "Employee, team, manager, and executive relationships within the organization.",
  },
  {
    key: "customer",
    label: "Customer",
    summary: "Customer account and stakeholder relationships for support and success.",
  },
  {
    key: "partner",
    label: "Partner",
    summary: "Implementation, reseller, and advisory partner relationships.",
  },
  {
    key: "community",
    label: "Community",
    summary: "Community, ecosystem, and public stakeholder relationships.",
  },
] as const;

export const RELATIONSHIP_INTELLIGENCE_ETHICAL_BOUNDARIES = [
  "Never impersonate users or auto-send messages",
  "Metadata only — no raw email or chat content",
  "Suggestions inform humans — no relationship manipulation",
  "Organizational scope — personal RSI remains separate",
] as const;

export function getRelationshipIntelligenceVocabulary() {
  return {
    categories: RELATIONSHIP_INTELLIGENCE_CATEGORIES,
    ethical_boundaries: RELATIONSHIP_INTELLIGENCE_ETHICAL_BOUNDARIES,
    distinction:
      "Organizational Relationship Intelligence (A.78) is tenant-level ABOS context. Personal RSI (Phase 33) is at /app/assistant/relationships.",
  };
}
