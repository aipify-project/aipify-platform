import assert from "node:assert/strict";
import {
  FIXTURE_PROVIDER_A_CONTRACT,
  FIXTURE_PROVIDER_B_CONTRACT,
  FIXTURE_PROVIDER_UNONIGHT_CONTRACT,
  interpolateProviderContractLabel,
  parseCoreAppIntegrationProviderContract,
  resolveContractSetupStepLabels,
  resolveVisibleSetupSteps,
  validateProviderAdminDestination,
} from "./index";

const validUnonight = parseCoreAppIntegrationProviderContract(
  FIXTURE_PROVIDER_UNONIGHT_CONTRACT,
  "unonight"
);
assert.equal(validUnonight.ok, true);
if (validUnonight.ok) {
  assert.equal(validUnonight.contract.displayName, "Unonight");
  assert.deepEqual(validUnonight.contract.requiredScopes, [
    "metadata.read",
    "organization.read",
    "integration.status.read",
  ]);
  assert.match(validUnonight.contract.adminIntegrationUrl, /\/admin\/integrations\/aipify$/);
  assert.equal(validUnonight.contract.capabilities.requiresExternalLogin, false);
}

assert.equal(parseCoreAppIntegrationProviderContract(null).ok, false);

const unsupported = parseCoreAppIntegrationProviderContract({
  ...FIXTURE_PROVIDER_A_CONTRACT,
  version: 99,
});
assert.equal(unsupported.ok, false);
if (!unsupported.ok) assert.equal(unsupported.code, "unsupported_version");

const missingDestination = parseCoreAppIntegrationProviderContract({
  ...FIXTURE_PROVIDER_A_CONTRACT,
  adminIntegrationUrl: "",
  adminBaseUrl: "",
  adminIntegrationPath: "",
  allowedAdminHosts: [],
});
assert.equal(missingDestination.ok, false);
if (!missingDestination.ok) assert.equal(missingDestination.code, "missing_admin_destination");

const missingScopes = parseCoreAppIntegrationProviderContract({
  ...FIXTURE_PROVIDER_A_CONTRACT,
  requiredScopes: [],
});
assert.equal(missingScopes.ok, false);
if (!missingScopes.ok) assert.equal(missingScopes.code, "missing_required_scopes");

const mismatch = parseCoreAppIntegrationProviderContract(FIXTURE_PROVIDER_A_CONTRACT, "provider_b");
assert.equal(mismatch.ok, false);
if (!mismatch.ok) assert.equal(mismatch.code, "provider_mismatch");

assert.equal(
  validateProviderAdminDestination({
    adminIntegrationUrl: "http://evil.example/path",
    allowedAdminHosts: ["evil.example"],
  }).ok,
  false
);
assert.equal(
  validateProviderAdminDestination({
    adminIntegrationUrl: "https://evil.example/path",
    allowedAdminHosts: ["console.provider-a.example"],
  }).ok,
  false
);
assert.equal(
  validateProviderAdminDestination({
    adminIntegrationUrl:
      "https://console.provider-a.example/integrations/aipify?redirect=https://evil.test",
    allowedAdminHosts: ["console.provider-a.example"],
  }).ok,
  false
);

for (const fixture of [
  FIXTURE_PROVIDER_UNONIGHT_CONTRACT,
  FIXTURE_PROVIDER_A_CONTRACT,
  FIXTURE_PROVIDER_B_CONTRACT,
]) {
  const parsed = parseCoreAppIntegrationProviderContract(fixture, fixture.providerKey);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) continue;
  const labels = resolveContractSetupStepLabels(parsed.contract);
  assert.ok(labels.length > 0);
  if (fixture.providerKey !== "unonight") {
    assert.equal(
      labels.some((line) => line.includes("Unonight")),
      false
    );
  }
}

const aSteps = resolveVisibleSetupSteps(FIXTURE_PROVIDER_A_CONTRACT);
assert.equal(
  aSteps.some((s) => s.actionType === "external_login"),
  false
);

const bSteps = resolveVisibleSetupSteps(FIXTURE_PROVIDER_B_CONTRACT);
assert.equal(
  bSteps.some((s) => s.actionType === "external_login"),
  true
);
const bLabels = resolveContractSetupStepLabels(FIXTURE_PROVIDER_B_CONTRACT);
assert.match(bLabels[0] ?? "", /Log in/i);

const uLabels = resolveContractSetupStepLabels(FIXTURE_PROVIDER_UNONIGHT_CONTRACT);
assert.equal(
  uLabels.some((line) => /Log in/i.test(line)),
  false
);
assert.match(uLabels[0] ?? "", /Open Unonight Admin/);

assert.equal(
  interpolateProviderContractLabel("Connect to: {providerName}", FIXTURE_PROVIDER_A_CONTRACT),
  "Connect to: Provider A"
);
assert.equal(
  interpolateProviderContractLabel("Open {adminName}", FIXTURE_PROVIDER_UNONIGHT_CONTRACT),
  "Open Unonight Admin"
);

assert.deepEqual(
  Object.keys(FIXTURE_PROVIDER_UNONIGHT_CONTRACT).sort(),
  Object.keys(FIXTURE_PROVIDER_A_CONTRACT).sort()
);
assert.deepEqual(
  Object.keys(FIXTURE_PROVIDER_UNONIGHT_CONTRACT).sort(),
  Object.keys(FIXTURE_PROVIDER_B_CONTRACT).sort()
);

console.log("provider-contract.test.ts: ok");
