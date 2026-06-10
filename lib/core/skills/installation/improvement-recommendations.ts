import { installationSkill } from "./_defaults";

export const improvementRecommendationsSkill = installationSkill({
  id: "improvement-recommendations",
  name: "Improvement Recommendations",
  description: "Installation-scoped improvement recommendations.",
  purpose: "Suggest environment-specific improvements with tenant isolation.",
  dataSources: ["health_scan", "system_mapping", "operational_patterns"],
  permissionsRequired: ["admin"],
  approvalRequirements: "Recommendations only.",
  learningBehaviour: "approved_only",
  escalationRules: ["high_impact_change"],
  rollbackSupport: false,
  ownerTeam: "intelligence",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  version: "1.0.0",
  layers: ["embedded", "customer_app"],
  moduleKey: "recommendations",
  releaseStage: "general_availability",
});
