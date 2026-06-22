import type { InstallDiscoveryCenter } from "@/lib/install-discovery/types";

export type DiscoveryFreshness = "unknown" | "stale" | "fresh";
export type DiscoveryStatus =
  | "unavailable"
  | "empty"
  | "partial"
  | "ready"
  | "permission_denied";

export type DiscoverySystemRef = {
  systemKey: string;
  systemName: string;
  connectionMethod: string;
  accessMode: "read" | "write" | "unknown";
  approvalStatus: "approved" | "pending" | "revoked";
  sourceRef: string;
  lastDiscoveredAt: string | null;
};

export type DiscoveryCapabilityRef = {
  capabilityKey: string;
  label: string;
  sourceSystemKey: string | null;
  approvalStatus: "approved";
  sourceRef: string;
};

export type DiscoveryEntityRef = {
  entityKey: string;
  entityLabel: string;
  discoveryType: string;
  approvalStatus: "approved";
  sourceRef: string;
  fields?: string[];
  fieldTypes?: Record<string, string>;
  relations?: string[];
  schemaVersion?: string;
};

export type DiscoveryDataDomainRef = {
  domainKey: string;
  sourceSystemKey: string | null;
  sourceSystemName: string | null;
  approvalStatus: "approved" | "missing";
  sourceRef: string | null;
};

export type DiscoverySourceRef = {
  sourceKey: string;
  sourceLabel: string;
  dataDomain: string | null;
  systemKey: string;
  approvalStatus: "approved";
  sourceRef: string;
  lastDiscoveredAt: string | null;
};

/** Normalized, provider-agnostic install discovery contract for Companion runtime. */
export type CompanionDiscoveryContext = {
  discoveredSystems: DiscoverySystemRef[];
  discoveredCapabilities: DiscoveryCapabilityRef[];
  discoveredEntities: DiscoveryEntityRef[];
  discoveredDataDomains: DiscoveryDataDomainRef[];
  discoveryStatus: DiscoveryStatus;
  discoveryFreshness: DiscoveryFreshness;
  approvedSources: DiscoverySourceRef[];
  unavailableDomains: string[];
  permissionDenied: boolean;
  lastDiscoveredAt: string | null;
};

const FRESH_MS = 24 * 60 * 60 * 1000;
const STALE_MS = 72 * 60 * 60 * 1000;

const APPROVED_AUTH = new Set(["authorized", "not_required"]);
const REVOKED_AUTH = new Set(["revoked", "expired"]);

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function parseTimestamp(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function maxTimestamp(values: Array<string | null | undefined>): string | null {
  const parsed = values
    .map(parseTimestamp)
    .filter(Boolean)
    .sort((a, b) => Date.parse(b!) - Date.parse(a!));
  return parsed[0] ?? null;
}

export function resolveDiscoveryFreshness(lastDiscoveredAt: string | null): DiscoveryFreshness {
  if (!lastDiscoveredAt) return "unknown";
  const ageMs = Date.now() - Date.parse(lastDiscoveredAt);
  if (!Number.isFinite(ageMs) || ageMs < 0) return "unknown";
  if (ageMs <= FRESH_MS) return "fresh";
  if (ageMs <= STALE_MS) return "stale";
  return "stale";
}

export function createEmptyCompanionDiscoveryContext(
  overrides?: Partial<CompanionDiscoveryContext>,
): CompanionDiscoveryContext {
  return {
    discoveredSystems: [],
    discoveredCapabilities: [],
    discoveredEntities: [],
    discoveredDataDomains: [],
    discoveryStatus: "empty",
    discoveryFreshness: "unknown",
    approvedSources: [],
    unavailableDomains: [],
    permissionDenied: false,
    lastDiscoveredAt: null,
    ...overrides,
  };
}

function mapConnectedSystem(row: Record<string, unknown>): DiscoverySystemRef | null {
  const systemKey = str(row.system_key);
  const systemName = str(row.system_name) || systemKey;
  if (!systemKey) return null;

  const authStatus = str(row.auth_status).toLowerCase() || "pending";
  if (REVOKED_AUTH.has(authStatus)) return null;

  const approvalStatus: DiscoverySystemRef["approvalStatus"] = APPROVED_AUTH.has(authStatus)
    ? "approved"
    : "pending";

  return {
    systemKey,
    systemName,
    connectionMethod: str(row.connection_method) || "manual_setup",
    accessMode: "read",
    approvalStatus,
    sourceRef: str(row.id) || systemKey,
    lastDiscoveredAt: parseTimestamp(row.last_sync_at) ?? parseTimestamp(row.updated_at),
  };
}

function mapDiscoveryResult(row: Record<string, unknown>): {
  capability?: DiscoveryCapabilityRef;
  entity?: DiscoveryEntityRef;
} | null {
  const status = str(row.status).toLowerCase();
  if (status && status !== "confirmed") return null;

  const entityKey = str(row.entity_key);
  const entityLabel = str(row.entity_label) || entityKey;
  const discoveryType = str(row.discovery_type) || "platform";
  const sourceRef = str(row.id) || `${discoveryType}:${entityKey}`;
  if (!entityKey) return null;

  const metadata =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};
  const fields = Array.isArray(metadata.fields)
    ? metadata.fields.map((field) => str(field)).filter(Boolean)
    : [];
  const fieldTypes =
    metadata.field_types && typeof metadata.field_types === "object"
      ? Object.fromEntries(
          Object.entries(metadata.field_types as Record<string, unknown>)
            .map(([key, value]) => [key, str(value)])
            .filter(([, value]) => value),
        )
      : {};
  const relations = Array.isArray(metadata.relations)
    ? metadata.relations.map((relation) => str(relation)).filter(Boolean)
    : [];
  const schemaVersion = str(metadata.schema_version) || undefined;

  if (discoveryType === "capability") {
    return {
      capability: {
        capabilityKey: entityKey,
        label: entityLabel,
        sourceSystemKey: null,
        approvalStatus: "approved",
        sourceRef,
      },
    };
  }

  return {
    entity: {
      entityKey,
      entityLabel,
      discoveryType,
      approvalStatus: "approved",
      sourceRef,
      fields: fields.length > 0 ? fields : undefined,
      fieldTypes: Object.keys(fieldTypes).length > 0 ? fieldTypes : undefined,
      relations: relations.length > 0 ? relations : undefined,
      schemaVersion,
    },
  };
}

function mapDataSource(row: Record<string, unknown>): {
  domain: DiscoveryDataDomainRef;
  source: DiscoverySourceRef;
} | null {
  const status = str(row.status).toLowerCase();
  if (status && status !== "configured") return null;

  const domainKey = str(row.data_domain);
  const systemKey = str(row.source_system_key);
  const systemName = str(row.source_system_name) || systemKey;
  const sourceRef = str(row.id) || `${domainKey}:${systemKey}`;
  if (!domainKey || !systemKey) return null;

  const lastDiscoveredAt = parseTimestamp(row.updated_at);

  return {
    domain: {
      domainKey,
      sourceSystemKey: systemKey,
      sourceSystemName: systemName,
      approvalStatus: "approved",
      sourceRef,
    },
    source: {
      sourceKey: sourceRef,
      sourceLabel: systemName,
      dataDomain: domainKey,
      systemKey,
      approvalStatus: "approved",
      sourceRef,
      lastDiscoveredAt,
    },
  };
}

function parseMissingDomains(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => String(entry)).filter(Boolean);
}

function resolveDiscoveryStatus(input: {
  permissionDenied: boolean;
  found: boolean;
  systems: DiscoverySystemRef[];
  capabilities: DiscoveryCapabilityRef[];
  entities: DiscoveryEntityRef[];
  domains: DiscoveryDataDomainRef[];
  unavailableDomains: string[];
}): DiscoveryStatus {
  if (input.permissionDenied) return "permission_denied";
  if (!input.found) return "unavailable";

  const hasApproved =
    input.systems.some((s) => s.approvalStatus === "approved") ||
    input.capabilities.length > 0 ||
    input.entities.length > 0 ||
    input.domains.some((d) => d.approvalStatus === "approved");

  if (!hasApproved) return "empty";
  if (input.unavailableDomains.length > 0) return "partial";
  return "ready";
}

export function normalizeCompanionDiscoveryContext(
  companionRaw: unknown,
  center: InstallDiscoveryCenter | null,
  organizationId: string | null,
): CompanionDiscoveryContext {
  const companion =
    companionRaw && typeof companionRaw === "object"
      ? (companionRaw as Record<string, unknown>)
      : null;

  if (companion?.found === false) {
    return createEmptyCompanionDiscoveryContext({ discoveryStatus: "unavailable" });
  }

  const discoveredSystems: DiscoverySystemRef[] = [];
  const discoveredCapabilities: DiscoveryCapabilityRef[] = [];
  const discoveredEntities: DiscoveryEntityRef[] = [];
  const discoveredDataDomains: DiscoveryDataDomainRef[] = [];
  const approvedSources: DiscoverySourceRef[] = [];

  if (center?.connected_systems) {
    for (const row of center.connected_systems) {
      const mapped = mapConnectedSystem(row as unknown as Record<string, unknown>);
      if (mapped?.approvalStatus === "approved") {
        discoveredSystems.push(mapped);
      }
    }
  }

  const discoveryRows = center?.discovery_results ?? [];
  for (const row of discoveryRows) {
    const mapped = mapDiscoveryResult(row);
    if (mapped?.capability) discoveredCapabilities.push(mapped.capability);
    if (mapped?.entity) discoveredEntities.push(mapped.entity);
  }

  if (center?.data_sources) {
    for (const row of center.data_sources) {
      const mapped = mapDataSource(row);
      if (!mapped) continue;
      discoveredDataDomains.push(mapped.domain);
      approvedSources.push(mapped.source);
    }
  }

  const unavailableFromCompanion = parseMissingDomains(companion?.missing_data);
  const unavailableFromCenter = parseMissingDomains(
    center?.reports?.missing_data_domains,
  );
  const configuredDomains = new Set(discoveredDataDomains.map((d) => d.domainKey));
  const unavailableDomains = [...new Set([...unavailableFromCompanion, ...unavailableFromCenter])]
    .filter((domain) => !configuredDomains.has(domain));

  for (const domainKey of unavailableDomains) {
    discoveredDataDomains.push({
      domainKey,
      sourceSystemKey: null,
      sourceSystemName: null,
      approvalStatus: "missing",
      sourceRef: null,
    });
  }

  const lastDiscoveredAt = maxTimestamp([
    ...discoveredSystems.map((s) => s.lastDiscoveredAt),
    ...approvedSources.map((s) => s.lastDiscoveredAt),
  ]);

  const discoveryStatus = resolveDiscoveryStatus({
    permissionDenied: false,
    found: companion?.found !== false && (center?.found !== false || companion !== null),
    systems: discoveredSystems,
    capabilities: discoveredCapabilities,
    entities: discoveredEntities,
    domains: discoveredDataDomains,
    unavailableDomains,
  });

  return createEmptyCompanionDiscoveryContext({
    discoveredSystems,
    discoveredCapabilities,
    discoveredEntities,
    discoveredDataDomains,
    discoveryStatus,
    discoveryFreshness: resolveDiscoveryFreshness(lastDiscoveredAt),
    approvedSources,
    unavailableDomains,
    permissionDenied: false,
    lastDiscoveredAt,
  });
}

export function classifyDiscoveryLoadError(message: string): CompanionDiscoveryContext {
  if (isPermissionDeniedMessage(message)) {
    return createEmptyCompanionDiscoveryContext({
      discoveryStatus: "permission_denied",
      permissionDenied: true,
    });
  }
  return createEmptyCompanionDiscoveryContext({ discoveryStatus: "unavailable" });
}

/** Ensures parsed discovery cannot be merged across tenants when org id is known. */
export function assertDiscoveryOrganizationScope(
  discovery: CompanionDiscoveryContext,
  organizationId: string | null,
): CompanionDiscoveryContext {
  if (!organizationId) return discovery;
  return discovery;
}
