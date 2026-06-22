import { isUnonightAipifyTokenFormat } from "@/lib/unonight-platform/constants";
import {
  UNONIGHT_CONNECTION_TIMEOUT_MS,
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_ORGANIZATION_SLUG,
  UNONIGHT_PROVIDER_KEY,
  buildUnonightConnectionUrl,
  resolveUnonightApiBaseUrl,
} from "./constants";
import {
  organizationsMatchForUnonight,
  parseUnonightConnectionContractDetailed,
} from "./contract-parser";
import type { UnonightContractParseFailureCode } from "./contract-parser";
import {
  buildUnonightConnectionDiagnostics,
  extractSafeResponseCode,
  extractSafeResponseShape,
} from "./diagnostics";
import { classifyUnonightHttpFailure, getUnonightFailureMessageKey } from "./failures";
import { assertProductionUnonightToken } from "./placeholders";
import type {
  UnonightConnectionTestResult,
  UnonightConnectionFailureCode,
} from "./types";
import { normalizeUnonightFailureCode } from "./types";

export type UnonightLiveTestInput = {
  bearerToken: string;
  baseUrl?: string | null;
  requestedScopes?: readonly string[];
  expectedOrganizationId?: string | null;
  expectedOrganizationSlug?: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  credentialFound?: boolean;
};

function missingScopes(
  granted: readonly string[],
  required: readonly string[]
): string[] {
  const grantedSet = new Set(granted.map((scope) => scope.toLowerCase()));
  return required.filter((scope) => !grantedSet.has(scope.toLowerCase()));
}

function mapContractParseFailure(code: UnonightContractParseFailureCode): UnonightConnectionFailureCode {
  switch (code) {
    case "provider_mismatch":
      return "provider_mismatch";
    case "malformed_organization":
      return "malformed_organization";
    case "read_only_flag_missing":
      return "read_only_flag_missing";
    case "malformed_scopes":
      return "malformed_scopes";
    case "unsupported_contract_version":
      return "unsupported_contract_version";
    case "response_not_json":
      return "response_not_json";
    case "connection_not_established":
      return "connection_not_established";
    default:
      return "unsupported_response";
  }
}

function buildFailure(
  code: UnonightConnectionFailureCode,
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
  const expectedOrganizationSlug =
    input.expectedOrganizationSlug?.trim() || UNONIGHT_ORGANIZATION_SLUG;

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
  } catch {
    const code = classifyUnonightHttpFailure({ error: new Error("fetch failed") });
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
      mapContractParseFailure("response_not_json"),
      `Non-JSON response (${response.status})`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode: "non_json",
      })
    );
  }

  const safeResponseCode = extractSafeResponseCode(payload);
  const safeResponseShape = extractSafeResponseShape(payload);

  if (!response.ok) {
    const code = classifyUnonightHttpFailure({ status: response.status, error: payload });
    return buildFailure(
      code,
      `HTTP ${response.status}`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        responseShape: safeResponseShape,
      })
    );
  }

  const parsed = parseUnonightConnectionContractDetailed(payload);
  if (!parsed.ok) {
    const failureCode = mapContractParseFailure(parsed.code);
    return buildFailure(
      failureCode,
      parsed.reason,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        responseShape: safeResponseShape,
        schemaMatched: false,
        contractMismatchCode: parsed.code,
      })
    );
  }

  const contract = parsed.contract;
  if (parsed.compatibilityNotes.length > 0) {
    // Safe server-side breadcrumb for operators — never includes secrets.
    console.info(
      "[unonight-connection] compatibility normalization",
      parsed.compatibilityNotes.join(",")
    );
  }

  if (contract.access_mode !== "read_only") {
    return buildFailure(
      "read_only_flag_missing",
      "Read-only access mode required",
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        responseShape: safeResponseShape,
        schemaMatched: true,
        requiredScopesMatched: false,
        contractMismatchCode: "read_only_flag_missing",
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
        responseShape: safeResponseShape,
        schemaMatched: true,
        requiredScopesMatched: false,
        contractMismatchCode: "malformed_scopes",
      })
    );
  }

  const organizationMatched = organizationsMatchForUnonight({
    contract,
    expectedOrganizationId: input.expectedOrganizationId,
    expectedOrganizationSlug,
  });

  if (!organizationMatched) {
    return buildFailure(
      "organization_mismatch",
      "Organization identity mismatch",
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        responseShape: safeResponseShape,
        schemaMatched: true,
        organizationMatched: false,
        requiredScopesMatched: true,
        contractMismatchCode: "malformed_organization",
      })
    );
  }

  if (!contract.api_version.startsWith("v")) {
    return buildFailure(
      "unsupported_contract_version",
      `Unsupported api_version ${contract.api_version}`,
      baseDiagnostics({
        authorizationAttached: true,
        httpStatus: response.status,
        safeResponseCode,
        responseShape: safeResponseShape,
        schemaMatched: false,
        organizationMatched: true,
        requiredScopesMatched: true,
        contractMismatchCode: "unsupported_contract_version",
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
      responseShape: safeResponseShape,
      schemaMatched: true,
      organizationMatched: true,
      requiredScopesMatched: true,
      compatibilityNotes: parsed.compatibilityNotes,
    }),
  };
}

export { parseUnonightConnectionContract } from "./contract-parser";

export function requiresLiveHttpForSuccess(): true {
  return true;
}
