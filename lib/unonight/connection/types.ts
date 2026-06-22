import type { UnonightConnectionScope } from "./constants";

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

export type UnonightConnectionFailureCode =
  | "invalid_token"
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

export type UnonightConnectionTestResult =
  | { ok: true; contract: UnonightConnectionSuccess; verifiedAt: string }
  | { ok: false; code: UnonightConnectionFailureCode; messageKey: string; technicalReason: string };

export type UnonightConnectionConfig = {
  base_url?: string;
  connection_name?: string;
  expected_organization_id?: string;
  requested_scopes?: UnonightConnectionScope[];
  last_verification?: UnonightConnectionSuccess | null;
  last_verified_at?: string | null;
};
