import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  canPresentMetricBindingAsDirectAnswer,
} from "@/lib/integration-intelligence/community/metric-contract";
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
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  runUnonightAuthenticatedLiveE2e,
} from "@/lib/unonight/provider-adapter";
import { collectSemanticDescriptorsFromManifest } from "@/lib/companion-runtime/companion-semantic-query-match";
import { getCommunityProviderManifest } from "@/lib/integration-intelligence/community/registry";

assert.equal(COMPANION_QUERY_ROUTING, "semantic_intent_first");

const memberBindings = buildUnonightMetricBindings({
  capabilityKey: "member.read",
  counts: { group_count: 12, discussion_count: 8, pending_moderation_count: null, pending_verification_count: null, reports_attention_count: null, listing_review_count: null },
});

const groupBinding = memberBindings.find((entry) => entry.source_metric === "group_count");
const discussionBinding = memberBindings.find((entry) => entry.source_metric === "discussion_count");
assert.ok(groupBinding);
assert.ok(discussionBinding);
assert.equal(groupBinding?.requested_metric, "total_members");
assert.equal(groupBinding?.semantic_match, "incompatible");
assert.equal(canPresentMetricBindingAsDirectAnswer(groupBinding), false);
assert.equal(discussionBinding?.requested_metric, "new_members");
assert.equal(discussionBinding?.semantic_match, "incompatible");
assert.equal(canPresentMetricBindingAsDirectAnswer(discussionBinding), false);

const listingBindings = buildUnonightMetricBindings({
  capabilityKey: "listing.read",
  counts: { group_count: null, discussion_count: null, pending_moderation_count: null, pending_verification_count: null, reports_attention_count: null, listing_review_count: 4 },
});
const listingBinding = listingBindings[0];
assert.equal(listingBinding?.semantic_match, "proxy");
assert.equal(canPresentMetricBindingAsDirectAnswer(listingBinding), false);

const moderationBindings = buildUnonightMetricBindings({
  capabilityKey: "moderation_queue.read",
  counts: { group_count: null, discussion_count: null, pending_moderation_count: 3, pending_verification_count: null, reports_attention_count: null, listing_review_count: null },
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
});

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
  assert.equal(/\b12\b|\b8\b/.test(answer?.directAnswer ?? ""), false, locale);
  assert.match(
    answer?.explanation ?? "",
    /exact|eksakt|exakt|exacta|dokładn|præcist|precis|точн/i,
    locale,
  );
}

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
assert.equal(newMembers?.answer_status, "metric_gap");
assert.equal(newMembers?.direct_answer.includes("12"), false);

const moderationCount = report.question_results.find(
  (entry) => entry.question_id === "moderation_count" && entry.organization_key === "unonight",
);
assert.ok(moderationCount?.direct_answer.includes("3"));

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

console.log("phase31b.test.ts: all assertions passed");
