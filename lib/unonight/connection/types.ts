import type { UnonightConnectionScope } from "./constants";
import type { UnonightConnectionDiagnostics } from "./diagnostics";

export type UnonightAccessMode = "read_only" | "read_write";

export type UnonightConnectionSuccess = {
  connected: true;
  provider: "unonight";
  organization_id: string;
  organization_name: string;
  access_mode: UnonightAccessMode;
  scopes: string[];
  api_version: string;
};

/** Customer-safe failure codes returned by the live connection test pipeline. */
export type UnonightConnectionFailureCode =
  | "invalid_token"
  | "revoked_token"
  | "credential_unavailable"
  | "endpoint_unreachable"
  | "unexpected_http_status"
  | "organization_mismatch"
  | "missing_required_scope"
  | "unsupported_response"
  | "verification_record_failed"
  | "expired_or_revoked"
  | "wrong_org"
  | "missing_scope"
  | "unreachable"
  | "timeout"
  | "bad_certificate"
  | "unsupported_api_version"
  | "malformed_response"
  | "server_error"
  | "placeholder_required"
  | "placeholder_not_configured";

export type UnonightConnectionTestFailure = {
  ok: false;
  code: UnonightConnectionFailureCode;
  messageKey: string;
  technicalReason: string;
  diagnostics: UnonightConnectionDiagnostics;
};

export type UnonightConnectionTestResult =
  | { ok: true; contract: UnonightConnectionSuccess; verifiedAt: string; diagnostics: UnonightConnectionDiagnostics }
  | UnonightConnectionTestFailure;

export type UnonightConnectionConfig = {
  base_url?: string;
  connection_name?: string;
  expected_organization_id?: string;
  requested_scopes?: UnonightConnectionScope[];
  last_verification?: UnonightConnectionSuccess | null;
  last_verified_at?: string | null;
};

export function normalizeUnonightFailureCode(
  code: UnonightConnectionFailureCode
): UnonightConnectionFailureCode {
  switch (code) {
    case "expired_or_revoked":
      return "revoked_token";
    case "wrong_org":
      return "organization_mismatch";
    case "missing_scope":
      return "missing_required_scope";
    case "unreachable":
    case "timeout":
    case "bad_certificate":
      return "endpoint_unreachable";
    case "malformed_response":
    case "unsupported_api_version":
      return "unsupported_response";
    case "server_error":
      return "unexpected_http_status";
    default:
      return code;
  }
}
