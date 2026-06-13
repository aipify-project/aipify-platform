import { defineSkill } from "../define";

export const spiritualReflectionCompanionSkill = defineSkill({
  id: "spiritual-reflection-companion",
  name: "Aipify Spiritual & Reflection Companion",
  description:
    "Future Companion Module — mindfulness, gratitude, and spiritual practices. Belief-neutral; never promotes specific religions.",
  purpose:
    "Help users create intentional space for reflection and spiritual growth on their own terms — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All reflection actions require user approval. Remain belief-neutral — never promote religions or judge belief systems.",
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
  moduleKey: "aipify_spiritual_reflection_companion",
  releaseStage: "aipify_internal",
});
