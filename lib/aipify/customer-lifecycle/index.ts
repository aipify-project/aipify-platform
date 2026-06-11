export * from "./types";
export * from "./parse";

export const CUSTOMER_LIFECYCLE_MODULE_PATH = "aipify-core/customer-lifecycle";
export const CUSTOMER_LIFECYCLE_PHILOSOPHY =
  "Customer success comes before expansion.";
export const CUSTOMER_LIFECYCLE_SAFETY_NOTE =
  "No aggressive upselling, manipulative retention, hidden scoring, or forced expansion campaigns.";

export const HEALTH_BAND_LABELS: Record<string, string> = {
  thriving: "Thriving Customer (90–100)",
  healthy: "Healthy Customer (75–89)",
  support_opportunity: "Support Opportunity (60–74)",
  at_risk: "At-Risk Customer (40–59)",
  critical: "Critical Intervention Recommended (below 40)",
};
