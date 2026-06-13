import { defineSkill } from "../define";

export const matchCompanionSkill = defineSkill({
  id: "match-companion",
  name: "Aipify Match Companion",
  description:
    "Future Companion Module — intentional compatibility for meaningful relationships. Not a dating platform.",
  purpose:
    "Help individuals navigate dating with greater intention, trust, and understanding — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "User controls all shared dimensions and privacy before any matching insight.",
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
  moduleKey: "aipify_match_companion",
  releaseStage: "aipify_internal",
});
