import { installationSkill } from "./_defaults";

export const workflowDiscoverySkill = installationSkill({
  id: "workflow-discovery",
  name: "Workflow Discovery",
  description: "Discovers how the customer environment operates.",
  purpose: "Tailor assistance to real workflows inside customer systems.",
  dataSources: ["installation_context", "system_mapping"],
  permissionsRequired: ["admin"],
  approvalRequirements: "Read-only discovery.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["discovery_incomplete"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  version: "1.0.0",
  layers: ["embedded"],
  releaseStage: "general_availability",
});
