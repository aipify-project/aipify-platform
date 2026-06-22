import { buildUnonightConnectionUrl, resolveUnonightApiBaseUrl } from "./constants";
import { extractSafeResponseShape } from "./contract-parser";

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
  response_shape?: {
    top_level_keys: string[];
    nested_keys: Record<string, string[]>;
  } | null;
  contract_mismatch_code?: string | null;
  compatibility_notes?: string[];
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
  responseShape?: ReturnType<typeof extractSafeResponseShape>;
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

export { extractSafeResponseShape };
