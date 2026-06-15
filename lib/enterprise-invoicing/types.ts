import type {
  AccessUnlockPolicy,
  BillingMethod,
  InvoiceStatus,
  PaymentTerm,
} from "./constants";

export type BillingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};

export type EnterpriseBillingProfile = {
  tenant_id: string;
  company_name: string;
  organization_number: string;
  vat_number: string;
  billing_address: BillingAddress;
  invoice_email: string;
  ap_contact_name: string;
  ap_contact_email: string;
  purchase_order_number: string;
  internal_reference: string;
  payment_terms: PaymentTerm;
  payment_terms_custom: string;
  preferred_currency: string;
  billing_language: string;
  access_unlock_policy: AccessUnlockPolicy;
  auto_send_invoices: boolean;
  require_approval_before_send: boolean;
  configured: boolean;
};

export type EnterpriseInvoice = {
  id: string;
  tenant_id: string;
  tenant_name: string;
  invoice_number: string;
  status: InvoiceStatus;
  plan_key: string | null;
  description: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  currency: string;
  payment_terms: string;
  due_date: string | null;
  purchase_order_number: string;
  internal_reference: string;
  billing_method: BillingMethod;
  dnb_kid: string;
  bank_reference: string;
  sent_at: string | null;
  viewed_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  is_overdue: boolean;
  suggest_reminder: boolean;
};

export type EnterpriseInvoiceAuditEntry = {
  id: string;
  tenant_id?: string;
  invoice_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type EnterpriseInvoiceBillingCenter = {
  scope: "platform" | "tenant";
  principle: string;
  billing_model: {
    self_service: string[];
    enterprise: string[];
  };
  profile: EnterpriseBillingProfile | null;
  invoices: EnterpriseInvoice[];
  recent_audit: EnterpriseInvoiceAuditEntry[];
  can_manage: boolean;
  can_finance: boolean;
  can_edit_billing_details: boolean;
  overdue_count: number;
  dnb_provider: Record<string, unknown> | null;
};

export type EnterpriseUpgradeCheckout = {
  current_plan: string;
  new_plan: string;
  current_price_monthly: number;
  new_price_monthly: number;
  price_difference_monthly: number;
  currency: string;
  billing_method: string;
  billing_method_label: string;
  payment_terms: string;
  payment_terms_label: string;
  requires_approval: boolean;
  access_unlock_policy: AccessUnlockPolicy;
  access_unlock_label: string;
  profile_configured: boolean;
  instant_access: boolean;
  enterprise_billing: boolean;
};

export type EnterpriseUpgradeResult = {
  invoice: EnterpriseInvoice;
  access_unlocked: boolean;
  message: string;
};

export type EnterpriseInvoicingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  save: string;
  saving: string;
  saved: string;
  empty: string;
  overdueBanner: string;
  sections: {
    billingDetails: string;
    paymentTerms: string;
    invoices: string;
    audit: string;
    dnbProfile: string;
    actions: string;
  };
  fields: Record<string, string>;
  paymentTerms: Record<string, string>;
  statuses: Record<string, string>;
  actions: Record<string, string>;
  paymentMethods?: Record<string, string>;
  invoiceCenter?: {
    title: string;
    emptyStructure: string;
  };
  billingModel: {
    selfService: string;
    enterprise: string;
    selfServiceNote: string;
    enterpriseNote: string;
  };
  upgrade: {
    title: string;
    currentPlan: string;
    newPlan: string;
    priceDifference: string;
    billingMethod: string;
    paymentTerms: string;
    accessPolicy: string;
    requiresApproval: string;
    approveAndContinue: string;
    createInvoiceDraft: string;
    profileRequired: string;
  };
  permissions: {
    viewOnly: string;
    financeRequired: string;
  };
};
