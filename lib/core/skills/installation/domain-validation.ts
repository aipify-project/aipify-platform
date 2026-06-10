import { installationSkill } from "./_defaults";

export const domainValidationSkill = installationSkill({
  id: "domain-validation",
  name: "Domain Validation",
  description: "Validates domain ownership and embed eligibility.",
  purpose: "Domain-locked secure embed runtime.",
  dataSources: ["customer_domains", "installation_token"],
  permissionsRequired: ["admin", "owner"],
  approvalRequirements: "Validation only.",
  learningBehaviour: "none",
  escalationRules: ["domain_mismatch", "unverified_domain"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  version: "1.0.0",
  layers: ["embedded", "customer_app", "platform"],
  releaseStage: "general_availability",
});
