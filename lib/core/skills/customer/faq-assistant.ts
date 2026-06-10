import { customerSkill } from "./_defaults";

export const faqAssistantSkill = customerSkill({
  id: "faq-assistant",
  name: "FAQ Assistant",
  description: "Answers frequently asked questions for end users and staff.",
  purpose: "Reduce support volume with accurate, calm FAQ responses.",
  dataSources: ["knowledge_base", "faq_entries"],
  permissionsRequired: ["support", "staff"],
  approvalRequirements: "Escalate when confidence is low or topic is sensitive.",
  learningBehaviour: "none",
  escalationRules: ["low_confidence", "sensitive_topic", "human_requested"],
  rollbackSupport: false,
  ownerTeam: "product",
  status: "active",
  supportsLearning: false,
  requiresApproval: false,
  version: "1.0.0",
  layers: ["embedded", "customer_app"],
  moduleKey: "support_ai_basic",
  releaseStage: "general_availability",
});
