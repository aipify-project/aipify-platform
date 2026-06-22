import type { UnonightConnectionFailureCode } from "./types";

const FAILURE_MESSAGE_KEYS: Record<UnonightConnectionFailureCode, string> = {
  invalid_token: "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
  expired_or_revoked: "customerApp.portalStructure.integrations.unonightConnection.failures.expiredOrRevoked",
  wrong_org: "customerApp.portalStructure.integrations.unonightConnection.failures.wrongOrg",
  missing_scope: "customerApp.portalStructure.integrations.unonightConnection.failures.missingScope",
  unreachable: "customerApp.portalStructure.integrations.unonightConnection.failures.unreachable",
  timeout: "customerApp.portalStructure.integrations.unonightConnection.failures.timeout",
  bad_certificate: "customerApp.portalStructure.integrations.unonightConnection.failures.badCertificate",
  unsupported_api_version:
    "customerApp.portalStructure.integrations.unonightConnection.failures.unsupportedApiVersion",
  malformed_response: "customerApp.portalStructure.integrations.unonightConnection.failures.malformedResponse",
  server_error: "customerApp.portalStructure.integrations.unonightConnection.failures.serverError",
  placeholder_required: "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
  placeholder_not_configured:
    "customerApp.portalStructure.integrations.unonightConnection.failures.placeholderNotConfigured",
};

export function getUnonightFailureMessageKey(code: UnonightConnectionFailureCode): string {
  return FAILURE_MESSAGE_KEYS[code];
}

export function classifyUnonightHttpFailure(input: {
  status?: number;
  error?: unknown;
}): UnonightConnectionFailureCode {
  const message = String(input.error ?? "").toLowerCase();
  if (message.includes("timeout") || message.includes("aborted")) return "timeout";
  if (message.includes("certificate") || message.includes("cert")) return "bad_certificate";
  if (message.includes("fetch failed") || message.includes("econnrefused") || message.includes("enotfound")) {
    return "unreachable";
  }

  const status = input.status ?? 0;
  if (status === 401) return "invalid_token";
  if (status === 403) return "expired_or_revoked";
  if (status === 403) return "missing_scope";
  if (status === 404) return "wrong_org";
  if (status === 408 || status === 504) return "timeout";
  if (status === 502 || status === 503) return "unreachable";
  if (status >= 500) return "server_error";
  return "malformed_response";
}
