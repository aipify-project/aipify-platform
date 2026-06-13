import { defineSkill } from "../define";

export const communityCompanionSkill = defineSkill({
  id: "community-companion",
  name: "Aipify Community Companion",
  description:
    "Future Companion Module — community engagement, health indicators, and moderator support. Human moderation remains authoritative.",
  purpose:
    "Help communities become healthier and more engaging — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "Community leaders control policies and moderation boundaries. Sensitive moderation decisions require human authority.",
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
  moduleKey: "aipify_community_companion",
  releaseStage: "aipify_internal",
});
