import { operationalSkill } from "./_defaults";

export const executiveBriefingsSkill = operationalSkill({
  id: "executive-briefings",
  name: "Executive Briefings",
  description: "Calm daily and periodic briefings for business leaders.",
  purpose: "Reduce decision fatigue with concise what happened / what needs attention summaries.",
  dataSources: ["presence_snapshot", "recommendations", "health_trends", "approvals"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Read-only summaries; no autonomous execution.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["pending_critical_approval"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  requiresInstallation: false,
  version: "1.0.0",
  layers: ["customer_app"],
  moduleKey: "executive_briefing_basic",
  releaseStage: "general_availability",
});
