import { operationalSkill } from "./_defaults";

export const knowledgeAssistantSkill = operationalSkill({
  id: "knowledge-assistant",
  name: "Knowledge Center",
  description: "Answers from tenant knowledge base and approved operational context.",
  purpose: "Surface institutional knowledge without exposing cross-tenant data.",
  dataSources: ["knowledge_base", "tenant_settings"],
  permissionsRequired: ["support", "staff", "read_only"],
  approvalRequirements: "Read-only retrieval; no external actions.",
  learningBehaviour: "none",
  escalationRules: ["missing_knowledge", "policy_conflict"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  requiresInstallation: false,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  moduleKey: "knowledge_base",
  releaseStage: "general_availability",
});
