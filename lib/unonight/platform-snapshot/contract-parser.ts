export type UnonightPlatformSnapshotParseFailureCode =
  | "response_not_json"
  | "status_unavailable"
  | "malformed_organization"
  | "malformed_platform"
  | "malformed_modules"
  | "unsupported_contract_version";

export type UnonightPlatformSnapshotSuccess = {
  status: "available" | "degraded" | "maintenance";
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
};

export type UnonightPlatformSnapshotParseResult =
  | { ok: true; snapshot: UnonightPlatformSnapshotSuccess }
  | { ok: false; code: UnonightPlatformSnapshotParseFailureCode; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function unwrapUnonightPlatformSnapshotPayload(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const data = payload.data;
  if (isRecord(data)) return data;
  return payload;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

export function parseUnonightPlatformSnapshotDetailed(payload: unknown): UnonightPlatformSnapshotParseResult {
  const record = unwrapUnonightPlatformSnapshotPayload(payload);
  if (!record) {
    return { ok: false, code: "response_not_json", reason: "Response was not JSON object" };
  }

  const statusRaw = String(record.status ?? "").trim().toLowerCase();
  const status =
    statusRaw === "available" || statusRaw === "degraded" || statusRaw === "maintenance"
      ? statusRaw
      : null;
  if (!status) {
    return { ok: false, code: "status_unavailable", reason: "Missing or invalid status" };
  }

  const apiVersion = String(record.api_version ?? "").trim();
  if (!apiVersion) {
    return { ok: false, code: "unsupported_contract_version", reason: "Missing api_version" };
  }

  const organizationRaw = record.organization;
  if (!isRecord(organizationRaw)) {
    return { ok: false, code: "malformed_organization", reason: "Missing organization block" };
  }

  const organizationId = String(organizationRaw.id ?? "").trim();
  const organizationName = String(organizationRaw.name ?? "").trim();
  const baseUrl = String(organizationRaw.base_url ?? "").trim();
  if (!organizationId || !organizationName || !baseUrl) {
    return { ok: false, code: "malformed_organization", reason: "Incomplete organization block" };
  }

  const platformRaw = record.platform;
  if (!isRecord(platformRaw)) {
    return { ok: false, code: "malformed_platform", reason: "Missing platform block" };
  }

  const environment = String(platformRaw.environment ?? "").trim();
  const version = String(platformRaw.version ?? "").trim();
  const supportedLocales = parseStringArray(platformRaw.supported_locales);
  const activeModules = parseStringArray(platformRaw.active_modules);

  if (!environment || !version) {
    return { ok: false, code: "malformed_platform", reason: "Incomplete platform block" };
  }

  if (activeModules.length === 0) {
    return { ok: false, code: "malformed_modules", reason: "No active modules reported" };
  }

  const checkedAt = String(record.checked_at ?? "").trim();
  if (!checkedAt) {
    return { ok: false, code: "malformed_platform", reason: "Missing checked_at" };
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
        version,
        supported_locales: supportedLocales,
        active_modules: activeModules,
      },
      checked_at: checkedAt,
    },
  };
}
