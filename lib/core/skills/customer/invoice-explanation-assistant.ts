import { customerSkill } from "./_defaults";

export const invoiceExplanationAssistantSkill = customerSkill({
  id: "invoice-explanation-assistant",
  name: "Invoice Explanation Assistant",
  description: "Explains invoices and billing line items in plain business language.",
  purpose: "Clarify billing without exposing payment credentials to learning.",
  dataSources: ["invoice_metadata", "subscription_plan"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Read-only; never stores payment details for learning.",
  learningBehaviour: "none",
  escalationRules: ["billing_dispute", "unclear_charge"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  supportsLearning: false,
  requiresApproval: false,
  version: "1.0.0",
  layers: ["customer_app"],
  releaseStage: "general_availability",
});
