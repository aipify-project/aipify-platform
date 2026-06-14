import { defineSkill } from "../define";

export const childhoodMemoryCompanionSkill = defineSkill({
  id: "childhood-memory-companion",
  name: "Aipify Childhood & Memory Companion",
  description:
    "Future Companion Module — childhood milestones, family archives, and generational memory preservation. Never replaces parental involvement.",
  purpose:
    "Help families preserve childhood moments and create lasting archives — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All memory actions require parental approval. Never share children's information without consent.",
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
  moduleKey: "aipify_childhood_memory_companion",
  releaseStage: "aipify_internal",
});
