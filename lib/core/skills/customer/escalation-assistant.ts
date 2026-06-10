import { customerSkill } from "./_defaults";

export const escalationAssistantSkill = customerSkill({
  id: "escalation-assistant",
  name: "Escalation Assistant",
  description: "Routes complex issues to the right human with full context.",
  purpose: "Ensure escalation paths exist for every customer-facing skill.",
  dataSources: ["support_tickets", "conversation_context", "tenant_policies"],
  permissionsRequired: ["support", "staff"],
  approvalRequirements: "Always preserves human handoff; never closes without resolution path.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["always_available"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  supportsLearning: true,
  requiresApproval: false,
  version: "1.0.0",
  layers: ["embedded", "customer_app"],
  releaseStage: "general_availability",
});
