import { defineSkill } from "../define";

export const petCompanionSkill = defineSkill({
  id: "pet-companion",
  name: "Aipify Pet Companion",
  description:
    "Future Companion Module — pet routines, preventative care reminders, and ownership coordination. Not veterinary care.",
  purpose:
    "Help pet owners care consistently with less stress — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All pet care actions require user approval. Never diagnose or replace veterinarians.",
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
  moduleKey: "aipify_pet_companion",
  releaseStage: "aipify_internal",
});
