import type { AlertSeverity, HealthProviderKey, HealthStatus } from "./constants";

export type ProviderHealthCard = {
  provider_key: HealthProviderKey;
  name: string;
  health_status: HealthStatus;
  environment: string;
  api_connection_status: string;
  webhook_status: string;
  last_successful_transaction_at: string | null;
  last_synchronization_at: string | null;
  failed_events_24h: number;
  success_rate_30d: number;
  check_interval_minutes: number;
  last_health_check_at: string | null;
  next_health_check_at: string | null;
  regions: string[];
  capabilities: string[];
};

export type HealthAlert = {
  id: string;
  provider_key: string;
  severity: AlertSeverity;
  alert_type: string;
  title: string;
  summary: string;
  created_at: string;
};

export type HealthAuditEntry = {
  id: string;
  provider_key: string;
  event_type: string;
  severity: AlertSeverity;
  summary: string;
  resolution_status: string;
  created_at: string;
};

export type PaymentProviderHealthCenter = {
  principle: string;
  all_operational: boolean;
  auto_check_intervals: Record<string, number>;
  providers: ProviderHealthCard[];
  alerts: HealthAlert[];
  audit: HealthAuditEntry[];
};

export type PaymentProviderHealthLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    providers: string;
    alerts: string;
    audit: string;
    autoChecks: string;
  };
  provider: {
    status: string;
    environment: string;
    apiConnection: string;
    webhookStatus: string;
    lastTransaction: string;
    lastSync: string;
    failed24h: string;
    successRate: string;
    nextCheck: string;
    viewDetails: string;
    retryCheck: string;
    viewLogs: string;
    testConnection: string;
  };
  healthStatuses: Record<HealthStatus, string>;
  environments: Record<string, string>;
  apiStatuses: Record<string, string>;
  severities: Record<AlertSeverity, string>;
  providers: Record<HealthProviderKey, string>;
  autoChecks: Record<HealthProviderKey, string>;
  audit: {
    event: string;
    severity: string;
    resolution: string;
    empty: string;
  };
  actions: {
    checking: string;
    checkComplete: string;
  };
};
