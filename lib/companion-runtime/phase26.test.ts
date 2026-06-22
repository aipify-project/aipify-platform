import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import {
  buildCommunityCapabilityId,
  COMMUNITY_BLOCKED_CAPABILITY_KEYS,
  COMMUNITY_BUSINESS_PACK_KEYS,
  isCommunityBusinessPackActive,
  isCommunityCapabilityBlocked,
} from "@/lib/integration-intelligence/community/types";
import {
  buildCommunityActionDefinitions,
  buildCommunityReadToolDefinitions,
  buildCommunitySchemaEntities,
  mapCommunityCapabilitiesToRefs,
  mergeCommunityCapabilities,
} from "./merge-community-runtime";
import {
  createEmptyCompanionCommunityContext,
  filterCommunityCapabilitiesForPrivacy,
  listEnabledCommunityCapabilities,
} from "./companion-community-context";
import {
  buildBlockedCommunityOperationAnswer,
  buildExternalCommunityUnavailableAnswer,
  buildCommunityProviderDiscoveryAnswer,
  hasBlockedCommunityOperationIntent,
  hasCommunityProviderIntent,
  matchCommunityProviderQuery,
} from "./community-answer";
import { buildActionDefinitionFromCommunityCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listCommunityProviderManifests();
assert.ok(manifests.length >= 6);

for (const blocked of COMMUNITY_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isCommunityCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isCommunityBusinessPackActive(["community_pack"]), true);
assert.equal(isCommunityBusinessPackActive(["engagement_pack"]), true);
assert.equal(isCommunityBusinessPackActive(["warehouse_pack"]), false);
assert.ok(COMMUNITY_BUSINESS_PACK_KEYS.includes("membership_pack"));

const networkCenter = manifests.find(
  (manifest) => manifest.provider_key === "community_network_center",
);
assert.ok(networkCenter);
assert.equal(networkCenter?.business_pack_key, "community_pack");

const requiredReadCapabilities = [
  "member.read",
  "membership.read",
  "activity.read",
  "engagement.read",
  "reward.read",
  "leaderboard.read",
  "referral.read",
  "birthday.read",
  "gift.read",
  "listing.read",
  "moderation_queue.read",
  "report.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const requiredWriteCapabilities = [
  "moderation.assign",
  "moderation.update",
  "reward.adjust",
] as const;

for (const capabilityKey of requiredWriteCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const communityContext = createEmptyCompanionCommunityContext({
  community_network_center_enabled: true,
  moderation_engine_enabled: true,
  client_relationship_loyalty_enabled: true,
  community_collective_intelligence_enabled: true,
  role_based_access_active: true,
  private_profile_data_filtered: true,
  birthday_data_limited: true,
  moderation_data_permission_gated: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "new_members", count: 5 },
    { signal_key: "pending_moderation", count: 2 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    community_network_center_enabled: manifest.source_engine === "community_network_center",
    moderation_engine_enabled: manifest.source_engine === "moderation_engine",
    client_relationship_loyalty_enabled: manifest.source_engine === "client_relationship_loyalty",
    community_collective_intelligence_enabled:
      manifest.source_engine === "community_collective_intelligence",
    community_engagement_services_enabled: false,
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active:
      manifest.business_pack_key === "community_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildCommunityCapabilityId(
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
        (!capability.required_permission ||
          capability.required_permission === "customer_community.view") &&
        (capability.operation === "read" || capability.approval_required) &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapCommunityCapabilitiesToRefs(communityContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "community_provider"));

const mergedCapabilities = mergeCommunityCapabilities([], communityContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildCommunitySchemaEntities(communityContext, [
  "customer_community.view",
  "moderation.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildCommunityReadToolDefinitions({
  communityContext,
  effectivePermissions: ["customer_community.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const moderationAssign = communityContext.capabilities.find(
  (capability) =>
    capability.capability_key === "moderation.assign" &&
    capability.provider_key === "moderation_engine",
);
assert.ok(moderationAssign);

const moderationDefinition = buildActionDefinitionFromCommunityCapability(moderationAssign!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(moderationDefinition);
assert.equal(moderationDefinition?.source, "community_provider");
assert.equal(moderationDefinition?.enabled, true);

const communityActions = buildCommunityActionDefinitions({
  communityContext,
  effectivePermissions: ["moderation.review", "customers.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(communityActions.length > 0);
assert.ok(communityActions.every((action) => action.approval_required));

const privateCapabilities = filterCommunityCapabilitiesForPrivacy({
  ...communityContext,
  capabilities: communityContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const enabled = listEnabledCommunityCapabilities(communityContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ communityContext });
const match = matchCommunityProviderQuery(
  "show community members engagement rewards and moderation queue",
  tenantContext,
);
assert.ok(match);
assert.equal(
  hasCommunityProviderIntent("community membership engagement reward moderation leaderboard"),
  true,
);
assert.equal(
  hasBlockedCommunityOperationIntent("delete member permanent ban irreversible points"),
  true,
);

const discovery = buildCommunityProviderDiscoveryAnswer(match!, communityContext, t);
assert.ok(discovery.directAnswer.includes("community.discoveryLead"));
assert.ok(discovery.explanation?.includes("community.privateProfileDataFiltered"));
assert.ok(discovery.explanation?.includes("community.commandBriefEventsLinked"));

const blocked = buildBlockedCommunityOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("community.blockedOperationLead"));

const externalUnavailable = buildExternalCommunityUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("community.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveCommunityProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "frisør", "salon", "vipps"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-community-context.ts",
  "load-companion-community-context.ts",
  "merge-community-runtime.ts",
  "community-answer.ts",
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
  assert.ok(raw.includes('"community"'), locale);
}

console.log("phase26 companion runtime tests passed");
