import type {
  AppPortalIntegrationConnection,
  AppPortalIntegrationProvider,
  AppPortalIntegrationSetup,
  AppPortalIntegrationsHub,
  IntegrationVerificationMetadata,
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

function parseVerificationMetadata(raw: unknown): IntegrationVerificationMetadata | null {
  const row = asRecord(raw);
  if (!row) return null;

  return {
    organization_id: row.organization_id == null ? null : asString(row.organization_id),
    organization_name: row.organization_name == null ? null : asString(row.organization_name),
    access_mode: row.access_mode == null ? null : asString(row.access_mode),
    scopes: asStringArray(row.scopes),
    api_version: row.api_version == null ? null : asString(row.api_version),
    connected: row.connected === true,
    provider: row.provider == null ? null : asString(row.provider),
  };
}

function parseAccessSummary(raw: unknown): Record<string, unknown> {
  return asRecord(raw) ?? {};
}

function extractVerificationFromAccessSummary(
  accessSummary: Record<string, unknown>
): {
  last_verification: IntegrationVerificationMetadata | null;
  last_verified_at: string | null;
  connection_name: string | null;
} {
  const lastVerification = parseVerificationMetadata(accessSummary.last_verification);
  const lastVerifiedAt =
    accessSummary.last_verified_at == null ? null : asString(accessSummary.last_verified_at);
  const connectionName =
    accessSummary.connection_name == null ? null : asString(accessSummary.connection_name);

  return {
    last_verification: lastVerification,
    last_verified_at: lastVerifiedAt,
    connection_name: connectionName,
  };
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
  const accessSummary = parseAccessSummary(row.access_summary);
  const verificationFields = extractVerificationFromAccessSummary(accessSummary);

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
    access_summary: accessSummary,
    last_verification: verificationFields.last_verification,
    last_verified_at: verificationFields.last_verified_at,
    connection_name: verificationFields.connection_name,
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

  const conn = row.connection ? parseConnection(row.connection) : null;

  return {
    provider_key: asString(row.provider_key),
    display_name: asString(row.display_name),
    setup_type: asString(row.setup_type),
    oauth_available: row.oauth_available === true,
    default_permission_level: asString(row.default_permission_level, "read_only"),
    recommended_scopes: asStringArray(row.recommended_scopes),
    connection: conn,
    manual_steps: asStringArray(row.manual_steps),
    oauth_steps: asStringArray(row.oauth_steps),
  };
}

export function parseVerificationFromTestResponse(
  raw: unknown
): IntegrationVerificationMetadata | null {
  return parseVerificationMetadata(raw);
}
