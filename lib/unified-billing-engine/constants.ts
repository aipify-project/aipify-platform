export const AIPIFY_CUSTOMER_TYPES = [
  "private_person",
  "business",
  "enterprise",
  "growth_partner",
  "provider",
  "internal_platform",
] as const;

export type AipifyCustomerType = (typeof AIPIFY_CUSTOMER_TYPES)[number];

export const BILLING_VALIDATION_STATES = [
  "pending",
  "valid",
  "invalid",
  "unavailable",
  "manual_review_required",
] as const;

export type BillingValidationState = (typeof BILLING_VALIDATION_STATES)[number];

export const BILLING_SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "grace_period",
  "past_due",
  "suspended",
  "cancelled",
  "expired",
] as const;

export const BILLING_EVENT_TYPES = [
  "billing.profile.created",
  "billing.profile.updated",
  "tax.validation.passed",
  "tax.validation.failed",
  "subscription.created",
  "subscription.updated",
  "invoice.generated",
  "invoice.paid",
  "invoice.failed",
  "license.activated",
  "license.suspended",
  "commission.created",
  "refund.created",
  "accounting.exported",
] as const;

export const UNIFIED_CHECKOUT_STEPS = [
  "select_product",
  "select_domain",
  "select_billing_profile",
  "confirm_customer_type",
  "validate_tax",
  "calculate_vat",
  "select_payment_method",
  "payment",
  "subscription_created",
  "license_activated",
  "invoice_generated",
  "audit_logged",
] as const;

export const BILLING_ENGINE_PRINCIPLE =
  "Aipify owns the billing truth. Payment providers process payments.";
