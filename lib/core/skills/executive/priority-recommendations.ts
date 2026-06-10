import { executiveSkill } from "./_defaults";

export const priorityRecommendationsSkill = executiveSkill({
  id: "priority-recommendations",
  name: "Priority Recommendations",
  description: "Executive-prioritized recommendations in business language.",
  purpose: "Surface what leaders should focus on first.",
  dataSources: ["recommendations", "impact_scores", "health_trends"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Recommendations only.",
  learningBehaviour: "approved_only",
  escalationRules: ["critical_impact"],
  rollbackSupport: false,
  ownerTeam: "intelligence",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  minimumPlan: "growth",
  version: "1.0.0",
  layers: ["customer_app"],
  moduleKey: "recommendations",
  releaseStage: "general_availability",
});
