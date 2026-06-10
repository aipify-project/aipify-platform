import { operationalSkill } from "./_defaults";

export const presenceEngineSkill = operationalSkill({
  id: "presence-engine",
  name: "Presence Engine",
  description: "Calm operational presence — what Aipify is doing and whether attention is needed.",
  purpose: "Reassure users without distraction; surface approvals and health honestly.",
  dataSources: ["presence_events", "automations", "approvals", "health_scores"],
  permissionsRequired: ["owner", "admin", "support", "staff"],
  approvalRequirements: "Presence reflects state only; does not execute actions.",
  learningBehaviour: "none",
  escalationRules: ["human_approval_required", "critical_attention"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  requiresInstallation: false,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  moduleKey: "presence_center",
  releaseStage: "general_availability",
});
