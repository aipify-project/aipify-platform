/**
 * UNONIGHT_API_INTEGRATION_V1 — FROZEN (PRODUCTION_VERIFIED)
 * See UNONIGHT_API_INTEGRATION_V1.md — change policy: DEFECT_OR_APPROVED_REQUIREMENT_ONLY
 */
import {
  UNONIGHT_PROVIDER_KEY,
} from "./constants";
import type { UnonightAccessMode, UnonightConnectionSuccess } from "./types";

export type UnonightContractParseFailureCode =
  | "response_not_json"
  | "provider_mismatch"
  | "malformed_organization"
  | "read_only_flag_missing"
  | "malformed_scopes"
  | "unsupported_contract_version"
  | "connection_not_established";

export type UnonightContractParseResult =
  | {
      ok: true;
      contract: UnonightConnectionSuccess;
      compatibilityNotes: string[];
    }
  | {
      ok: false;
      code: UnonightContractParseFailureCode;
      reason: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/** Unwrap common `{ data: ... }` envelopes without accepting arbitrary nesting. */
export function unwrapUnonightConnectionPayload(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const data = payload.data;
  if (isRecord(data)) return data;
  return payload;
}

function parseScopeEntry(entry: unknown): string | null {
  if (typeof entry === "string" && entry.trim()) return entry.trim();
  if (!isRecord(entry)) return null;
  const candidate = entry.scope ?? entry.key ?? entry.name ?? entry.id;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

export function parseUnonightScopes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const scopes: string[] = [];
  for (const entry of value) {
    const parsed = parseScopeEntry(entry);
    if (parsed) scopes.push(parsed);
  }
  return scopes;
}

function isConnectedPayload(payload: Record<string, unknown>): boolean {
  if (payload.connected === true || payload.ok === true) return true;
  const status = String(payload.status ?? "").trim().toLowerCase();
  return status === "connected" || status === "active" || status === "verified";
}

function resolveAccessMode(payload: Record<string, unknown>): UnonightAccessMode | null {
  const fromField = payload.access_mode;
  if (fromField === "read_only" || fromField === "read_write") return fromField;
  if (fromField === "readonly") return "read_only";

  if (payload.read_only === true || payload.readOnly === true) return "read_only";
  if (payload.read_only === false || payload.readOnly === false) return "read_write";

  const capabilities = payload.capabilities;
  if (isRecord(capabilities)) {
    const mode = capabilities.mode ?? capabilities.access_mode;
    if (mode === "read_only" || mode === "readonly") return "read_only";
    if (mode === "read_write") return "read_write";
  }

  if (isConnectedPayload(payload) && payload.read_only !== false) {
    return "read_only";
  }

  return null;
}

function resolveApiVersion(payload: Record<string, unknown>): string {
  const version = payload.api_version ?? payload.version ?? payload.apiVersion;
  const normalized = String(version ?? "v1").trim();
  return normalized || "v1";
}

function readOrganizationFields(payload: Record<string, unknown>): {
  organizationId: string;
  organizationName: string;
  organizationSlug: string | null;
} {
  const organization = payload.organization;
  if (isRecord(organization)) {
    const organizationId = String(
      organization.id ?? organization.organization_id ?? ""
    ).trim();
    const organizationName = String(
      organization.name ?? organization.organization_name ?? ""
    ).trim();
    const organizationSlug = String(organization.slug ?? "").trim() || null;
    if (organizationId || organizationName) {
      return {
        organizationId,
        organizationName,
        organizationSlug: organizationSlug ?? (!isUuid(organizationId) ? organizationId : null),
      };
    }
  }

  const organizationId = String(payload.organization_id ?? "").trim();
  const organizationName = String(payload.organization_name ?? "").trim();
  const organizationSlug = String(payload.organization_slug ?? "").trim() || null;

  return {
    organizationId,
    organizationName,
    organizationSlug: organizationSlug ?? (!isUuid(organizationId) ? organizationId : null),
  };
}

function resolveProvider(payload: Record<string, unknown>): string {
  return String(payload.provider ?? payload.provider_key ?? UNONIGHT_PROVIDER_KEY).trim();
}

/**
 * Unonight production may omit integration.status.read even though GET /connection
 * proves read-only integration status is available.
 */
export function normalizeUnonightGrantedScopes(
  payload: Record<string, unknown>,
  scopes: string[]
): { scopes: string[]; compatibilityNotes: string[] } {
  const notes: string[] = [];
  const granted = new Set(scopes.map((scope) => scope.toLowerCase()));
  const normalized = [...scopes];

  if (
    isConnectedPayload(payload) &&
    resolveAccessMode(payload) === "read_only" &&
    granted.has("metadata.read") &&
    granted.has("organization.read") &&
    !granted.has("integration.status.read")
  ) {
    normalized.push("integration.status.read");
    notes.push("implicit_integration_status_read");
  }

  return { scopes: [...new Set(normalized)], compatibilityNotes: notes };
}

export function parseUnonightConnectionContractDetailed(
  payload: unknown
): UnonightContractParseResult {
  const record = unwrapUnonightConnectionPayload(payload);
  if (!record) {
    return { ok: false, code: "response_not_json", reason: "Response is not a JSON object" };
  }

  if (!isConnectedPayload(record)) {
    return {
      ok: false,
      code: "connection_not_established",
      reason: "Missing connected signal (connected, ok, or status=connected)",
    };
  }

  const provider = resolveProvider(record);
  if (provider && provider !== UNONIGHT_PROVIDER_KEY) {
    return {
      ok: false,
      code: "provider_mismatch",
      reason: `Unexpected provider ${provider}`,
    };
  }

  const { organizationId, organizationName, organizationSlug } = readOrganizationFields(record);
  if (!organizationId || !organizationName) {
    return {
      ok: false,
      code: "malformed_organization",
      reason: "Organization id and name are required",
    };
  }

  const accessMode = resolveAccessMode(record);
  if (!accessMode) {
    return {
      ok: false,
      code: "read_only_flag_missing",
      reason: "Read-only access mode could not be determined",
    };
  }

  const parsedScopes = parseUnonightScopes(record.scopes);
  if (record.scopes !== undefined && !Array.isArray(record.scopes)) {
    return { ok: false, code: "malformed_scopes", reason: "Scopes must be an array" };
  }

  const { scopes, compatibilityNotes: scopeNotes } = normalizeUnonightGrantedScopes(
    record,
    parsedScopes
  );

  const apiVersion = resolveApiVersion(record);
  if (!apiVersion.startsWith("v")) {
    return {
      ok: false,
      code: "unsupported_contract_version",
      reason: `Unsupported api version ${apiVersion}`,
    };
  }

  const compatibilityNotes = [...scopeNotes];
  if (record.read_only === true && !record.access_mode) {
    compatibilityNotes.push("read_only_boolean");
  }
  if (record.status === "connected" && record.connected !== true && record.ok !== true) {
    compatibilityNotes.push("status_connected");
  }
  if (isRecord(record.data)) {
    compatibilityNotes.push("data_wrapper");
  }
  if (record.version && !record.api_version) {
    compatibilityNotes.push("version_alias");
  }

  return {
    ok: true,
    contract: {
      connected: true,
      provider: "unonight",
      organization_id: organizationId,
      organization_name: organizationName,
      organization_slug: organizationSlug,
      access_mode: accessMode,
      scopes,
      api_version: apiVersion,
    },
    compatibilityNotes,
  };
}

export function parseUnonightConnectionContract(payload: unknown): UnonightConnectionSuccess | null {
  const parsed = parseUnonightConnectionContractDetailed(payload);
  return parsed.ok ? parsed.contract : null;
}

export function organizationsMatchForUnonight(input: {
  contract: UnonightConnectionSuccess;
  expectedOrganizationId?: string | null;
  expectedOrganizationSlug?: string | null;
}): boolean {
  const expectedId = input.expectedOrganizationId?.trim();
  if (!expectedId) return true;

  if (input.contract.organization_id === expectedId) return true;

  const expectedSlug = input.expectedOrganizationSlug?.trim().toLowerCase();
  const responseSlug = (
    input.contract.organization_slug ??
    (!isUuid(input.contract.organization_id) ? input.contract.organization_id : null)
  )?.toLowerCase();

  if (expectedSlug && responseSlug && expectedSlug === responseSlug) return true;

  // Dedicated Unonight tenant uses slug id in the live API response.
  if (
    input.contract.provider === "unonight" &&
    responseSlug === "unonight" &&
    expectedSlug === "unonight"
  ) {
    return true;
  }

  return false;
}
