import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createEmptyCompanionDiscoveryContext,
  normalizeCompanionDiscoveryContext,
} from "./companion-discovery-context";
import {
  createEmptyCompanionBusinessPackCollection,
  normalizeCompanionBusinessPackCollection,
} from "./companion-business-pack-context";
import {
  buildCompanionSchemaCollection,
  createEmptyCompanionSchemaCollection,
  hasApprovedSchemaEntities,
  isSchemaEntityAvailable,
  isSchemaOperationAvailable,
} from "./companion-schema-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const discovery = normalizeCompanionDiscoveryContext(
  { found: true, missing_data: [] },
  {
    found: true,
    connected_systems: [
      {
        id: "sys-1",
        system_key: "shopify",
        system_name: "Shopify",
        connection_method: "oauth",
        auth_status: "authorized",
        sync_mode: "scheduled",
        sync_health: "healthy",
        updated_at: new Date().toISOString(),
      },
    ],
    discovery_results: [
      {
        id: "ent-1",
        discovery_type: "platform",
        entity_key: "inventory",
        entity_label: "Inventory",
        status: "confirmed",
        metadata: {
          fields: ["sku", "quantity", "api_secret"],
          field_types: { sku: "string", quantity: "number", api_secret: "secret" },
          relations: ["inventory->shopify"],
          schema_version: "discovery:v2",
        },
      },
      {
        id: "ent-revoked",
        discovery_type: "platform",
        entity_key: "legacy_orders",
        entity_label: "Legacy orders",
        status: "rejected",
      },
    ],
    data_sources: [
      {
        id: "src-1",
        data_domain: "products",
        source_system_key: "shopify",
        source_system_name: "Shopify",
        connection_method: "oauth",
        status: "configured",
        updated_at: new Date().toISOString(),
      },
    ],
    reports: { missing_data_domains: [] },
  },
  "11111111-1111-1111-1111-111111111111",
);

const businessPacks = normalizeCompanionBusinessPackCollection({
  activeBusinessPacks: ["operations_suite", "inactive_pack"],
  subscriptionStatus: "active",
  effectivePermissions: ["inventory.read"],
  gateItems: [{ pack_key: "inactive_pack", activation_status: "activation_failed" }],
  runtimeInstalled: {
    found: true,
    runtime_instances: [
      {
        pack_id: "operations_suite",
        runtime_status: "active",
        license_status: "active",
        installed_at: new Date().toISOString(),
      },
    ],
  },
  runtimePermissions: {
    found: true,
    capability_grants: [
      {
        pack_id: "operations_suite",
        capability_key: "inventory.read",
        grant_status: "active",
        manifest_ref: "provider.shopify",
      },
      {
        pack_id: "operations_suite",
        capability_key: "inventory.write",
        grant_status: "active",
        manifest_ref: "provider.shopify",
      },
      {
        pack_id: "operations_suite",
        capability_key: "billing.manage",
        grant_status: "active",
        manifest_ref: "",
      },
    ],
  },
  modulesCenter: null,
});

const schema = buildCompanionSchemaCollection({
  discovery,
  businessPackContext: businessPacks,
  connectedProviders: ["shopify"],
  effectivePermissions: ["inventory.read"],
});

assert.ok(schema.availableEntities.includes("inventory"));
assert.ok(schema.availableEntities.includes("products"));
assert.equal(schema.availableOperations.includes("read"), true);
assert.equal(isSchemaEntityAvailable(schema, "inventory"), true);
assert.equal(isSchemaOperationAvailable(schema, "read"), true);

const inventory = schema.entities.find((entity) => entity.entity_key === "inventory");
assert.ok(inventory);
assert.ok(inventory.fields.includes("sku"));
assert.equal(inventory.fields.includes("api_secret"), false);
assert.ok(inventory.relations.includes("inventory->shopify"));
assert.equal(inventory.approval_status, "approved");

const suspended = buildCompanionSchemaCollection({
  discovery,
  businessPackContext: createEmptyCompanionBusinessPackCollection({ appEntitlementBlocked: true }),
  connectedProviders: [],
  effectivePermissions: [],
});
assert.equal(suspended.appEntitlementBlocked, true);
assert.equal(suspended.entities.length, 0);

const permissionDenied = buildCompanionSchemaCollection({
  discovery: createEmptyCompanionDiscoveryContext({ permissionDenied: true, discoveryStatus: "permission_denied" }),
  businessPackContext: createEmptyCompanionBusinessPackCollection(),
  connectedProviders: [],
  effectivePermissions: [],
});
assert.equal(permissionDenied.permissionDenied, true);

const noVerifiedProvider = buildCompanionSchemaCollection({
  discovery,
  businessPackContext: businessPacks,
  connectedProviders: [],
  effectivePermissions: ["inventory.read"],
});
assert.equal(
  noVerifiedProvider.entities.some((entity) => entity.source_provider === "unonight"),
  false,
);

const empty = createEmptyCompanionSchemaCollection();
assert.equal(hasApprovedSchemaEntities(empty), false);

const tenantDefaults = createEmptyCompanionTenantContext();
assert.ok(Array.isArray(tenantDefaults.schemaContext.entities));
assert.ok(Array.isArray(tenantDefaults.availableEntities));
assert.ok(Array.isArray(tenantDefaults.availableOperations));

const schemaSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/companion-schema-context.ts"),
  "utf8",
);
assert.equal(/unonight/i.test(schemaSource), false);

const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), `locales/${locale}/customer-app/companionPlatformKnowledge.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    companionPlatformKnowledge: { schema: Record<string, string> };
  };
  assert.ok(parsed.companionPlatformKnowledge.schema.accessDenied, locale);
  assert.ok(parsed.companionPlatformKnowledge.schema.sourceLabel, locale);
}

console.log("phase4 companion runtime tests passed");
