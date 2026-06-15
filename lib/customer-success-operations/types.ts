import type { PlanStatus, RenewalWindow, SuccessStatus } from "./constants";

export type CustomerSuccessFilters = {
  success_status?: SuccessStatus | "";
  assigned_manager?: string;
  country?: string;
  renewal_window?: RenewalWindow | "";
  health_score_min?: number;
};

export type SuccessOverview = {
  requiring_attention: number;
  onboarding_customers: number;
  success_plans_active: number;
  scheduled_check_ins: number;
  renewals_next_30_days: number;
  expansion_opportunities: number;
};

export type SuccessCustomerRow = {
  customer_id: string;
  customer: string;
  success_status: SuccessStatus;
  assigned_manager: string;
  health_score: number;
  last_check_in: string | null;
  next_action: string;
  renewal_date: string | null;
  country: string;
};

export type OnboardingProgress = {
  customer_id: string;
  customer: string;
  account_created: string | null;
  first_login: string | null;
  first_user_invited: string | null;
  first_integration: string | null;
  first_action: string | null;
  milestones_completed: number;
};

export type CheckInRecord = {
  id: string;
  customer_id: string;
  customer: string;
  check_in_type: string;
  scheduled_at: string;
  status: string;
};

export type ExpansionRecommendation = {
  id: string;
  customer_id: string;
  customer: string;
  current_plan: string;
  recommended_upgrade: string;
  estimated_revenue_increase: number;
  currency: string;
  reason: string;
};

export type SuccessPlan = {
  id: string;
  customer_id: string;
  customer: string;
  objective: string;
  owner: string;
  start_date: string;
  target_date: string | null;
  milestones: unknown[];
  status: PlanStatus;
};

export type SuccessAuditEntry = {
  id: string;
  customer_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type CustomerSuccessOperationsCenter = {
  principle: string;
  all_progressing: boolean;
  filters: CustomerSuccessFilters;
  overview: SuccessOverview;
  customers: SuccessCustomerRow[];
  onboarding: OnboardingProgress[];
  check_ins: CheckInRecord[];
  expansion: ExpansionRecommendation[];
  success_plans: SuccessPlan[];
  renewals: {
    within_30_days: SuccessCustomerRow[];
    within_60_days: SuccessCustomerRow[];
    within_90_days: SuccessCustomerRow[];
  };
  audit: SuccessAuditEntry[];
};

export type CustomerSuccessOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    customers: string;
    onboarding: string;
    checkIns: string;
    expansion: string;
    successPlans: string;
    renewals: string;
    audit: string;
    filters: string;
  };
  overview: {
    requiringAttention: string;
    onboarding: string;
    successPlans: string;
    checkIns: string;
    renewals: string;
    expansion: string;
  };
  table: {
    customer: string;
    successStatus: string;
    assignedManager: string;
    healthScore: string;
    lastCheckIn: string;
    nextAction: string;
    renewalDate: string;
    actions: string;
    currentPlan: string;
    recommendedUpgrade: string;
    revenueIncrease: string;
    reason: string;
    objective: string;
    owner: string;
    startDate: string;
    targetDate: string;
    status: string;
    event: string;
    accountCreated: string;
    firstLogin: string;
    firstUserInvited: string;
    firstIntegration: string;
    firstAction: string;
    milestonesCompleted: string;
    scheduledAt: string;
    checkInType: string;
  };
  statuses: Record<SuccessStatus, string>;
  planStatuses: Record<PlanStatus, string>;
  checkInTypes: Record<string, string>;
  actions: {
    openCustomer: string;
    scheduleMeeting: string;
    sendFollowUp: string;
    assignManager: string;
    createPlan: string;
    escalate: string;
    contact: string;
    scheduleReview: string;
    prepareProposal: string;
    applying: string;
  };
  filters: {
    successStatus: string;
    healthScore: string;
    assignedManager: string;
    renewalWindow: string;
    country: string;
    allStatuses: string;
    allRenewals: string;
    allCountries: string;
    apply: string;
  };
  renewals: {
    within30: string;
    within60: string;
    within90: string;
  };
  onboardingMilestones: {
    accountCreated: string;
    firstLogin: string;
    firstUserInvited: string;
    firstIntegration: string;
    firstAction: string;
    milestonesCompleted: string;
  };
};
