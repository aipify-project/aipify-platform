import type { HealthStatus, LifecycleStage, PlanType } from "./constants";

export type CustomerLifecycleFilters = {
  lifecycle_stage?: LifecycleStage | "";
  country?: string;
  health_status?: HealthStatus | "";
  plan?: PlanType | "";
  registration_from?: string;
  registration_to?: string;
};

export type LifecycleOverview = {
  new_customers_30d: number;
  trial_customers: number;
  active_customers: number;
  at_risk_customers: number;
  churned_customers: number;
  reactivated_customers: number;
};

export type LifecycleCustomerRow = {
  customer_id: string;
  company: string;
  lifecycle_stage: LifecycleStage;
  current_plan: string;
  plan_type: string;
  users: number;
  country: string;
  days_as_customer: number;
  health_score: number;
  health_status: HealthStatus;
  last_activity: string | null;
};

export type AtRiskCase = {
  id: string;
  customer_id: string;
  customer: string;
  risk_reason: string;
  health_score: number;
  recommended_action: string;
};

export type ExpansionOpportunity = {
  id: string;
  customer_id: string;
  customer: string;
  current_plan: string;
  opportunity: string;
  estimated_revenue_impact: number;
  currency: string;
};

export type TimelineEvent = {
  id: string;
  customer_id: string | null;
  customer: string;
  event_type: string;
  title: string;
  summary: string;
  event_at: string;
};

export type LifecycleAuditEntry = {
  id: string;
  customer_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type LifecycleStageMeta = {
  key: string;
  label: string;
};

export type CustomerLifecycleCenter = {
  principle: string;
  has_events: boolean;
  filters: CustomerLifecycleFilters;
  lifecycle_stages: LifecycleStageMeta[];
  overview: LifecycleOverview;
  customers: LifecycleCustomerRow[];
  at_risk: AtRiskCase[];
  expansion_opportunities: ExpansionOpportunity[];
  timeline: TimelineEvent[];
  audit: LifecycleAuditEntry[];
};

export type CustomerLifecycleCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    stages: string;
    customers: string;
    atRisk: string;
    expansion: string;
    timeline: string;
    audit: string;
    filters: string;
    healthScore: string;
  };
  overview: {
    newCustomers: string;
    trialCustomers: string;
    activeCustomers: string;
    atRiskCustomers: string;
    churnedCustomers: string;
    reactivatedCustomers: string;
  };
  table: {
    company: string;
    lifecycleStage: string;
    currentPlan: string;
    users: string;
    country: string;
    daysAsCustomer: string;
    healthScore: string;
    lastActivity: string;
    actions: string;
    customer: string;
    riskReason: string;
    recommendedAction: string;
    opportunity: string;
    revenueImpact: string;
    event: string;
  };
  healthFactors: {
    loginFrequency: string;
    featureAdoption: string;
    supportInteractions: string;
    paymentHistory: string;
    teamEngagement: string;
  };
  stages: Record<LifecycleStage, string>;
  healthStatuses: Record<HealthStatus, string>;
  actions: {
    view: string;
    contact: string;
    scheduleOnboarding: string;
    offerTraining: string;
    escalate: string;
    monitor: string;
    applying: string;
  };
  filters: {
    lifecycleStage: string;
    country: string;
    healthStatus: string;
    plan: string;
    registrationFrom: string;
    registrationTo: string;
    allStages: string;
    allHealth: string;
    allPlans: string;
    allCountries: string;
    apply: string;
  };
  plans: Record<PlanType, string>;
};
