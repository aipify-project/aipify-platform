import { defineSkill } from "../define";

export const legacyBusinessCompanionSkill = defineSkill({
  id: "legacy-business-companion",
  name: "Aipify Legacy Business Companion",
  description:
    "Future Companion Module — institutional knowledge, succession planning, and leadership wisdom preservation. Never overrides succession decisions.",
  purpose:
    "Help organizations preserve human knowledge for future leaders — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All legacy actions require appropriate approvals. Never override succession or speak for leaders without authorization.",
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
  moduleKey: "aipify_legacy_business_companion",
  releaseStage: "aipify_internal",
});
