import { defineSkill } from "../define";

export const lifeTransitionsCompanionSkill = defineSkill({
  id: "life-transitions-companion",
  name: "Aipify Life Transitions Companion",
  description:
    "Future Companion Module — major life transition coordination and preparation. Never replaces professional guidance.",
  purpose:
    "Help people navigate significant life changes with organization and support — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All transition actions require user approval. Never make major life decisions or replace professional guidance.",
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
  moduleKey: "aipify_life_transitions_companion",
  releaseStage: "aipify_internal",
});
