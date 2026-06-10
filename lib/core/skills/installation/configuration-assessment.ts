import { installationSkill } from "./_defaults";

export const configurationAssessmentSkill = installationSkill({
  id: "configuration-assessment",
  name: "Configuration Assessment",
  description: "Assesses install configuration against best practices.",
  purpose: "Recommend safe configuration improvements.",
  dataSources: ["install_config", "license_limits", "plan_modules"],
  permissionsRequired: ["admin", "owner"],
  approvalRequirements: "Recommendations only unless low-risk auto-fix approved.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["misconfiguration", "license_exceeded"],
  rollbackSupport: true,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: true,
  supportsLearning: true,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  releaseStage: "general_availability",
});
