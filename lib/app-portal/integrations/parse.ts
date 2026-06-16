import type {
  AppPortalIntegrationConnection,
  AppPortalIntegrationProvider,
  AppPortalIntegrationSetup,
  AppPortalIntegrationsHub,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asBool(value: unknown, fallback = false): boolean {
  return value === true || (value == null ? fallback : Boolean(value));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

function parseProvider(raw: unknown): AppPortalIntegrationProvider {
  const row = asRecord(raw) ?? {};
  return {
    provider_key: asString(row.provider_key),
    display_name: asString(row.display_name),
    category: asString(row.category),
    setup_type: asString(row.setup_type, "manual") as AppPortalIntegrationProvider["setup_type"],
    oauth_available: row.oauth_available === true,
    default_permission_level: asString(row.default_permission_level, "read_only") as
      | "read_only"
      | "read_write",
    recommended_scopes: asStringArray(row.recommended_scopes),
  };
}

function parseConnection(raw: unknown): AppPortalIntegrationConnection {
  const row = asRecord(raw) ?? {};
  return {
    id: asString(row.id),
    provider_key: asString(row.provider_key),
    setup_type: asString(row.setup_type, "manual") as AppPortalIntegrationConnection["setup_type"],
    status: asString(row.status),
    permission_level: asString(row.permission_level),
    approved_scopes: asStringArray(row.approved_scopes),
    masked_credential_hint: row.masked_credential_hint == null ? null : asString(row.masked_credential_hint),
    last_test_success_at: row.last_test_success_at == null ? null : asString(row.last_test_success_at),
    last_test_failed_at: row.last_test_failed_at == null ? null : asString(row.last_test_failed_at),
    last_test_error: row.last_test_error == null ? null : asString(row.last_test_error),
  };
}

export function parseAppPortalIntegrationsHub(raw: unknown): AppPortalIntegrationsHub | null {
  const row = asRecord(raw);
  if (!row) return null;

  const providers = Array.isArray(row.providers) ? row.providers.map(parseProvider) : [];
  const connections = Array.isArray(row.connections) ? row.connections.map(parseConnection) : [];

  return {
    read_only_principle: asString(row.read_only_principle),
    can_manage: asBool(row.can_manage),
    setup_flow_steps: asStringArray(row.setup_flow_steps),
    providers,
    connections,
    privacy_note: asString(row.privacy_note),
  };
}

export function parseAppPortalIntegrationSetup(raw: unknown): AppPortalIntegrationSetup | null {
  const row = asRecord(raw);
  if (!row) return null;

  const conn = asRecord(row.connection);

  return {
    provider_key: asString(row.provider_key),
    display_name: asString(row.display_name),
    setup_type: asString(row.setup_type),
    oauth_available: row.oauth_available === true,
    default_permission_level: asString(row.default_permission_level, "read_only"),
    recommended_scopes: asStringArray(row.recommended_scopes),
    connection: conn
      ? {
          id: asString(conn.id),
          status: asString(conn.status),
          permission_level: asString(conn.permission_level),
          approved_scopes: asStringArray(conn.approved_scopes),
          masked_credential_hint:
            conn.masked_credential_hint == null ? null : asString(conn.masked_credential_hint),
          last_test_success_at:
            conn.last_test_success_at == null ? null : asString(conn.last_test_success_at),
          last_test_failed_at:
            conn.last_test_failed_at == null ? null : asString(conn.last_test_failed_at),
        }
      : null,
    manual_steps: asStringArray(row.manual_steps),
    oauth_steps: asStringArray(row.oauth_steps),
  };
}
