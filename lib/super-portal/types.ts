import type {
  GlobalPlatformStatus,
  PlatformAdminRole,
  PlatformAdminStatus,
  SuperPortalLocale,
  TrendDirection,
} from "./constants";

export type SuperPortalExecutiveAlert = {
  id: string;
  title: string;
  severity: string;
  category: string;
  created_at: string;
};

export type SuperPortalGrowthTrend = {
  key: string;
  label: string;
  value_pct: number;
};

export type SuperPortalHealthIndicators = {
  uptime_pct: number;
  global_status: GlobalPlatformStatus;
  open_critical_incidents: number;
  operational_services: number;
  degraded_services: number;
  maintenance_services: number;
  incident_services: number;
};

export type SuperPortalDashboard = {
  principle: string;
  total_organizations: number;
  total_active_users: number;
  total_active_subscriptions: number;
  platform_administrator_count: number;
  global_platform_status: GlobalPlatformStatus;
  open_critical_incidents: number;
  growth_trends: SuperPortalGrowthTrend[];
  executive_alerts: SuperPortalExecutiveAlert[];
  platform_uptime_pct: number;
  platform_health_indicators: SuperPortalHealthIndicators;
  privacy_note: string;
};

export type SuperPlatformAdministrator = {
  id: string;
  auth_user_id: string;
  email: string;
  display_name: string;
  role: PlatformAdminRole;
  status: PlatformAdminStatus;
  last_login_at: string | null;
  suspended_at: string | null;
  created_at: string;
  activity_summary: {
    last_login_at: string | null;
    audit_events_30d: number;
  };
};

export type SuperLanguageSetting = {
  locale: SuperPortalLocale | string;
  enabled: boolean;
  completeness_pct: number;
  missing_keys_count: number;
  updated_at: string;
};

export type SuperGlobalAuditEntry = {
  id: string;
  user_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  previous_state: Record<string, unknown>;
  new_state: Record<string, unknown>;
  created_at: string;
};

export type SuperExecutiveInsights = {
  organization_growth: {
    new_organizations_30d: number;
    trend: TrendDirection;
  };
  subscription_growth: {
    new_subscriptions_30d: number;
    active_subscriptions: number;
    trend: TrendDirection;
  };
  revenue_indicators: {
    mrr: number;
    trend: TrendDirection;
  };
  platform_adoption: {
    active_installations: number;
    trend: TrendDirection;
  };
  global_activity: {
    actions_today: number;
    platform_admin_logins_7d: number;
  };
};

export type SuperPortalLabels = {
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    principle: string;
    privacyNote: string;
    totalOrganizations: string;
    totalActiveUsers: string;
    totalActiveSubscriptions: string;
    platformAdministrators: string;
    globalPlatformStatus: string;
    openCriticalIncidents: string;
    platformUptime: string;
    platformHealthIndicators: string;
    operationalServices: string;
    degradedServices: string;
    maintenanceServices: string;
    incidentServices: string;
    growthTrends: string;
    executiveAlerts: string;
    noAlerts: string;
    portalModules: string;
    openModule: string;
    statuses: Record<string, string>;
  };
  platformAdministrators: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    email: string;
    displayName: string;
    role: string;
    status: string;
    lastLogin: string;
    activitySummary: string;
    auditEvents30d: string;
    create: string;
    suspend: string;
    reactivate: string;
    saving: string;
    roles: Record<string, string>;
    statuses: Record<string, string>;
  };
  languageAdministration: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    locale: string;
    enabled: string;
    completeness: string;
      missingKeys: string;
      enable: string;
      disable: string;
      saving: string;
      yes: string;
      no: string;
      locales: Record<string, string>;
  };
  globalAudit: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    user: string;
    action: string;
    timestamp: string;
    previousValue: string;
    newValue: string;
    empty: string;
  };
  executiveInsights: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    organizationGrowth: string;
    subscriptionGrowth: string;
    revenueIndicators: string;
    platformAdoption: string;
    globalActivity: string;
    newOrganizations30d: string;
    newSubscriptions30d: string;
    activeSubscriptions: string;
    mrr: string;
    activeInstallations: string;
    actionsToday: string;
    adminLogins7d: string;
    trends: Record<string, string>;
  };
};
