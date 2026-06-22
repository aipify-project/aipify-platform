import { buildUnonightConnectionUrl, resolveUnonightApiBaseUrl } from "./constants";
import type { UnonightConnectionDiagnostics, UnonightSafeResponseShape } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapPayload(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const data = payload.data;
  if (isRecord(data)) return data;
  return payload;
}

export function extractSafeResponseShape(payload: unknown): UnonightSafeResponseShape | null {
  const record = unwrapPayload(payload);
  if (!record) return null;

  const nested_keys: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(record)) {
    if (isRecord(value)) nested_keys[key] = Object.keys(value);
    if (Array.isArray(value) && value.length > 0 && isRecord(value[0])) {
      nested_keys[key] = Object.keys(value[0]);
    }
  }

  return { top_level_keys: Object.keys(record), nested_keys };
}

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
  responseShape?: UnonightSafeResponseShape | null;
  contractMismatchCode?: string | null;
  compatibilityNotes?: string[];
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
    response_shape: input.responseShape ?? null,
    contract_mismatch_code: input.contractMismatchCode ?? null,
    compatibility_notes: input.compatibilityNotes ?? [],
  };
}

export function extractSafeResponseCode(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string" && record.error.trim()) return record.error.trim();
  if (typeof record.code === "string" && record.code.trim()) return record.code.trim();
  if (record.ok === true) return "ok";
  if (record.connected === true) return "connected";
  const status = String(record.status ?? "").trim().toLowerCase();
  if (status === "connected") return "connected";
  return null;
}
