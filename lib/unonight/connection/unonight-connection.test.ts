import assert from "node:assert/strict";
import {
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_PLACEHOLDER_TOKENS,
  assertProductionUnonightToken,
  buildUnonightConnectionUrl,
  classifyUnonightHttpFailure,
  isUnonightPlaceholderToken,
  parseUnonightConnectionContract,
  requiresLiveHttpForSuccess,
  resolveUnonightApiBaseUrl,
  testUnonightReadOnlyConnection,
} from "./index";

async function runTests() {
  for (const token of UNONIGHT_PLACEHOLDER_TOKENS) {
    assert.equal(isUnonightPlaceholderToken(token), true);
  }
  assert.throws(() => assertProductionUnonightToken("unonight-pilot-token"), /invalid_token/);

  const contract = parseUnonightConnectionContract({
    connected: true,
    provider: "unonight",
    organization_id: "org-unonight-1",
    organization_name: "Unonight",
    access_mode: "read_only",
    scopes: ["metadata.read", "organization.read"],
    api_version: "v1",
  });
  assert.ok(contract);
  assert.equal(contract?.access_mode, "read_only");

  const invalidToken = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "invalid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
  });
  assert.equal(invalidToken.ok, false);
  if (!invalidToken.ok) assert.equal(invalidToken.code, "invalid_token");

  const revoked = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "revoked" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
  });
  assert.equal(revoked.ok, false);
  if (!revoked.ok) assert.equal(revoked.code, "expired_or_revoked");

  const wrongOrg = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    expectedOrganizationId: "expected-org",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          connected: true,
          provider: "unonight",
          organization_id: "other-org",
          organization_name: "Other",
          access_mode: "read_only",
          scopes: UNONIGHT_DEFAULT_SCOPES,
          api_version: "v1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ),
  });
  assert.equal(wrongOrg.ok, false);
  if (!wrongOrg.ok) assert.equal(wrongOrg.code, "wrong_org");

  const missingScope = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          connected: true,
          provider: "unonight",
          organization_id: "org-unonight-1",
          organization_name: "Unonight",
          access_mode: "read_only",
          scopes: ["metadata.read"],
          api_version: "v1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ),
  });
  assert.equal(missingScope.ok, false);
  if (!missingScope.ok) assert.equal(missingScope.code, "missing_scope");

  const unreachable = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () => {
      throw new TypeError("fetch failed");
    },
  });
  assert.equal(unreachable.ok, false);
  if (!unreachable.ok) assert.equal(unreachable.code, "unreachable");

  const valid = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          connected: true,
          provider: "unonight",
          organization_id: "org-unonight-1",
          organization_name: "Unonight",
          access_mode: "read_only",
          scopes: UNONIGHT_DEFAULT_SCOPES,
          api_version: "v1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ),
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.contract.organization_id, "org-unonight-1");
    assert.equal(valid.contract.access_mode, "read_only");
  }

  assert.equal(requiresLiveHttpForSuccess(), true);
  assert.equal(
    buildUnonightConnectionUrl("https://platform.unonight.com"),
    "https://platform.unonight.com/api/aipify/v1/connection"
  );
  assert.equal(classifyUnonightHttpFailure({ status: 504 }), "timeout");
  assert.equal(resolveUnonightApiBaseUrl("https://custom.example"), "https://custom.example");

  console.log("unonight connection foundation tests passed");
}

void runTests();
