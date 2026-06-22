import {
  UNONIGHT_CONNECTION_TIMEOUT_MS,
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_PROVIDER_KEY,
  buildUnonightConnectionUrl,
  resolveUnonightApiBaseUrl,
} from "./constants";
import { classifyUnonightHttpFailure, getUnonightFailureMessageKey } from "./failures";
import { assertProductionUnonightToken } from "./placeholders";
import type {
  UnonightConnectionSuccess,
  UnonightConnectionTestResult,
} from "./types";

export type UnonightLiveTestInput = {
  bearerToken: string;
  baseUrl?: string | null;
  requestedScopes?: readonly string[];
  expectedOrganizationId?: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
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

export function parseUnonightConnectionContract(payload: unknown): UnonightConnectionSuccess | null {
  if (!isRecord(payload)) return null;
  if (payload.connected !== true) return null;
  if (payload.provider !== UNONIGHT_PROVIDER_KEY) return null;

  const organizationId = String(payload.organization_id ?? "").trim();
  const organizationName = String(payload.organization_name ?? "").trim();
  const apiVersion = String(payload.api_version ?? "").trim();
  const accessMode = normalizeAccessMode(payload.access_mode);
  const scopes = parseScopes(payload.scopes);

  if (!organizationId || !organizationName || !apiVersion || !accessMode) return null;
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

export async function testUnonightReadOnlyConnection(
  input: UnonightLiveTestInput
): Promise<UnonightConnectionTestResult> {
  try {
    assertProductionUnonightToken(input.bearerToken);
  } catch {
    return {
      ok: false,
      code: "invalid_token",
      messageKey: getUnonightFailureMessageKey("invalid_token"),
      technicalReason: "placeholder blocked or missing",
    };
  }

  const requestedScopes = input.requestedScopes?.length
    ? input.requestedScopes
    : [...UNONIGHT_DEFAULT_SCOPES];
  const baseUrl = resolveUnonightApiBaseUrl(input.baseUrl);
  const url = buildUnonightConnectionUrl(baseUrl);
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
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const code = classifyUnonightHttpFailure({ error });
    return {
      ok: false,
      code,
      messageKey: getUnonightFailureMessageKey(code),
      technicalReason: "Live HTTP connection test failed",
    };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    const code = classifyUnonightHttpFailure({ status: response.status });
    return {
      ok: false,
      code,
      messageKey: getUnonightFailureMessageKey(code),
      technicalReason: `Non-JSON response (${response.status})`,
    };
  }

  if (!response.ok) {
    const code = classifyUnonightHttpFailure({ status: response.status, error: payload });
    return {
      ok: false,
      code,
      messageKey: getUnonightFailureMessageKey(code),
      technicalReason: `HTTP ${response.status}`,
    };
  }

  const contract = parseUnonightConnectionContract(payload);
  if (!contract) {
    return {
      ok: false,
      code: "malformed_response",
      messageKey: getUnonightFailureMessageKey("malformed_response"),
      technicalReason: "Connection contract validation failed",
    };
  }

  if (contract.access_mode !== "read_only") {
    return {
      ok: false,
      code: "missing_scope",
      messageKey: getUnonightFailureMessageKey("missing_scope"),
      technicalReason: "Read-only access mode required",
    };
  }

  const scopeGaps = missingScopes(contract.scopes, requestedScopes);
  if (scopeGaps.length > 0) {
    return {
      ok: false,
      code: "missing_scope",
      messageKey: getUnonightFailureMessageKey("missing_scope"),
      technicalReason: `Missing scopes: ${scopeGaps.join(", ")}`,
    };
  }

  if (
    input.expectedOrganizationId?.trim() &&
    contract.organization_id !== input.expectedOrganizationId.trim()
  ) {
    return {
      ok: false,
      code: "wrong_org",
      messageKey: getUnonightFailureMessageKey("wrong_org"),
      technicalReason: "Organization identity mismatch",
    };
  }

  if (!contract.api_version.startsWith("v")) {
    return {
      ok: false,
      code: "unsupported_api_version",
      messageKey: getUnonightFailureMessageKey("unsupported_api_version"),
      technicalReason: `Unsupported api_version ${contract.api_version}`,
    };
  }

  return {
    ok: true,
    contract,
    verifiedAt: new Date().toISOString(),
  };
}

export function requiresLiveHttpForSuccess(): true {
  return true;
}
