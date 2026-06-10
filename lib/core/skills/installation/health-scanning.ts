import { installationSkill } from "./_defaults";

export const healthScanningSkill = installationSkill({
  id: "health-scanning",
  name: "Health Scanning",
  description: "Scans installation and environment health on schedule or demand.",
  purpose: "Early detection of degradation inside customer environments.",
  dataSources: ["health_scan_results", "service_endpoints"],
  permissionsRequired: ["admin", "support"],
  approvalRequirements: "Low-risk scans auto; invasive scans need approval.",
  riskClassification: "low",
  learningBehaviour: "operational_metadata",
  escalationRules: ["scan_failure", "critical_finding"],
  rollbackSupport: false,
  ownerTeam: "platform",
  status: "active",
  enabledByDefault: true,
  requiresApproval: false,
  supportsLearning: true,
  version: "1.0.0",
  layers: ["embedded", "platform"],
  moduleKey: "health_monitoring",
  releaseStage: "general_availability",
});
