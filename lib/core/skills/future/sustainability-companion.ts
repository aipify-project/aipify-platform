import { defineSkill } from "../define";

export const sustainabilityCompanionSkill = defineSkill({
  id: "sustainability-companion",
  name: "Aipify Sustainability Companion",
  description:
    "Future Companion Module — environmental awareness, sustainable habits, and conscious planning. Never shames users.",
  purpose:
    "Help people align everyday choices with environmental values through awareness and convenience — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All sustainability actions require user approval. Never shame users or create eco-anxiety.",
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
  moduleKey: "aipify_sustainability_companion",
  releaseStage: "aipify_internal",
});
