import assert from "node:assert/strict";
import test from "node:test";
import { UNONIGHT_PLATFORM_METADATA_SCOPE } from "./constants";
import { testUnonightPlatformSnapshot } from "./fetch-snapshot";

const VALID_TOKEN = "uno_aipify_test_token_1234567890abcdef";

const SNAPSHOT_PAYLOAD = {
  status: "available",
  api_version: "v1",
  organization: {
    id: "unonight",
    name: "Unonight",
    base_url: "https://www.unonight.com",
  },
  platform: {
    environment: "production",
    version: "2026.06.1",
    supported_locales: ["en", "no"],
    active_modules: ["chat", "marketplace"],
  },
  checked_at: "2026-06-22T12:00:00.000Z",
};

test("platform snapshot does not block on stale stored scopes before live call", async () => {
  let called = false;
  const result = await testUnonightPlatformSnapshot({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () => {
      called = true;
      return new Response(JSON.stringify(SNAPSHOT_PAYLOAD), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  assert.equal(called, true);
  assert.equal(result.ok, true);
});

test("platform snapshot reports live missing scope only from Unonight 403", async () => {
  const result = await testUnonightPlatformSnapshot({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "missing_scope" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "missing_required_scope");
    assert.match(result.technicalReason, new RegExp(UNONIGHT_PLATFORM_METADATA_SCOPE));
  }
});

test("platform snapshot maps other 403 responses to forbidden", async () => {
  const result = await testUnonightPlatformSnapshot({
    bearerToken: VALID_TOKEN,
    baseUrl: "https://example.test",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "platform_snapshot_forbidden");
});
