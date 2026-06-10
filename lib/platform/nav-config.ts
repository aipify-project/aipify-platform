export type PlatformNavId =
  | "executive"
  | "overview"
  | "customers"
  | "subscriptions"
  | "billing"
  | "invoices"
  | "paymentProviders"
  | "installations"
  | "metrics"
  | "stats"
  | "support"
  | "automations"
  | "intelligence"
  | "actions"
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
  { id: "overview", href: "/platform", labelKey: "platform.nav.overview" },
  {
    id: "customers",
    href: "/platform/customers",
    labelKey: "platform.nav.customers",
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
    id: "invoices",
    href: "/platform/invoices",
    labelKey: "platform.nav.invoices",
  },
  {
    id: "installations",
    href: "/platform/installations",
    labelKey: "platform.nav.installations",
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
  if (pathname.startsWith("/platform/executive")) return "executive";
  if (pathname.startsWith("/platform/customers")) return "customers";
  if (pathname.startsWith("/platform/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/billing")) return "billing";
  if (pathname.startsWith("/platform/invoices")) return "invoices";
  if (pathname.startsWith("/platform/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/installations")) return "installations";
  if (pathname.startsWith("/platform/metrics")) return "metrics";
  if (pathname.startsWith("/platform/stats")) return "metrics";
  if (pathname.startsWith("/platform/support")) return "support";
  if (pathname.startsWith("/platform/automations")) return "automations";
  if (pathname.startsWith("/platform/intelligence")) return "intelligence";
  if (pathname.startsWith("/platform/actions")) return "actions";
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
