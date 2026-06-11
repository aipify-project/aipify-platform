import type { NormalizedMemoryObservation } from "../types";

export const UNONIGHT_MEMORY_OBSERVATIONS: NormalizedMemoryObservation[] = [
  {
    source_module: "unonight",
    source_type: "verification_habit",
    observation_key: "memory.unonight.verification_reviews",
    summary: "Admin frequently reviews pending guest verifications",
    scope_level: "team",
    metadata: { workflow: "verification_approval" },
  },
  {
    source_module: "unonight",
    source_type: "support_scenario",
    observation_key: "memory.unonight.support_drafts",
    summary: "Common support scenario: draft review before guest reply",
    scope_level: "tenant",
    metadata: { category: "support" },
  },
  {
    source_module: "unonight",
    source_type: "marketplace_moderation",
    observation_key: "memory.unonight.marketplace_moderation",
    summary: "Marketplace listings often require moderation review",
    scope_level: "team",
    metadata: { category: "marketplace" },
  },
];
