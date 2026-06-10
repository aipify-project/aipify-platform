import type { CustomerHealth } from "./ai-dashboard";
import { computeCustomerHealth, deriveInstallationHealth } from "./ai-dashboard";
import type {
  ActivityLogCategory,
  ActivityLogEntry,
  CustomerMasterDetail,
  CustomerRecommendation,
  CustomerRecord,
  OpportunitySignal,
} from "./types";

export type WorkspaceRecommendation = {
  id: string;
  message: string;
  priority: CustomerRecommendation["priority"];
  recommendedAction: string;
  confidence: number;
  source: "db" | "derived";
};

export type OpportunityBadge = {
  signal: OpportunitySignal;
  label: string;
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ["all"],
  admin: ["billing", "users", "settings", "integrations"],
  administrator: ["billing", "users", "settings", "integrations"],
  support: ["support", "users"],
  moderator: ["support", "content"],
  marketing: ["analytics", "campaigns"],
  analyst: ["analytics", "reports"],
  staff: ["dashboard"],
  custom: ["custom"],
};

const CATEGORY_COLORS: Record<ActivityLogCategory, string> = {
  support: "bg-blue-50 text-blue-700 ring-blue-100",
  billing: "bg-amber-50 text-amber-700 ring-amber-100",
  installations: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  automations: "bg-violet-50 text-violet-700 ring-violet-100",
  users: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  system: "bg-gray-50 text-gray-700 ring-gray-100",
  ai_recommendations: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
};

export function inferActivityCategory(entry: ActivityLogEntry): ActivityLogCategory {
  if (entry.category) return entry.category;
  if (entry.event_type.startsWith("support")) return "support";
  if (entry.event_type.startsWith("invoice") || entry.event_type.startsWith("trial")) {
    return "billing";
  }
  if (entry.event_type.startsWith("installation") || entry.event_type.startsWith("integration")) {
    return "installations";
  }
  if (entry.event_type.startsWith("ai")) return "ai_recommendations";
  if (entry.event_type.startsWith("user")) return "users";
  return "system";
}

export function getCategoryStyle(category: ActivityLogCategory): string {
  return CATEGORY_COLORS[category];
}

export function getRolePermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.staff;
}

export function computeSuccessScore(detail: CustomerMasterDetail): number {
  let score = 50;
  const usage = detail.usage;
  const activeUsers = detail.users.filter((user) => user.status === "active").length;

  if (activeUsers > 0) score += Math.min(activeUsers * 8, 24);
  if (usage) {
    score += Math.min(Math.floor(usage.automated_actions / 10), 15);
    score += Math.min(detail.installations.length * 10, 20);
    if (usage.most_used_modules.length >= 3) score += 10;
  }
  if (detail.overview.customer_status === "active") score += 10;
  if (detail.overview.customer_status === "cancelled") score -= 30;
  if (detail.overview.total_installations === 0) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export function detectOpportunities(detail: CustomerMasterDetail): OpportunityBadge[] {
  const badges: OpportunityBadge[] = [];

  if (
    detail.overview.customer_status === "trial" &&
    detail.overview.plan_type === "starter"
  ) {
    badges.push({ signal: "upgrade", label: "Upgrade Opportunity" });
  }
  if (detail.installations.length > 0 && (detail.usage?.most_used_modules.length ?? 0) >= 3) {
    badges.push({ signal: "expansion", label: "Expansion Opportunity" });
  }
  if (detail.overview.customer_status === "paused" || detail.overview.customer_status === "overdue") {
    badges.push({ signal: "retention_risk", label: "Retention Risk" });
  }
  if (detail.users.every((user) => !user.last_login_at)) {
    badges.push({ signal: "low_engagement", label: "Low Engagement" });
  }
  if ((detail.usage?.support_requests_handled ?? 0) > 30 && detail.support.length === 0) {
    badges.push({ signal: "advocate", label: "Customer Advocate Potential" });
  }

  return badges.slice(0, 3);
}

export function buildWorkspaceRecommendations(
  detail: CustomerMasterDetail
): WorkspaceRecommendation[] {
  const fromDb = (detail.recommendations ?? []).map((rec) => ({
    id: rec.id,
    message: rec.message,
    priority: rec.priority,
    recommendedAction: rec.recommended_action,
    confidence: rec.confidence,
    source: "db" as const,
  }));

  if (fromDb.length > 0) return fromDb;

  const derived: WorkspaceRecommendation[] = [];
  const daysSinceLogin = detail.users.reduce<number | null>((min, user) => {
    if (!user.last_login_at) return min;
    const days = Math.floor(
      (Date.now() - new Date(user.last_login_at).getTime()) / 86_400_000
    );
    return min === null ? days : Math.max(min, days);
  }, null);

  if (daysSinceLogin != null && daysSinceLogin >= 14) {
    derived.push({
      id: "derived-low-login",
      message: `Customer has not logged in for ${daysSinceLogin} days.`,
      priority: "high",
      recommendedAction: "Send re-engagement email",
      confidence: 96,
      source: "derived",
    });
  }

  if ((detail.usage?.support_requests_handled ?? 0) > 10) {
    derived.push({
      id: "derived-support-volume",
      message: "Support volume increased during the last 14 days.",
      priority: "normal",
      recommendedAction: "Review recent support cases",
      confidence: 81,
      source: "derived",
    });
  }

  if (
    detail.overview.trial_days_remaining != null &&
    detail.overview.trial_days_remaining <= 7
  ) {
    derived.push({
      id: "derived-trial",
      message: `Trial expires in ${detail.overview.trial_days_remaining} days.`,
      priority: "urgent",
      recommendedAction: "Schedule onboarding meeting",
      confidence: 92,
      source: "derived",
    });
  }

  const missingIntegrations = detail.installations.some(
    (installation) => (installation.integrations?.length ?? 0) === 0
  );
  if (missingIntegrations) {
    derived.push({
      id: "derived-integrations",
      message: "Integration setup remains incomplete.",
      priority: "normal",
      recommendedAction: "Guide customer through integration setup",
      confidence: 72,
      source: "derived",
    });
  }

  return derived;
}

export function buildCustomerAiInsightMessages(detail: CustomerMasterDetail): string[] {
  const recommendations = buildWorkspaceRecommendations(detail);
  const insights = recommendations.map((rec) => rec.message);

  if (detail.overview.customer_status === "trial") {
    insights.push("Trial conversion likelihood: High.");
  }

  if (insights.length === 0) {
    insights.push("Customer activity is stable this month.");
    insights.push("Recommended action: No immediate action required.");
  }

  return insights.slice(0, 5);
}

export function getCustomerHealthFromDetail(detail: CustomerMasterDetail): CustomerHealth {
  const record: CustomerRecord = {
    id: detail.customer.id,
    customer_number: detail.customer.customer_number,
    customer_type: detail.customer.customer_type,
    display_name: detail.customer.company_name ?? detail.customer.full_name ?? "Customer",
    email: detail.customer.email,
    country: detail.customer.country,
    language: detail.customer.language,
    status: detail.customer.status,
    company_id: detail.customer.company_id,
    installation_count: detail.overview.total_installations,
    user_count: detail.overview.total_users,
    plan_name: detail.overview.plan_name,
    plan_type: detail.overview.plan_type,
    trial_days_remaining: detail.overview.trial_days_remaining,
    created_at: detail.customer.created_at,
  };
  return computeCustomerHealth(record);
}

export function getInstallationHealthScore(
  installation: CustomerMasterDetail["installations"][number]
): number {
  const row = {
    id: installation.id,
    customer_id: "",
    customer_number: "",
    customer_name: "",
    customer_email: "",
    site_url: installation.site_url,
    system_type: installation.system_type,
    status: installation.status,
    modules: Array.isArray(installation.modules)
      ? installation.modules.map((module) =>
          typeof module === "string" ? module : module.module_key
        )
      : [],
    integrations: installation.integrations ?? [],
    last_synced_at: installation.last_synced_at,
    created_at: installation.created_at ?? "",
  };
  const health = deriveInstallationHealth(row);
  if (health.health === "healthy") return 92;
  if (health.health === "attention") return 68;
  return 41;
}

export const QUICK_ACTION_KEYS = [
  "openSupport",
  "pauseSubscription",
  "generateInvoice",
  "resendWelcome",
  "runHealthScan",
  "scheduleOnboarding",
] as const;

export type QuickActionKey = (typeof QUICK_ACTION_KEYS)[number];

export const INTEGRATION_PROVIDERS = [
  "supabase",
  "stripe",
  "resend",
  "shopify",
  "webhooks",
  "custom_api",
] as const;
