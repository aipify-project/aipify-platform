export const PAYMENT_OPS_PROVIDERS = ["stripe", "vipps", "klarna", "dnb"] as const;

export type PaymentOpsProviderKey = (typeof PAYMENT_OPS_PROVIDERS)[number];

export const ALERT_SEVERITIES = ["info", "warning", "critical"] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const SETTLEMENT_STATUSES = ["completed", "pending", "failed"] as const;

export const API_STATUSES = ["connected", "disconnected"] as const;

export const ENVIRONMENTS = ["sandbox", "production"] as const;

export const REGIONAL_COVERAGE_KEYS = [
  "nordics",
  "europe",
  "north_america",
  "asia_pacific",
  "enterprise",
] as const;

export type RegionalCoverageKey = (typeof REGIONAL_COVERAGE_KEYS)[number];

export const OPERATIONAL_CAPABILITIES: Record<PaymentOpsProviderKey, string[]> = {
  stripe: [
    "card_payments",
    "global_subscriptions",
    "apple_pay",
    "google_pay",
    "international_customers",
  ],
  vipps: ["nordic_payments", "mobile_checkout", "fast_authentication"],
  klarna: ["pay_now", "pay_later", "installments"],
  dnb: ["enterprise_invoicing", "bank_transfers", "payment_terms"],
};

export const ALERT_SEVERITY_BADGES: Record<AlertSeverity, string> = {
  info: "bg-blue-50 text-blue-800 ring-blue-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

import type { OperationsIndicator } from "./types";

export const OPERATIONS_INDICATOR_STYLES: Record<
  OperationsIndicator,
  { dot: string; text: string }
> = {
  healthy: { dot: "bg-emerald-500", text: "text-emerald-700" },
  stable: { dot: "bg-emerald-500", text: "text-emerald-700" },
  attention: { dot: "bg-amber-500", text: "text-amber-800" },
  critical: { dot: "bg-red-500", text: "text-red-700" },
};

export const AUDIT_FILTER_CATEGORIES = [
  "all",
  "payments",
  "providers",
  "webhooks",
  "invoices",
  "settlements",
  "configuration",
  "security",
] as const;

export type AuditFilterCategory = (typeof AUDIT_FILTER_CATEGORIES)[number];

export const PROVIDER_STATUS_BADGES: Record<string, string> = {
  operational: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending_setup: "bg-amber-50 text-amber-900 ring-amber-200",
  requires_attention: "bg-orange-50 text-orange-900 ring-orange-200",
  disabled: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  disconnected: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
};
