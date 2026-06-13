import { defineSkill } from "../define";

export const financeCompanionSkill = defineSkill({
  id: "finance-companion",
  name: "Aipify Finance Companion",
  description:
    "Future Companion Module — financial awareness, planning, and organization. Not regulated financial advice.",
  purpose:
    "Help people and organizations become more organized and intentional with finances — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All financial actions require explicit approval. Never provide regulated advice or replace licensed professionals.",
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
  minimumPlan: "business",
  core: false,
  tenantScoped: true,
  version: "0.0.1",
  layers: ["customer_app"],
  moduleKey: "aipify_finance_companion",
  releaseStage: "aipify_internal",
});
