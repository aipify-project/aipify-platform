import { executiveSkill } from "./_defaults";

export const weeklyExecutiveSummariesSkill = executiveSkill({
  id: "weekly-executive-summaries",
  name: "Weekly Executive Summaries",
  description: "Weekly calm summary of what happened and what improved.",
  purpose: "Reduce decision fatigue with periodic leadership summaries.",
  dataSources: ["presence_snapshot", "healing_logs", "recommendations"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Read-only summaries.",
  learningBehaviour: "none",
  escalationRules: ["pending_approvals"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  minimumPlan: "starter",
  version: "1.0.0",
  layers: ["customer_app"],
  moduleKey: "executive_briefing_basic",
  releaseStage: "general_availability",
});
