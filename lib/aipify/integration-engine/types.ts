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

export type PlatformPriority = {
  category?: string;
  label?: string;
  integrations?: string[];
  status?: string;
};

export type InstallConnection = {
  capabilities?: string[];
  install_engine_route?: string;
  install_wizard_route?: string;
};

export type TrustConnection = {
  principle?: string;
  organizations_should_understand?: string[];
  disable_path?: string;
};

export type ConnectorArchitecture = {
  note?: string;
  modules?: string[];
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  integrations?: string[];
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
};

export type IntegrationEngineCard = {
  has_organization: boolean;
  active_integrations?: number;
  failed_integrations?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  integration_engine_note?: string;
};

export type IntegrationEngineDashboard = {
  has_organization: boolean;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  integration_engine_note?: string;
  integration_principles?: string[];
  platform_priorities?: PlatformPriority[];
  install_connection?: InstallConnection;
  permission_requirements?: string[];
  audit_requirements?: string[];
  self_love_note?: string;
  trust_connection?: TrustConnection;
  connector_architecture?: ConnectorArchitecture;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  success_criteria?: AbosSuccessCriterion[];
  integration_links?: IntegrationLink[];
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
