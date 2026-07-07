import assert from "node:assert/strict";
import {
  WebsiteKompisPositiveAvailabilityCache,
  buildWebsiteKompisPublicAvailabilityCacheKey,
  isWebsiteKompisHardUnavailableReason,
  isWebsiteKompisTransientPublicAvailabilityFailure,
  resolveWebsiteKompisPublicAvailabilityWithResilience,
} from "@/lib/marketing/website-kompis-public-availability-resilience";

const installId = "11111111-1111-4111-8111-111111111111";
const domain = "example-a.test";

function available() {
  return {
    available: true as const,
    reason: "available" as const,
    capabilityKey: "website_kompis" as const,
  };
}

function unavailable(
  reason:
    | "license_unknown"
    | "license_inactive"
    | "entitlement_missing"
    | "domain_unverified"
    | "install_missing",
) {
  return {
    available: false as const,
    reason,
    capabilityKey: "website_kompis" as const,
  };
}

async function runWebsiteKompisPublicAvailabilityResilienceTests() {
  assert.equal(isWebsiteKompisHardUnavailableReason("license_inactive"), true);
  assert.equal(isWebsiteKompisHardUnavailableReason("entitlement_missing"), true);
  assert.equal(isWebsiteKompisHardUnavailableReason("license_unknown"), false);

  assert.equal(
    isWebsiteKompisTransientPublicAvailabilityFailure(unavailable("license_unknown"), {
      installId,
      domain,
    }),
    true,
  );
  assert.equal(
    isWebsiteKompisTransientPublicAvailabilityFailure(unavailable("license_inactive"), {
      installId,
      domain,
    }),
    false,
  );
  assert.equal(
    isWebsiteKompisTransientPublicAvailabilityFailure(unavailable("license_unknown"), {
      installId: null,
      domain,
    }),
    false,
  );

  assert.equal(
    buildWebsiteKompisPublicAvailabilityCacheKey({ installId, domain: "Example-A.TEST" }),
    `${installId}|example-a.test`,
  );

  const cache = new WebsiteKompisPositiveAvailabilityCache();
  const cacheKey = buildWebsiteKompisPublicAvailabilityCacheKey({ installId, domain })!;

  cache.set(cacheKey, available());
  assert.deepEqual(cache.get(cacheKey), available());
  cache.clear();

  let attempts = 0;
  const retried = await resolveWebsiteKompisPublicAvailabilityWithResilience({
    visitorContext: { installId, domain },
    cache,
    resolveOnce: async () => {
      attempts += 1;
      return attempts === 1 ? unavailable("license_unknown") : available();
    },
  });
  assert.equal(attempts, 2);
  assert.equal(retried.available, true);
  assert.deepEqual(cache.get(cacheKey), available());

  const cacheForSession = new WebsiteKompisPositiveAvailabilityCache();
  cacheForSession.set(cacheKey, available());

  let sessionResolveCalls = 0;
  const cachedSession = await resolveWebsiteKompisPublicAvailabilityWithResilience({
    visitorContext: { installId, domain },
    cache: cacheForSession,
    resolveOnce: async () => {
      sessionResolveCalls += 1;
      return unavailable("license_unknown");
    },
  });
  assert.equal(sessionResolveCalls, 0);
  assert.equal(cachedSession.available, true);

  let hardAttempts = 0;
  const hardUnavailable = await resolveWebsiteKompisPublicAvailabilityWithResilience({
    visitorContext: { installId, domain },
    cache: new WebsiteKompisPositiveAvailabilityCache(),
    resolveOnce: async () => {
      hardAttempts += 1;
      return unavailable("license_inactive");
    },
  });
  assert.equal(hardAttempts, 1);
  assert.equal(hardUnavailable.reason, "license_inactive");
}

runWebsiteKompisPublicAvailabilityResilienceTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
