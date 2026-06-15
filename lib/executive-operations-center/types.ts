import type {
  ActionCategory,
  ActionPriority,
  AlertType,
  CalendarEventType,
  ExecutivePeriod,
  HealthStatus,
} from "./constants";

export type ExecutiveOperationsFilters = {
  period?: ExecutivePeriod | "";
};

export type ExecutiveOverview = {
  active_customers: number;
  monthly_recurring_revenue: number;
  customer_growth: number;
  system_health: number;
  open_critical_issues: number;
  executive_actions_required: number;
};

export type ExecutiveAction = {
  id: string;
  action: string;
  category: ActionCategory;
  priority: ActionPriority;
  due_date: string | null;
  owner: string;
  status: string;
  customer_id: string | null;
};

export type OrganizationalHealth = {
  customer_health_score: number;
  customer_health_status: HealthStatus;
  revenue_health_score: number;
  revenue_health_status: HealthStatus;
  platform_stability_score: number;
  platform_stability_status: HealthStatus;
  support_performance_score: number;
  support_performance_status: HealthStatus;
};

export type GrowthOverview = {
  new_customers_30d: number;
  upgrades_30d: number;
  expansion_revenue: number;
  churn_rate: number;
  trial_conversion_rate: number;
};

export type SystemOverview = {
  infrastructure_status: string;
  payment_provider_status: string;
  integration_health: string;
  ai_engine_status: string;
  notification_status: string;
  platform_uptime: number;
};

export type ExecutiveAlert = {
  id: string;
  alert_type: AlertType;
  title: string;
  summary: string;
  severity: ActionPriority;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  event_type: CalendarEventType;
  title: string;
  scheduled_at: string;
  owner: string;
  customer_id: string | null;
};

export type ExecutiveAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type ExecutiveOperationsCenter = {
  principle: string;
  no_actions_required: boolean;
  period: ExecutivePeriod;
  since_last_login: string | null;
  filters: ExecutiveOperationsFilters;
  overview: ExecutiveOverview;
  executive_summary: string[];
  actions: ExecutiveAction[];
  organizational_health: OrganizationalHealth;
  growth: GrowthOverview;
  system: SystemOverview;
  alerts: ExecutiveAlert[];
  calendar: CalendarEvent[];
  audit: ExecutiveAuditEntry[];
};

export type ExecutiveOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sinceLastLogin: string;
  sections: {
    overview: string;
    summary: string;
    actions: string;
    organizationalHealth: string;
    growth: string;
    system: string;
    alerts: string;
    calendar: string;
    audit: string;
    filters: string;
  };
  overview: {
    activeCustomers: string;
    mrr: string;
    customerGrowth: string;
    systemHealth: string;
    criticalIssues: string;
    actionsRequired: string;
  };
  table: {
    action: string;
    category: string;
    priority: string;
    dueDate: string;
    owner: string;
    actions: string;
    event: string;
    score: string;
    status: string;
    scheduledAt: string;
    title: string;
  };
  categories: Record<ActionCategory, string>;
  priorities: Record<ActionPriority, string>;
  healthStatuses: Record<HealthStatus, string>;
  healthMetrics: {
    customer: string;
    revenue: string;
    platform: string;
    support: string;
  };
  growth: {
    newCustomers: string;
    upgrades: string;
    expansionRevenue: string;
    churnRate: string;
    trialConversion: string;
  };
  system: {
    infrastructure: string;
    paymentProvider: string;
    integration: string;
    aiEngine: string;
    notification: string;
    uptime: string;
  };
  alertTypes: Record<AlertType, string>;
  calendarTypes: Record<CalendarEventType, string>;
  systemStatuses: Record<string, string>;
  actions: {
    approve: string;
    escalate: string;
    acknowledge: string;
    complete: string;
    applying: string;
  };
  filters: {
    period: string;
    apply: string;
  };
  periods: Record<ExecutivePeriod, string>;
};
