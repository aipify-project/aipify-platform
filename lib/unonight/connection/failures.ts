import type { UnonightConnectionFailureCode } from "./types";
import { normalizeUnonightFailureCode } from "./types";

const FAILURE_MESSAGE_KEYS: Record<UnonightConnectionFailureCode, string> = {
  invalid_token:
    "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
  revoked_token:
    "customerApp.portalStructure.integrations.unonightConnection.failures.expiredOrRevoked",
  credential_unavailable:
    "customerApp.portalStructure.integrations.unonightConnection.failures.credentialUnavailable",
  endpoint_unreachable:
    "customerApp.portalStructure.integrations.unonightConnection.failures.unreachable",
  unexpected_http_status:
    "customerApp.portalStructure.integrations.unonightConnection.failures.serverError",
  organization_mismatch:
    "customerApp.portalStructure.integrations.unonightConnection.failures.wrongOrg",
  missing_required_scope:
    "customerApp.portalStructure.integrations.unonightConnection.failures.missingScope",
  unsupported_response:
    "customerApp.portalStructure.integrations.unonightConnection.failures.malformedResponse",
  verification_record_failed:
    "customerApp.portalStructure.integrations.unonightConnection.failures.verificationRecordFailed",
  expired_or_revoked:
    "customerApp.portalStructure.integrations.unonightConnection.failures.expiredOrRevoked",
  wrong_org: "customerApp.portalStructure.integrations.unonightConnection.failures.wrongOrg",
  missing_scope:
    "customerApp.portalStructure.integrations.unonightConnection.failures.missingScope",
  unreachable: "customerApp.portalStructure.integrations.unonightConnection.failures.unreachable",
  timeout: "customerApp.portalStructure.integrations.unonightConnection.failures.timeout",
  bad_certificate:
    "customerApp.portalStructure.integrations.unonightConnection.failures.badCertificate",
  unsupported_api_version:
    "customerApp.portalStructure.integrations.unonightConnection.failures.unsupportedApiVersion",
  malformed_response:
    "customerApp.portalStructure.integrations.unonightConnection.failures.malformedResponse",
  server_error: "customerApp.portalStructure.integrations.unonightConnection.failures.serverError",
  placeholder_required:
    "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
  placeholder_not_configured:
    "customerApp.portalStructure.integrations.unonightConnection.failures.placeholderNotConfigured",
};

const ERROR_PANEL_PREFIX =
  "customerApp.portalStructure.integrations.unonightConnection.errorPanels";

export function getUnonightFailureMessageKey(code: UnonightConnectionFailureCode): string {
  const normalized = normalizeUnonightFailureCode(code);
  return FAILURE_MESSAGE_KEYS[normalized] ?? FAILURE_MESSAGE_KEYS.unsupported_response;
}

export function getUnonightFailureErrorPanelKey(
  code: UnonightConnectionFailureCode,
  field: "title" | "body"
): string {
  const normalized = normalizeUnonightFailureCode(code);
  const panelKeyMap: Partial<Record<UnonightConnectionFailureCode, string>> = {
    invalid_token: "invalidToken",
    revoked_token: "revokedToken",
    credential_unavailable: "credentialUnavailable",
    endpoint_unreachable: "unreachable",
    unexpected_http_status: "unexpectedHttpStatus",
    organization_mismatch: "organizationMismatch",
    missing_required_scope: "missingScope",
    unsupported_response: "unsupportedResponse",
    verification_record_failed: "verificationRecordFailed",
  };
  const panelKey = panelKeyMap[normalized] ?? "unsupportedResponse";
  return `${ERROR_PANEL_PREFIX}.${panelKey}.${field}`;
}

export function listUnonightFailureTranslationKeys(): string[] {
  const keys = new Set<string>(Object.values(FAILURE_MESSAGE_KEYS));
  for (const panel of [
    "invalidToken",
    "revokedToken",
    "credentialUnavailable",
    "unreachable",
    "unexpectedHttpStatus",
    "organizationMismatch",
    "missingScope",
    "unsupportedResponse",
    "verificationRecordFailed",
  ]) {
    keys.add(`${ERROR_PANEL_PREFIX}.${panel}.title`);
    keys.add(`${ERROR_PANEL_PREFIX}.${panel}.body`);
  }
  keys.add(`${ERROR_PANEL_PREFIX}.actions.retry`);
  keys.add(`${ERROR_PANEL_PREFIX}.actions.updateKey`);
  keys.add(`${ERROR_PANEL_PREFIX}.actions.openUnonightAdmin`);
  keys.add(`${ERROR_PANEL_PREFIX}.actions.backToIntegrations`);
  keys.add(`${ERROR_PANEL_PREFIX}.openUnonightAdminHref`);
  return [...keys];
}

function readErrorCode(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) return "";
  const record = payload as Record<string, unknown>;
  return String(record.error ?? record.code ?? "").trim().toLowerCase();
}

export function classifyUnonightHttpFailure(input: {
  status?: number;
  error?: unknown;
}): UnonightConnectionFailureCode {
  const message = String(input.error ?? "").toLowerCase();
  const bodyCode = readErrorCode(input.error);

  if (message.includes("timeout") || message.includes("aborted")) return "endpoint_unreachable";
  if (message.includes("certificate") || message.includes("cert")) return "endpoint_unreachable";
  if (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("enotfound")
  ) {
    return "endpoint_unreachable";
  }

  if (
    bodyCode === "auth_failed" ||
    bodyCode === "invalid_token" ||
    bodyCode === "unauthorized"
  ) {
    return "invalid_token";
  }
  if (bodyCode === "expired_or_revoked" || bodyCode === "revoked_token") {
    return "revoked_token";
  }

  const status = input.status ?? 0;
  if (status === 401) return "invalid_token";
  if (status === 403) return "revoked_token";
  if (status === 404) return "organization_mismatch";
  if (status === 408 || status === 504) return "endpoint_unreachable";
  if (status === 502 || status === 503) return "endpoint_unreachable";
  if (status >= 500) return "unexpected_http_status";
  if (status >= 400) return "unexpected_http_status";
  return "unsupported_response";
}
