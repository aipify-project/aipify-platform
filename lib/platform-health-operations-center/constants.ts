export const SERVICE_KEYS = [
  "authentication",
  "database",
  "email_delivery",
  "payment_infrastructure",
  "background_jobs",
  "file_storage",
  "marketplace_services",
  "notification_services",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_STATUSES = [
  "operational",
  "degraded",
  "maintenance",
  "incident",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const INCIDENT_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export const INCIDENT_STATUSES = [
  "investigating",
  "identified",
  "monitoring",
  "resolved",
] as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const ALERT_CATEGORIES = [
  "failed_job",
  "service_interruption",
  "authentication_anomaly",
  "payment_failure",
  "email_delivery",
  "marketplace",
  "notification",
] as const;

export type AlertCategory = (typeof ALERT_CATEGORIES)[number];

export const ALERT_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_RESOLUTION_STATUSES = ["open", "acknowledged", "resolved"] as const;

export type AlertResolutionStatus = (typeof ALERT_RESOLUTION_STATUSES)[number];

export const DEPLOYMENT_STATUSES = ["successful", "failed", "rolled_back"] as const;

export type DeploymentStatus = (typeof DEPLOYMENT_STATUSES)[number];

export const SERVICE_STATUS_BADGES: Record<ServiceStatus, string> = {
  operational: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  degraded: "bg-amber-50 text-amber-800 ring-amber-200",
  maintenance: "bg-sky-50 text-sky-800 ring-sky-200",
  incident: "bg-rose-50 text-rose-800 ring-rose-200",
};

export const SEVERITY_BADGES: Record<IncidentSeverity | AlertSeverity, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-rose-50 text-rose-800 ring-rose-200",
};
