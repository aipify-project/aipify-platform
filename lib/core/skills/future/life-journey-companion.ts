import { defineSkill } from "../define";

export const lifeJourneyCompanionSkill = defineSkill({
  id: "life-journey-companion",
  name: "Aipify Life Journey Companion",
  description:
    "Future orchestration layer — unifies personal Companion Modules across life stages. Never defines identity or meaningful life.",
  purpose:
    "Coordinate personal companions with continuity and compassion as life evolves — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All orchestration actions require user approval. Never pressure life choices or duplicate domain companion logic.",
  learningBehaviour: "approved_only",
  tenantIsolation: "tenant",
  escalationRules: [],
  rollbackSupport: false,
  ownerTeam: "product",
  category: "future",
  status: "planned",
  enabledByDefault: false,
  requiresApproval: true,
  supportsLearning: false,
  requiresInstallation: false,
  minimumPlan: "growth",
  core: false,
  tenantScoped: true,
  version: "0.0.1",
  layers: ["customer_app"],
  moduleKey: "aipify_life_journey_companion",
  releaseStage: "aipify_internal",
});
