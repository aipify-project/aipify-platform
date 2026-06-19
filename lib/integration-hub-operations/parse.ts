import type {
  ApiKeyEntry,
  HealthCheck,
  HubConnector,
  IntegrationHubCenter,
  MarketplaceConnector,
  SyncRun,
  WebhookEntry,
} from "./types";

function parseConnector(row: Record<string, unknown>): HubConnector {
  return {
    id: String(row.id ?? ""),
    connector_key: String(row.connector_key ?? ""),
    connector_name: String(row.connector_name ?? ""),
    provider: row.provider ? String(row.provider) : undefined,
    version: row.version ? String(row.version) : undefined,
    category: row.category ? String(row.category) : undefined,
    status: row.status ? String(row.status) : undefined,
    auth_method: row.auth_method ? String(row.auth_method) : undefined,
    sync_mode: row.sync_mode ? String(row.sync_mode) : undefined,
    sync_direction: row.sync_direction ? String(row.sync_direction) : undefined,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    permissions_requested: row.permissions_requested,
    permissions_granted: row.permissions_granted,
    data_access_scope: row.data_access_scope ? String(row.data_access_scope) : undefined,
    approval_required: row.approval_required === true,
    health_status: row.health_status ? String(row.health_status) : undefined,
    last_sync_at: row.last_sync_at ? String(row.last_sync_at) : undefined,
    last_sync_status: row.last_sync_status ? String(row.last_sync_status) : undefined,
    last_error: row.last_error ? String(row.last_error) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    installed_at: row.installed_at ? String(row.installed_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function parseMarketplace(row: Record<string, unknown>): MarketplaceConnector {
  return {
    connector_key: String(row.connector_key ?? ""),
    connector_name: String(row.connector_name ?? ""),
    provider: row.provider ? String(row.provider) : undefined,
    category: row.category ? String(row.category) : undefined,
    description: row.description ? String(row.description) : undefined,
    auth_methods: row.auth_methods,
    default_permissions: row.default_permissions,
    sync_directions: row.sync_directions,
    business_pack_keys: row.business_pack_keys,
    is_available: row.is_available === true,
  };
}

function parseSyncRun(row: Record<string, unknown>): SyncRun {
  return {
    id: String(row.id ?? ""),
    connector_id: row.connector_id ? String(row.connector_id) : undefined,
    connector_name: row.connector_name ? String(row.connector_name) : undefined,
    sync_type: row.sync_type ? String(row.sync_type) : undefined,
    sync_target: row.sync_target ? String(row.sync_target) : undefined,
    status: row.status ? String(row.status) : undefined,
    records_processed: row.records_processed != null ? Number(row.records_processed) : undefined,
    duration_ms: row.duration_ms != null ? Number(row.duration_ms) : undefined,
    error_message: row.error_message ? String(row.error_message) : undefined,
    warning_message: row.warning_message ? String(row.warning_message) : undefined,
    started_at: row.started_at ? String(row.started_at) : undefined,
    completed_at: row.completed_at ? String(row.completed_at) : undefined,
  };
}

function parseWebhook(row: Record<string, unknown>): WebhookEntry {
  return {
    id: String(row.id ?? ""),
    webhook_name: String(row.webhook_name ?? ""),
    source: row.source ? String(row.source) : undefined,
    destination: row.destination ? String(row.destination) : undefined,
    event_types: row.event_types,
    status: row.status ? String(row.status) : undefined,
    retry_count: row.retry_count != null ? Number(row.retry_count) : undefined,
    failure_count: row.failure_count != null ? Number(row.failure_count) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

function parseApiKey(row: Record<string, unknown>): ApiKeyEntry {
  return {
    id: String(row.id ?? ""),
    key_name: String(row.key_name ?? ""),
    key_prefix: row.key_prefix ? String(row.key_prefix) : undefined,
    permissions: row.permissions,
    usage_count: row.usage_count != null ? Number(row.usage_count) : undefined,
    rate_limit_per_hour: row.rate_limit_per_hour != null ? Number(row.rate_limit_per_hour) : undefined,
    status: row.status ? String(row.status) : undefined,
    last_used_at: row.last_used_at ? String(row.last_used_at) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

function parseHealth(row: Record<string, unknown>): HealthCheck {
  return {
    connector_id: row.connector_id ? String(row.connector_id) : undefined,
    connector_name: row.connector_name ? String(row.connector_name) : undefined,
    health_status: row.health_status ? String(row.health_status) : undefined,
    availability_pct: row.availability_pct != null ? Number(row.availability_pct) : undefined,
    api_errors: row.api_errors != null ? Number(row.api_errors) : undefined,
    rate_limit_hits: row.rate_limit_hits != null ? Number(row.rate_limit_hits) : undefined,
    auth_issues: row.auth_issues != null ? Number(row.auth_issues) : undefined,
    latency_ms: row.latency_ms != null ? Number(row.latency_ms) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    checked_at: row.checked_at ? String(row.checked_at) : undefined,
  };
}

export function parseIntegrationHubCenter(row: Record<string, unknown>): IntegrationHubCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    connector_statuses: Array.isArray(row.connector_statuses) ? row.connector_statuses.map(String) : undefined,
    auth_methods: Array.isArray(row.auth_methods) ? row.auth_methods.map(String) : undefined,
    sync_modes: Array.isArray(row.sync_modes) ? row.sync_modes.map(String) : undefined,
    installed_connectors: Array.isArray(row.installed_connectors)
      ? row.installed_connectors.map((r) => parseConnector(r as Record<string, unknown>))
      : undefined,
    marketplace: Array.isArray(row.marketplace)
      ? row.marketplace.map((r) => parseMarketplace(r as Record<string, unknown>))
      : undefined,
    connected_systems: Array.isArray(row.connected_systems)
      ? row.connected_systems.map((item) => {
          const c = item as Record<string, unknown>;
          return {
            connector: c.connector ? parseConnector(c.connector as Record<string, unknown>) : undefined,
            domain: c.domain ? String(c.domain) : undefined,
            domain_status: c.domain_status ? String(c.domain_status) : undefined,
          };
        })
      : undefined,
    domains: Array.isArray(row.domains)
      ? row.domains.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            domain_id: item.domain_id ? String(item.domain_id) : undefined,
            domain: item.domain ? String(item.domain) : undefined,
            verification_status: item.verification_status ? String(item.verification_status) : undefined,
            connector_count: item.connector_count != null ? Number(item.connector_count) : undefined,
          };
        })
      : undefined,
    api_keys: Array.isArray(row.api_keys)
      ? row.api_keys.map((r) => parseApiKey(r as Record<string, unknown>))
      : undefined,
    webhooks: Array.isArray(row.webhooks)
      ? row.webhooks.map((r) => parseWebhook(r as Record<string, unknown>))
      : undefined,
    sync_history: Array.isArray(row.sync_history)
      ? row.sync_history.map((r) => parseSyncRun(r as Record<string, unknown>))
      : undefined,
    health_monitoring: Array.isArray(row.health_monitoring)
      ? row.health_monitoring.map((r) => parseHealth(r as Record<string, unknown>))
      : undefined,
    connector_governance: row.connector_governance as Record<string, unknown> | undefined,
    installation_workflow: Array.isArray(row.installation_workflow) ? row.installation_workflow.map(String) : undefined,
    business_pack_integration: row.business_pack_integration as Record<string, unknown> | undefined,
    domain_intelligence: Array.isArray(row.domain_intelligence)
      ? row.domain_intelligence.map((d) => {
          const item = d as Record<string, unknown>;
          return { domain: item.domain ? String(item.domain) : undefined, connectors: item.connectors };
        })
      : undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    companion_integration: row.companion_integration as Record<string, unknown> | undefined,
    external_actions_framework: row.external_actions_framework as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseIntegrationHubSearchResults(row: Record<string, unknown>): HubConnector[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseConnector(r as Record<string, unknown>));
}
