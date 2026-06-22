import type { UnonightAipifyScope } from "./constants";

export type UnonightAipifyTokenRecord = {
  id: string;
  token_name: string;
  token_prefix: string;
  scopes: UnonightAipifyScope[] | string[];
  access_mode: "read_only";
  status: "active" | "revoked" | "rotated";
  last_used_at: string | null;
  copied_at: string | null;
  revoked_at: string | null;
  rotated_at: string | null;
  created_at: string;
};

export type UnonightAipifyTokenListResponse = {
  tokens: UnonightAipifyTokenRecord[];
  default_scopes: string[];
};

export type UnonightAipifyTokenRevealResponse = {
  id: string;
  token_name: string;
  token: string;
  scopes: string[];
  access_mode: "read_only";
  status: "active";
  created_at: string;
  previous_token_id?: string;
};

export type UnonightAipifyConnectionResponse = {
  connected: true;
  provider: "unonight";
  organization_id: string;
  organization_name: string;
  access_mode: "read_only";
  scopes: string[];
  api_version: string;
};

export type UnonightAipifyConnectionErrorCode =
  | "invalid_token"
  | "expired_or_revoked"
  | "rate_limited"
  | "server_error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseUnonightAipifyTokenList(payload: unknown): UnonightAipifyTokenListResponse | null {
  if (!isRecord(payload)) return null;
  const tokens = Array.isArray(payload.tokens) ? payload.tokens : [];
  const defaultScopes = Array.isArray(payload.default_scopes)
    ? payload.default_scopes.filter((s): s is string => typeof s === "string")
    : [];
  return {
    tokens: tokens
      .filter(isRecord)
      .map((row) => ({
        id: String(row.id ?? ""),
        token_name: String(row.token_name ?? ""),
        token_prefix: String(row.token_prefix ?? "uno_aipify_"),
        scopes: Array.isArray(row.scopes)
          ? row.scopes.filter((s): s is string => typeof s === "string")
          : [],
        access_mode: "read_only" as const,
        status: (row.status as UnonightAipifyTokenRecord["status"]) ?? "active",
        last_used_at: row.last_used_at ? String(row.last_used_at) : null,
        copied_at: row.copied_at ? String(row.copied_at) : null,
        revoked_at: row.revoked_at ? String(row.revoked_at) : null,
        rotated_at: row.rotated_at ? String(row.rotated_at) : null,
        created_at: String(row.created_at ?? ""),
      }))
      .filter((row) => row.id.length > 0),
    default_scopes: defaultScopes,
  };
}

export function parseUnonightAipifyTokenReveal(payload: unknown): UnonightAipifyTokenRevealResponse | null {
  if (!isRecord(payload)) return null;
  const token = typeof payload.token === "string" ? payload.token : "";
  if (!token) return null;
  return {
    id: String(payload.id ?? ""),
    token_name: String(payload.token_name ?? ""),
    token,
    scopes: Array.isArray(payload.scopes)
      ? payload.scopes.filter((s): s is string => typeof s === "string")
      : [],
    access_mode: "read_only",
    status: "active",
    created_at: String(payload.created_at ?? ""),
    previous_token_id:
      typeof payload.previous_token_id === "string" ? payload.previous_token_id : undefined,
  };
}
