import { executiveSkill } from "./_defaults";

export const riskIdentificationSkill = executiveSkill({
  id: "risk-identification",
  name: "Risk Identification",
  description: "Identifies operational and business risks for leadership review.",
  purpose: "Support decisions with clear risk context — not alarmist messaging.",
  dataSources: ["health_trends", "action_logs", "integration_status"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Insight only.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["critical_risk"],
  rollbackSupport: false,
  ownerTeam: "intelligence",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  minimumPlan: "business",
  version: "1.0.0",
  layers: ["customer_app", "platform"],
  moduleKey: "executive_center",
  releaseStage: "general_availability",
});
