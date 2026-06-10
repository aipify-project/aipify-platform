import { installationSkill } from "./_defaults";

export const integrationDetectionSkill = installationSkill({
  id: "integration-detection",
  name: "Integration Detection",
  description: "Detects connected integrations and their health.",
  purpose: "Understand customer stack for accurate assistance.",
  dataSources: ["installation_integrations", "webhook_endpoints"],
  permissionsRequired: ["admin"],
  approvalRequirements: "Read-only detection.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["integration_error"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  version: "1.0.0",
  layers: ["embedded", "platform"],
  releaseStage: "general_availability",
});
