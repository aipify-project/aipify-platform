import assert from "node:assert/strict";
import {
  COMPANION_SEMANTIC_FALLBACK_ORDER,
  COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
  COMPANION_SEMANTIC_PRIMARY_MECHANISM,
} from "./companion-semantic-policy";
import { resolveCompanionSemanticIntent } from "./companion-semantic-query-match";
import { UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS } from "@/lib/unonight/provider-adapter/semantic-descriptors";

assert.equal(COMPANION_SEMANTIC_PRIMARY_MECHANISM, "manifest_schema_driven");
assert.equal(COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE, "fallback_only");
assert.deepEqual(COMPANION_SEMANTIC_FALLBACK_ORDER[0], "manifest_entity_alias");

const memberIntent = resolveCompanionSemanticIntent({
  query: "Hvor mange medlemmer har vi?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});

assert.equal(memberIntent.entity, "member");
assert.equal(memberIntent.operation, "count");
assert.equal(memberIntent.metric, "total");
assert.equal(memberIntent.time_scope, "current");
assert.equal(memberIntent.capability_candidates[0], "member.read");
assert.equal(memberIntent.confidence, "high");

const newMemberIntent = resolveCompanionSemanticIntent({
  query: "Hvor mange nye medlemmer har vi fått siden sist?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});

assert.equal(newMemberIntent.entity, "member");
assert.equal(newMemberIntent.operation, "count");
assert.equal(newMemberIntent.metric, "new");
assert.equal(newMemberIntent.time_scope, "since_last");
assert.equal(newMemberIntent.capability_candidates[0], "member.read");

const moderationIntent = resolveCompanionSemanticIntent({
  query: "Er det noe som venter på moderering?",
  descriptors: UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS,
  locale: "no",
});

assert.equal(moderationIntent.capability_candidates[0], "moderation_queue.read");

console.log("companion-semantic-policy.test.ts: all assertions passed");
