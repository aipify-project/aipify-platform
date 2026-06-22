import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  COMPANION_CAPABILITY_RESOLUTION,
  COMPANION_CUSTOMER_PHRASES_IN_CORE,
  COMPANION_EXACT_PHRASE_MATCH,
  COMPANION_GENERIC_FALLBACK,
  COMPANION_METRIC_RESOLUTION,
  COMPANION_PROXY_METRIC_AS_EXACT_ANSWER,
  COMPANION_QUERY_ROUTING,
  COMPANION_RESOLUTION_PIPELINE,
} from "@/lib/companion-runtime/companion-semantic-policy";
import { listRoutingSurfacesThatCanOverrideSemantic } from "@/lib/companion-runtime/companion-semantic-routing-map";
import {
  mapSemanticIntentToRequestedMetric,
  resolveCompanionSemanticIntent,
  resolveRequestedMetricFromDescriptor,
} from "@/lib/companion-runtime/companion-semantic-query-match";
import {
  resolveCompanionSemanticQuery,
  resolvedIntentToProviderMatch,
} from "@/lib/companion-runtime/companion-semantic-resolver";
import { updateConversationSemanticContext } from "@/lib/companion-runtime/companion-semantic-outcome";
import {
  createEmptyCompanionCommunityContext,
} from "@/lib/companion-runtime/companion-community-context";
import { matchCommunityProviderQuery } from "@/lib/companion-runtime/community-answer";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import {
  applyUnonightProviderAdapterToCommunityContext,
  buildCompanionPlatformKnowledgeTranslator,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
} from "@/lib/unonight/provider-adapter";
import { UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS } from "@/lib/unonight/provider-adapter/semantic-descriptors";

assert.equal(COMPANION_QUERY_ROUTING, "semantic_intent_first");
assert.equal(COMPANION_EXACT_PHRASE_MATCH, "support_only");
assert.equal(COMPANION_CAPABILITY_RESOLUTION, "manifest_schema_driven");
assert.equal(COMPANION_METRIC_RESOLUTION, "semantic_and_schema_validated");
assert.equal(COMPANION_GENERIC_FALLBACK, "last_resort");
assert.equal(COMPANION_CUSTOMER_PHRASES_IN_CORE, "forbidden");
assert.equal(COMPANION_PROXY_METRIC_AS_EXACT_ANSWER, "forbidden");
assert.equal(COMPANION_RESOLUTION_PIPELINE.at(-1), "generic_fallback");

const overrideSurfaces = listRoutingSurfacesThatCanOverrideSemantic();
assert.ok(overrideSurfaces.every((entry) => entry.role === "fallback_only" || entry.role === "support"));

const memberDescriptor = UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS.find(
  (entry) => entry.capability_key === "member.read",
)!;

const memberTotalPhrases = [
  "Hvor mange medlemmer har vi?",
  "Hvor mange er registrert?",
  "Hvor stor er medlemsbasen?",
  "Antall brukere nå?",
  "Hvor mange har vi nå?",
  "Hvor mangen medlemmer har vi?",
];

for (const phrase of memberTotalPhrases) {
  const intent = resolveCompanionSemanticIntent({
    query: phrase,
    descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
    locale: "no",
  });
  assert.equal(intent.entity, "member", phrase);
  assert.equal(intent.capability_candidates[0], "member.read", phrase);
  const metric = resolveRequestedMetricFromDescriptor({ descriptor: memberDescriptor, intent });
  assert.equal(metric.requested_metric, "total_members", phrase);
}

const newMemberIntent = resolveCompanionSemanticIntent({
  query: "Har vi fått noen nye?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});
assert.equal(newMemberIntent.metric, "new");
assert.equal(
  resolveRequestedMetricFromDescriptor({ descriptor: memberDescriptor, intent: newMemberIntent })
    .requested_metric,
  "new_members",
);

const sinceLastIntent = resolveCompanionSemanticIntent({
  query: "Hvor mange kom til siden sist?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});
assert.equal(
  resolveRequestedMetricFromDescriptor({ descriptor: memberDescriptor, intent: sinceLastIntent })
    .requested_metric,
  "new_members",
);

const growthIntent = resolveCompanionSemanticIntent({
  query: "Hvordan utvikler medlemstallet seg?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});
assert.equal(growthIntent.operation, "trend");
assert.equal(
  resolveRequestedMetricFromDescriptor({ descriptor: memberDescriptor, intent: growthIntent })
    .requested_metric,
  "member_growth",
);

const listIntent = resolveCompanionSemanticIntent({
  query: "Hvilke medlemmer har vi?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});
assert.equal(listIntent.operation, "list");
assert.equal(
  resolveRequestedMetricFromDescriptor({ descriptor: memberDescriptor, intent: listIntent })
    .requested_metric,
  "member_list",
);

const baseContext = applyUnonightProviderAdapterToCommunityContext(
  createEmptyCompanionCommunityContext({
    community_network_center_enabled: true,
    moderation_engine_enabled: true,
    group_count: 12,
    discussion_count: 8,
    pending_moderation_count: 3,
    reports_attention_count: 1,
    listing_review_count: 4,
  }),
  {
    organizationId: "org-unonight",
    subscriptionStatus: "active",
    connectedProviders: ["unonight"],
    activeBusinessPacks: ["community_pack"],
    effectivePermissions: ["customer_community.view", "moderation.view"],
  },
);

const tenant = createEmptyCompanionTenantContext({
  communityContext: baseContext,
  connectedProviders: ["unonight"],
});

const followUpResolved = resolveCompanionSemanticQuery({
  query: "Hvor mange har vi nå?",
  locale: "no",
  manifests: listCommunityProviderManifests(),
  conversation: {
    previous_entity: "member",
    previous_capability_key: "member.read",
    previous_requested_metric: "total_members",
  },
  preferredProviderKeys: [UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY],
});
assert.equal(followUpResolved.entity, "member");
assert.equal(followUpResolved.requested_metric, "total_members");
assert.equal(followUpResolved.conversation_reference, true);

const bareCount = resolveCompanionSemanticQuery({
  query: "Hvor mange har vi nå?",
  locale: "no",
  manifests: listCommunityProviderManifests(),
  preferredProviderKeys: [UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY],
});
assert.equal(bareCount.outcome, "intent_ambiguous");

const moderationResolved = resolveCompanionSemanticQuery({
  query: "Er det noe som venter på moderering?",
  locale: "no",
  manifests: listCommunityProviderManifests(),
  preferredProviderKeys: [UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY],
});
assert.equal(moderationResolved.capability_key, "moderation_queue.read");
assert.equal(moderationResolved.requested_metric, "pending_moderation");

const match = matchCommunityProviderQuery(
  "Hvor mange medlemmer har vi?",
  tenant,
  "no",
);
assert.equal(match?.provider_key, UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY);
assert.equal(match?.capability_key, "member.read");
assert.equal(match?.requested_metric, "total_members");

const context = updateConversationSemanticContext(null, followUpResolved);
assert.equal(context.previous_entity, "member");

const locales: CustomerActiveLocale[] = ["no", "en", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const t = buildCompanionPlatformKnowledgeTranslator(locale);
  const resolved = resolveCompanionSemanticQuery({
    query: locale === "no" ? "Hvor mange medlemmer har vi?" : "How many members do we have?",
    locale,
    manifests: listCommunityProviderManifests(),
    preferredProviderKeys: [UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY],
  });
  const providerMatch = resolvedIntentToProviderMatch(resolved);
  assert.ok(providerMatch?.capability_key, locale);
  const clarification = t("customerApp.companionPlatformKnowledge.semanticRouting.clarification.bareCount");
  assert.equal(clarification.includes("customerApp."), false, locale);
}

const coreFiles = [
  "lib/companion-runtime/companion-semantic-resolver.ts",
  "lib/companion-runtime/community-answer.ts",
  "lib/companion-runtime/companion-semantic-query-match.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  assert.equal(/Hvor mange medlemmer|modereringskø|unonight_community/i.test(source), false, file);
}

assert.equal(
  mapSemanticIntentToRequestedMetric({
    entity: "member",
    metric: "total",
    timeScope: "current",
  }).requested_metric,
  "total_members",
);

execSync("npx tsx lib/companion-runtime/phase31b.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/companion-semantic-invariant.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/companion-semantic-policy.test.ts", { stdio: "inherit" });

console.log("phase32.test.ts: all assertions passed");
