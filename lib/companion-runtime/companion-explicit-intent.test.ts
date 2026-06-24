import assert from "node:assert/strict";
import {
  blocksOrganizationMemberCapabilityQuery,
  extractProviderEntityHint,
  isCompanionRegistrationMetaQuery,
  isIntegrationInstallCheckQuery,
  isKnowledgeProviderFetchQuery,
  isMediaVerificationQuery,
  resolveCompanionExplicitIntent,
} from "@/lib/companion-runtime/companion-explicit-intent";
import { classifyCompanionSubmitPath, resolveDirectTurnRoute } from "@/lib/companion-runtime/companion-submit-path";
import { resolveOrganizationCapabilityRoute } from "@/lib/companion-runtime/organization-capability-resolution";

const GENERIC_PROVIDER = "nordic ledger partners";

const SEMANTIC_CASES = [
  {
    query: "Hvilken side er du registrert på?",
    kind: "companion_registration_meta",
    mustNotRouteMemberCount: true,
  },
  {
    query: `Hent FAQ-seksjonen fra ${GENERIC_PROVIDER}`,
    kind: "knowledge_provider_fetch",
    expectedProvider: GENERIC_PROVIDER,
    mustNotRouteMemberCount: false,
  },
  {
    query: "Importer organisasjonskunnskap fra ekstern provider",
    kind: "knowledge_provider_fetch",
    mustNotRouteMemberCount: false,
  },
  {
    query: "Kan du verifisere bilder?",
    kind: "media_verification",
    mustNotRouteMemberCount: false,
  },
  {
    query: "Sjekk Google Analytics om den er installert riktig",
    kind: "integration_install_check",
    mustNotRouteMemberCount: false,
  },
] as const;

for (const testCase of SEMANTIC_CASES) {
  const intent = resolveCompanionExplicitIntent(testCase.query);
  assert.ok(intent, testCase.query);
  assert.equal(intent?.kind, testCase.kind, testCase.query);
  assert.equal(classifyCompanionSubmitPath(testCase.query, "no"), "direct", testCase.query);
  assert.equal(resolveDirectTurnRoute(testCase.query, "no"), "exact_source", testCase.query);

  if ("expectedProvider" in testCase && testCase.expectedProvider) {
    assert.equal(intent?.provider_hint, testCase.expectedProvider, testCase.query);
  }

  if (testCase.mustNotRouteMemberCount) {
    assert.equal(blocksOrganizationMemberCapabilityQuery(testCase.query), true);
    assert.equal(resolveOrganizationCapabilityRoute(testCase.query, "no"), null);
  }
}

assert.equal(isCompanionRegistrationMetaQuery("Hvilken side er du registrert på?"), true);
assert.equal(isCompanionRegistrationMetaQuery("Hvor mange medlemmer har vi?"), false);
assert.equal(
  isKnowledgeProviderFetchQuery(`Hent kunnskapsseksjonen fra ${GENERIC_PROVIDER}`),
  true,
);
assert.equal(isKnowledgeProviderFetchQuery("Importer organisasjonskunnskap"), true);
assert.equal(isMediaVerificationQuery("Kan du verifisere bilder?"), true);
assert.equal(
  isIntegrationInstallCheckQuery("Sjekk Google Analytics om den er installert riktig"),
  true,
);
assert.equal(extractProviderEntityHint(`Hent FAQ fra ${GENERIC_PROVIDER}`), GENERIC_PROVIDER);
assert.equal(extractProviderEntityHint("Hent FAQ fra shopify"), null);

console.log("companion-explicit-intent.test.ts: ok");
