import assert from "node:assert/strict";
import {
  canonicalProductIdentityKey,
  dedupeLockedCapabilities,
  resolveCustomerFacingFeatureLabel,
  resolveTrustedCustomerFacingModulesCount,
} from "./package-presentation";

function run() {
  assert.equal(resolveTrustedCustomerFacingModulesCount([{ module_key: "a" }]), null);
  assert.equal(resolveTrustedCustomerFacingModulesCount(undefined), null);

  assert.equal(resolveCustomerFacingFeatureLabel("internal.module_key"), null);
  assert.equal(resolveCustomerFacingFeatureLabel("Install Engine"), null);
  assert.equal(
    resolveCustomerFacingFeatureLabel("Install Engine", () => "Veiledet installasjon"),
    "Veiledet installasjon"
  );
  assert.equal(resolveCustomerFacingFeatureLabel("Support workflows"), "Support workflows");

  const deduped = dedupeLockedCapabilities([
    {
      id: "upgrade-insights",
      identityKey: canonicalProductIdentityKey({
        packageKey: "insights",
        kind: "upgrade",
        fallbackIndex: 0,
      }),
      name: "Aipify Insights",
      description: "upgrade",
      kind: "upgrade",
      priority: 4,
    },
    {
      id: "addon-insights",
      identityKey: canonicalProductIdentityKey({
        addonKey: "insights",
        kind: "addon",
        fallbackIndex: 1,
      }),
      name: "Aipify Insights",
      description: "addon",
      kind: "addon",
      priority: 3,
    },
    {
      id: "upgrade-enterprise",
      identityKey: canonicalProductIdentityKey({
        packageKey: "enterprise",
        kind: "upgrade",
        fallbackIndex: 2,
      }),
      name: "Aipify Enterprise",
      description: "enterprise",
      kind: "upgrade",
      priority: 4,
    },
  ]);

  assert.equal(deduped.length, 2);
  assert.equal(deduped.find((c) => c.name === "Aipify Insights")?.kind, "addon");
  assert.equal(deduped.find((c) => c.name === "Aipify Insights")?.description, "addon");

  console.log("package-presentation.test.ts: ok");
}

run();
