export type PlatformNavId =
  | "executive"
  | "executiveOperationsCenter"
  | "announcementCenter"
  | "feedbackCenter"
  | "overview"
  | "customers"
  | "customerLifecycle"
  | "customerSuccessOperations"
  | "subscriptions"
  | "billing"
  | "invoices"
  | "paymentOperations"
  | "paymentHealth"
  | "paymentAnalytics"
  | "subscriptionOperations"
  | "paymentProviders"
  | "installations"
  | "installEngine"
  | "updates"
  | "trust"
  | "impact"
  | "presencePilot"
  | "pilotOperations"
  | "pilotInstall"
  | "metrics"
  | "stats"
  | "support"
  | "automations"
  | "intelligence"
  | "actions"
  | "skills"
  | "system";

export type ActionNavId =
  | "pending"
  | "approved"
  | "executed"
  | "failed"
  | "templates"
  | "policies"
  | "logs";

export type ActionNavItem = {
  id: ActionNavId;
  href: string;
  labelKey: string;
};

export const ACTION_NAV: ActionNavItem[] = [
  { id: "pending", href: "/platform/actions", labelKey: "platform.actions.nav.pending" },
  { id: "approved", href: "/platform/actions/approved", labelKey: "platform.actions.nav.approved" },
  { id: "executed", href: "/platform/actions/executed", labelKey: "platform.actions.nav.executed" },
  { id: "failed", href: "/platform/actions/failed", labelKey: "platform.actions.nav.failed" },
  { id: "templates", href: "/platform/actions/templates", labelKey: "platform.actions.nav.templates" },
  { id: "policies", href: "/platform/actions/policies", labelKey: "platform.actions.nav.policies" },
  { id: "logs", href: "/platform/actions/logs", labelKey: "platform.actions.nav.logs" },
];

export type IntelligenceNavId =
  | "brain"
  | "learningQueue"
  | "globalPatterns"
  | "selfHealing"
  | "settings"
  | "auditLog";

export type IntelligenceNavItem = {
  id: IntelligenceNavId;
  href: string;
  labelKey: string;
};

export const INTELLIGENCE_NAV: IntelligenceNavItem[] = [
  { id: "brain", href: "/platform/intelligence", labelKey: "platform.intelligence.nav.brain" },
  {
    id: "learningQueue",
    href: "/platform/intelligence/learning-queue",
    labelKey: "platform.intelligence.nav.learningQueue",
  },
  {
    id: "globalPatterns",
    href: "/platform/intelligence/global-patterns",
    labelKey: "platform.intelligence.nav.globalPatterns",
  },
  {
    id: "selfHealing",
    href: "/platform/intelligence/self-healing",
    labelKey: "platform.intelligence.nav.selfHealing",
  },
  {
    id: "settings",
    href: "/platform/intelligence/settings",
    labelKey: "platform.intelligence.nav.settings",
  },
  {
    id: "auditLog",
    href: "/platform/intelligence/audit-log",
    labelKey: "platform.intelligence.nav.auditLog",
  },
];

export type PlatformNavItem = {
  id: PlatformNavId;
  href: string;
  labelKey: string;
};

export const PLATFORM_ADMIN_NAV: PlatformNavItem[] = [
  { id: "executive", href: "/platform/executive", labelKey: "platform.nav.executive" },
  {
    id: "executiveOperationsCenter",
    href: "/platform/executive/operations-center",
    labelKey: "platform.nav.executiveOperationsCenter",
  },
  {
    id: "announcementCenter",
    href: "/platform/communications/announcement-center",
    labelKey: "platform.nav.announcementCenter",
  },
  {
    id: "feedbackCenter",
    href: "/platform/product/feedback-center",
    labelKey: "platform.nav.feedbackCenter",
  },
  { id: "overview", href: "/platform", labelKey: "platform.nav.overview" },
  {
    id: "customers",
    href: "/platform/customers",
    labelKey: "platform.nav.customers",
  },
  {
    id: "customerLifecycle",
    href: "/platform/customers/lifecycle-center",
    labelKey: "platform.nav.customerLifecycle",
  },
  {
    id: "customerSuccessOperations",
    href: "/platform/customers/success-operations",
    labelKey: "platform.nav.customerSuccessOperations",
  },
  {
    id: "subscriptions",
    href: "/platform/subscriptions",
    labelKey: "platform.nav.subscriptions",
  },
  {
    id: "billing",
    href: "/platform/billing",
    labelKey: "platform.nav.billing",
  },
  {
    id: "paymentOperations",
    href: "/platform/billing/payment-operations",
    labelKey: "platform.nav.paymentOperations",
  },
  {
    id: "paymentHealth",
    href: "/platform/billing/payment-health",
    labelKey: "platform.nav.paymentHealth",
  },
  {
    id: "paymentAnalytics",
    href: "/platform/billing/payment-analytics",
    labelKey: "platform.nav.paymentAnalytics",
  },
  {
    id: "subscriptionOperations",
    href: "/platform/billing/subscription-operations",
    labelKey: "platform.nav.subscriptionOperations",
  },
  {
    id: "invoices",
    href: "/platform/billing/enterprise-invoices",
    labelKey: "platform.nav.enterpriseInvoices",
  },
  {
    id: "paymentProviders",
    href: "/platform/payment-providers",
    labelKey: "platform.nav.paymentProviders",
  },
  {
    id: "installations",
    href: "/platform/installations",
    labelKey: "platform.nav.installations",
  },
  {
    id: "installEngine",
    href: "/platform/install-engine",
    labelKey: "platform.nav.installEngine",
  },
  {
    id: "updates",
    href: "/platform/updates",
    labelKey: "platform.nav.updates",
  },
  {
    id: "trust",
    href: "/platform/trust",
    labelKey: "platform.nav.trust",
  },
  {
    id: "impact",
    href: "/platform/impact",
    labelKey: "platform.nav.impact",
  },
  {
    id: "presencePilot",
    href: "/platform/presence-pilot",
    labelKey: "platform.nav.presencePilot",
  },
  {
    id: "pilotOperations",
    href: "/platform/pilot-operations",
    labelKey: "platform.nav.pilotOperations",
  },
  {
    id: "pilotInstall",
    href: "/platform/install/unonight",
    labelKey: "platform.nav.pilotInstall",
  },
  {
    id: "metrics",
    href: "/platform/metrics",
    labelKey: "platform.nav.metrics",
  },
  {
    id: "support",
    href: "/platform/support",
    labelKey: "platform.nav.support",
  },
  {
    id: "automations",
    href: "/platform/automations",
    labelKey: "platform.nav.automations",
  },
  {
    id: "intelligence",
    href: "/platform/intelligence",
    labelKey: "platform.nav.intelligence",
  },
  {
    id: "actions",
    href: "/platform/actions",
    labelKey: "platform.nav.actions",
  },
  {
    id: "skills",
    href: "/platform/skills",
    labelKey: "platform.nav.skills",
  },
  {
    id: "system",
    href: "/platform/system",
    labelKey: "platform.nav.system",
  },
];

export const PLATFORM_MOBILE_NAV_IDS: PlatformNavId[] = [
  "overview",
  "customers",
  "invoices",
  "billing",
];

export function getPlatformActiveNavId(pathname: string): PlatformNavId {
  if (pathname.startsWith("/platform/product/feedback-center")) return "feedbackCenter";
  if (pathname.startsWith("/platform/communications/announcement-center")) return "announcementCenter";
  if (pathname.startsWith("/platform/executive/operations-center")) return "executiveOperationsCenter";
  if (pathname.startsWith("/platform/executive")) return "executive";
  if (pathname.startsWith("/platform/customers/success-operations")) return "customerSuccessOperations";
  if (pathname.startsWith("/platform/customers/lifecycle-center")) return "customerLifecycle";
  if (pathname.startsWith("/platform/customers")) return "customers";
  if (pathname.startsWith("/platform/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/billing/payment-operations")) return "paymentOperations";
  if (pathname.startsWith("/platform/billing/payment-health")) return "paymentHealth";
  if (pathname.startsWith("/platform/billing/payment-analytics")) return "paymentAnalytics";
  if (pathname.startsWith("/platform/billing/subscription-operations")) return "subscriptionOperations";
  if (pathname.startsWith("/platform/billing/enterprise-invoices")) return "invoices";
  if (pathname.startsWith("/platform/billing")) return "billing";
  if (pathname.startsWith("/platform/invoices")) return "invoices";
  if (pathname.startsWith("/platform/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/install-engine")) return "installEngine";
  if (pathname.startsWith("/platform/updates")) return "updates";
  if (pathname.startsWith("/platform/trust")) return "trust";
  if (pathname.startsWith("/platform/impact")) return "impact";
  if (pathname.startsWith("/platform/presence-pilot")) return "presencePilot";
  if (pathname.startsWith("/platform/pilot-operations")) return "pilotOperations";
  if (pathname.startsWith("/platform/install/unonight")) return "pilotInstall";
  if (pathname.startsWith("/platform/installations")) return "installations";
  if (pathname.startsWith("/platform/metrics")) return "metrics";
  if (pathname.startsWith("/platform/stats")) return "metrics";
  if (pathname.startsWith("/platform/support")) return "support";
  if (pathname.startsWith("/platform/automations")) return "automations";
  if (pathname.startsWith("/platform/intelligence")) return "intelligence";
  if (pathname.startsWith("/platform/actions")) return "actions";
  if (pathname.startsWith("/platform/skills")) return "skills";
  if (pathname.startsWith("/platform/system")) return "system";
  return "overview";
}

export function getActionActiveNavId(pathname: string): ActionNavId {
  if (pathname.startsWith("/platform/actions/approved")) return "approved";
  if (pathname.startsWith("/platform/actions/executed")) return "executed";
  if (pathname.startsWith("/platform/actions/failed")) return "failed";
  if (pathname.startsWith("/platform/actions/templates")) return "templates";
  if (pathname.startsWith("/platform/actions/policies")) return "policies";
  if (pathname.startsWith("/platform/actions/logs")) return "logs";
  return "pending";
}

export function getIntelligenceActiveNavId(pathname: string): IntelligenceNavId {
  if (pathname.startsWith("/platform/intelligence/learning-queue")) return "learningQueue";
  if (pathname.startsWith("/platform/intelligence/global-patterns")) return "globalPatterns";
  if (pathname.startsWith("/platform/intelligence/self-healing")) return "selfHealing";
  if (pathname.startsWith("/platform/intelligence/settings")) return "settings";
  if (pathname.startsWith("/platform/intelligence/audit-log")) return "auditLog";
  return "brain";
}
