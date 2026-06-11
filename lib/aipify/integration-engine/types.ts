export type ConnectedIntegration = {
  id: string;
  integration_key: string;
  integration_name: string;
  status?: string;
  enabled?: boolean;
  last_sync_at?: string | null;
  last_error?: string | null;
  has_credentials?: boolean;
  configuration?: Record<string, unknown>;
};

export type IntegrationCatalogItem = {
  integration_key: string;
  integration_name: string;
  category?: string;
  description?: string | null;
  is_available?: boolean;
  is_future?: boolean;
};

export type SyncFailure = {
  id: string;
  integration_id: string;
  sync_type?: string;
  error_message?: string | null;
  retry_count?: number;
  started_at?: string;
};

export type WebhookEvent = {
  id: string;
  integration_id: string;
  event_type: string;
  status?: string;
  signature_valid?: boolean | null;
  created_at?: string;
};

export type PendingAction = {
  id: string;
  integration_key: string;
  integration_name: string;
  status?: string;
  warning?: string;
};

export type IntegrationEngineCard = {
  has_organization: boolean;
  active_integrations?: number;
  failed_integrations?: number;
  philosophy?: string;
};

export type IntegrationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  connected_integrations: ConnectedIntegration[];
  catalog: IntegrationCatalogItem[];
  recent_failures: SyncFailure[];
  recent_webhooks: WebhookEvent[];
  pending_actions: PendingAction[];
  health_summary?: {
    active?: number;
    failed?: number;
    disabled?: number;
    pending?: number;
  };
  unonight_pilot?: {
    connected?: boolean;
    status?: string | null;
    last_sync_at?: string | null;
  };
};
