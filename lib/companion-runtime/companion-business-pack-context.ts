import type { BusinessPackActivationStatus } from "@/lib/business-pack-activation-gate";
import type { ModulesCenter } from "@/lib/commercial-packages/types";
import { parseModulesCenter } from "@/lib/commercial-packages/parse";
import type { BusinessPackRuntimeCenter } from "@/lib/business-pack-runtime-engine/parse";
import { parseBusinessPackRuntimeCenter } from "@/lib/business-pack-runtime-engine/parse";
import { listRegisteredIntegrationProviders } from "@/lib/integration-intelligence/manifest-registry";

export type PackFreshness = "unknown" | "fresh" | "stale";
export type PackActivationExposure = BusinessPackActivationStatus | "active" | "inactive";

export type CompanionCapabilityRef = {
  capability_id: string;
  entity: string;
  operation: "read" | "write" | "unknown";
  access_mode: "read" | "write";
  permission: string | null;
  source_provider: string | null;
  pack_key: string;
};

export type CompanionBusinessPackContext = {
  pack_key: string;
  status: "active" | "inactive" | "suspended" | "pending" | "failed";
  entitlement_status: "active" | "trial" | "missing" | "suspended";
  enabled_modules: string[];
  capabilities: CompanionCapabilityRef[];
  entities: string[];
  read_boundaries: string[];
  write_boundaries: string[];
  required_permissions: string[];
  provider_dependencies: string[];
  activation_state: PackActivationExposure;
  source: "business_pack_runtime" | "marketplace" | "license";
  freshness: PackFreshness;
};

export type CompanionBusinessPackCollection = {
  packs: CompanionBusinessPackContext[];
  entitledCapabilities: CompanionCapabilityRef[];
  enabledModules: string[];
  permissionDenied: boolean;
  appEntitlementBlocked: boolean;
  lastUpdatedAt: string | null;
};

const BLOCKING_GATE_STATUSES = new Set<BusinessPackActivationStatus>([
  "pending_activation",
  "validating",
  "activation_failed",
  "suspended",
  "removed",
]);

const FRESH_MS = 24 * 60 * 60 * 1000;
const STALE_MS = 72 * 60 * 60 * 1000;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  const normalized = subscriptionStatus.toLowerCase();
  return ["paused", "cancelled", "suspended", "inactive"].includes(normalized);
}

function inferOperation(capabilityKey: string): "read" | "write" | "unknown" {
  const lower = capabilityKey.toLowerCase();
  if (
    lower.includes(".write") ||
    lower.includes("_write") ||
    lower.includes(".manage") ||
    lower.includes("_manage") ||
    lower.includes(".create") ||
    lower.includes("_create")
  ) {
    return "write";
  }
  if (
    lower.includes(".read") ||
    lower.includes("_read") ||
    lower.includes(".view") ||
    lower.includes("_view") ||
    lower.includes(".list") ||
    lower.includes("_list")
  ) {
    return "read";
  }
  return "unknown";
}

function inferPermission(capabilityKey: string): string | null {
  const parts = capabilityKey.split(".").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]}.${parts[1]}`;
  }
  return null;
}

function resolveFreshness(timestamp: string | null): PackFreshness {
  if (!timestamp) return "unknown";
  const ageMs = Date.now() - Date.parse(timestamp);
  if (!Number.isFinite(ageMs) || ageMs < 0) return "unknown";
  if (ageMs <= FRESH_MS) return "fresh";
  if (ageMs <= STALE_MS) return "stale";
  return "stale";
}

function parseProviderDependencies(manifestRef: string): string[] {
  const ref = manifestRef.trim();
  if (!ref) return [];
  const providers = listRegisteredIntegrationProviders();
  return providers.filter((provider) => ref.includes(provider));
}

export function createEmptyCompanionBusinessPackCollection(
  overrides?: Partial<CompanionBusinessPackCollection>,
): CompanionBusinessPackCollection {
  return {
    packs: [],
    entitledCapabilities: [],
    enabledModules: [],
    permissionDenied: false,
    appEntitlementBlocked: false,
    lastUpdatedAt: null,
    ...overrides,
  };
}

function mapCapabilityGrant(
  row: Record<string, unknown>,
  effectivePermissions: string[],
): CompanionCapabilityRef | null {
  const grantStatus = str(row.grant_status).toLowerCase();
  if (grantStatus && grantStatus !== "active") return null;

  const capabilityId = str(row.capability_key);
  const packKey = str(row.pack_id);
  if (!capabilityId || !packKey) return null;

  const operation = inferOperation(capabilityId);
  const permission = inferPermission(capabilityId);
  if (permission && !effectivePermissions.includes(permission)) {
    return null;
  }

  const manifestRef = str(row.manifest_ref);
  const sourceProvider = parseProviderDependencies(manifestRef)[0] ?? null;

  return {
    capability_id: capabilityId,
    entity: capabilityId.split(".")[0] || capabilityId,
    operation,
    access_mode: operation === "write" ? "write" : "read",
    permission,
    source_provider: sourceProvider,
    pack_key: packKey,
  };
}

function parseEnabledModules(modulesCenter: ModulesCenter | null): string[] {
  if (!modulesCenter?.installed_modules) return [];
  const keys = new Set<string>();
  for (const entry of modulesCenter.installed_modules) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const status = str(row.status).toLowerCase();
    const enabled = row.enabled === true;
    if (!enabled) continue;
    if (!["enabled", "trial", "beta"].includes(status)) continue;
    const moduleKey = str(row.module_key);
    if (moduleKey) keys.add(moduleKey);
  }
  return [...keys];
}

function groupModulesByPack(
  modulesCenter: ModulesCenter | null,
  packKeys: string[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const packKey of packKeys) map.set(packKey, []);
  if (!modulesCenter?.installed_modules) return map;

  for (const entry of modulesCenter.installed_modules) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const moduleKey = str(row.module_key);
    const suiteKey = str(row.suite_key);
    if (!moduleKey) continue;
    const packKey = suiteKey || packKeys.find((key) => moduleKey.startsWith(key)) || "";
    if (!packKey || !map.has(packKey)) continue;
    if (row.enabled !== true) continue;
    map.get(packKey)?.push(moduleKey);
  }
  return map;
}

function resolvePackExposure(
  packKey: string,
  gateStatus: BusinessPackActivationStatus | undefined,
  runtimeStatus: string | null,
  licenseStatus: string | null,
): { exposed: boolean; activation_state: PackActivationExposure; status: CompanionBusinessPackContext["status"] } {
  if (gateStatus && BLOCKING_GATE_STATUSES.has(gateStatus)) {
    if (gateStatus === "activation_failed") {
      return { exposed: false, activation_state: gateStatus, status: "failed" };
    }
    if (gateStatus === "suspended" || gateStatus === "removed") {
      return { exposed: false, activation_state: gateStatus, status: "suspended" };
    }
    return { exposed: false, activation_state: gateStatus, status: "pending" };
  }

  const runtime = str(runtimeStatus).toLowerCase();
  const license = str(licenseStatus).toLowerCase();
  if (runtime === "suspended" || license === "suspended" || license === "cancelled") {
    return { exposed: false, activation_state: "suspended", status: "suspended" };
  }

  return { exposed: true, activation_state: "active", status: "active" };
}

export function normalizeCompanionBusinessPackCollection(input: {
  activeBusinessPacks: string[];
  subscriptionStatus: string | null;
  effectivePermissions: string[];
  gateItems: Array<{ pack_key: string; activation_status: BusinessPackActivationStatus }>;
  runtimeInstalled: BusinessPackRuntimeCenter | null;
  runtimePermissions: BusinessPackRuntimeCenter | null;
  modulesCenter: ModulesCenter | null;
}): CompanionBusinessPackCollection {
  if (isAppEntitlementBlocked(input.subscriptionStatus)) {
    return createEmptyCompanionBusinessPackCollection({ appEntitlementBlocked: true });
  }

  const gateByPack = new Map(
    input.gateItems.map((item) => [item.pack_key, item.activation_status]),
  );

  const runtimeByPack = new Map<string, Record<string, unknown>>();
  for (const row of input.runtimeInstalled?.runtime_instances ?? []) {
    const packId = str(row.pack_id);
    if (packId) runtimeByPack.set(packId, row);
  }

  const grantsByPack = new Map<string, CompanionCapabilityRef[]>();
  for (const row of input.runtimePermissions?.capability_grants ?? []) {
    const capability = mapCapabilityGrant(row, input.effectivePermissions);
    if (!capability) continue;
    const list = grantsByPack.get(capability.pack_key) ?? [];
    list.push(capability);
    grantsByPack.set(capability.pack_key, list);
  }

  const modulesByPack = groupModulesByPack(input.modulesCenter, input.activeBusinessPacks);
  const enabledModules = parseEnabledModules(input.modulesCenter);
  const packs: CompanionBusinessPackContext[] = [];

  for (const packKey of input.activeBusinessPacks) {
    const runtime = runtimeByPack.get(packKey);
    const exposure = resolvePackExposure(
      packKey,
      gateByPack.get(packKey),
      str(runtime?.runtime_status),
      str(runtime?.license_status),
    );
    if (!exposure.exposed) continue;

    const capabilities = grantsByPack.get(packKey) ?? [];
    const packModules = modulesByPack.get(packKey) ?? [];
    const providerDependencies = [
      ...new Set(capabilities.flatMap((cap) => (cap.source_provider ? [cap.source_provider] : []))),
    ];

    packs.push({
      pack_key: packKey,
      status: exposure.status,
      entitlement_status: exposure.status === "active" ? "active" : "missing",
      enabled_modules: packModules,
      capabilities,
      entities: capabilities.map((cap) => cap.entity),
      read_boundaries: capabilities
        .filter((cap) => cap.access_mode === "read")
        .map((cap) => cap.capability_id),
      write_boundaries: capabilities
        .filter((cap) => cap.access_mode === "write")
        .map((cap) => cap.capability_id),
      required_permissions: [
        ...new Set(capabilities.map((cap) => cap.permission).filter(Boolean) as string[]),
      ],
      provider_dependencies: providerDependencies,
      activation_state: exposure.activation_state,
      source: runtime ? "business_pack_runtime" : "marketplace",
      freshness: resolveFreshness(str(runtime?.installed_at) || null),
    });
  }

  const entitledCapabilities = packs.flatMap((pack) => pack.capabilities);

  return createEmptyCompanionBusinessPackCollection({
    packs,
    entitledCapabilities,
    enabledModules,
    lastUpdatedAt: packs
      .map((pack) => (pack.freshness === "fresh" ? new Date().toISOString() : null))
      .find(Boolean) ?? null,
  });
}

export function classifyBusinessPackLoadError(message: string): CompanionBusinessPackCollection {
  if (isPermissionDeniedMessage(message)) {
    return createEmptyCompanionBusinessPackCollection({ permissionDenied: true });
  }
  return createEmptyCompanionBusinessPackCollection();
}

export function parseRuntimeCenter(raw: unknown): BusinessPackRuntimeCenter | null {
  return parseBusinessPackRuntimeCenter(raw);
}

export function parseModulesCenterData(raw: unknown): ModulesCenter | null {
  const parsed = parseModulesCenter(raw);
  return parsed.has_customer ? parsed : null;
}

export function isCapabilityEntitled(
  collection: CompanionBusinessPackCollection,
  capabilityId: string,
): boolean {
  return collection.entitledCapabilities.some((cap) => cap.capability_id === capabilityId);
}

export function hasActiveBusinessPackEntitlements(
  collection: CompanionBusinessPackCollection,
): boolean {
  return collection.packs.length > 0 || collection.entitledCapabilities.length > 0;
}
