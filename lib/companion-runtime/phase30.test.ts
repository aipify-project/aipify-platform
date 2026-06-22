import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  UNONIGHT_ADAPTER_SOURCE_MAP,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES,
  applyUnonightProviderAdapterToCommunityContext,
  clearUnonightProviderAdapterAuditTrailForTests,
  evaluateUnonightProviderAdapterActivationGate,
  getUnonightAdapterSource,
  listUnonightProviderAdapterAuditTrail,
  normalizeUnonightProviderAdapterRecords,
} from "@/lib/unonight/provider-adapter";
import { getCommunityProviderManifest, listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import {
  createEmptyCompanionCommunityContext,
} from "@/lib/companion-runtime/companion-community-context";
import {
  hasCommunityProviderIntent,
  matchCommunityProviderQuery,
} from "@/lib/companion-runtime/community-answer";
import { resolveCommunityProviderAdapterGroundedAnswer } from "@/lib/companion-runtime/community-provider-adapter-answer";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";

clearUnonightProviderAdapterAuditTrailForTests();

const manifest = getCommunityProviderManifest(UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY);
assert.ok(manifest, "unonight community adapter manifest registered");
assert.equal(manifest?.source_engine, "community_pack_adapter");

for (const capability of UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES) {
  assert.ok(
    manifest?.capabilities.some((entry) => entry.capability_key === capability),
    capability,
  );
  assert.ok(getUnonightAdapterSource(capability), `${capability} source map`);
}

assert.equal(UNONIGHT_ADAPTER_SOURCE_MAP.every((entry) => entry.read_only), true);
assert.equal(
  UNONIGHT_ADAPTER_SOURCE_MAP.some((entry) => entry.status === "live"),
  true,
);
assert.equal(
  UNONIGHT_ADAPTER_SOURCE_MAP.some((entry) => entry.status === "partial"),
  true,
);

const gateActive = evaluateUnonightProviderAdapterActivationGate({
  subscriptionStatus: "active",
  connectedProviders: ["unonight"],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view", "moderation.view"],
  communityNetworkEnabled: true,
  moderationEngineEnabled: true,
  permissionDenied: false,
  appEntitlementBlocked: false,
  smokeTestPassed: true,
});
assert.equal(gateActive.status, "active");

const gateDisabled = evaluateUnonightProviderAdapterActivationGate({
  subscriptionStatus: "paused",
  connectedProviders: ["unonight"],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view"],
  communityNetworkEnabled: true,
  moderationEngineEnabled: false,
  permissionDenied: false,
  appEntitlementBlocked: true,
  smokeTestPassed: false,
});
assert.equal(gateDisabled.status, "disabled");

const gateOtherTenant = evaluateUnonightProviderAdapterActivationGate({
  subscriptionStatus: "active",
  connectedProviders: [],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view"],
  communityNetworkEnabled: true,
  moderationEngineEnabled: false,
  permissionDenied: false,
  appEntitlementBlocked: false,
  smokeTestPassed: true,
});
assert.equal(gateOtherTenant.status, "disabled");

const baseContext = createEmptyCompanionCommunityContext({
  community_network_center_enabled: true,
  moderation_engine_enabled: true,
  new_members_count: 12,
  pending_moderation_count: 3,
  pending_verification_count: 2,
  reports_attention_count: 1,
  listing_review_count: 4,
  command_brief_signals: [{ signal_key: "new_members", count: 12 }],
});

const merged = applyUnonightProviderAdapterToCommunityContext(baseContext, {
  organizationId: "org-unonight",
  subscriptionStatus: "active",
  connectedProviders: ["unonight"],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view", "moderation.view"],
});

assert.ok(merged.external_provider_adapters?.length === 1);
assert.equal(merged.external_provider_adapters?.[0]?.activation.status, "active");
assert.ok(merged.external_provider_adapters?.[0]?.records.length > 0);
assert.ok(listUnonightProviderAdapterAuditTrail().length >= 1);

const moderationRecord = merged.external_provider_adapters?.[0]?.records.find(
  (record) => record.capability_key === "moderation_queue.read",
);
assert.ok(moderationRecord);
assert.equal(moderationRecord?.count, 3);
assert.ok(moderationRecord?.source_reference.includes("get_aipify_moderation_dashboard"));
assert.equal(moderationRecord?.permission_scope, "moderation.view");

const moderationReadiness = merged.external_provider_adapters?.[0]?.capability_readiness.find(
  (entry) => entry.capability_key === "moderation_queue.read",
);
assert.equal(moderationReadiness?.status, "production_ready_candidate");

const memberReadiness = merged.external_provider_adapters?.[0]?.capability_readiness.find(
  (entry) => entry.capability_key === "member.read",
);
assert.equal(memberReadiness?.status, "connected_but_partial");

const tenantA = createEmptyCompanionTenantContext({
  communityContext: merged,
  connectedProviders: ["unonight"],
});

const tenantB = createEmptyCompanionTenantContext({
  communityContext: createEmptyCompanionCommunityContext({
    community_network_center_enabled: true,
    new_members_count: 99,
  }),
  connectedProviders: [],
});

assert.equal(
  applyUnonightProviderAdapterToCommunityContext(tenantB.communityContext, {
    organizationId: "org-other",
    subscriptionStatus: "active",
    connectedProviders: [],
    activeBusinessPacks: ["community_pack"],
    effectivePermissions: ["customer_community.view"],
  }).external_provider_adapters?.length ?? 0,
  0,
);

assert.equal(hasCommunityProviderIntent("Hvor mange nye medlemmer har vi fått siden sist?"), true);
assert.equal(hasCommunityProviderIntent("Er det noe som venter på moderering?"), true);
assert.equal(hasCommunityProviderIntent("Har vi verifiseringer som venter?"), true);

const memberMatch = matchCommunityProviderQuery(
  "Hvor mange nye medlemmer har vi fått siden sist?",
  tenantA,
  "no",
);
assert.equal(memberMatch?.provider_key, UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY);
assert.equal(memberMatch?.capability_key, "member.read");

const moderationMatch = matchCommunityProviderQuery(
  "Er det noe som venter på moderering?",
  tenantA,
  "no",
);
assert.equal(moderationMatch?.capability_key, "moderation_queue.read");

const t = (key: string) => {
  if (key.endsWith(".groundedLead")) {
    return "{capability}: {count}";
  }
  if (key.endsWith(".valueMissing")) {
    return "missing";
  }
  return key;
};
const grounded = resolveCommunityProviderAdapterGroundedAnswer(
  moderationMatch!,
  tenantA.communityContext,
  t,
  "no",
);
assert.ok(grounded?.directAnswer.includes("3"));

const emptyContext = applyUnonightProviderAdapterToCommunityContext(
  createEmptyCompanionCommunityContext({
    community_network_center_enabled: true,
    moderation_engine_enabled: true,
    new_members_count: null,
    pending_moderation_count: null,
  }),
  {
    organizationId: "org-unonight",
    subscriptionStatus: "active",
    connectedProviders: ["unonight"],
    activeBusinessPacks: ["community_pack"],
    effectivePermissions: ["customer_community.view", "moderation.view"],
  },
);

const emptyModerationReadiness = emptyContext.external_provider_adapters?.[0]?.capability_readiness.find(
  (entry) => entry.capability_key === "moderation_queue.read",
);
assert.equal(emptyModerationReadiness?.status, "connected_but_partial");

const normalized = normalizeUnonightProviderAdapterRecords({
  organizationId: "org-1",
  fetchedAt: new Date().toISOString(),
  counts: {
    new_members_count: 5,
    pending_moderation_count: 1,
    pending_verification_count: 0,
    reports_attention_count: 0,
    listing_review_count: 0,
    activity_count: 5,
  },
  effectivePermissions: ["customer_community.view", "moderation.view"],
  gateActive: true,
});

for (const record of normalized.records) {
  const serialized = JSON.stringify(record);
  assert.equal(/password|token|secret|email|birthday/i.test(serialized), false);
  assert.equal(record.count === null || typeof record.count === "number", true);
}

const runtimeFiles = [
  "lib/companion-runtime/orchestrator.ts",
  "lib/companion-runtime/companion-tool-definition.ts",
  "lib/companion-platform-knowledge/platform-corpus.ts",
];
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  assert.equal(/unonight/i.test(source), false, file);
}

assert.ok(listCommunityProviderManifests().some((entry) => entry.provider_key === UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY));

console.log("phase30.test.ts: all assertions passed");
