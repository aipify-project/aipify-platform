import type {
  PlanType,
  RenewalPeriod,
  SubscriptionDisplayStatus,
} from "./constants";

export type SubscriptionOperationsFilters = {
  plan?: PlanType | "";
  status?: SubscriptionDisplayStatus | "";
  country?: string;
  provider?: string;
  renewal_period?: RenewalPeriod | "";
};

export type SubscriptionOperationsOverview = {
  active_subscriptions: number;
  trial_accounts: number;
  upcoming_renewals: number;
  upgrades_this_month: number;
  downgrades_this_month: number;
  cancelled_subscriptions: number;
};

export type SubscriptionRow = {
  id: string;
  customer_id: string;
  customer: string;
  customer_number: string;
  plan: string;
  plan_type: string;
  users: number;
  billing_provider: string;
  monthly_value: number;
  currency: string;
  renewal_date: string | null;
  status: SubscriptionDisplayStatus;
  country: string;
};

export type TrialRecord = {
  subscription_id: string;
  customer_id: string;
  customer: string;
  trial_start: string | null;
  trial_end: string | null;
  days_remaining: number;
  conversion_probability: number;
};

export type PlanChangeRecord = {
  id: string;
  customer_id: string;
  previous_plan: string;
  new_plan: string;
  effective_date: string;
  revenue_impact?: number;
  reason?: string;
};

export type PastDueCase = {
  id: string;
  customer_id: string;
  customer: string;
  outstanding_amount: number;
  currency: string;
  days_overdue: number;
  payment_provider: string;
  recommended_action: string;
};

export type EnterpriseContract = {
  customer_id: string;
  customer: string;
  contract_start: string;
  contract_end: string | null;
  payment_terms: string;
  account_manager: string;
};

export type SubscriptionAuditEntry = {
  id: string;
  customer_id: string | null;
  subscription_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type SubscriptionOperationsCenter = {
  principle: string;
  has_subscriptions: boolean;
  filters: SubscriptionOperationsFilters;
  overview: SubscriptionOperationsOverview;
  subscriptions: SubscriptionRow[];
  trials: TrialRecord[];
  upgrades: PlanChangeRecord[];
  downgrades: PlanChangeRecord[];
  renewals: {
    within_7_days: SubscriptionRow[];
    within_30_days: SubscriptionRow[];
    within_90_days: SubscriptionRow[];
  };
  past_due: PastDueCase[];
  enterprise_contracts: EnterpriseContract[];
  audit: SubscriptionAuditEntry[];
};

export type SubscriptionOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    subscriptions: string;
    trials: string;
    upgrades: string;
    downgrades: string;
    renewals: string;
    pastDue: string;
    enterpriseContracts: string;
    audit: string;
    filters: string;
  };
  overview: {
    active: string;
    trials: string;
    renewals: string;
    upgrades: string;
    downgrades: string;
    cancelled: string;
  };
  table: {
    customer: string;
    plan: string;
    users: string;
    billingProvider: string;
    monthlyValue: string;
    renewalDate: string;
    status: string;
    actions: string;
    previousPlan: string;
    newPlan: string;
    effectiveDate: string;
    revenueImpact: string;
    reason: string;
    trialStart: string;
    trialEnd: string;
    daysRemaining: string;
    conversionProbability: string;
    outstandingAmount: string;
    daysOverdue: string;
    paymentProvider: string;
    recommendedAction: string;
    contractStart: string;
    contractEnd: string;
    paymentTerms: string;
    accountManager: string;
    event: string;
  };
  statuses: Record<SubscriptionDisplayStatus, string>;
  actions: {
    view: string;
    upgrade: string;
    downgrade: string;
    extendTrial: string;
    suspend: string;
    reactivate: string;
    cancel: string;
    convertToPaid: string;
    sendReminder: string;
    applying: string;
  };
  filters: {
    plan: string;
    status: string;
    country: string;
    provider: string;
    renewalPeriod: string;
    allPlans: string;
    allStatuses: string;
    allCountries: string;
    allProviders: string;
    allRenewals: string;
    apply: string;
  };
  renewals: {
    within7: string;
    within30: string;
    within90: string;
  };
  plans: Record<PlanType, string>;
};
