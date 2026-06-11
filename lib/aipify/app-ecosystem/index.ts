export * from "./types";
export * from "./parse";
export * from "./manifest";
export * from "./sdk";

export const APP_ECOSYSTEM_MODULE_PATH = "aipify-core/app-ecosystem";
export const APP_ECOSYSTEM_PHILOSOPHY =
  "Apps are guests inside Aipify — secure, governed, permission-aware, and auditable.";
export const APP_ECOSYSTEM_SAFETY_NOTE =
  "Third-party apps run in Sandbox Runtime. No secret access, no cross-tenant data, no Governance bypass.";

export const DEVELOPER_PORTAL_INFO = {
  sdk_version: "1.0.0",
  manifest_spec_url: "/developers#manifest",
  sandbox_restrictions: [
    "No unrestricted filesystem access",
    "No unrestricted database access",
    "No direct secret access",
    "No cross-tenant access",
    "No Governance bypass",
    "No Policy Engine bypass",
  ],
  partner_tiers: ["internal", "verified_developer", "agency_partner", "enterprise_partner"],
  publishing_steps: [
    "Build app with SDK",
    "Run local manifest validation",
    "Security scan",
    "Governance validation",
    "Submit for review",
    "Publish to Marketplace",
  ],
};
