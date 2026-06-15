export const PAYMENT_TERMS = [
  "due_on_receipt",
  "net_7",
  "net_14",
  "net_30",
  "net_60",
  "custom",
] as const;

export type PaymentTerm = (typeof PAYMENT_TERMS)[number];

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "approved",
  "partially_paid",
  "paid",
  "overdue",
  "reminder_sent",
  "disputed",
  "cancelled",
  "credited",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const ACCESS_UNLOCK_POLICIES = [
  "contract_approval",
  "invoice_sent",
  "payment_received",
] as const;

export type AccessUnlockPolicy = (typeof ACCESS_UNLOCK_POLICIES)[number];

export const BILLING_METHODS = ["invoice", "dnb_bank_transfer"] as const;

export type BillingMethod = (typeof BILLING_METHODS)[number];

export const SELF_SERVICE_PROVIDERS = ["stripe", "klarna", "vipps"] as const;

export const ENTERPRISE_BILLING_METHODS = ["invoice", "dnb_bank_transfer"] as const;

export const INVOICE_ACTIONS = [
  "create",
  "send",
  "mark_viewed",
  "approve",
  "mark_paid",
  "register_partial_payment",
  "send_reminder",
  "credit",
  "cancel",
  "dispute",
  "escalate",
  "add_note",
  "attach_po",
  "mark_overdue",
] as const;

export type InvoiceAction = (typeof INVOICE_ACTIONS)[number];

export const DNB_ENTERPRISE_FIELDS = [
  "DNB_MERCHANT_ID",
  "DNB_ACCOUNT_NUMBER",
  "DNB_KID_PREFIX",
  "DNB_API_KEY",
  "DNB_API_SECRET",
  "DNB_ENVIRONMENT",
  "DNB_CALLBACK_URL",
  "DNB_WEBHOOK_SECRET",
] as const;

export const AUDIT_EVENT_TYPES = [
  "invoice_created",
  "invoice_sent",
  "invoice_viewed",
  "invoice_approved",
  "invoice_paid",
  "invoice_overdue",
  "reminder_sent",
  "payment_registered",
  "invoice_credited",
  "billing_details_changed",
  "payment_terms_changed",
  "po_number_changed",
  "partial_payment_registered",
  "invoice_disputed",
  "invoice_cancelled",
  "invoice_escalated",
  "upgrade_invoice_drafted",
] as const;
