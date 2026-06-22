import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  canPresentMetricBindingAsDirectAnswer,
  hasExactPresentableBinding,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import { COMPANION_QUERY_ROUTING } from "@/lib/companion-runtime/companion-semantic-policy";
import {
  mapSemanticIntentToRequestedMetric,
  resolveCompanionSemanticIntent,
} from "@/lib/companion-runtime/companion-semantic-query-match";
import {
  createEmptyCompanionCommunityContext,
} from "@/lib/companion-runtime/companion-community-context";
import {
  matchCommunityProviderQuery,
} from "@/lib/companion-runtime/community-answer";
import { resolveCommunityProviderAdapterGroundedAnswer } from "@/lib/companion-runtime/community-provider-adapter-answer";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import {
  buildUnonightMetricBindings,
  buildCompanionPlatformKnowledgeTranslator,
  applyUnonightProviderAdapterToCommunityContext,
  buildUnonightMemberStatisticsSnapshot,
  parseUnonightMemberStatisticsPayload,
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  UNONIGHT_MEMBER_METRIC_DEFINITIONS,
  UNONIGHT_MEMBER_STATISTICS_RPC,
  runUnonightAuthenticatedLiveE2e,
} from "@/lib/unonight/provider-adapter";
import { collectSemanticDescriptorsFromManifest } from "@/lib/companion-runtime/companion-semantic-query-match";
import { getCommunityProviderManifest } from "@/lib/integration-intelligence/community/registry";
import { getUnonightAdapterSource } from "@/lib/unonight/provider-adapter/source-map";

assert.equal(COMPANION_QUERY_ROUTING, "semantic_intent_first");

const memberStats = buildUnonightMemberStatisticsSnapshot({
  total_members: 2847,
  active_members: 1923,
  new_members_today: 14,
  new_members_7d: 87,
  new_members_30d: 312,
  new_members_since: 42,
  since_boundary_source: "since_last_login",
});

const memberBindings = buildUnonightMetricBindings({
  capabilityKey: "member.read",
  counts: {
    group_count: 12,
    discussion_count: 8,
    pending_moderation_count: null,
    pending_verification_count: null,
    reports_attention_count: null,
    listing_review_count: null,
    member_statistics: memberStats,
  },
});

const totalBinding = memberBindings.find((entry) => entry.source_metric === "total_members");
const newSinceBinding = memberBindings.find((entry) => entry.source_metric === "new_members_since");
assert.ok(totalBinding);
assert.ok(newSinceBinding);
assert.equal(totalBinding?.semantic_match, "exact");
assert.equal(canPresentMetricBindingAsDirectAnswer(totalBinding), true);
assert.equal(newSinceBinding?.requested_metric, "new_members");
assert.equal(newSinceBinding?.semantic_match, "exact");

const proxyFreeBindings = buildUnonightMetricBindings({
  capabilityKey: "member.read",
  counts: {
    group_count: 12,
    discussion_count: 8,
    pending_moderation_count: null,
    pending_verification_count: null,
    reports_attention_count: null,
    listing_review_count: null,
    member_statistics: null,
  },
});
assert.equal(proxyFreeBindings.length, 0);

const memberSource = getUnonightAdapterSource("member.read");
assert.equal(memberSource?.source_id, UNONIGHT_MEMBER_STATISTICS_RPC);
assert.equal(memberSource?.status, "live");

assert.ok(UNONIGHT_MEMBER_METRIC_DEFINITIONS.registered_member.length > 0);

const parsedPayload = parseUnonightMemberStatisticsPayload({
  found: true,
  total_members: 100,
  active_members: 80,
  new_members_today: 2,
  new_members_7d: 10,
  new_members_30d: 30,
  new_members_since: 5,
  member_growth: [],
  source_reference: "test",
  generated_at: "2026-06-22T10:00:00.000Z",
  timezone: "Europe/Oslo",
  period: { kind: "current", from: null, to: null },
  completeness: "complete",
  warnings: [],
});
assert.equal(parsedPayload.total_members, 100);

const listingBindings = buildUnonightMetricBindings({
  capabilityKey: "listing.read",
  counts: {
    group_count: null,
    discussion_count: null,
    pending_moderation_count: null,
    pending_verification_count: null,
    reports_attention_count: null,
    listing_review_count: 4,
    member_statistics: null,
  },
});
const listingBinding = listingBindings[0];
assert.equal(listingBinding?.semantic_match, "proxy");
assert.equal(canPresentMetricBindingAsDirectAnswer(listingBinding), false);

const moderationBindings = buildUnonightMetricBindings({
  capabilityKey: "moderation_queue.read",
  counts: {
    group_count: null,
    discussion_count: null,
    pending_moderation_count: 3,
    pending_verification_count: null,
    reports_attention_count: null,
    listing_review_count: null,
    member_statistics: null,
  },
});
assert.equal(moderationBindings[0]?.semantic_match, "exact");
assert.equal(canPresentMetricBindingAsDirectAnswer(moderationBindings[0]), true);

const baseContext = createEmptyCompanionCommunityContext({
  community_network_center_enabled: true,
  moderation_engine_enabled: true,
  group_count: 12,
  discussion_count: 8,
  pending_moderation_count: 3,
  pending_verification_count: 2,
  reports_attention_count: 1,
  listing_review_count: 4,
});

const merged = applyUnonightProviderAdapterToCommunityContext(baseContext, {
  organizationId: "org-unonight",
  subscriptionStatus: "active",
  connectedProviders: ["unonight"],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view", "moderation.view"],
  memberStatistics: memberStats,
});

assert.equal(
  hasExactPresentableBinding(
    buildUnonightMetricBindings({
      capabilityKey: "member.read",
      counts: {
        group_count: 12,
        discussion_count: 8,
        pending_moderation_count: null,
        pending_verification_count: null,
        reports_attention_count: null,
        listing_review_count: null,
        member_statistics: memberStats,
      },
    }),
  ),
  true,
);

const tenant = createEmptyCompanionTenantContext({
  communityContext: merged,
  connectedProviders: ["unonight"],
});

const manifest = getCommunityProviderManifest(UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY);
const descriptors = collectSemanticDescriptorsFromManifest(manifest);
const memberIntent = resolveCompanionSemanticIntent({
  query: "Hvor mange nye medlemmer har vi fått siden sist?",
  descriptors,
  locale: "no",
});
const requested = mapSemanticIntentToRequestedMetric({
  entity: memberIntent.entity,
  metric: memberIntent.metric,
  timeScope: memberIntent.time_scope,
});
assert.equal(requested.requested_metric, "new_members");

const memberMatch = matchCommunityProviderQuery(
  "Hvor mange nye medlemmer har vi fått siden sist?",
  tenant,
  "no",
);
assert.equal(memberMatch?.capability_key, "member.read");
assert.equal(memberMatch?.requested_metric, "new_members");

const locales: CustomerActiveLocale[] = ["no", "en", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const t = buildCompanionPlatformKnowledgeTranslator(locale);
  const answer = resolveCommunityProviderAdapterGroundedAnswer(
    memberMatch!,
    tenant.communityContext,
    t,
    locale,
  );
  assert.ok(answer?.directAnswer.length);
  assert.ok(answer?.explanation?.length);
  assert.equal(answer?.directAnswer.includes("customerApp."), false, locale);
  assert.match(answer?.directAnswer ?? "", /\b42\b/, locale);
  assert.equal(/\b12\b|\b8\b/.test(answer?.directAnswer ?? ""), false, locale);
}

const totalMatch = matchCommunityProviderQuery("Hvor mange medlemmer har vi?", tenant, "no");
assert.equal(totalMatch?.requested_metric, "total_members");
const totalAnswer = resolveCommunityProviderAdapterGroundedAnswer(
  totalMatch!,
  tenant.communityContext,
  buildCompanionPlatformKnowledgeTranslator("no"),
  "no",
);
assert.match(totalAnswer?.directAnswer ?? "", /\b2847\b/);

const report = runUnonightAuthenticatedLiveE2e({
  t: buildCompanionPlatformKnowledgeTranslator("no"),
  locale: "no",
});
for (const capability of UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES) {
  const readiness = report.capability_readiness_after_e2e.find(
    (entry) => entry.capability_key === capability,
  );
  assert.equal(readiness?.readiness, "production_ready_candidate", capability);
  assert.equal(readiness?.promoted_to_production_ready, false, capability);
}

const newMembers = report.question_results.find(
  (entry) => entry.question_id === "new_members" && entry.organization_key === "unonight",
);
assert.ok(newMembers);
assert.equal(newMembers?.answer_status, "grounded");
assert.match(newMembers?.direct_answer ?? "", /\b42\b/);
assert.equal(newMembers?.direct_answer.includes("12"), false);

const moderationCount = report.question_results.find(
  (entry) => entry.question_id === "moderation_count" && entry.organization_key === "unonight",
);
assert.ok(moderationCount?.direct_answer.includes("3"));

const mergedWithoutStats = applyUnonightProviderAdapterToCommunityContext(baseContext, {
  organizationId: "org-unonight",
  subscriptionStatus: "active",
  connectedProviders: ["unonight"],
  activeBusinessPacks: ["community_pack"],
  effectivePermissions: ["customer_community.view", "moderation.view"],
  memberStatistics: null,
});
const gapTenant = createEmptyCompanionTenantContext({
  communityContext: mergedWithoutStats,
  connectedProviders: ["unonight"],
});
const gapMatch = matchCommunityProviderQuery(
  "Hvor mange medlemmer har vi?",
  gapTenant,
  "no",
);
const gapAnswer = resolveCommunityProviderAdapterGroundedAnswer(
  gapMatch!,
  gapTenant.communityContext,
  buildCompanionPlatformKnowledgeTranslator("no"),
  "no",
);
assert.match(gapAnswer?.explanation ?? "", /exact|eksakt|exakt|exacta|dokładn|præcist|precis|точн/i);

const coreFiles = [
  "lib/companion-runtime/community-answer.ts",
  "lib/companion-runtime/companion-semantic-query-match.ts",
  "lib/integration-intelligence/community/metric-contract.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  assert.equal(/Hvor mange nye medlemmer|group_count|discussion_count|unonight_community/i.test(source), false, file);
}

execSync("npx tsx lib/companion-runtime/phase30.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/phase31.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/phase32.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/provider-layer-placement.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/phase33c.test.ts", { stdio: "inherit" });

console.log("phase33.test.ts: all assertions passed");
