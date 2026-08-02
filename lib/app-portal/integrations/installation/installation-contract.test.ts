import assert from "node:assert/strict";
import {
  INSTALLATION_CONTRACT_FIXTURES,
  canActivateFromWizard,
  canInstallationTransition,
  listInstallationLocales,
  parseInstallationContract,
  planInstallationSteps,
  resolveCustomerSafeText,
  resolveInstallationContract,
  selectDefaultSupportMode,
  validateInstallationFieldValue,
  waitingStateForSupportMode,
} from "./index";

assert.equal(INSTALLATION_CONTRACT_FIXTURES.length, 5);

for (const fixture of INSTALLATION_CONTRACT_FIXTURES) {
  const parsed = parseInstallationContract(fixture, {
    expectedProviderKey: fixture.provider_key,
  });
  assert.equal(parsed.ok, true, `fixture ${fixture.provider_key} should parse`);
  if (parsed.ok) {
    assert.equal(parsed.contract.versioning.status, "published");
    assert.equal(parsed.contract.activation_requirements.no_auto_activation, true);
  }
}

assert.equal(parseInstallationContract(null).ok, false);

const draft = {
  ...INSTALLATION_CONTRACT_FIXTURES[0],
  versioning: { status: "draft" as const },
};
assert.equal(parseInstallationContract(draft).ok, false);
assert.equal(parseInstallationContract(draft, { allowDraft: true }).ok, true);

const base = INSTALLATION_CONTRACT_FIXTURES[1]!;
const cyclic = {
  ...base,
  dependencies: [
    { from: "introduction", to: "choose_support" },
    { from: "choose_support", to: "introduction" },
  ],
};
const cyclicParsed = parseInstallationContract(cyclic, { expectedProviderKey: base.provider_key });
assert.equal(cyclicParsed.ok, false);
if (!cyclicParsed.ok) {
  assert.equal(cyclicParsed.issues.some((i) => i.code === "dependency_cycle"), true);
}

const badStep = {
  ...base,
  steps: [{ ...base.steps[0]!, step_type: "not_a_real_step" }],
};
assert.equal(
  parseInstallationContract(badStep, { expectedProviderKey: base.provider_key }).ok,
  false
);

assert.equal(selectDefaultSupportMode(base), "aipify_managed");

const customerManaged = planInstallationSteps(base, {
  supportMode: "aipify_managed",
  audience: "customer_owner",
});
assert.equal(customerManaged.some((s) => s.step_type === "provide_credentials"), false);
assert.equal(customerManaged.some((s) => s.step_type === "waiting_external_party"), true);

const selfService = planInstallationSteps(base, {
  supportMode: "self_service",
  audience: "customer_owner",
});
assert.equal(selfService.some((s) => s.step_type === "provide_credentials"), true);

assert.equal(canInstallationTransition("verified", "ready_for_activation"), true);
assert.equal(canInstallationTransition("in_progress", "active"), false);
assert.equal(canActivateFromWizard("verified"), true);
assert.equal(canActivateFromWizard("in_progress"), false);
assert.equal(waitingStateForSupportMode("aipify_managed"), "awaiting_aipify");

const locales = listInstallationLocales();
assert.ok(locales.includes("en"));
assert.ok(locales.includes("es"));
assert.ok(locales.length >= 7);

assert.equal(
  resolveCustomerSafeText(
    { kind: "locale_map", values: { en: "Hello", no: "Hei" }, fallbackLocale: "en" },
    { locale: "zz", translate: (k) => k, emptyFallback: "fallback" }
  ),
  "Hello"
);

const missingKey = resolveCustomerSafeText(
  { kind: "locale_key", key: "missing.installation.key" },
  { locale: "no", translate: (k) => k, emptyFallback: "safe" }
);
assert.equal(missingKey, "safe");
assert.equal(missingKey.includes("missing.installation.key"), false);

const secretField = {
  field_key: "api_key",
  field_type: "secret_reference" as const,
  label: { kind: "locale_key" as const, key: "x" },
  required: true,
  secret: true,
  security_classification: "secret" as const,
};
const secretOk = validateInstallationFieldValue(secretField, "sk-test-123");
assert.equal(secretOk.ok, true);
if (secretOk.ok) {
  assert.deepEqual(secretOk.sanitized, { __secret_pending: true, length: 11 });
}

const urlField = {
  field_key: "base_url",
  field_type: "url" as const,
  label: { kind: "locale_key" as const, key: "x" },
  required: true,
  security_classification: "internal" as const,
  validation: { allowlist_hosts: ["api.example.com"] },
};
assert.equal(validateInstallationFieldValue(urlField, "http://api.example.com").ok, false);
assert.equal(validateInstallationFieldValue(urlField, "https://api.example.com").ok, true);

const resolved = resolveInstallationContract({
  providerKey: "commerce_provider",
  installationContract: {},
  onboardingMode: "oauth",
});
assert.equal(resolved.ok, true);
if (resolved.ok) {
  assert.equal(resolved.contract.installation_mode, "oauth");
  assert.equal(resolved.contract.provider_key, "commerce_provider");
}

console.log("installation-contract.test.ts: ok");
