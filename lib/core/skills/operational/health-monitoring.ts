import { operationalSkill } from "./_defaults";

export const healthMonitoringSkill = operationalSkill({
  id: "health-monitoring",
  name: "Health Monitoring",
  description: "Monitors integrations, services, and installation health trends.",
  purpose: "Detect degradation early and surface calm, actionable status.",
  dataSources: ["installation_health", "integration_status", "webhook_metrics"],
  permissionsRequired: ["admin", "support"],
  approvalRequirements: "Read-only monitoring; alerts only.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["health_below_threshold", "integration_failure"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  requiresInstallation: true,
  version: "1.0.0",
  layers: ["customer_app", "embedded", "platform"],
  moduleKey: "health_monitoring",
  releaseStage: "general_availability",
});
