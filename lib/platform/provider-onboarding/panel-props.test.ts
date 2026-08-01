import assert from "node:assert/strict";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  unonightApiKeyOnboarding,
} from "@/lib/app-portal/integrations/onboarding";
import {
  assertSerializableClientProps,
  buildPlatformProviderOnboardingPanelProps,
} from "./panel-props";

const identityT = (key: string) => key;

// --- A. Root cause regression: function props crash Client Components (digest 340189304) ---

{
  const crashingProps = {
    labels: { title: "x" },
    translate: (key: string) => key,
  };
  assert.throws(
    () => assertSerializableClientProps(crashingProps),
    /Functions cannot be passed directly to Client Components/
  );
}

{
  const props = buildPlatformProviderOnboardingPanelProps(identityT);
  assert.equal(typeof props.messageCatalog, "object");
  assert.equal(typeof props.labels.title, "string");
  assert.equal(typeof (props as { translate?: unknown }).translate, "undefined");
  assert.doesNotThrow(() => assertSerializableClientProps(props));
  assert.equal(props.labels.pageLoadFailed, "platform.providerOnboarding.pageLoadFailed");
  assert.equal(props.labels.retry, "platform.providerOnboarding.retry");
  assert.equal(props.labels.backHref, "/platform");
  assert.ok(
    Object.keys(props.messageCatalog).some((key) =>
      key.includes("integrations.onboarding.modes.oauth")
    )
  );
}

// --- C/D. Invalid provider parse is isolated (does not throw) ---

{
  const invalid = parseCoreProviderOnboardingContract(
    { ...unonightApiKeyOnboarding, onboardingMode: "unknown" },
    { expectedProviderKey: unonightApiKeyOnboarding.providerKey }
  );
  assert.equal(invalid.ok, false);
  if (!invalid.ok) {
    assert.equal(typeof invalid.code, "string");
  }

  const valid = parseCoreProviderOnboardingContract(unonightApiKeyOnboarding, {
    expectedProviderKey: unonightApiKeyOnboarding.providerKey,
  });
  assert.equal(valid.ok, true);

  // Mixed list: one invalid does not prevent other fixtures from parsing.
  const results = CORE_PROVIDER_ONBOARDING_FIXTURES.map((fixture) =>
    parseCoreProviderOnboardingContract(fixture, {
      expectedProviderKey: fixture.providerKey,
    })
  );
  assert.ok(results.every((result) => result.ok));
  const withPoison = [
    ...results,
    parseCoreProviderOnboardingContract({ bad: true }, {}),
  ];
  assert.equal(withPoison.filter((r) => r.ok).length, results.length);
  assert.equal(withPoison.filter((r) => !r.ok).length, 1);
}

// --- Null nested / malformed metadata ---

{
  const nullNested = parseCoreProviderOnboardingContract({
    ...unonightApiKeyOnboarding,
    docs: null,
  });
  assert.equal(nullNested.ok, false);

  const malformedUrl = parseCoreProviderOnboardingContract({
    ...unonightApiKeyOnboarding,
    docs: {
      ...unonightApiKeyOnboarding.docs,
      support: { url: "not-a-url" },
    },
  });
  assert.equal(malformedUrl.ok, false);
}

console.log("panel-props.test.ts: ok");
