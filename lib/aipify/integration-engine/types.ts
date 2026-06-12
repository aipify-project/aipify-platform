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
  note?: string;
};

export type FinancialPrinciple = {
  key?: string;
  label?: string;
  description?: string;
};

export type PrimaryStrategySystem = {
  key?: string;
  name?: string;
  role?: string;
  emoji?: string;
  note?: string;
};

export type PrimaryStrategy = {
  principle?: string;
  systems?: PrimaryStrategySystem[];
  coordination_model?: string;
  coordination_note?: string;
  aipify_role?: string;
  aipify_role_note?: string;
};

export type BlueprintBoundaries = {
  principle?: string;
  should_not_become?: string[];
  preserved_a8?: string[];
};

export type ExecutiveInsightExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type FinancialTrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type FinancialEngagementSummary = {
  stripe_connected?: boolean;
  fiken_connected?: boolean;
  stripe_active?: boolean;
  fiken_active?: boolean;
  stripe_syncs?: number;
  fiken_syncs?: number;
  stripe_webhooks?: number;
  financial_webhooks?: number;
  stripe_sync_failures?: number;
  last_stripe_sync_at?: string | null;
  last_fiken_sync_at?: string | null;
  fiken_catalog_scaffold?: boolean;
  stripe_catalog_available?: boolean;
  privacy_note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type IntegrationEngineCard = {
  has_organization: boolean;
  active_integrations?: number;
  failed_integrations?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  integration_engine_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: FinancialEngagementSummary;
  blueprint_note?: string;
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
  implementation_blueprint?: ImplementationBlueprintMeta;
  financial_operations_note?: string;
  blueprint_philosophy?: string;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  blueprint_distinction_note?: string;
  financial_principles?: FinancialPrinciple[];
  primary_strategy?: PrimaryStrategy;
  aipify_may?: string[];
  blueprint_boundaries?: BlueprintBoundaries;
  executive_insight_examples?: ExecutiveInsightExample[];
  self_love_connection?: SelfLoveConnection;
  financial_trust_connection?: FinancialTrustConnection;
  financial_dogfooding?: {
    principle?: string;
    aipify_group?: Record<string, unknown>;
    unonight?: Record<string, unknown>;
  };
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: FinancialEngagementSummary;
  financial_operations_success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
};
