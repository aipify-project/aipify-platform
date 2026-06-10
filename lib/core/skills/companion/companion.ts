import { defineSkill } from "../define";

/** Companion skills are disabled by default and must never interfere with operations. */
export const companionSkill = defineSkill({
  id: "companion",
  name: "Companion",
  description:
    "Optional human-friendly interactions: greetings, schedule awareness, wellbeing reminders, casual conversation.",
  purpose: "Provide optional warmth without distracting from operational work.",
  dataSources: ["user_preferences", "schedule_metadata"],
  permissionsRequired: ["owner", "admin", "staff"],
  approvalRequirements: "User must explicitly enable; no operational side effects.",
  learningBehaviour: "none",
  tenantIsolation: "tenant",
  escalationRules: [],
  rollbackSupport: false,
  ownerTeam: "product",
  category: "companion",
  status: "disabled",
  enabledByDefault: false,
  requiresApproval: false,
  supportsLearning: false,
  requiresInstallation: false,
  minimumPlan: "starter",
  core: false,
  tenantScoped: true,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  releaseStage: "aipify_internal",
});

export const COMPANION_CAPABILITIES = [
  "friendly_greetings",
  "wellbeing_reminders",
  "schedule_awareness",
  "break_suggestions",
  "simple_lifestyle_recommendations",
  "casual_conversations",
] as const;
