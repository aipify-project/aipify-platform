import { customerSkill } from "./_defaults";

export const installationGuideAssistantSkill = customerSkill({
  id: "installation-guide-assistant",
  name: "Installation Guide Assistant",
  description: "Walks users through install, domain verification, and token setup.",
  purpose: "Make install-first adoption fast and reliable.",
  dataSources: ["install_wizard", "domain_validation", "installation_docs"],
  permissionsRequired: ["admin", "owner"],
  approvalRequirements: "Guidance only.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["install_failure", "domain_blocked"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  supportsLearning: true,
  requiresApproval: false,
  requiresInstallation: true,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  moduleKey: "install_management",
  releaseStage: "general_availability",
});
