import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";
import { getIntegrationProviderManifest } from "@/lib/integration-intelligence/manifest-registry";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

export type SchemaFreshness = "unknown" | "fresh" | "stale";
export type SchemaApprovalStatus = "approved" | "pending" | "revoked" | "missing";

export type CompanionSchemaContext = {
  entity_key: string;
  display_name: string;
  fields: string[];
  field_types: Record<string, string>;
  relations: string[];
  supported_operations: ("read" | "write")[];
  read_boundaries: string[];
  write_boundaries: string[];
  required_permissions: string[];
  source_provider: string | null;
  pack_key: string | null;
  schema_version: string;
  freshness: SchemaFreshness;
  approval_status: SchemaApprovalStatus;
};

export type CompanionSchemaCollection = {
  entities: CompanionSchemaContext[];
  availableEntities: string[];
  availableOperations: ("read" | "write")[];
  permissionDenied: boolean;
  appEntitlementBlocked: boolean;
  lastUpdatedAt: string | null;
};

const FORBIDDEN_FIELD_PATTERN =
  /password|secret|token|credential|api_key|private_key|auth_header|bearer/i;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function schemaKey(entityKey: string, packKey: string | null, sourceProvider: string | null): string {
  return `${entityKey}::${packKey ?? ""}::${sourceProvider ?? ""}`;
}

function isSafeField(field: string): boolean {
  return Boolean(field) && !FORBIDDEN_FIELD_PATTERN.test(field);
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function mergeFieldTypes(
  current: Record<string, string>,
  incoming: Record<string, string>,
): Record<string, string> {
  return { ...current, ...incoming };
}

function mergeSchemaEntity(
  current: CompanionSchemaContext,
  patch: Partial<CompanionSchemaContext>,
): CompanionSchemaContext {
  return {
    ...current,
    display_name: patch.display_name || current.display_name,
    fields: uniqueStrings([...current.fields, ...(patch.fields ?? [])]),
    field_types: mergeFieldTypes(current.field_types, patch.field_types ?? {}),
    relations: uniqueStrings([...current.relations, ...(patch.relations ?? [])]),
    supported_operations: uniqueStrings([
      ...current.supported_operations,
      ...(patch.supported_operations ?? []),
    ]) as ("read" | "write")[],
    read_boundaries: uniqueStrings([...current.read_boundaries, ...(patch.read_boundaries ?? [])]),
    write_boundaries: uniqueStrings([
      ...current.write_boundaries,
      ...(patch.write_boundaries ?? []),
    ]),
    required_permissions: uniqueStrings([
      ...current.required_permissions,
      ...(patch.required_permissions ?? []),
    ]),
    source_provider: patch.source_provider ?? current.source_provider,
    pack_key: patch.pack_key ?? current.pack_key,
    schema_version: patch.schema_version ?? current.schema_version,
    freshness: patch.freshness ?? current.freshness,
    approval_status:
      patch.approval_status === "approved" ? "approved" : current.approval_status,
  };
}

function permissionAllowed(permission: string | null, effectivePermissions: string[]): boolean {
  if (!permission) return true;
  return effectivePermissions.includes(permission);
}

function filterPermissionDeniedFields(
  entity: CompanionSchemaContext,
  effectivePermissions: string[],
): CompanionSchemaContext | null {
  if (
    entity.required_permissions.length > 0 &&
    !entity.required_permissions.some((permission) =>
      permissionAllowed(permission, effectivePermissions),
    )
  ) {
    return null;
  }

  const safeFields = entity.fields.filter(isSafeField);
  if (safeFields.length === 0 && entity.read_boundaries.length === 0) return null;

  return {
    ...entity,
    fields: safeFields,
    field_types: Object.fromEntries(
      Object.entries(entity.field_types).filter(([field]) => safeFields.includes(field)),
    ),
  };
}

export function createEmptyCompanionSchemaCollection(
  overrides?: Partial<CompanionSchemaCollection>,
): CompanionSchemaCollection {
  return {
    entities: [],
    availableEntities: [],
    availableOperations: [],
    permissionDenied: false,
    appEntitlementBlocked: false,
    lastUpdatedAt: null,
    ...overrides,
  };
}

function upsertEntity(
  map: Map<string, CompanionSchemaContext>,
  entity: CompanionSchemaContext,
): void {
  const key = schemaKey(entity.entity_key, entity.pack_key, entity.source_provider);
  const existing = map.get(key);
  map.set(key, existing ? mergeSchemaEntity(existing, entity) : entity);
}

function mapDiscoveryFreshness(
  freshness: CompanionDiscoveryContext["discoveryFreshness"],
): SchemaFreshness {
  if (freshness === "fresh") return "fresh";
  if (freshness === "stale") return "stale";
  return "unknown";
}

function addDiscoverySchemas(
  map: Map<string, CompanionSchemaContext>,
  discovery: CompanionDiscoveryContext,
): void {
  for (const entity of discovery.discoveredEntities) {
    if (entity.approvalStatus !== "approved") continue;
    upsertEntity(map, {
      entity_key: entity.entityKey,
      display_name: entity.entityLabel || humanizeEntityKey(entity.entityKey),
      fields: uniqueStrings(entity.fields ?? []).filter(isSafeField),
      field_types: entity.fieldTypes ?? {},
      relations: uniqueStrings(entity.relations ?? []),
      supported_operations: ["read"],
      read_boundaries: uniqueStrings(entity.fields ?? [entity.entityKey]).filter(isSafeField),
      write_boundaries: [],
      required_permissions: [],
      source_provider: null,
      pack_key: null,
      schema_version: entity.schemaVersion ?? "discovery:v1",
      freshness: mapDiscoveryFreshness(discovery.discoveryFreshness),
      approval_status: "approved",
    });
  }

  for (const domain of discovery.discoveredDataDomains) {
    if (domain.approvalStatus !== "approved") continue;
    const relation =
      domain.sourceSystemKey && domain.domainKey
        ? `${domain.domainKey}->${domain.sourceSystemKey}`
        : null;
    upsertEntity(map, {
      entity_key: domain.domainKey,
      display_name: humanizeEntityKey(domain.domainKey),
      fields: [domain.domainKey].filter(isSafeField),
      field_types: { [domain.domainKey]: "domain" },
      relations: relation ? [relation] : [],
      supported_operations: ["read"],
      read_boundaries: [domain.domainKey],
      write_boundaries: [],
      required_permissions: [],
      source_provider: domain.sourceSystemKey,
      pack_key: null,
      schema_version: "discovery:domain:v1",
      freshness: mapDiscoveryFreshness(discovery.discoveryFreshness),
      approval_status: "approved",
    });
  }
}

function addBusinessPackSchemas(
  map: Map<string, CompanionSchemaContext>,
  businessPackContext: CompanionBusinessPackCollection,
  effectivePermissions: string[],
): void {
  if (businessPackContext.appEntitlementBlocked) return;

  for (const pack of businessPackContext.packs) {
    for (const capability of pack.capabilities) {
      if (!permissionAllowed(capability.permission, effectivePermissions)) continue;

      const fieldKey = capability.capability_id.split(".").slice(1).join(".") || capability.capability_id;
      const safeField = isSafeField(fieldKey) ? fieldKey : capability.entity;
      const operations: ("read" | "write")[] =
        capability.access_mode === "write" ? ["read", "write"] : ["read"];

      upsertEntity(map, {
        entity_key: capability.entity,
        display_name: humanizeEntityKey(capability.entity),
        fields: [safeField].filter(isSafeField),
        field_types: { [safeField]: capability.operation },
        relations: capability.source_provider ? [`${capability.entity}->${capability.source_provider}`] : [],
        supported_operations: operations,
        read_boundaries: capability.access_mode === "read" ? [capability.capability_id] : [],
        write_boundaries: capability.access_mode === "write" ? [capability.capability_id] : [],
        required_permissions: capability.permission ? [capability.permission] : [],
        source_provider: capability.source_provider,
        pack_key: pack.pack_key,
        schema_version: "business_pack:v1",
        freshness: pack.freshness,
        approval_status: "approved",
      });
    }
  }
}

function addVerifiedProviderSchemas(
  map: Map<string, CompanionSchemaContext>,
  connectedProviders: string[],
): void {
  for (const providerKey of connectedProviders) {
    const manifest = getIntegrationProviderManifest(providerKey);
    if (!manifest) continue;

    const manifestFields = uniqueStrings(
      manifest.capabilities.flatMap((capability) => capability.fields.map(String)),
    ).filter(isSafeField);

    for (const entity of manifest.entities) {
      upsertEntity(map, {
        entity_key: entity.key,
        display_name: entity.displayNames?.en ?? humanizeEntityKey(entity.key),
        fields: manifestFields,
        field_types: Object.fromEntries(manifestFields.map((field) => [field, "metadata"])),
        relations: [`${entity.key}->${providerKey}`],
        supported_operations: ["read"],
        read_boundaries: manifestFields,
        write_boundaries: [],
        required_permissions: [],
        source_provider: providerKey,
        pack_key: null,
        schema_version: "provider_manifest:v1",
        freshness: "unknown",
        approval_status: "approved",
      });
    }
  }
}

export function buildCompanionSchemaCollection(input: {
  discovery: CompanionDiscoveryContext;
  businessPackContext: CompanionBusinessPackCollection;
  connectedProviders: string[];
  effectivePermissions: string[];
}): CompanionSchemaCollection {
  if (input.businessPackContext.appEntitlementBlocked) {
    return createEmptyCompanionSchemaCollection({ appEntitlementBlocked: true });
  }

  if (input.discovery.permissionDenied && input.businessPackContext.packs.length === 0) {
    return createEmptyCompanionSchemaCollection({ permissionDenied: true });
  }

  const map = new Map<string, CompanionSchemaContext>();

  if (input.discovery.discoveryStatus !== "permission_denied") {
    addDiscoverySchemas(map, input.discovery);
  }

  addBusinessPackSchemas(map, input.businessPackContext, input.effectivePermissions);
  addVerifiedProviderSchemas(map, input.connectedProviders);

  const entities = [...map.values()]
    .map((entity) => filterPermissionDeniedFields(entity, input.effectivePermissions))
    .filter((entity): entity is CompanionSchemaContext => entity !== null)
    .filter((entity) => entity.approval_status === "approved");

  const availableEntities = uniqueStrings(entities.map((entity) => entity.entity_key));
  const availableOperations = uniqueStrings(
    entities.flatMap((entity) => entity.supported_operations),
  ) as ("read" | "write")[];

  return createEmptyCompanionSchemaCollection({
    entities,
    availableEntities,
    availableOperations,
    lastUpdatedAt: input.discovery.lastDiscoveredAt ?? input.businessPackContext.lastUpdatedAt,
  });
}

export function hasApprovedSchemaEntities(collection: CompanionSchemaCollection): boolean {
  return collection.entities.length > 0;
}

export function isSchemaEntityAvailable(
  collection: CompanionSchemaCollection,
  entityKey: string,
): boolean {
  return collection.availableEntities.includes(entityKey);
}

export function isSchemaOperationAvailable(
  collection: CompanionSchemaCollection,
  operation: "read" | "write",
): boolean {
  return collection.availableOperations.includes(operation);
}
