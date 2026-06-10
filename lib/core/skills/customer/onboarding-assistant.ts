import { customerSkill } from "./_defaults";

export const onboardingAssistantSkill = customerSkill({
  id: "onboarding-assistant",
  name: "Onboarding Assistant",
  description: "Guides new tenants through setup and first-value milestones.",
  purpose: "Reduce time-to-value and onboarding friction.",
  dataSources: ["onboarding_state", "install_wizard", "knowledge_base"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Guidance only; no destructive actions.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["setup_blocked", "integration_failure"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  supportsLearning: true,
  requiresApproval: false,
  version: "1.0.0",
  layers: ["customer_app"],
  releaseStage: "general_availability",
});
