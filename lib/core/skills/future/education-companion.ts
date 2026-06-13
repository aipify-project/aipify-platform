import { defineSkill } from "../define";

export const educationCompanionSkill = defineSkill({
  id: "education-companion",
  name: "Aipify Education Companion",
  description:
    "Future Companion Module — lifelong learning, study support, and skill development. Never academic misconduct.",
  purpose:
    "Help people continue growing and achieving meaningful learning goals throughout life — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All learning actions require user approval. Never complete assessments dishonestly or replace educators.",
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
  moduleKey: "aipify_education_companion",
  releaseStage: "aipify_internal",
});
