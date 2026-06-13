import { defineSkill } from "../define";

export const familyCompanionSkill = defineSkill({
  id: "family-companion",
  name: "Aipify Family Companion",
  description:
    "Future Companion Module — family coordination, reminders, and shared responsibilities. Reduces mental load without replacing relationships.",
  purpose:
    "Help families remember what matters, prepare for important moments, and spend more time together — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "Parental authority preserved — actions require explicit permissions and Trust & Action approval where applicable.",
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
  moduleKey: "aipify_family_companion",
  releaseStage: "aipify_internal",
});
