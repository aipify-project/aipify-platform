import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listHrProviderManifests } from "@/lib/integration-intelligence/hr/registry";
import {
  buildHrCapabilityId,
  HR_BLOCKED_CAPABILITY_KEYS,
  HR_BUSINESS_PACK_KEYS,
  isHrBusinessPackActive,
  isHrCapabilityBlocked,
} from "@/lib/integration-intelligence/hr/types";
import {
  buildHrActionDefinitions,
  buildHrReadToolDefinitions,
  buildHrSchemaEntities,
  mapHrCapabilitiesToRefs,
  mergeHrCapabilities,
} from "./merge-hr-runtime";
import {
  createEmptyCompanionHrContext,
  filterHrCapabilitiesForPrivacy,
  listEnabledHrCapabilities,
} from "./companion-hr-context";
import {
  buildBlockedHrOperationAnswer,
  buildExternalHrUnavailableAnswer,
  buildHrProviderDiscoveryAnswer,
  hasBlockedHrOperationIntent,
  hasHrProviderIntent,
  matchHrProviderQuery,
} from "./hr-answer";
import { buildActionDefinitionFromHrCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listHrProviderManifests();
assert.ok(manifests.length >= 7);

for (const blocked of HR_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isHrCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isHrBusinessPackActive(["hr_pack"]), true);
assert.equal(isHrBusinessPackActive(["people"]), true);
assert.equal(isHrBusinessPackActive(["aipify_hosts"]), false);
assert.ok(HR_BUSINESS_PACK_KEYS.includes("hr_pack"));

const employeeDirectory = manifests.find(
  (manifest) => manifest.provider_key === "workforce_employee_directory",
);
assert.ok(employeeDirectory);
assert.equal(employeeDirectory?.business_pack_key, "hr_pack");

const requiredCapabilities = [
  "employee.read",
  "team.read",
  "department.read",
  "role.read",
  "absence.read",
  "schedule.read",
  "onboarding.read",
  "training.read",
  "certification.read",
  "performance.read",
  "employee.update",
  "onboarding.create",
  "task.assign",
] as const;

for (const capabilityKey of requiredCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const hrContext = createEmptyCompanionHrContext({
  employee_management_enabled: true,
  employee_lifecycle_enabled: true,
  people_operations_enabled: true,
  team_center_enabled: true,
  workforce_scheduling_enabled: true,
  absence_coverage_enabled: true,
  vacation_mode_active: true,
  role_filter_active: true,
  department_scope_active: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "onboarding_in_progress", count: 2 },
    { signal_key: "expiring_certifications", count: 1 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    employee_management_enabled: manifest.source_engine === "employee_management",
    employee_lifecycle_enabled: manifest.source_engine === "employee_lifecycle",
    people_operations_enabled: manifest.source_engine === "people_operations",
    team_center_enabled: manifest.source_engine === "team_center",
    workforce_scheduling_enabled: manifest.source_engine === "workforce_scheduling",
    absence_coverage_enabled: manifest.source_engine === "absence_coverage",
    employee_knowledge_enabled: manifest.source_engine === "employee_knowledge",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: manifest.business_pack_key === "hr_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildHrCapabilityId(
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
      enabled:
        (!capability.required_permission || capability.required_permission === "employees.view") &&
        (capability.operation === "read" || capability.approval_required),
    })),
  ),
});

const capabilityRefs = mapHrCapabilitiesToRefs(hrContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "hr_provider"));

const mergedCapabilities = mergeHrCapabilities([], hrContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildHrSchemaEntities(hrContext, ["employees.view", "people.view"]);
assert.ok(schemaEntities.length > 0);

const readTools = buildHrReadToolDefinitions({
  hrContext,
  effectivePermissions: ["employees.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const onboardingCreate = hrContext.capabilities.find(
  (capability) =>
    capability.capability_key === "onboarding.create" &&
    capability.provider_key === "workforce_lifecycle",
);
assert.ok(onboardingCreate);

const onboardingDefinition = buildActionDefinitionFromHrCapability(onboardingCreate!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(onboardingDefinition);
assert.equal(onboardingDefinition?.source, "hr_provider");
assert.equal(onboardingDefinition?.enabled, true);

const hrActions = buildHrActionDefinitions({
  hrContext,
  effectivePermissions: ["employees.manage", "people.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(hrActions.length > 0);
assert.ok(hrActions.every((action) => action.approval_required));

const privateCapabilities = filterHrCapabilitiesForPrivacy({
  ...hrContext,
  capabilities: hrContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const permissionFiltered = buildHrSchemaEntities(
  {
    ...hrContext,
    capabilities: hrContext.capabilities.map((capability) =>
      capability.required_permission === "people.view"
        ? { ...capability, enabled: false }
        : capability,
    ),
  },
  ["employees.view"],
);
assert.ok(
  permissionFiltered.some((entity) => entity.entity_key.includes("workforce_employee_directory")),
);
assert.ok(
  permissionFiltered.every((entity) => !entity.required_permissions.includes("people.view")),
);

const enabled = listEnabledHrCapabilities(hrContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ hrContext });
const match = matchHrProviderQuery("show employee team absence and onboarding status", tenantContext);
assert.ok(match);
assert.equal(hasHrProviderIntent("hr people operations workforce employee"), true);
assert.equal(hasBlockedHrOperationIntent("salary change and terminate employee"), true);

const discovery = buildHrProviderDiscoveryAnswer(match!, hrContext, t);
assert.ok(discovery.directAnswer.includes("hr.discoveryLead"));
assert.ok(discovery.explanation?.includes("hr.departmentScopeActive"));
assert.ok(discovery.explanation?.includes("hr.commandBriefEventsLinked"));

const blocked = buildBlockedHrOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("hr.blockedOperationLead"));

const externalUnavailable = buildExternalHrUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("hr.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveHrProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "airbnb", "frisør", "salon"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-hr-context.ts",
  "load-companion-hr-context.ts",
  "merge-hr-runtime.ts",
  "hr-answer.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenTerms) {
    assert.equal(new RegExp(`\\b${term}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"hr"'), locale);
}

console.log("phase21 companion runtime tests passed");
