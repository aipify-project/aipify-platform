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

export const PAYMENT_PROVIDERS = [
  "klarna",
  "stripe",
  "vipps",
  "manual",
  "invoice",
] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const PAYMENT_STATUSES = [
  "not_connected",
  "pending_setup",
  "active",
  "failed",
  "cancelled",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

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
  "failed",
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
  user_count: number;
  plan_name: string | null;
  plan_type: PlanType | null;
  trial_days_remaining: number | null;
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

export type PaymentProfile = {
  id: string;
  customer_id: string;
  provider: PaymentProvider;
  provider_customer_id: string | null;
  provider_mandate_id: string | null;
  payment_status: PaymentStatus;
  kid_number: string | null;
  billing_email: string;
  billing_address: string;
  postal_code: string;
  city: string;
  country: string;
  vat_number: string | null;
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
  next_billing_date: string | null;
  cancelled_at: string | null;
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
  subscription_id: string | null;
  invoice_number: string;
  kid_number: string | null;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  due_date: string;
  issued_at: string;
  paid_at: string | null;
  provider_payment_id: string | null;
  pdf_url: string | null;
  last_sent_at: string | null;
  created_at: string;
};

export type PaymentEvent = {
  id: string;
  customer_id: string;
  provider: PaymentProvider;
  event_type: string;
  provider_event_id: string | null;
  status: string;
  raw_payload: Record<string, unknown>;
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
  payment_profile: PaymentProfile | null;
  subscription: Subscription | null;
  installations: CustomerInstallationSummary[];
  invoices: Invoice[];
  payment_events: PaymentEvent[];
};

export type SubscriptionRow = Subscription & {
  customer_number: string;
  display_name: string;
  provider: PaymentProvider | null;
  payment_status: PaymentStatus | null;
};

export type PaymentProfileRow = PaymentProfile & {
  customer_number: string;
  display_name: string;
};

export type PaymentProviderSummary = {
  provider: PaymentProvider;
  customer_count: number;
  active_count: number;
  trialing_count: number;
  failed_count: number;
};

export type PaymentEventRow = PaymentEvent & {
  customer_number: string;
  display_name: string;
};

export type CustomerBillingOverview = {
  subscription: Subscription | null;
  payment_profile: PaymentProfile | null;
  invoices: Invoice[];
};

export type InvoiceAction =
  | "send"
  | "resend"
  | "mark_paid"
  | "mark_overdue"
  | "mark_failed"
  | "cancel";

export type PlatformMetrics = {
  revenue: {
    mrr: number;
    arr: number;
    trial_to_paid_conversion_rate: number;
    outstanding_invoice_amount: number;
    average_revenue_per_customer: number;
  };
  customers: {
    total: number;
    active: number;
    trial: number;
    paused: number;
    cancelled: number;
    overdue: number;
  };
  installations: {
    total: number;
    active: number;
    failed: number;
    average_per_customer: number;
  };
  ai_activity: {
    support_requests_handled: number;
    automated_tasks_completed: number;
    ai_recommendations_generated: number;
    average_assistant_response_time_seconds: number;
  };
  growth: {
    new_customers_30d: number;
    new_installations_30d: number;
    most_used_modules: string[];
    customer_retention_rate: number;
  };
};

export type CustomerUserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  status: string;
  last_login_at: string | null;
  is_owner: boolean;
};

export type CustomerInstallationRow = {
  id: string;
  name: string | null;
  site_url: string | null;
  system_type: string;
  status: string;
  last_synced_at: string | null;
  modules: string[];
};

export type UsageStatistics = {
  id: string;
  customer_id: string;
  support_requests_handled: number;
  automated_actions: number;
  ai_recommendations: number;
  avg_response_time_seconds: number;
  most_used_modules: string[];
  created_at: string;
  updated_at: string;
};

export type SupportCase = {
  id: string;
  customer_id: string;
  subject: string;
  status: string;
  assigned_agent: string | null;
  opened_at: string;
  closed_at: string | null;
  last_contact_at: string | null;
  resolution_time_hours: number | null;
  created_at: string;
};

export type ActivityLogEntry = {
  id: string;
  customer_id: string;
  event_type: string;
  title: string;
  details: Record<string, unknown>;
  created_at: string;
};

export type CustomerOverviewSummary = {
  plan_name: string | null;
  plan_type: PlanType | null;
  subscription_status: SubscriptionStatus | null;
  customer_status: CustomerStatus;
  trial_days_remaining: number | null;
  next_billing_date: string | null;
  total_users: number;
  total_installations: number;
  outstanding_invoices: number;
  payment_provider: PaymentProvider | null;
};

export type PlatformInstallationIntegration = {
  integration_key: string;
  status: string;
  last_synced_at: string | null;
};

export type PlatformInstallationRow = {
  id: string;
  customer_id: string;
  customer_number: string;
  customer_name: string;
  customer_email: string;
  site_url: string | null;
  system_type: string;
  status: string;
  modules: string[];
  integrations: PlatformInstallationIntegration[];
  last_synced_at: string | null;
  created_at: string;
};

export type PlatformSupportQueueRow = {
  id: string;
  customer_id: string;
  customer_number: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assigned_agent: string | null;
  ai_escalation_reason: string | null;
  opened_at: string;
  last_contact_at: string | null;
  updated_at: string;
};

export type PlatformServiceStatus = "operational" | "degraded" | "outage" | "pending";

export type CustomerMasterDetail = {
  customer: Customer;
  payment_profile: PaymentProfile | null;
  subscription: Subscription | null;
  overview: CustomerOverviewSummary;
  users: CustomerUserRow[];
  installations: CustomerInstallationRow[];
  invoices: Invoice[];
  usage: UsageStatistics | null;
  support: SupportCase[];
  activity_log: ActivityLogEntry[];
};
