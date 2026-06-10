/**
 * Customer wizard UI constants (Layer 2). Phase 17 Install Engine foundation
 * lives in lib/install/ — see INSTALL_ENGINE.md.
 */
export const INSTALLATION_LIFECYCLE_STATUSES = [
  "draft",
  "pending_verification",
  "ready",
  "installing",
  "active",
  "warning",
  "failed",
  "suspended",
  "archived",
] as const;

export type InstallationLifecycleStatus =
  (typeof INSTALLATION_LIFECYCLE_STATUSES)[number];

export const INSTALLATION_HEALTH_STATUSES = [
  "healthy",
  "needs_attention",
  "critical",
] as const;

export type InstallationHealthStatus =
  (typeof INSTALLATION_HEALTH_STATUSES)[number];

export const MODULE_CATALOG = [
  { key: "support_ai", label: "Support AI" },
  { key: "analytics_ai", label: "Analytics AI" },
  { key: "commerce_ai", label: "Commerce AI" },
  { key: "assistant", label: "Assistant AI" },
  { key: "moderation_ai", label: "Moderation AI" },
  { key: "executive_insights", label: "Executive Insights" },
  { key: "notifications", label: "Notifications" },
] as const;

export type InstallationModuleCatalogKey =
  (typeof MODULE_CATALOG)[number]["key"];

export type CustomerOnboarding = {
  id: string;
  customer_id: string;
  profile_completed: boolean;
  domain_connected: boolean;
  installation_active: boolean;
  health_scan_completed: boolean;
  recommendation_generated: boolean;
  support_enabled: boolean;
  score: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InstallationHealthScan = {
  id: string;
  installation_id: string;
  customer_id: string | null;
  score: number;
  status: InstallationHealthStatus;
  connectivity_ok: boolean;
  webhook_ok: boolean;
  modules_ok: boolean;
  api_ok: boolean;
  details: Record<string, unknown>;
  created_at: string;
};

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

import type { SystemType } from "@/lib/tenant/types";

export type InstallationWizardLabels = {
  title: string;
  subtitle: string;
  start: string;
  next: string;
  back: string;
  finish: string;
  loading: string;
  error: string;
  pulseLabel: string;
  steps: Record<string, string>;
  nameLabel: string;
  namePlaceholder: string;
  domainLabel: string;
  domainPlaceholder: string;
  systemType: string;
  systemTypes: Record<SystemType, string>;
  verifyTitle: string;
  verifyHint: string;
  startVerification: string;
  confirmVerification: string;
  metaTagLabel: string;
  modulesTitle: string;
  modulesHint: string;
  credentialsTitle: string;
  credentialsHint: string;
  copy: string;
  copied: string;
  activateTitle: string;
  activateHint: string;
  activate: string;
  healthTitle: string;
  healthScore: string;
  healthStatus: Record<string, string>;
  completed: string;
};

export const WIZARD_STEPS: { step: WizardStep; key: string }[] = [
  { step: 1, key: "name" },
  { step: 2, key: "domain" },
  { step: 3, key: "verify" },
  { step: 4, key: "modules" },
  { step: 5, key: "credentials" },
  { step: 6, key: "activate" },
  { step: 7, key: "health" },
];

export function formatHealthStatus(
  status: InstallationHealthStatus | string | null | undefined,
  labels: Record<string, string>
): string {
  if (!status) return "—";
  return labels[status] ?? status;
}

export function getOnboardingItems(onboarding: CustomerOnboarding) {
  return [
    { key: "profile_completed", done: onboarding.profile_completed },
    { key: "domain_connected", done: onboarding.domain_connected },
    { key: "installation_active", done: onboarding.installation_active },
    { key: "health_scan_completed", done: onboarding.health_scan_completed },
    { key: "recommendation_generated", done: onboarding.recommendation_generated },
    { key: "support_enabled", done: onboarding.support_enabled },
  ] as const;
}

export function formatInstallationModuleKeys(
  modules: Array<{ module_key: string } | string> | undefined
): string {
  if (!modules?.length) return "—";
  return modules
    .map((module) => (typeof module === "string" ? module : module.module_key))
    .join(", ");
}

export const PLACEHOLDER_RECOMMENDATIONS = [
  "enable_support_ai",
  "reconnect_webhook",
  "rotate_installation_token",
  "run_health_diagnostics",
  "upgrade_plan_domains",
] as const;
