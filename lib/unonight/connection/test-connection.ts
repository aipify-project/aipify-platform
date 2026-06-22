import { isUnonightAipifyTokenFormat } from "@/lib/unonight-platform/constants";
import {
  UNONIGHT_CONNECTION_TIMEOUT_MS,
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_PROVIDER_KEY,
  buildUnonightConnectionUrl,
  resolveUnonightApiBaseUrl,
} from "./constants";
import {
  buildUnonightConnectionDiagnostics,
  extractSafeResponseCode,
} from "./diagnostics";
import { classifyUnonightHttpFailure, getUnonightFailureMessageKey } from "./failures";
import { assertProductionUnonightToken } from "./placeholders";
import type {
  UnonightConnectionSuccess,
  UnonightConnectionTestResult,
} from "./types";
import { normalizeUnonightFailureCode } from "./types";

export type UnonightLiveTestInput = {
  bearerToken: string;
  baseUrl?: string | null;
  requestedScopes?: readonly string[];
  expectedOrganizationId?: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  credentialFound?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseScopes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function normalizeAccessMode(value: unknown): "read_only" | "read_write" | null {
  if (value === "read_only" || value === "read_write") return value;
  if (value === "readonly") return "read_only";
  return null;
}

function readOrganizationFields(payload: Record<string, unknown>): {
  organizationId: string;
  organizationName: string;
} {
  const organization = payload.organization;
  if (isRecord(organization)) {
    const organizationId = String(
      organization.id ?? organization.organization_id ?? ""
    ).trim();
    const organizationName = String(
      organization.name ?? organization.organization_name ?? ""
    ).trim();
    if (organizationId || organizationName) {
      return { organizationId, organizationName };
    }
  }

  return {
    organizationId: String(payload.organization_id ?? "").trim(),
    organizationName: String(payload.organization_name ?? "").trim(),
  };
}

export function parseUnonightConnectionContract(payload: unknown): UnonightConnectionSuccess | null {
  if (!isRecord(payload)) return null;

  const canonicalConnected = payload.connected === true;
  const okConnected = payload.ok === true;
  if (!canonicalConnected && !okConnected) return null;

  const provider = String(payload.provider ?? UNONIGHT_PROVIDER_KEY).trim();
  if (provider && provider !== UNONIGHT_PROVIDER_KEY) return null;

  const { organizationId, organizationName } = readOrganizationFields(payload);
  const apiVersion = String(payload.api_version ?? "v1").trim();
  const accessMode = normalizeAccessMode(payload.access_mode);
  const scopes = parseScopes(payload.scopes);

  if (!organizationId || !organizationName || !accessMode) return null;

  return {
    connected: true,
    provider: "unonight",
    organization_id: organizationId,
    organization_name: organizationName,
    access_mode: accessMode,
    scopes,
    api_version: apiVersion,
  };
}

function missingScopes(
  granted: readonly string[],
  required: readonly string[]
): string[] {
  const grantedSet = new Set(granted.map((scope) => scope.toLowerCase()));
  return required.filter((scope) => !grantedSet.has(scope.toLowerCase()));
}

function buildFailure(
  code: Parameters<typeof normalizeUnonightFailureCode>[0],
  technicalReason: string,
  diagnostics: ReturnType<typeof buildUnonightConnectionDiagnostics>
): UnonightConnectionTestResult {
  const normalized = normalizeUnonightFailureCode(code);
  return {
    ok: false,
    code: normalized,
    messageKey: getUnonightFailureMessageKey(normalized),
    technicalReason,
    diagnostics,
  };
}

export async function testUnonightReadOnlyConnection(
  input: UnonightLiveTestInput
): Promise<UnonightConnectionTestResult> {
  const credentialFound = input.credentialFound ?? true;
  const tokenPrefixValid = isUnonightAipifyTokenFormat(input.bearerToken);
  const baseUrl = resolveUnonightApiBaseUrl(input.baseUrl);
  const url = buildUnonightConnectionUrl(baseUrl);

  const baseDiagnostics = (overrides: Partial<Parameters<typeof buildUnonightConnectionDiagnostics>[0]>) =>
    buildUnonightConnectionDiagnostics({
      baseUrl,
      credentialFound,
      tokenPrefixValid,
      authorizationAttached: false,
      schemaMatched: false,
      ...overrides,
    });

  try {
    assertProductionUnonightToken(input.bearerToken);
  } catch {
    return buildFailure(
      "invalid_token",
      "placeholder blocked or missing",
      baseDiagnostics({ safeResponseCode: "invalid_token" })
    );
  }

  if (!tokenPrefixValid) {
    return buildFailure(
      "invalid_token",
      "Token prefix must start with uno_aipify_",
      baseDiagnostics({ safeResponseCode: "invalid_token_format" })
    );
  }

  const requestedScopes = input.requestedScopes?.length
    ? input.requestedScopes
    : [...UNONIGHT_DEFAULT_SCOPES];
  const fetchImpl = input.fetchImpl ?? fetch;
  const timeoutMs = input.timeoutMs ?? UNONIGHT_CONNECTION_TIMEOUT_MS;

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.bearerToken.trim()}`,
        Accept: "application/json",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const code = classifyUnonightHttpFailure({ error });
    return buildFailure(
      code,
      "Live HTTP connection test failed",
      baseDiagnostics({
        authorizationAttached: true,
        safeResponseCode: "network_error",
      })
    );
  }

  if (response.status >= 300 && response.status < 400) {
    return buildFailure(
      "endpoint_unreachable",
      `Redirect response (${response.status}) is not allowed`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode: "redirect",
      })
    );
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    const code = classifyUnonightHttpFailure({ status: response.status });
    return buildFailure(
      code,
      `Non-JSON response (${response.status})`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode: "non_json",
      })
    );
  }

  const safeResponseCode = extractSafeResponseCode(payload);

  if (!response.ok) {
    const code = classifyUnonightHttpFailure({ status: response.status, error: payload });
    return buildFailure(
      code,
      `HTTP ${response.status}`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
      })
    );
  }

  const contract = parseUnonightConnectionContract(payload);
  if (!contract) {
    return buildFailure(
      "unsupported_response",
      "Connection contract validation failed",
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        schemaMatched: false,
      })
    );
  }

  if (contract.access_mode !== "read_only") {
    return buildFailure(
      "missing_required_scope",
      "Read-only access mode required",
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        schemaMatched: true,
        requiredScopesMatched: false,
      })
    );
  }

  const scopeGaps = missingScopes(contract.scopes, requestedScopes);
  if (scopeGaps.length > 0) {
    return buildFailure(
      "missing_required_scope",
      `Missing scopes: ${scopeGaps.join(", ")}`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        schemaMatched: true,
        requiredScopesMatched: false,
      })
    );
  }

  const organizationMatched =
    !input.expectedOrganizationId?.trim() ||
    contract.organization_id === input.expectedOrganizationId.trim();

  if (!organizationMatched) {
    return buildFailure(
      "organization_mismatch",
      "Organization identity mismatch",
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        schemaMatched: true,
        organizationMatched: false,
        requiredScopesMatched: true,
      })
    );
  }

  if (!contract.api_version.startsWith("v")) {
    return buildFailure(
      "unsupported_response",
      `Unsupported api_version ${contract.api_version}`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        schemaMatched: false,
        organizationMatched: true,
        requiredScopesMatched: true,
      })
    );
  }

  return {
    ok: true,
    contract,
    verifiedAt: new Date().toISOString(),
    diagnostics: baseDiagnostics({
      authorizationAttached: true,
      httpStatus: response.status,
      safeResponseCode,
      schemaMatched: true,
      organizationMatched: true,
      requiredScopesMatched: true,
    }),
  };
}

export function requiresLiveHttpForSuccess(): true {
  return true;
}
