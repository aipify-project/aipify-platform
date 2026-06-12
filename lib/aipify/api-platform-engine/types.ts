export type DeveloperObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type ApiCategoryItem = {
  key?: string;
  label?: string;
  scopes?: string[];
};

export type ApiCategories = {
  core?: ApiCategoryItem[];
  companion?: ApiCategoryItem[];
  commerce?: ApiCategoryItem[];
  partner?: ApiCategoryItem[];
};

export type SecurityPrinciple = {
  key?: string;
  label?: string;
  description?: string;
};

export type DeveloperExperienceSurface = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type DeveloperExperience = {
  principle?: string;
  surfaces?: DeveloperExperienceSurface[];
  metadata_scaffold?: boolean;
  boundary?: string;
};

export type TrustConnectionBlueprint = {
  principle?: string;
  organizations_should_understand?: string[];
  metadata_only?: boolean;
  transparency_note?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ApiPlatformEngagementSummary = {
  active_keys?: number;
  pending_approval_keys?: number;
  active_webhooks?: number;
  audit_events_30d?: number;
  sandbox_enabled?: boolean;
  rate_limit_tier?: string;
  developer_objectives_documented?: number;
  api_category_endpoints_documented?: number;
  developer_portal_route?: string;
  privacy_note?: string;
};

export type ApiKeyMetadata = {
  id?: string;
  key_name?: string;
  key_prefix?: string;
  scopes?: string[];
  status?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
};

export type WebhookSubscription = {
  id?: string;
  subscription_name?: string;
  event_types?: string[];
  endpoint_url?: string;
  status?: string;
  secret_ref?: string;
  metadata?: Record<string, unknown>;
};

export type ApiAuditEntry = {
  id?: string;
  action?: string;
  resource_type?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type ApiPlatformEngineCard = {
  has_organization: boolean;
  active_keys?: number;
  active_webhooks?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  blueprint_phase?: number;
  engine_phase?: string;
  route?: string;
  [key: string]: unknown;
};

export type ApiPlatformEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  privacy_note?: string;
  mission?: string;
  blueprint_philosophy?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  settings?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  api_keys?: ApiKeyMetadata[];
  webhooks?: WebhookSubscription[];
  recent_audit?: ApiAuditEntry[];
  principles?: string[];
  developer_objectives?: DeveloperObjective[];
  api_categories?: ApiCategories;
  developer_experience?: DeveloperExperience;
  security_principles?: SecurityPrinciple[];
  trust_connection_blueprint?: TrustConnectionBlueprint;
  dogfooding_blueprint?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  blueprint_vision_phrases?: string[];
  engagement_summary?: ApiPlatformEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  implementation_blueprint?: Record<string, unknown>;
  [key: string]: unknown;
};
