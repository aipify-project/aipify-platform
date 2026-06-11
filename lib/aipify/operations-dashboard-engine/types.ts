export type DashboardPreference = {
  widget_key: string;
  enabled?: boolean;
  display_order?: number;
};

export type OperationsAlert = {
  id: string;
  alert_type?: string;
  severity?: string;
  title: string;
  message?: string | null;
  acknowledged_at?: string | null;
  dismissed_at?: string | null;
  created_at?: string;
};

export type OrganizationHealth = {
  score?: number;
  status?: string;
  factors?: Record<string, number>;
};

export type OperationsDashboardEngineCard = {
  has_organization: boolean;
  health_status?: string;
  health_score?: number;
  active_alerts?: number;
  pending_approvals?: number;
  philosophy?: string;
};

export type OperationsDashboardEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  user_role?: string;
  allowed_widgets?: string[];
  preferences: DashboardPreference[];
  widgets?: Record<string, unknown>;
  active_alerts: OperationsAlert[];
  organization_health?: OrganizationHealth;
};
