import { defineSkill } from "../define";

export const legalCompanionSkill = defineSkill({
  id: "legal-companion",
  name: "Aipify Legal Companion",
  description:
    "Future Companion Module — legal organization, deadlines, and preparation workflows. Not legal advice.",
  purpose:
    "Help people and organizations stay organized and prepared around legal responsibilities — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All legal preparation actions require explicit approval. Never provide legal advice or replace attorneys.",
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
  moduleKey: "aipify_legal_companion",
  releaseStage: "aipify_internal",
});
