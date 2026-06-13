import { defineSkill } from "../define";

export const entrepreneurCompanionSkill = defineSkill({
  id: "entrepreneur-companion",
  name: "Aipify Entrepreneur Companion",
  description:
    "Future Companion Module — founder priorities, operations, growth, and sustainable business building. Never replaces leadership.",
  purpose:
    "Help entrepreneurs coordinate priorities, reduce overload, and build sustainably — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All entrepreneur actions require explicit approval. Never replace leadership judgment or encourage burnout.",
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
  moduleKey: "aipify_entrepreneur_companion",
  releaseStage: "aipify_internal",
});
