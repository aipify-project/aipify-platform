import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listIndustryPackProviderManifests } from "@/lib/integration-intelligence/industry-packs/registry";
import {
  buildIndustryPackCapabilityId,
  INDUSTRY_PACK_BLOCKED_CAPABILITY_KEYS,
  isIndustryPackCapabilityBlocked,
} from "@/lib/integration-intelligence/industry-packs/types";
import {
  buildIndustryPackActionDefinitions,
  buildIndustryPackReadToolDefinitions,
  buildIndustryPackSchemaEntities,
  mapIndustryPackCapabilitiesToRefs,
  mergeIndustryPackCapabilities,
} from "./merge-industry-pack-runtime";
import {
  createEmptyCompanionIndustryPackContext,
  filterIndustryPackCapabilitiesForPrivacy,
  listEnabledIndustryPackCapabilities,
} from "./companion-industry-pack-context";
import {
  buildBlockedIndustryPackOperationAnswer,
  buildExternalIndustryPackUnavailableAnswer,
  buildIndustryPackProviderDiscoveryAnswer,
  hasBlockedIndustryPackOperationIntent,
  hasIndustryPackProviderIntent,
  matchIndustryPackProviderQuery,
} from "./industry-pack-answer";
import { buildActionDefinitionFromIndustryPackCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listIndustryPackProviderManifests();
assert.ok(manifests.length >= 5);

for (const blocked of INDUSTRY_PACK_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isIndustryPackCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

const localServiceBeauty = manifests.find(
  (manifest) => manifest.provider_key === "local_service_beauty",
);
assert.ok(localServiceBeauty);
assert.equal(localServiceBeauty?.business_pack_key, "appointments_services");
assert.equal(localServiceBeauty?.industry_blueprint_slug, "local-service-business");

const requiredCapabilities = [
  "service.read",
  "treatment.read",
  "staff.read",
  "availability.read",
  "appointment.read",
  "customer.read",
  "product.read",
  "inventory.read",
  "appointment.create",
  "appointment.update",
  "reminder.create",
  "follow_up.create",
] as const;

for (const capabilityKey of requiredCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const industryPackContext = createEmptyCompanionIndustryPackContext({
  appointment_booking_enabled: true,
  workforce_scheduling_enabled: true,
  absence_coverage_enabled: true,
  service_inventory_enabled: true,
  follow_up_enabled: true,
  prevent_double_booking: true,
  vacation_mode_integration_enabled: true,
  post_vacation_buffer_days: 2,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    appointment_booking_enabled: manifest.source_engine === "appointment_booking",
    workforce_scheduling_enabled: manifest.source_engine === "workforce_scheduling",
    absence_coverage_enabled: manifest.source_engine === "absence_vacation_coverage",
    service_inventory_enabled: manifest.source_engine === "service_inventory",
    follow_up_enabled: manifest.source_engine === "companion_follow_up",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: manifest.business_pack_key === "appointments_services" || !manifest.business_pack_key,
    industry_blueprint_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildIndustryPackCapabilityId(
        manifest.provider_key,
        capability.capability_key,
        capability.operation,
      ),
      provider_key: manifest.provider_key,
      capability_key: capability.capability_key,
      operation: capability.operation,
      entity: capability.entity,
      adapter_available: false,
      approval_required: capability.approval_required,
      reversible: capability.reversible,
      risk_level: capability.risk_level,
      required_permission: capability.required_permission,
      runtime_status: manifest.implementation_status,
      privacy_sensitive: capability.privacy_sensitive,
      enabled: capability.operation === "read" || capability.approval_required,
    })),
  ),
});

const capabilityRefs = mapIndustryPackCapabilitiesToRefs(industryPackContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "industry_pack_provider"));

const mergedCapabilities = mergeIndustryPackCapabilities([], industryPackContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildIndustryPackSchemaEntities(industryPackContext, []);
assert.ok(schemaEntities.length > 0);

const readTools = buildIndustryPackReadToolDefinitions({
  industryPackContext,
  effectivePermissions: [],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const appointmentCreate = industryPackContext.capabilities.find(
  (capability) =>
    capability.capability_key === "appointment.create" &&
    capability.provider_key === "local_service_beauty",
);
assert.ok(appointmentCreate);

const appointmentDefinition = buildActionDefinitionFromIndustryPackCapability(
  appointmentCreate!,
  {
    permissionAllowed: true,
    appEntitlementBlocked: false,
    emergencyStop: false,
    maxRiskLevel: 2,
  },
);
assert.ok(appointmentDefinition);
assert.equal(appointmentDefinition?.source, "industry_pack_provider");
assert.equal(appointmentDefinition?.enabled, true);

const industryActions = buildIndustryPackActionDefinitions({
  industryPackContext,
  effectivePermissions: [],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(industryActions.length > 0);
assert.ok(industryActions.every((action) => action.approval_required));

const privateCapabilities = filterIndustryPackCapabilitiesForPrivacy({
  ...industryPackContext,
  capabilities: industryPackContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const enabled = listEnabledIndustryPackCapabilities(industryPackContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ industryPackContext });
const match = matchIndustryPackProviderQuery("show treatment availability and book appointment", tenantContext);
assert.ok(match);
assert.equal(hasIndustryPackProviderIntent("industry pack treatment staff"), true);
assert.equal(hasBlockedIndustryPackOperationIntent("cancel appointment and refund"), true);

const discovery = buildIndustryPackProviderDiscoveryAnswer(match!, industryPackContext, t);
assert.ok(discovery.directAnswer.includes("industryPack.discoveryLead"));
assert.ok(discovery.explanation?.includes("industryPack.doubleBookingPrevented"));
assert.ok(discovery.explanation?.includes("industryPack.vacationModeActive"));

const blocked = buildBlockedIndustryPackOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("industryPack.blockedOperationLead"));

const externalUnavailable = buildExternalIndustryPackUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("industryPack.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveIndustryPackProviderAnswer"));

const forbiddenIndustryTerms = [
  "frisør",
  "frisor",
  "klinikk",
  PILOT_INTEGRATION_PROVIDER_KEY,
  "plumber",
  "salon",
  "hairdresser",
  "healthcare_clinic",
];
for (const term of forbiddenIndustryTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-industry-pack-context.ts",
  "load-companion-industry-pack-context.ts",
  "merge-industry-pack-runtime.ts",
  "industry-pack-answer.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenIndustryTerms) {
    assert.equal(new RegExp(`\\b${term}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"industryPack"'), locale);
}

console.log("phase19 companion runtime tests passed");
