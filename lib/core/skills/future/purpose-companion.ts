import { defineSkill } from "../define";

export const purposeCompanionSkill = defineSkill({
  id: "purpose-companion",
  name: "Aipify Purpose Companion",
  description:
    "Future Companion Module — values, meaningful goals, reflection, and life alignment. Never defines purpose for users.",
  purpose:
    "Help individuals live in alignment with values and long-term aspirations — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All purpose actions require user approval. Never impose beliefs, judge choices, or replace counseling.",
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
  moduleKey: "aipify_purpose_companion",
  releaseStage: "aipify_internal",
});
