import type {
  AlertCategory,
  AlertResolutionStatus,
  AlertSeverity,
  DeploymentStatus,
  IncidentSeverity,
  IncidentStatus,
  ServiceKey,
  ServiceStatus,
} from "./constants";

export type PlatformHealthService = {
  key: ServiceKey | string;
  label: string;
  status: ServiceStatus;
  checked_at: string;
};

export type PlatformHealthExecutiveSummary = {
  active_organizations: number;
  active_subscriptions: number;
  platform_uptime_pct: number;
  open_incidents: number;
  resolved_incidents_this_month: number;
  critical_alerts: number;
};

export type PlatformHealthIncidentNote = {
  id: string;
  note: string;
  created_at: string;
};

export type PlatformHealthIncident = {
  id: string;
  title: string;
  summary: string;
  service_key: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  created_at: string;
  resolved_at: string | null;
  notes: PlatformHealthIncidentNote[];
};

export type PlatformHealthResolvedIncident = {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  resolved_at: string | null;
};

export type PlatformHealthAlert = {
  id: string;
  title: string;
  category: AlertCategory;
  severity: AlertSeverity;
  resolution_status: AlertResolutionStatus;
  summary: string;
  created_at: string;
  resolved_at: string | null;
};

export type PlatformHealthDeployment = {
  id?: string;
  version: string;
  previous_version: string | null;
  deployed_at: string;
  initiator: string;
  status: DeploymentStatus;
};

export type PlatformHealthAuditEntry = {
  id: string;
  action: string;
  previous_state: Record<string, unknown>;
  new_state: Record<string, unknown>;
  created_at: string;
};

export type PlatformHealthOperationsCenter = {
  principle: string;
  services: PlatformHealthService[];
  executive_summary: PlatformHealthExecutiveSummary;
  incidents: PlatformHealthIncident[];
  resolved_incidents: PlatformHealthResolvedIncident[];
  alerts: PlatformHealthAlert[];
  deployment: PlatformHealthDeployment;
  deployment_history: PlatformHealthDeployment[];
  audit_logs: PlatformHealthAuditEntry[];
  can_manage: boolean;
};

export type PlatformHealthOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    services: string;
    executiveSummary: string;
    incidents: string;
    resolvedIncidents: string;
    alerts: string;
    deployment: string;
    deploymentHistory: string;
    audit: string;
    createIncident: string;
  };
  executiveSummary: {
    activeOrganizations: string;
    activeSubscriptions: string;
    platformUptime: string;
    openIncidents: string;
    resolvedIncidentsMonth: string;
    criticalAlerts: string;
  };
  services: Record<string, string>;
  serviceStatuses: Record<ServiceStatus, string>;
  severities: Record<IncidentSeverity, string>;
  incidentStatuses: Record<IncidentStatus, string>;
  alertCategories: Record<AlertCategory, string>;
  alertResolutionStatuses: Record<AlertResolutionStatus, string>;
  deploymentStatuses: Record<DeploymentStatus, string>;
  table: {
    title: string;
    category: string;
    severity: string;
    status: string;
    timestamp: string;
    version: string;
    initiator: string;
    action: string;
    notes: string;
  };
  form: {
    incidentTitle: string;
    incidentSummary: string;
    serviceKey: string;
    severity: string;
    status: string;
    note: string;
    create: string;
    updateStatus: string;
    addNote: string;
    acknowledgeAlert: string;
    resolveAlert: string;
    saving: string;
  };
  actions: {
    applying: string;
  };
};
