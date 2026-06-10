import { installationSkill } from "./_defaults";

export const systemMappingSkill = installationSkill({
  id: "system-mapping",
  name: "System Mapping",
  description: "Maps roles, modules, and structure of the host system.",
  purpose: "Respect customer-native roles and system layout.",
  dataSources: ["system_type", "role_mapping", "module_registry"],
  permissionsRequired: ["admin"],
  approvalRequirements: "Read-only mapping.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["unknown_system_type"],
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
