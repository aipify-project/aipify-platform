import { operationalSkill } from "./_defaults";

export const supportAssistantSkill = operationalSkill({
  id: "support-assistant",
  name: "Support Assistant",
  description: "AI-assisted support for operational and customer-facing questions.",
  purpose: "Reduce support demand and resolve issues with calm, accurate assistance.",
  dataSources: ["knowledge_base", "support_tickets", "installation_context"],
  permissionsRequired: ["support", "staff"],
  approvalRequirements: "Low-risk responses auto; escalations require human handoff.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["unresolved_ticket", "high_risk_topic", "customer_distress"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  requiresInstallation: false,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  moduleKey: "support_ai_basic",
  releaseStage: "general_availability",
});
