import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
  COMPANION_SEMANTIC_PRIMARY_MECHANISM,
  COMPANION_SEMANTIC_QUERY_MATCH_MODULE,
} from "./companion-semantic-policy";

const repoRoot = join(import.meta.dirname, "..", "..");

assert.equal(COMPANION_SEMANTIC_PRIMARY_MECHANISM, "manifest_schema_driven");
assert.equal(COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE, "fallback_only");

const communityAnswerSource = readFileSync(
  join(repoRoot, "lib/companion-runtime/community-answer.ts"),
  "utf8",
);
const semanticMatchSource = readFileSync(
  join(repoRoot, COMPANION_SEMANTIC_QUERY_MATCH_MODULE),
  "utf8",
);
const unonightSemanticSource = readFileSync(
  join(repoRoot, "lib/unonight/provider-adapter/semantic-descriptors.ts"),
  "utf8",
);

assert.match(communityAnswerSource, /resolveCompanionSemanticIntent/);
assert.match(communityAnswerSource, /collectSemanticDescriptorsFromManifest/);
assert.doesNotMatch(communityAnswerSource, /\bunonight\b/i);
assert.doesNotMatch(communityAnswerSource, /modereringskø/);
assert.doesNotMatch(communityAnswerSource, /markedsplass/);

assert.match(semanticMatchSource, /resolveCompanionSemanticIntent/);
assert.match(semanticMatchSource, /phraseMatchesQuery/);
assert.doesNotMatch(semanticMatchSource, /\bunonight\b/i);

assert.match(unonightSemanticSource, /medlemmer/);
assert.match(unonightSemanticSource, /modereringskø/);
assert.doesNotMatch(unonightSemanticSource, /resolveCompanionSemanticIntent/);

const orchestratorSource = readFileSync(
  join(repoRoot, "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.doesNotMatch(orchestratorSource, /\bunonight\b/i);

console.log("companion-semantic-invariant.test.ts: all assertions passed");
