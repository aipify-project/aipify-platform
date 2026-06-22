import { buildUnonightConnectionUrl, resolveUnonightApiBaseUrl } from "./constants";

/** Safe connection-test diagnostics — never includes bearer tokens or Authorization values. */
export type UnonightConnectionDiagnostics = {
  normalized_base_url: string;
  final_endpoint: string;
  http_status: number | null;
  safe_response_code: string | null;
  credential_found: boolean;
  token_prefix_valid: boolean;
  authorization_attached: boolean;
  organization_matched: boolean | null;
  required_scopes_matched: boolean | null;
  schema_matched: boolean;
};

export function buildUnonightConnectionDiagnostics(input: {
  baseUrl?: string | null;
  credentialFound: boolean;
  tokenPrefixValid: boolean;
  authorizationAttached: boolean;
  httpStatus?: number | null;
  safeResponseCode?: string | null;
  organizationMatched?: boolean | null;
  requiredScopesMatched?: boolean | null;
  schemaMatched: boolean;
}): UnonightConnectionDiagnostics {
  const normalizedBaseUrl = resolveUnonightApiBaseUrl(input.baseUrl);
  return {
    normalized_base_url: normalizedBaseUrl,
    final_endpoint: buildUnonightConnectionUrl(normalizedBaseUrl),
    http_status: input.httpStatus ?? null,
    safe_response_code: input.safeResponseCode ?? null,
    credential_found: input.credentialFound,
    token_prefix_valid: input.tokenPrefixValid,
    authorization_attached: input.authorizationAttached,
    organization_matched: input.organizationMatched ?? null,
    required_scopes_matched: input.requiredScopesMatched ?? null,
    schema_matched: input.schemaMatched,
  };
}

export function extractSafeResponseCode(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string" && record.error.trim()) return record.error.trim();
  if (typeof record.code === "string" && record.code.trim()) return record.code.trim();
  if (record.ok === true) return "ok";
  if (record.connected === true) return "connected";
  return null;
}
