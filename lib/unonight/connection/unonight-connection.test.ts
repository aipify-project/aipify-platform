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
  resolveUnonightBaseUrlForForm,
  testUnonightReadOnlyConnection,
  validateUnonightBaseUrlInput,
} from "./index";

const VALID_TOKEN = "uno_aipify_valid-looking-token-abcdef12";

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

  const okContract = parseUnonightConnectionContract({
    ok: true,
    organization_id: "org-unonight-1",
    organization_name: "Unonight",
    access_mode: "read_only",
    scopes: UNONIGHT_DEFAULT_SCOPES,
  });
  assert.ok(okContract);
  assert.equal(okContract?.api_version, "v1");

  const nestedContract = parseUnonightConnectionContract({
    connected: true,
    organization: { id: "org-unonight-1", name: "Unonight" },
    access_mode: "read_only",
    scopes: UNONIGHT_DEFAULT_SCOPES,
    api_version: "v1",
  });
  assert.ok(nestedContract);

  const productionContract = parseUnonightConnectionContract({
    scopes: ["metadata.read", "organization.read"],
    status: "connected",
    read_only: true,
    connection: {
      endpoint: "/api/aipify/v1/connection",
      token_hint: "uno_aipify_hint",
      last_used_at: "2026-06-22T09:58:43.071129+00:00",
    },
    api_version: "v1",
    organization: {
      id: "unonight",
      name: "Unonight",
      base_url: "https://www.unonight.com",
    },
  });
  assert.ok(productionContract);
  assert.equal(productionContract?.access_mode, "read_only");
  assert.equal(productionContract?.organization_slug, "unonight");
  assert.ok(
    productionContract?.scopes.some((scope) => scope.toLowerCase() === "integration.status.read")
  );

  const invalidToken = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "AUTH_FAILED" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
  });
  assert.equal(invalidToken.ok, false);
  if (!invalidToken.ok) {
    assert.equal(invalidToken.code, "invalid_token");
    assert.equal(invalidToken.diagnostics.safe_response_code, "AUTH_FAILED");
    assert.equal(
      invalidToken.diagnostics.final_endpoint,
      "https://example.test/api/aipify/v1/connection"
    );
  }

  const revoked = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "revoked" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
  });
  assert.equal(revoked.ok, false);
  if (!revoked.ok) assert.equal(revoked.code, "revoked_token");

  const wrongOrg = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
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
  if (!wrongOrg.ok) assert.equal(wrongOrg.code, "organization_mismatch");

  const missingScope = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          ok: true,
          organization_id: "org-unonight-1",
          organization_name: "Unonight",
          access_mode: "read_only",
          scopes: ["metadata.read"],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ),
  });
  assert.equal(missingScope.ok, false);
  if (!missingScope.ok) assert.equal(missingScope.code, "missing_required_scope");

  const unreachable = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () => {
      throw new TypeError("fetch failed");
    },
  });
  assert.equal(unreachable.ok, false);
  if (!unreachable.ok) assert.equal(unreachable.code, "endpoint_unreachable");

  const invalidPrefix = await testUnonightReadOnlyConnection({
    bearerToken: "valid-looking-token-abcdef12",
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }),
  });
  assert.equal(invalidPrefix.ok, false);
  if (!invalidPrefix.ok) assert.equal(invalidPrefix.code, "invalid_token");

  const valid = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
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
    assert.equal(valid.diagnostics.http_status, 200);
    assert.equal(valid.diagnostics.schema_matched, true);
  }

  const productionLive = await testUnonightReadOnlyConnection({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    expectedOrganizationId: "32d748eb-9a66-4174-a416-18a813610d3e",
    expectedOrganizationSlug: "unonight",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          scopes: ["metadata.read", "organization.read"],
          status: "connected",
          read_only: true,
          api_version: "v1",
          organization: { id: "unonight", name: "Unonight" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ),
  });
  assert.equal(productionLive.ok, true);
  if (productionLive.ok) {
    assert.equal(productionLive.contract.organization_id, "unonight");
    assert.equal(productionLive.diagnostics.organization_matched, true);
    assert.ok(productionLive.diagnostics.compatibility_notes?.includes("status_connected"));
  }

  assert.equal(requiresLiveHttpForSuccess(), true);
  assert.equal(
    buildUnonightConnectionUrl("https://www.unonight.com"),
    "https://www.unonight.com/api/aipify/v1/connection"
  );
  assert.equal(classifyUnonightHttpFailure({ status: 504 }), "endpoint_unreachable");
  assert.equal(
    classifyUnonightHttpFailure({ status: 401, error: { error: "AUTH_FAILED" } }),
    "invalid_token"
  );
  assert.equal(resolveUnonightApiBaseUrl("https://custom.example"), "https://custom.example");
  assert.equal(resolveUnonightApiBaseUrl(null), "https://www.unonight.com");
  assert.equal(resolveUnonightApiBaseUrl("https://www.unonight.com"), "https://www.unonight.com");
  assert.equal(resolveUnonightApiBaseUrl("https://platform.unonight.com"), "https://www.unonight.com");

  const emailValidation = validateUnonightBaseUrlInput("admin@unonight.com");
  assert.equal(emailValidation.ok, false);
  if (!emailValidation.ok) assert.equal(emailValidation.code, "email_not_allowed");

  const formDefault = resolveUnonightBaseUrlForForm("admin@unonight.com");
  assert.equal(formDefault, "https://www.unonight.com");

  console.log("unonight connection foundation tests passed");
}

void runTests();
