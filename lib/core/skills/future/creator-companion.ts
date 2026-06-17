import { defineSkill } from "../define";

export const creatorCompanionSkill = defineSkill({
  id: "creator-companion",
  name: "Aipify Creators — Creator Companion",
  description:
    "Future Business Pack / Companion Module — help creators unlock more value from tools they already use. Never replaces human creativity.",
  purpose:
    "Reduce creator workflow friction through Companion-assisted ideas, drafts, and planning — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All publication and external communication requires explicit user approval. Never auto-post or auto-send.",
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
  moduleKey: "aipify_creators_creator_companion",
  releaseStage: "aipify_internal",
});
