import { operationalSkill } from "./_defaults";

export const billingMonitoringSkill = operationalSkill({
  id: "billing-monitoring",
  name: "Billing Monitoring",
  description: "Tracks subscription, payment, and invoice health for the tenant.",
  purpose: "Surface billing issues early without exposing payment details to learning.",
  dataSources: ["subscription_status", "invoice_metadata", "payment_status"],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements: "Read-only tenant billing view; no payment execution.",
  learningBehaviour: "none",
  escalationRules: ["payment_failed", "subscription_lapsed"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: false,
  requiresInstallation: false,
  version: "1.0.0",
  layers: ["customer_app", "platform"],
  releaseStage: "general_availability",
});
