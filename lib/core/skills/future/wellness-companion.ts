import { defineSkill } from "../define";

export const wellnessCompanionSkill = defineSkill({
  id: "wellness-companion",
  name: "Aipify Wellness Companion",
  description:
    "Future Companion Module — wellbeing routines, work-life balance, and self-care support. Not a healthcare service.",
  purpose:
    "Help people build healthier, more sustainable lives — planted for future release. Never medical advice.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All wellness actions require user approval. Never diagnose or replace healthcare professionals.",
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
  moduleKey: "aipify_wellness_companion",
  releaseStage: "aipify_internal",
});
