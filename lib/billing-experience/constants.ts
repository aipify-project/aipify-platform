export const BILLING_PATHS = ["instant", "enterprise"] as const;

export type BillingPath = (typeof BILLING_PATHS)[number];

export const ENTERPRISE_PROCUREMENT_METHODS = [
  "dnb_invoice",
  "purchase_orders",
  "bank_transfer",
  "terms_30",
  "terms_60",
  "terms_90",
  "framework_agreements",
] as const;

export type EnterpriseProcurementMethod = (typeof ENTERPRISE_PROCUREMENT_METHODS)[number];

export const ENTERPRISE_ONBOARDING_ACTIONS = [
  "contact_enterprise_team",
  "request_invoice_account",
  "purchase_order_support",
  "dnb_invoice_setup",
] as const;

export type EnterpriseOnboardingAction = (typeof ENTERPRISE_ONBOARDING_ACTIONS)[number];

export const INVOICE_STATUS_BADGES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-blue-50 text-blue-800 ring-blue-200",
  viewed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  approved: "bg-violet-50 text-violet-800 ring-violet-200",
  partially_paid: "bg-amber-50 text-amber-900 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  overdue: "bg-red-50 text-red-800 ring-red-200",
  reminder_sent: "bg-orange-50 text-orange-900 ring-orange-200",
  disputed: "bg-rose-50 text-rose-900 ring-rose-200",
  cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  credited: "bg-neutral-100 text-neutral-700 ring-neutral-200",
};

export const BILLING_METHOD_LABEL_KEYS: Record<string, string> = {
  invoice: "invoice",
  dnb_bank_transfer: "bankTransfer",
  dnb_invoice: "dnbInvoice",
};
