import { defineSkill } from "../define";

export const retirementCompanionSkill = defineSkill({
  id: "retirement-companion",
  name: "Aipify Retirement Companion",
  description:
    "Future Companion Module — retirement planning, purpose, social engagement, and lifestyle fulfillment. Not financial or medical advice.",
  purpose:
    "Help people navigate retirement with confidence, structure, and fulfillment — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All retirement actions require explicit approval. Never replace licensed professionals or make major life decisions.",
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
  moduleKey: "aipify_retirement_companion",
  releaseStage: "aipify_internal",
});
