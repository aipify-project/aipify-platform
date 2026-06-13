import { defineSkill } from "../define";

export const homeCompanionSkill = defineSkill({
  id: "home-companion",
  name: "Aipify Home Companion",
  description:
    "Future Companion Module — household management, maintenance reminders, and service coordination.",
  purpose:
    "Help people stay prepared and organized at home — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "Service appointments and financial actions require explicit approval. Never override household decision-makers.",
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
  moduleKey: "aipify_home_companion",
  releaseStage: "aipify_internal",
});
