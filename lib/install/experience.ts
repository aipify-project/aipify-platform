/** Phase 24 — Modern customer install experience (simplicity outside, control inside). */

export const MODERN_INSTALL_ROUTE = "/app/install";
export const DEVELOPER_SETTINGS_ROUTE = "/app/settings/developer";

/** Customer-visible flow (no license keys for standard users). */
export const MODERN_INSTALL_FLOW = [
  { id: "select_platform", order: 1, labelKey: "install.modern.flow.selectPlatform" },
  { id: "sign_in", order: 2, labelKey: "install.modern.flow.signIn" },
  { id: "connect_platform", order: 3, labelKey: "install.modern.flow.connectPlatform" },
  { id: "approve_permissions", order: 4, labelKey: "install.modern.flow.approvePermissions" },
  { id: "aipify_learns", order: 5, labelKey: "install.modern.flow.aipifyLearns" },
  { id: "review_recommendations", order: 6, labelKey: "install.modern.flow.reviewRecommendations" },
  { id: "activate_aipify", order: 7, labelKey: "install.modern.flow.activateAipify" },
  { id: "first_executive_briefing", order: 8, labelKey: "install.modern.flow.firstBriefing" },
] as const;

export type ModernInstallStepId = (typeof MODERN_INSTALL_FLOW)[number]["id"];

export const INSTALL_PLATFORM_OPTIONS = [
  "shopify",
  "wordpress",
  "woocommerce",
  "custom_website",
  "developer_setup",
  "not_sure",
] as const;

export type InstallPlatformOption = (typeof INSTALL_PLATFORM_OPTIONS)[number];

/** Customer-facing heartbeat labels (maps to Install Engine statuses). */
export const CUSTOMER_HEARTBEAT_LABELS: Record<string, string> = {
  healthy: "connected",
  warning: "warning",
  disconnected: "disconnected",
  pending_update: "updating",
  paused: "suspended",
};

export const MODERN_INSTALL_PRINCIPLE =
  "Complexity belongs inside Aipify. Simplicity belongs to the customer.";
