export const CUSTOMER_TYPES = ["company", "private"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const CUSTOMER_STATUSES = [
  "trial",
  "active",
  "paused",
  "cancelled",
  "overdue",
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const PAYMENT_METHODS = ["manual", "card", "invoice", "stripe"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PLAN_TYPES = ["starter", "growth", "business", "enterprise"] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

export const SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "cancelled",
  "paused",
  "past_due",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const BILLING_CYCLES = ["monthly", "yearly"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export type CustomerRecord = {
  id: string;
  customer_number: string;
  customer_type: CustomerType;
  display_name: string;
  email: string;
  country: string;
  language: string;
  status: CustomerStatus;
  company_id: string | null;
  installation_count: number;
  created_at: string;
};

export type Customer = {
  id: string;
  customer_number: string;
  company_id: string | null;
  customer_type: CustomerType;
  company_name: string | null;
  organization_number: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string;
  language: string;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
};

export type BillingProfile = {
  id: string;
  customer_id: string;
  billing_name: string;
  billing_email: string;
  billing_address: string;
  postal_code: string;
  city: string;
  country: string;
  vat_number: string | null;
  payment_method: PaymentMethod;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  customer_id: string;
  plan_name: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  trial_starts_at: string | null;
  trial_ends_at: string | null;
  billing_cycle: BillingCycle;
  price_amount: number;
  currency: string;
  max_users: number;
  max_installations: number;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  due_date: string;
  issued_at: string;
  paid_at: string | null;
  pdf_url: string | null;
  last_sent_at: string | null;
  created_at: string;
};

export type CustomerInstallationSummary = {
  id: string;
  name: string | null;
  site_url: string | null;
  system_type: string;
  status: string;
  last_synced_at: string | null;
};

export type CustomerDetail = {
  customer: Customer;
  billing_profile: BillingProfile | null;
  subscription: Subscription | null;
  installations: CustomerInstallationSummary[];
  invoices: Invoice[];
};

export type SubscriptionRow = Subscription & {
  customer_number: string;
  display_name: string;
};

export type BillingProfileRow = BillingProfile & {
  customer_number: string;
  display_name: string;
};

export type InvoiceAction =
  | "send"
  | "resend"
  | "mark_paid"
  | "mark_overdue"
  | "cancel";
