export const IMPLEMENTATION_BLUEPRINT_PHASE132_MISSION =
  "Coordinate specialized Companions as a harmonious workforce — clarity of responsibility, healthy collaboration, and human-led governance. People First. Companionship before replacement.";

export const IMPLEMENTATION_BLUEPRINT_PHASE132_PHILOSOPHY =
  "Humans lead; companions support within governance frameworks. Harmony not hierarchy. Specialized Companions work as teams — never one super-assistant. Metadata only — no surveillance of individuals. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE132_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Companion Workforce Center orchestrates responsibility, collaboration, and escalation across companion roles. Aipify recommends and prepares; humans approve and decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE132_VISION =
  "Organizations experience coordinated companion teamwork — meaningful support, balanced workloads, psychological safety, and recognition — while humans retain full authority.";

export const IMPLEMENTATION_BLUEPRINT_PHASE132_OBJECTIVE_KEYS = [
  "workforce_directory",
  "collaboration_rules",
  "task_routing",
  "conflict_management",
  "governance_alignment",
  "health_insights",
  "human_collaboration",
  "psychological_safety",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE132_WORKFORCE_CENTER = [
  "directory",
  "responsibility_assignment",
  "collaboration_rules",
  "visualization",
  "escalation",
  "performance_insights",
  "governance",
  "human_oversight",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE132_COMPANION_ROLES = [
  "executive",
  "support",
  "knowledge",
  "commerce",
  "growth_partner",
  "governance",
  "transformation",
  "community",
  "resilience",
  "operations",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE132_COMPANION_LIMITATIONS = [
  "expand_authority",
  "redefine_responsibilities",
  "suppress_escalation",
  "bypass_governance",
  "override_humans",
] as const;

export function getImplementationBlueprintPhase132Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE132_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE132_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE132_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE132_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE132_OBJECTIVE_KEYS,
    workforceCenterCapabilities: IMPLEMENTATION_BLUEPRINT_PHASE132_WORKFORCE_CENTER,
    companionRoles: IMPLEMENTATION_BLUEPRINT_PHASE132_COMPANION_ROLES,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE132_COMPANION_LIMITATIONS,
    engineRoute: "/app/companion-workforce-engine",
    enginePhase: "Repo Phase 132 — Coordinated Companion Workforce Engine",
    blueprintPhase: "Phase 132 — Coordinated Companion Workforce",
    autonomousOrganizationEra: "Autonomous Organization Era (131–140)",
    agentsDistinction: "Multi-Agent Collaboration Phase 74 at /app/agents — cross-link only, never duplicate RPCs",
    marketplaceDistinction: "Companion Marketplace Phase 113 at /app/companion-marketplace — cross-link only",
    humanOversightCrossLink: "Human Oversight A.40 at /app/human-oversight-engine — Phase 131 interim cross-link",
    metadataOnly: "Metadata only in workforce directory and health signals — no PII or individual surveillance",
    growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate",
  };
}
