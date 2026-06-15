import type {
  FilterPreset,
  HealthBand,
  PlanType,
  RenewalPeriod,
  RiskLevel,
  SubscriptionDisplayStatus,
} from "./constants";

export type SubscriptionOperationsFilters = {
  plan?: PlanType | "";
  status?: SubscriptionDisplayStatus | "";
  country?: string;
  provider?: string;
  renewal_period?: RenewalPeriod | "";
  date_from?: string;
  date_to?: string;
  growth_partner?: string;
  account_manager?: string;
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
    executiveSnapshot: string;
    overview: string;
    subscriptions: string;
    healthScoring: string;
    trials: string;
    upgrades: string;
    downgrades: string;
    renewals: string;
    pastDue: string;
    enterpriseContracts: string;
    lifecycleTimeline: string;
    executiveInsights: string;
    revenueAtRisk: string;
    growthOpportunities: string;
    audit: string;
    filters: string;
    forecasting: string;
  };
  executive: {
    mrr: string;
    arr: string;
    netGrowth: string;
    conversionRate: string;
    renewalRisk: string;
    acv: string;
    active: string;
    trials: string;
    renewals: string;
    upgrades: string;
    downgrades: string;
    cancelled: string;
  };
  health: Record<HealthBand, string>;
  healthDescription: string;
  table: {
    customer: string;
    plan: string;
    users: string;
    billingProvider: string;
    monthlyValue: string;
    mrrContribution: string;
    renewalDate: string;
    status: string;
    actions: string;
    previousPlan: string;
    newPlan: string;
    effectiveDate: string;
    revenueImpact: string;
    mrrImpact: string;
    reason: string;
    trialStart: string;
    trialEnd: string;
    daysRemaining: string;
    conversionProbability: string;
    usageScore: string;
    growthPartner: string;
    outstandingAmount: string;
    daysOverdue: string;
    paymentProvider: string;
    recommendedAction: string;
    contractStart: string;
    contractEnd: string;
    contractValue: string;
    paymentTerms: string;
    accountManager: string;
    event: string;
    healthScore: string;
    renewalProbability: string;
    contractType: string;
    accountOwner: string;
    lastInteraction: string;
    riskLevel: string;
    retryAttempts: string;
    nextStep: string;
    expansionOpportunity: string;
    contractHealth: string;
    upcomingMilestone: string;
    actor: string;
    financialImpact: string;
    automation: string;
    approval: string;
    date: string;
    signal: string;
    recommendation: string;
    priority: string;
  };
  statuses: Record<SubscriptionDisplayStatus, string>;
  riskLevels: Record<RiskLevel, string>;
  expansion: Record<string, string>;
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
    offerOnboarding: string;
    discountCampaign: string;
    escalateSales: string;
    retryPayment: string;
    contactCustomer: string;
    switchPaymentMethod: string;
    moveToCollections: string;
    pauseAccess: string;
    applying: string;
  };
  filters: {
    plan: string;
    status: string;
    country: string;
    provider: string;
    renewalPeriod: string;
    growthPartner: string;
    accountManager: string;
    allPlans: string;
    allStatuses: string;
    allCountries: string;
    allProviders: string;
    allRenewals: string;
    allPartners: string;
    allManagers: string;
    apply: string;
    presets: Record<FilterPreset, string>;
  };
  renewals: {
    within7: string;
    within30: string;
    within90: string;
    commandCenter: string;
  };
  insights: {
    recommendedAction: string;
    empty: string;
  };
  revenueAtRisk: {
    title: string;
    pastDue: string;
    lowHealth: string;
    enterpriseRenewals: string;
    decliningUsage: string;
    total: string;
  };
  growth: {
    empty: string;
  };
  lifecycle: {
    empty: string;
  };
  forecasting: {
    futureNote: string;
  };
  plans: Record<PlanType, string>;
};
