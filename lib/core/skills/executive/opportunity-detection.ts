import { executiveSkill } from "./_defaults";

export const opportunityDetectionSkill = executiveSkill({
  id: "opportunity-detection",
  name: "Opportunity Detection",
  description: "Surfaces growth and efficiency opportunities for executives.",
  purpose: "Help leaders see improvement potential in plain business terms.",
  dataSources: ["operational_patterns", "recommendation_effectiveness"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Insight only.",
  learningBehaviour: "approved_only",
  escalationRules: [],
  rollbackSupport: false,
  ownerTeam: "intelligence",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  minimumPlan: "business",
  version: "1.0.0",
  layers: ["customer_app"],
  moduleKey: "advanced_insights",
  releaseStage: "general_availability",
});
