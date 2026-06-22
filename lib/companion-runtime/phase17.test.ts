import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listServicesProviderManifests } from "@/lib/integration-intelligence/services/registry";
import {
  buildServicesCapabilityId,
  SERVICES_BLOCKED_CAPABILITY_KEYS,
  isServicesCapabilityBlocked,
} from "@/lib/integration-intelligence/services/types";
import {
  buildServicesActionDefinitions,
  buildServicesReadToolDefinitions,
  buildServicesSchemaEntities,
  mapServicesCapabilitiesToRefs,
  mergeServicesCapabilities,
} from "./merge-services-runtime";
import {
  createEmptyCompanionServicesContext,
  filterServicesCapabilitiesForPrivacy,
  listEnabledServicesCapabilities,
} from "./companion-services-context";
import {
  buildBlockedServicesOperationAnswer,
  buildExternalServicesUnavailableAnswer,
  buildServicesProviderDiscoveryAnswer,
  hasBlockedServicesOperationIntent,
  hasServicesProviderIntent,
  matchServicesProviderQuery,
} from "./services-answer";
import { buildActionDefinitionFromServicesCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listServicesProviderManifests();
assert.ok(manifests.length >= 7);

for (const blocked of SERVICES_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isServicesCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

const appointmentBooking = manifests.find((manifest) => manifest.provider_key === "appointment_booking");
assert.ok(appointmentBooking);
assert.equal(appointmentBooking?.business_pack_key, "appointments_services");
assert.equal(appointmentBooking?.implementation_status, "partial");

const capabilityId = buildServicesCapabilityId(
  "appointment_booking",
  "appointment.read",
  "read",
);
assert.equal(capabilityId, "appointment_booking.appointment.read.read");

const servicesContext = createEmptyCompanionServicesContext({
  appointment_booking_enabled: true,
  workforce_scheduling_enabled: true,
  absence_coverage_enabled: true,
  execution_operations_enabled: true,
  real_world_coordination_enabled: true,
  service_network_enabled: true,
  service_intake_enabled: true,
  prevent_double_booking: true,
  overbooking_allowed: false,
  vacation_mode_integration_enabled: true,
  slot_hold_minutes: 15,
  default_buffer_minutes: 5,
  timezone_aware_scheduling: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    appointment_booking_enabled: manifest.source_engine === "appointment_booking",
    workforce_scheduling_enabled: manifest.source_engine === "workforce_scheduling",
    absence_coverage_enabled: manifest.source_engine === "absence_vacation_coverage",
    execution_operations_enabled: manifest.source_engine === "execution_operations",
    real_world_coordination_enabled: manifest.source_engine === "companion_real_world_coordination",
    service_network_enabled: manifest.source_engine === "service_network",
    service_intake_enabled: manifest.source_engine === "service_intake",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: manifest.business_pack_key === "appointments_services",
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildServicesCapabilityId(
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
      enabled: capability.operation === "read" || (capability.approval_required && capability.reversible),
    })),
  ),
});

const capabilityRefs = mapServicesCapabilitiesToRefs(servicesContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "services_provider"));

const mergedCapabilities = mergeServicesCapabilities([], servicesContext);
assert.ok(mergedCapabilities.length >= capabilityRefs.length);

const schemaEntities = buildServicesSchemaEntities(servicesContext, [
  "execution_operations.view",
  "execution_operations.manage",
  "absence.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildServicesReadToolDefinitions({
  servicesContext,
  effectivePermissions: ["execution_operations.view"],
});
assert.equal(readTools.every((tool) => tool.enabled === false), true);

const workOrderCapability = servicesContext.capabilities.find(
  (capability) =>
    capability.provider_key === "execution_operations" &&
    capability.capability_key === "work_order.create",
);
assert.ok(workOrderCapability);

const reversibleActions = buildServicesActionDefinitions({
  servicesContext,
  effectivePermissions: ["execution_operations.view", "execution_operations.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
}).filter((action) => action.reversible);

assert.ok(reversibleActions.length > 0);
assert.ok(reversibleActions.every((action) => action.approval_required));

const workOrderDefinition = buildActionDefinitionFromServicesCapability(workOrderCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(workOrderDefinition);
assert.equal(workOrderDefinition?.source, "services_provider");

const deniedContext = createEmptyCompanionServicesContext({ permission_denied: true });
assert.equal(filterServicesCapabilitiesForPrivacy(deniedContext).length, 0);
assert.equal(listEnabledServicesCapabilities(deniedContext).length, 0);

const tenantContext = createEmptyCompanionTenantContext({ servicesContext });
const t = (key: string) => key;

assert.equal(hasServicesProviderIntent("show appointment availability"), true);
assert.equal(hasBlockedServicesOperationIntent("cancel appointment for tomorrow"), true);

const match = matchServicesProviderQuery("appointment availability this week", tenantContext);
assert.ok(match);
assert.equal(match?.provider_key, "appointment_booking");

const discovery = buildServicesProviderDiscoveryAnswer(match!, servicesContext, t);
assert.ok(discovery.directAnswer.includes("services.discoveryLead"));
assert.ok(discovery.explanation?.includes("services.doubleBookingPrevented"));
assert.ok(discovery.explanation?.includes("services.vacationModeActive"));

const blocked = buildBlockedServicesOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("services.blockedOperationLead"));

const externalUnavailable = buildExternalServicesUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("services.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveServicesProviderAnswer"));

const forbiddenIndustryTerms = [
  "rørlegger",
  "frisør",
  "klinikk",
  "unonight",
  "plumber",
  "salon",
  "healthcare_clinic",
];
for (const term of forbiddenIndustryTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-services-context.ts",
  "load-companion-services-context.ts",
  "merge-services-runtime.ts",
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
  assert.ok(raw.includes('"services"'), locale);
}

console.log("phase17 companion runtime tests passed");
