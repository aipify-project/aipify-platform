import { customerSkill } from "./_defaults";

export const customerSupportAssistantSkill = customerSkill({
  id: "customer-support-assistant",
  name: "Customer Support Assistant",
  description: "End-user support inside customer environments.",
  purpose: "Assist customers and reduce support demand with escalation paths.",
  dataSources: ["knowledge_base", "support_categories", "installation_context"],
  permissionsRequired: ["support", "staff"],
  approvalRequirements: "Escalate unresolved or high-risk interactions.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["unresolved", "high_risk", "human_requested"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  supportsLearning: true,
  requiresApproval: false,
  version: "1.0.0",
  layers: ["embedded"],
  moduleKey: "support_ai_basic",
  releaseStage: "general_availability",
});
