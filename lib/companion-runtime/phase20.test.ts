import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listHostsProviderManifests } from "@/lib/integration-intelligence/hosts/registry";
import {
  buildHostsCapabilityId,
  HOSTS_BLOCKED_CAPABILITY_KEYS,
  HOSTS_BUSINESS_PACK_KEYS,
  isHostsBusinessPackActive,
  isHostsCapabilityBlocked,
} from "@/lib/integration-intelligence/hosts/types";
import {
  buildHostsActionDefinitions,
  buildHostsReadToolDefinitions,
  buildHostsSchemaEntities,
  mapHostsCapabilitiesToRefs,
  mergeHostsCapabilities,
} from "./merge-hosts-runtime";
import {
  createEmptyCompanionHostsContext,
  filterHostsCapabilitiesForPrivacy,
  listEnabledHostsCapabilities,
} from "./companion-hosts-context";
import {
  buildBlockedHostsOperationAnswer,
  buildExternalHostsUnavailableAnswer,
  buildHostsProviderDiscoveryAnswer,
  hasBlockedHostsOperationIntent,
  hasHostsProviderIntent,
  matchHostsProviderQuery,
} from "./hosts-answer";
import { buildActionDefinitionFromHostsCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listHostsProviderManifests();
assert.ok(manifests.length >= 9);

for (const blocked of HOSTS_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isHostsCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isHostsBusinessPackActive(["aipify_hosts"]), true);
assert.equal(isHostsBusinessPackActive(["hosts_pack"]), true);
assert.equal(isHostsBusinessPackActive(["appointments_services"]), false);
assert.ok(HOSTS_BUSINESS_PACK_KEYS.includes("aipify_hosts"));

const shortTermProperty = manifests.find(
  (manifest) => manifest.provider_key === "short_term_property",
);
assert.ok(shortTermProperty);
assert.equal(shortTermProperty?.business_pack_key, "aipify_hosts");

const requiredCapabilities = [
  "property.read",
  "reservation.read",
  "availability.read",
  "guest.read",
  "cleaning.read",
  "maintenance.read",
  "payout.read",
  "revenue.read",
  "expense.read",
  "forecast.read",
  "report.export",
  "message.draft",
] as const;

for (const capabilityKey of requiredCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const hostsContext = createEmptyCompanionHostsContext({
  property_center_enabled: true,
  booking_center_enabled: true,
  guest_center_enabled: true,
  finance_center_enabled: true,
  portfolio_isolation_enabled: true,
  vacation_mode_active: true,
  command_brief_events_linked: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    property_center_enabled: manifest.source_engine === "property_center",
    booking_center_enabled: manifest.source_engine === "booking_center",
    guest_center_enabled: manifest.source_engine === "guest_center",
    calendar_center_enabled: manifest.source_engine === "calendar_center",
    operations_center_enabled: manifest.source_engine === "operations_center",
    finance_center_enabled: manifest.source_engine === "finance_center",
    communication_center_enabled: manifest.source_engine === "communication_center",
    reports_center_enabled: manifest.source_engine === "reports_center",
    access_center_enabled: false,
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: manifest.business_pack_key === "aipify_hosts" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildHostsCapabilityId(
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

const capabilityRefs = mapHostsCapabilitiesToRefs(hostsContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "hosts_provider"));

const mergedCapabilities = mergeHostsCapabilities([], hostsContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildHostsSchemaEntities(hostsContext, ["aipify_hosts.view"]);
assert.ok(schemaEntities.length > 0);

const readTools = buildHostsReadToolDefinitions({
  hostsContext,
  effectivePermissions: ["aipify_hosts.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const messageDraft = hostsContext.capabilities.find(
  (capability) =>
    capability.capability_key === "message.draft" &&
    capability.provider_key === "short_term_communications",
);
assert.ok(messageDraft);

const draftDefinition = buildActionDefinitionFromHostsCapability(messageDraft!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(draftDefinition);
assert.equal(draftDefinition?.source, "hosts_provider");
assert.equal(draftDefinition?.enabled, true);

const hostsActions = buildHostsActionDefinitions({
  hostsContext,
  effectivePermissions: ["aipify_hosts.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(hostsActions.length > 0);
assert.ok(hostsActions.every((action) => action.approval_required));

const privateCapabilities = filterHostsCapabilitiesForPrivacy({
  ...hostsContext,
  capabilities: hostsContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const enabled = listEnabledHostsCapabilities(hostsContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ hostsContext });
const match = matchHostsProviderQuery("show property reservations and revenue forecast", tenantContext);
assert.ok(match);
assert.equal(hasHostsProviderIntent("hosts property reservation finance"), true);
assert.equal(hasBlockedHostsOperationIntent("delete reservation and refund payment"), true);

const discovery = buildHostsProviderDiscoveryAnswer(match!, hostsContext, t);
assert.ok(discovery.directAnswer.includes("hosts.discoveryLead"));
assert.ok(discovery.explanation?.includes("hosts.portfolioIsolationActive"));
assert.ok(discovery.explanation?.includes("hosts.commandBriefEventsLinked"));

const blocked = buildBlockedHostsOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("hosts.blockedOperationLead"));

const externalUnavailable = buildExternalHostsUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("hosts.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveHostsProviderAnswer"));

const forbiddenHostsTerms = ["airbnb", "vrbo", "expedia", "booking.com"];
for (const term of forbiddenHostsTerms) {
  assert.equal(new RegExp(`\\b${term.replace(".", "\\.")}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-hosts-context.ts",
  "load-companion-hosts-context.ts",
  "merge-hosts-runtime.ts",
  "hosts-answer.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenHostsTerms) {
    assert.equal(new RegExp(`\\b${term.replace(".", "\\.")}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const commandBriefSource = fs.readFileSync(
  path.join(process.cwd(), "lib/command-center/command-brief-integration-status.ts"),
  "utf8",
);
assert.ok(commandBriefSource.includes('hosts:'));

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"hosts"'), locale);
}

console.log("phase20 companion runtime tests passed");
