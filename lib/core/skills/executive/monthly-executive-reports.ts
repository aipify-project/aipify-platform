import { executiveSkill } from "./_defaults";

export const monthlyExecutiveReportsSkill = executiveSkill({
  id: "monthly-executive-reports",
  name: "Monthly Executive Reports",
  description: "Monthly business-oriented operational report for leadership.",
  purpose: "Longer-horizon view of stability, improvements, and attention items.",
  dataSources: ["executive_center_bundle", "platform_metrics", "health_trends"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Read-only reports.",
  learningBehaviour: "none",
  escalationRules: [],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  minimumPlan: "business",
  version: "1.0.0",
  layers: ["customer_app", "platform"],
  moduleKey: "executive_center",
  releaseStage: "general_availability",
});
