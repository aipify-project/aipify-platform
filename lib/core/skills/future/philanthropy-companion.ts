import { defineSkill } from "../define";

export const philanthropyCompanionSkill = defineSkill({
  id: "philanthropy-companion",
  name: "Aipify Philanthropy Companion",
  description:
    "Future Companion Module — charitable giving, volunteering, and impact planning. Never pressures users to donate.",
  purpose:
    "Help people give with purpose and contribute with intention — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All giving and volunteering actions require explicit approval. Never pressure donations or judge contribution levels.",
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
  moduleKey: "aipify_philanthropy_companion",
  releaseStage: "aipify_internal",
});
