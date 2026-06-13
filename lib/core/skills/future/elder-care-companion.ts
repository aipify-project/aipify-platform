import { defineSkill } from "../define";

export const elderCareCompanionSkill = defineSkill({
  id: "elder-care-companion",
  name: "Aipify Elder Care Companion",
  description:
    "Future Companion Module — aging support, routines, and family coordination with dignity-first design. Not medical care.",
  purpose:
    "Help people maintain independence and strengthen family support systems — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "Family permission structures required. Never medical decisions. Emergency response is human-led.",
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
  moduleKey: "aipify_elder_care_companion",
  releaseStage: "aipify_internal",
});
