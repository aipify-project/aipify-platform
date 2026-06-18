export * from "./types";
export * from "./parse";
export * from "./labels";

export const GROWTH_PARTNER_OPERATIONS_BASE = "/app/growth-partner";

export const GROWTH_PARTNER_OPS_SECTIONS = [
  { key: "dashboard", href: "/app/growth-partner" },
  { key: "leads", href: "/app/growth-partner/leads" },
  { key: "opportunities", href: "/app/growth-partner/opportunities" },
  { key: "customers", href: "/app/growth-partner/customers" },
  { key: "commissions", href: "/app/growth-partner/commissions" },
  { key: "payouts", href: "/app/growth-partner/payouts" },
  { key: "marketing", href: "/app/growth-partner/marketing" },
  { key: "campaigns", href: "/app/growth-partner/campaigns" },
  { key: "resources", href: "/app/growth-partner/resources" },
  { key: "training", href: "/app/growth-partner/training" },
  { key: "certifications", href: "/app/growth-partner/certifications" },
  { key: "performance", href: "/app/growth-partner/performance" },
  { key: "coreValues", href: "/app/growth-partner/core-values" },
  { key: "terms", href: "/growth-partner-terms" },
  { key: "support", href: "/app/growth-partner/support" },
] as const;
