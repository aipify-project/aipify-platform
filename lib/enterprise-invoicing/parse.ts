import type {
  EnterpriseBillingProfile,
  EnterpriseInvoice,
  EnterpriseInvoiceAuditEntry,
  EnterpriseInvoiceBillingCenter,
  EnterpriseUpgradeCheckout,
  EnterpriseUpgradeResult,
} from "./types";
import type { AccessUnlockPolicy, BillingMethod, InvoiceStatus, PaymentTerm } from "./constants";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function parseEnterpriseBillingProfile(raw: unknown): EnterpriseBillingProfile | null {
  const row = asRecord(raw);
  if (!row) return null;
  const address = asRecord(row.billing_address) ?? {};

  return {
    tenant_id: asString(row.tenant_id),
    company_name: asString(row.company_name),
    organization_number: asString(row.organization_number),
    vat_number: asString(row.vat_number),
    billing_address: {
      line1: asString(address.line1),
      line2: asString(address.line2),
      city: asString(address.city),
      postal_code: asString(address.postal_code),
      country: asString(address.country),
    },
    invoice_email: asString(row.invoice_email),
    ap_contact_name: asString(row.ap_contact_name),
    ap_contact_email: asString(row.ap_contact_email),
    purchase_order_number: asString(row.purchase_order_number),
    internal_reference: asString(row.internal_reference),
    payment_terms: asString(row.payment_terms, "net_30") as PaymentTerm,
    payment_terms_custom: asString(row.payment_terms_custom),
    preferred_currency: asString(row.preferred_currency, "NOK"),
    billing_language: asString(row.billing_language, "en"),
    access_unlock_policy: asString(row.access_unlock_policy, "contract_approval") as AccessUnlockPolicy,
    auto_send_invoices: asBool(row.auto_send_invoices),
    require_approval_before_send: asBool(row.require_approval_before_send, true),
    configured: asBool(row.configured),
  };
}

export function parseEnterpriseInvoice(raw: unknown): EnterpriseInvoice | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;

  return {
    id: asString(row.id),
    tenant_id: asString(row.tenant_id),
    tenant_name: asString(row.tenant_name),
    invoice_number: asString(row.invoice_number),
    status: asString(row.status, "draft") as InvoiceStatus,
    plan_key: row.plan_key ? asString(row.plan_key) : null,
    description: asString(row.description),
    amount: asNumber(row.amount),
    tax_amount: asNumber(row.tax_amount),
    total_amount: asNumber(row.total_amount),
    amount_paid: asNumber(row.amount_paid),
    currency: asString(row.currency, "NOK"),
    payment_terms: asString(row.payment_terms),
    due_date: row.due_date ? asString(row.due_date) : null,
    purchase_order_number: asString(row.purchase_order_number),
    internal_reference: asString(row.internal_reference),
    billing_method: asString(row.billing_method, "invoice") as BillingMethod,
    dnb_kid: asString(row.dnb_kid),
    bank_reference: asString(row.bank_reference),
    sent_at: row.sent_at ? asString(row.sent_at) : null,
    viewed_at: row.viewed_at ? asString(row.viewed_at) : null,
    approved_at: row.approved_at ? asString(row.approved_at) : null,
    paid_at: row.paid_at ? asString(row.paid_at) : null,
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    is_overdue: asBool(row.is_overdue),
    suggest_reminder: asBool(row.suggest_reminder),
  };
}

function parseAuditEntry(raw: unknown): EnterpriseInvoiceAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    tenant_id: row.tenant_id ? asString(row.tenant_id) : undefined,
    invoice_id: row.invoice_id ? asString(row.invoice_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseEnterpriseInvoiceBillingCenter(
  raw: unknown
): EnterpriseInvoiceBillingCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const billingModel = asRecord(row.billing_model);

  return {
    scope: row.scope === "platform" ? "platform" : "tenant",
    principle: asString(row.principle),
    billing_model: {
      self_service: Array.isArray(billingModel?.self_service)
        ? billingModel.self_service.map(String)
        : [],
      enterprise: Array.isArray(billingModel?.enterprise)
        ? billingModel.enterprise.map(String)
        : [],
    },
    profile: row.profile ? parseEnterpriseBillingProfile(row.profile) : null,
    invoices: Array.isArray(row.invoices)
      ? row.invoices.map(parseEnterpriseInvoice).filter(Boolean) as EnterpriseInvoice[]
      : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map(parseAuditEntry).filter(Boolean) as EnterpriseInvoiceAuditEntry[]
      : [],
    can_manage: asBool(row.can_manage),
    can_finance: asBool(row.can_finance),
    can_edit_billing_details: asBool(row.can_edit_billing_details),
    overdue_count: asNumber(row.overdue_count),
    dnb_provider: asRecord(row.dnb_provider),
  };
}

export function parseEnterpriseUpgradeCheckout(raw: unknown): EnterpriseUpgradeCheckout | null {
  const row = asRecord(raw);
  if (!row) return null;

  return {
    current_plan: asString(row.current_plan),
    new_plan: asString(row.new_plan),
    current_price_monthly: asNumber(row.current_price_monthly),
    new_price_monthly: asNumber(row.new_price_monthly),
    price_difference_monthly: asNumber(row.price_difference_monthly),
    currency: asString(row.currency, "NOK"),
    billing_method: asString(row.billing_method, "invoice"),
    billing_method_label: asString(row.billing_method_label, "Enterprise invoice billing"),
    payment_terms: asString(row.payment_terms),
    payment_terms_label: asString(row.payment_terms_label),
    requires_approval: asBool(row.requires_approval, true),
    access_unlock_policy: asString(row.access_unlock_policy, "contract_approval") as AccessUnlockPolicy,
    access_unlock_label: asString(row.access_unlock_label),
    profile_configured: asBool(row.profile_configured),
    instant_access: asBool(row.instant_access),
    enterprise_billing: asBool(row.enterprise_billing, true),
  };
}

export function parseEnterpriseUpgradeResult(raw: unknown): EnterpriseUpgradeResult | null {
  const row = asRecord(raw);
  if (!row) return null;
  const invoice = parseEnterpriseInvoice(row.invoice);
  if (!invoice) return null;

  return {
    invoice,
    access_unlocked: asBool(row.access_unlocked),
    message: asString(row.message),
  };
}
