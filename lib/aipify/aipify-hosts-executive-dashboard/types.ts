export type HostsExecutiveWidgetKey =
  | "executive_summary"
  | "requires_attention"
  | "notifications"
  | "todays_operations"
  | "property_health"
  | "financial_snapshot"
  | "upcoming_events"
  | "quick_actions";

export type HostsExecutiveSummary = {
  active_properties: number;
  occupancy_rate: number;
  revenue_this_month: number;
  open_incidents: number;
  guest_satisfaction_score: number;
  open_approvals: number;
};

export type HostsExecutiveAttentionItem = {
  type: string;
  label: string;
  property_id: string | null;
  severity: string;
  link: string;
};

export type HostsExecutiveTodaysOperations = {
  arrivals_today: number;
  departures_today: number;
  cleaning_tasks_today: number;
  maintenance_tasks_today: number;
  pending_guest_requests: number;
};

export type HostsExecutivePropertyHealth = {
  excellent: number;
  good: number;
  attention_required: number;
  critical: number;
  properties: Array<{
    property_id: string;
    property: string;
    overall_score: number;
    score_level: string;
  }>;
};

export type HostsExecutiveFinancialSnapshot = {
  revenue_this_month: number;
  upcoming_payouts: number;
  outstanding_expenses: number;
  estimated_net_position: number;
};

export type HostsExecutiveUpcomingEvent = {
  id: string;
  event_key: string;
  event_type: string;
  title: string;
  event_date: string;
  property_id: string | null;
  property: string;
  summary: string;
};

export type HostsExecutiveNotification = {
  type: string;
  title: string;
  message: string;
  priority: string;
};

export type HostsExecutiveQuickAction = {
  key: string;
  route: string;
};

export type HostsExecutiveWidgetPreferences = {
  widget_order: string[];
  collapsed: Record<string, boolean>;
};

export type HostsExecutiveDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  positioning: string;
  governance: Record<string, boolean>;
  widget_preferences: HostsExecutiveWidgetPreferences;
  default_widgets: string[];
  executive_summary: HostsExecutiveSummary;
  requires_attention: HostsExecutiveAttentionItem[];
  requires_attention_count: number;
  todays_operations: HostsExecutiveTodaysOperations;
  property_health: HostsExecutivePropertyHealth;
  financial_snapshot: HostsExecutiveFinancialSnapshot;
  upcoming_events: HostsExecutiveUpcomingEvent[];
  notifications: HostsExecutiveNotification[];
  quick_actions: HostsExecutiveQuickAction[];
};

export type HostsExecutiveDashboardActionResult = {
  success: boolean;
  summary?: string;
};
