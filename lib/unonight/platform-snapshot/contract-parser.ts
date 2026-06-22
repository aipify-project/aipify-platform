import { UNONIGHT_ORGANIZATION_SLUG, UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";
import {
  UNONIGHT_SNAPSHOT_DEFAULT_BASE_URL,
  UNONIGHT_SNAPSHOT_ENVIRONMENTS,
  UNONIGHT_SNAPSHOT_STATUSES,
  isSafeLocaleCode,
  isSafePublicModuleKey,
} from "./constants";

export type UnonightPlatformSnapshotParseFailureCode =
  | "response_not_json"
  | "unsupported_contract_version"
  | "malformed_organization"
  | "malformed_environment"
  | "malformed_platform"
  | "malformed_modules"
  | "malformed_locales"
  | "invalid_checked_at"
  | "availability_status_missing"
  | "availability_status_unknown"
  | "availability_status_invalid_type"
  | "status_unavailable"
  | "unsafe_payload"
  | "organization_mismatch";

export type UnonightPlatformSnapshotSuccess = {
  status: (typeof UNONIGHT_SNAPSHOT_STATUSES)[number];
  api_version: string;
  organization: {
    id: string;
    name: string;
    base_url: string;
  };
  platform: {
    environment: string;
    version: string;
    supported_locales: string[];
    active_modules: string[];
  };
  checked_at: string;
  compatibilityNotes: string[];
};

export type UnonightPlatformSnapshotParseResult =
  | { ok: true; snapshot: UnonightPlatformSnapshotSuccess }
  | { ok: false; code: UnonightPlatformSnapshotParseFailureCode; reason: string };

const FORBIDDEN_PAYLOAD_KEYS = new Set([
  "token",
  "secret",
  "password",
  "email",
  "user",
  "users",
  "member",
  "members",
  "statistics",
  "stats",
  "revenue",
  "orders",
  "payments",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function detectUnsafePayloadKeys(record: Record<string, unknown>): string[] {
  const unsafe: string[] = [];
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_PAYLOAD_KEYS.has(lower)) unsafe.push(key);
  }
  return unsafe;
}

/** Unwrap `{ data: ... }` envelopes without accepting arbitrary nesting. */
export function unwrapUnonightPlatformSnapshotPayload(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const data = payload.data;
  if (isRecord(data)) return data;
  const snapshot = payload.snapshot;
  if (isRecord(snapshot)) return snapshot;
  return payload;
}

function normalizeAvailabilityStatus(raw: unknown): UnonightPlatformSnapshotSuccess["status"] | null {
  if (typeof raw === "boolean") {
    return raw ? "available" : "degraded";
  }

  const value = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!value) return null;

  if (value === "available" || value === "online" || value === "operational" || value === "healthy" || value === "active") {
    return "available";
  }
  if (value === "degraded" || value === "partial" || value === "limited") {
    return "degraded";
  }
  if (value === "maintenance" || value === "down" || value === "offline") {
    return "maintenance";
  }
  return null;
}

function resolveAvailabilityStatusRaw(
  record: Record<string, unknown>,
  platformRaw: Record<string, unknown>,
): unknown {
  if (typeof record.is_available === "boolean") return record.is_available;
  if (typeof platformRaw.is_available === "boolean") return platformRaw.is_available;

  return (
    record.status ??
    record.availability_status ??
    record.production_status ??
    record.availability ??
    platformRaw.status ??
    platformRaw.availability ??
    platformRaw.platform_status ??
    platformRaw.operational_status
  );
}

function resolveApiVersion(record: Record<string, unknown>, platformRaw: Record<string, unknown> | null): string {
  const version = record.api_version ?? record.version ?? record.apiVersion ?? platformRaw?.api_version;
  const normalized = String(version ?? "v1").trim();
  return normalized || "v1";
}

function readOrganizationFields(record: Record<string, unknown>): {
  organizationId: string;
  organizationName: string;
  baseUrl: string;
} {
  const organization = record.organization;
  if (isRecord(organization)) {
    const organizationId = String(
      organization.id ?? organization.slug ?? organization.organization_id ?? "",
    ).trim();
    const organizationName = String(
      organization.name ?? organization.organization_name ?? "",
    ).trim();
    const baseUrl = String(
      organization.base_url ?? organization.baseUrl ?? record.base_url ?? UNONIGHT_SNAPSHOT_DEFAULT_BASE_URL,
    ).trim();
    return { organizationId, organizationName, baseUrl };
  }

  const organizationId = String(record.organization_id ?? record.organization_slug ?? "").trim();
  const organizationName = String(record.organization_name ?? "").trim();
  const baseUrl = String(record.base_url ?? UNONIGHT_SNAPSHOT_DEFAULT_BASE_URL).trim();
  return { organizationId, organizationName, baseUrl };
}

function resolvePlatformBlock(record: Record<string, unknown>): Record<string, unknown> {
  const platform = record.platform;
  if (isRecord(platform)) return platform;
  return record;
}

function moduleEntryEnabled(entry: Record<string, unknown>): boolean {
  if (entry.enabled === false || entry.active === false || entry.is_active === false) return false;
  if (entry.enabled === true || entry.active === true || entry.is_active === true) return true;
  const status = String(entry.status ?? "").trim().toLowerCase();
  if (status === "disabled" || status === "inactive" || status === "planned") return false;
  return true;
}

function parseModuleKey(entry: unknown): string | null {
  if (typeof entry === "string") {
    const trimmed = entry.trim().toLowerCase();
    return isSafePublicModuleKey(trimmed) ? trimmed : null;
  }
  if (!isRecord(entry)) return null;
  if (!moduleEntryEnabled(entry)) return null;
  const candidate = entry.key ?? entry.module_key ?? entry.id ?? entry.name ?? entry.module;
  if (typeof candidate !== "string") return null;
  const trimmed = candidate.trim().toLowerCase();
  return isSafePublicModuleKey(trimmed) ? trimmed : null;
}

function parseModuleMap(value: unknown): string[] {
  if (!isRecord(value)) return [];
  const modules = new Set<string>();
  for (const [key, enabled] of Object.entries(value)) {
    if (enabled === false) continue;
    const normalized = key.trim().toLowerCase();
    if (isSafePublicModuleKey(normalized)) modules.add(normalized);
  }
  return [...modules];
}

export function parseUnonightActiveModules(value: unknown): string[] {
  const modules = new Set<string>();
  if (Array.isArray(value)) {
    for (const entry of value) {
      const key = parseModuleKey(entry);
      if (key) modules.add(key);
    }
    return [...modules];
  }
  return parseModuleMap(value);
}

function resolveModules(record: Record<string, unknown>, platformRaw: Record<string, unknown>): string[] {
  const candidates = [
    platformRaw.active_modules,
    platformRaw.modules,
    record.active_modules,
    record.modules,
  ];
  for (const candidate of candidates) {
    const parsed = parseUnonightActiveModules(candidate);
    if (parsed.length > 0) return parsed;
  }
  return [];
}

function parseLocaleArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const locales = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const normalized = entry.trim().toLowerCase().split("-")[0];
    if (isSafeLocaleCode(normalized)) locales.add(normalized);
  }
  return [...locales];
}

function resolveSupportedLocales(
  record: Record<string, unknown>,
  platformRaw: Record<string, unknown>,
): string[] {
  const organization = record.organization;
  const organizationLocales =
    isRecord(organization) && Array.isArray(organization.supported_locales)
      ? organization.supported_locales
      : null;

  const candidates = [
    platformRaw.supported_locales,
    platformRaw.locales,
    platformRaw.supportedLanguages,
    platformRaw.supported_languages,
    platformRaw.languages,
    record.supported_locales,
    record.locales,
    record.supported_languages,
    record.languages,
    organizationLocales,
  ];
  for (const candidate of candidates) {
    const parsed = parseLocaleArray(candidate);
    if (parsed.length > 0) return parsed;
  }
  return [];
}

function resolveEnvironment(
  record: Record<string, unknown>,
  platformRaw: Record<string, unknown>,
): string | null {
  const raw = String(
    platformRaw.environment ?? record.environment ?? record.deployment_environment ?? "",
  )
    .trim()
    .toLowerCase();
  if (!raw) return null;
  if ((UNONIGHT_SNAPSHOT_ENVIRONMENTS as readonly string[]).includes(raw)) return raw;
  if (raw === "prod") return "production";
  if (raw === "stage") return "staging";
  return null;
}

function resolvePlatformVersion(
  record: Record<string, unknown>,
  platformRaw: Record<string, unknown>,
): string {
  const version = String(
    platformRaw.version ??
      platformRaw.platform_version ??
      record.platform_version ??
      record.version ??
      "",
  ).trim();
  return version || "unknown";
}

function resolveCheckedAt(record: Record<string, unknown>, platformRaw: Record<string, unknown>): string | null {
  const raw = String(
    record.checked_at ?? record.checkedAt ?? platformRaw.checked_at ?? platformRaw.timestamp ?? "",
  ).trim();
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function organizationMatchesUnonightSnapshot(input: {
  organizationId: string;
  expectedOrganizationSlug?: string | null;
}): boolean {
  const expectedSlug = (input.expectedOrganizationSlug ?? UNONIGHT_ORGANIZATION_SLUG).trim().toLowerCase();
  const organizationId = input.organizationId.trim().toLowerCase();
  if (!organizationId) return false;
  if (organizationId === expectedSlug) return true;
  if (!isUuid(organizationId) && organizationId === UNONIGHT_ORGANIZATION_SLUG) return true;
  return false;
}

export function parseUnonightPlatformSnapshotDetailed(payload: unknown): UnonightPlatformSnapshotParseResult {
  const record = unwrapUnonightPlatformSnapshotPayload(payload);
  if (!record) {
    return { ok: false, code: "response_not_json", reason: "Response was not JSON object" };
  }

  const unsafeKeys = detectUnsafePayloadKeys(record);
  if (unsafeKeys.length > 0) {
    return {
      ok: false,
      code: "unsafe_payload",
      reason: `Forbidden payload keys: ${unsafeKeys.join(", ")}`,
    };
  }

  const compatibilityNotes: string[] = [];
  if (isRecord((payload as Record<string, unknown>)?.data)) compatibilityNotes.push("data_wrapper");
  if (isRecord((payload as Record<string, unknown>)?.snapshot)) compatibilityNotes.push("snapshot_wrapper");

  const platformRaw = resolvePlatformBlock(record);
  const availabilityRaw = resolveAvailabilityStatusRaw(record, platformRaw);

  if (availabilityRaw === undefined || availabilityRaw === null) {
    return {
      ok: false,
      code: "availability_status_missing",
      reason: "Missing availability status field",
    };
  }

  if (
    typeof availabilityRaw !== "string" &&
    typeof availabilityRaw !== "boolean" &&
    typeof availabilityRaw !== "number"
  ) {
    return {
      ok: false,
      code: "availability_status_invalid_type",
      reason: "Availability status field has invalid type",
    };
  }

  const status = normalizeAvailabilityStatus(availabilityRaw);
  if (!status) {
    return {
      ok: false,
      code: "availability_status_unknown",
      reason: "Unrecognized availability status value",
    };
  }
  if (!record.status && (record.availability || platformRaw.availability)) {
    compatibilityNotes.push("availability_alias");
  }

  const apiVersion = resolveApiVersion(record, isRecord(record.platform) ? record.platform : null);
  if (!apiVersion.startsWith("v")) {
    return {
      ok: false,
      code: "unsupported_contract_version",
      reason: `Unsupported api_version ${apiVersion}`,
    };
  }
  if (!record.api_version && (record.version || record.apiVersion)) {
    compatibilityNotes.push("version_alias");
  }

  const { organizationId, organizationName, baseUrl } = readOrganizationFields(record);
  if (!organizationId || !organizationName) {
    return { ok: false, code: "malformed_organization", reason: "Organization id and name are required" };
  }
  if (!baseUrl.startsWith("https://")) {
    return { ok: false, code: "malformed_organization", reason: "Organization base_url must be https" };
  }
  if (!record.organization && (record.organization_id || record.organization_name)) {
    compatibilityNotes.push("flat_organization");
  }
  if (isRecord(record.organization) && !record.organization.base_url && !record.organization.baseUrl) {
    compatibilityNotes.push("default_base_url");
  }

  const environment = resolveEnvironment(record, platformRaw);
  if (!environment) {
    return { ok: false, code: "malformed_environment", reason: "Missing or unrecognized environment" };
  }

  const platformVersion = resolvePlatformVersion(record, platformRaw);
  const activeModules = resolveModules(record, platformRaw);
  if (activeModules.length === 0) {
    return { ok: false, code: "malformed_modules", reason: "No active public modules reported" };
  }
  if (!platformRaw.active_modules && (platformRaw.modules || record.modules)) {
    compatibilityNotes.push("modules_alias");
  }

  const supportedLocales = resolveSupportedLocales(record, platformRaw);
  const localesFieldPresent = [
    platformRaw.supported_locales,
    platformRaw.locales,
    platformRaw.supportedLanguages,
    platformRaw.supported_languages,
    platformRaw.languages,
    record.supported_locales,
    record.locales,
    record.supported_languages,
    record.languages,
    isRecord(record.organization) ? record.organization.supported_locales : null,
  ].some((candidate) => candidate !== undefined && candidate !== null);

  if (localesFieldPresent) {
    if (supportedLocales.length === 0) {
      return { ok: false, code: "malformed_locales", reason: "Supported locales field was present but invalid" };
    }
    if (!platformRaw.supported_locales && (platformRaw.locales || record.locales || record.languages)) {
      compatibilityNotes.push("locales_alias");
    }
  } else {
    compatibilityNotes.push("locales_missing");
  }

  let checkedAt = resolveCheckedAt(record, platformRaw);
  if (!checkedAt) {
    checkedAt = new Date().toISOString();
    compatibilityNotes.push("generated_checked_at");
  }

  const provider = String(record.provider ?? record.provider_key ?? UNONIGHT_PROVIDER_KEY).trim();
  if (provider && provider !== UNONIGHT_PROVIDER_KEY) {
    return { ok: false, code: "malformed_organization", reason: `Unexpected provider ${provider}` };
  }

  if (!isRecord(record.platform)) {
    compatibilityNotes.push("flat_platform_fields");
  }

  return {
    ok: true,
    snapshot: {
      status,
      api_version: apiVersion,
      organization: {
        id: organizationId,
        name: organizationName,
        base_url: baseUrl,
      },
      platform: {
        environment,
        version: platformVersion,
        supported_locales: supportedLocales,
        active_modules: activeModules,
      },
      checked_at: checkedAt,
      compatibilityNotes,
    },
  };
}
