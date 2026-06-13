import { defineSkill } from "../define";

export const parentingCompanionSkill = defineSkill({
  id: "parenting-companion",
  name: "Aipify Parenting Companion",
  description:
    "Future Companion Module — parenting routines, milestones, and family coordination. Never a substitute parent.",
  purpose:
    "Help parents reduce mental overload and focus on meaningful family moments — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "Parental authority preserved — all actions require explicit approval. Never override family values.",
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
  moduleKey: "aipify_parenting_companion",
  releaseStage: "aipify_internal",
});
