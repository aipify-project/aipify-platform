import { executiveSkill } from "./_defaults";

export const approvalInsightsSkill = executiveSkill({
  id: "approval-insights",
  name: "Approval Insights",
  description: "Executive view of pending approvals with risk and impact context.",
  purpose: "Help leaders decide quickly on items requiring human control.",
  dataSources: ["action_center", "approval_queue", "risk_classification"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Human must approve or decline; skill surfaces context only.",
  learningBehaviour: "none",
  escalationRules: ["critical_pending"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: true,
  supportsLearning: false,
  minimumPlan: "growth",
  version: "1.0.0",
  layers: ["customer_app", "platform"],
  moduleKey: "action_center",
  releaseStage: "general_availability",
});
