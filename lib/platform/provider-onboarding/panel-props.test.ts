import assert from "node:assert/strict";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  unonightApiKeyOnboarding,
} from "@/lib/app-portal/integrations/onboarding";
import { classifyProviderListRow } from "./classify";
import {
  assertSerializableClientProps,
  buildPlatformProviderOnboardingPanelProps,
} from "./panel-props";

const identityT = (key: string) => key;

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
  assert.equal(props.labels.tabEdit, "platform.providerOnboarding.tabEdit");
  assert.equal(props.labels.status.contract_required, "platform.providerOnboarding.status.contract_required");
  assert.doesNotThrow(() => assertSerializableClientProps(props));
}

{
  const shopify = classifyProviderListRow({
    provider_key: "shopify",
    display_name: "Shopify",
    is_available: true,
    has_onboarding_contract: false,
  });
  assert.equal(shopify.status, "contract_required");

  const unonight = classifyProviderListRow(
    {
      provider_key: "unonight",
      display_name: "Unonight",
      is_available: true,
      has_onboarding_contract: true,
      readiness_level: "production_ready",
    },
    unonightApiKeyOnboarding
  );
  assert.equal(unonight.status, "production_ready");
}

{
  for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
    assert.equal(
      parseCoreProviderOnboardingContract(fixture, {
        expectedProviderKey: fixture.providerKey,
      }).ok,
      true
    );
  }
}

console.log("panel-props.test.ts: ok");
