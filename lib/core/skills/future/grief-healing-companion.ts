import { defineSkill } from "../define";

export const griefHealingCompanionSkill = defineSkill({
  id: "grief-healing-companion",
  name: "Aipify Grief & Healing Companion",
  description:
    "Future Companion Module — practical grief support, memory preservation, and family coordination. Never replaces counselors.",
  purpose:
    "Help people carry practical burdens during loss with dignity and compassion — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All grief support actions require user approval. Never replace therapists or rush healing.",
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
  moduleKey: "aipify_grief_healing_companion",
  releaseStage: "aipify_internal",
});
