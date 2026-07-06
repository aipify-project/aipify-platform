import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

const NEUTRAL_DOMAIN = "example-a.test";
const NEUTRAL_INSTALL_ID = "11111111-1111-4111-8111-111111111111";

async function runWebsiteKompisRuntimeTrustDiagnosticTests() {
  installServerOnlyShim();

  const {
    evaluateWebsiteKompisRuntimeTrustDiagnostic,
    FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS,
    isWebsiteKompisDiagnosticGuardConfigured,
    sanitizeWebsiteKompisRuntimeTrustDiagnosticResponse,
    verifyWebsiteKompisDiagnosticToken,
  } = await import("@/lib/marketing/website-kompis-runtime-trust-diagnostic");
  type WebsiteKompisRuntimeTrustDiagnosticProbe = import("@/lib/marketing/website-kompis-runtime-trust-diagnostic").WebsiteKompisRuntimeTrustDiagnosticProbe;

  function baseProbe(
    overrides: Partial<WebsiteKompisRuntimeTrustDiagnosticProbe> = {},
  ): WebsiteKompisRuntimeTrustDiagnosticProbe {
    return {
      serviceRoleConfigured: true,
      serviceRoleSelectWorked: true,
      domainInputPresent: true,
      installIdInputPresent: true,
      domainBindingFound: true,
      verifiedActiveDomainBinding: true,
      installFound: true,
      installActive: true,
      domainInstallMatch: true,
      hasResolvableBinding: true,
      ...overrides,
    };
  }

  const sanitized = sanitizeWebsiteKompisRuntimeTrustDiagnosticResponse({
    ok: true,
    serviceRoleConfigured: true,
    serviceRoleSelectWorked: true,
    domainInputPresent: true,
    installIdInputPresent: false,
    domainBindingFound: true,
    verifiedActiveDomainBinding: true,
    installFound: true,
    installActive: true,
    domainInstallMatch: true,
    canReadExpectedBinding: true,
    failureStage: "none",
    tenant_id: "secret-tenant",
    customer_id: "secret-customer",
    user_id: "secret-user",
  });

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    assert.equal(
      forbidden in sanitized,
      false,
      `forbidden field leaked: ${forbidden}`,
    );
  }

  assert.equal(sanitized.ok, true);
  assert.equal(sanitized.canReadExpectedBinding, true);

  const originalCronSecret = process.env.CRON_SECRET;
  const originalDiagnosticToken = process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN;

  delete process.env.CRON_SECRET;
  delete process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN;
  assert.equal(isWebsiteKompisDiagnosticGuardConfigured(), false);
  assert.equal(verifyWebsiteKompisDiagnosticToken("any-token"), false);

  process.env.CRON_SECRET = "neutral-diagnostic-secret";
  assert.equal(isWebsiteKompisDiagnosticGuardConfigured(), true);
  assert.equal(verifyWebsiteKompisDiagnosticToken(null), false);
  assert.equal(verifyWebsiteKompisDiagnosticToken(""), false);
  assert.equal(verifyWebsiteKompisDiagnosticToken("wrong-token"), false);
  assert.equal(verifyWebsiteKompisDiagnosticToken("neutral-diagnostic-secret"), true);

  process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN = "website-kompis-diagnostic-secret";
  assert.equal(verifyWebsiteKompisDiagnosticToken("website-kompis-diagnostic-secret"), true);

  if (originalCronSecret === undefined) {
    delete process.env.CRON_SECRET;
  } else {
    process.env.CRON_SECRET = originalCronSecret;
  }

  if (originalDiagnosticToken === undefined) {
    delete process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN;
  } else {
    process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN = originalDiagnosticToken;
  }

  const configFailure = evaluateWebsiteKompisRuntimeTrustDiagnostic(
    baseProbe({
      serviceRoleConfigured: false,
      hasResolvableBinding: false,
    }),
  );
  assert.equal(configFailure.serviceRoleConfigured, false);
  assert.equal(configFailure.failureStage, "service_role_config");
  assert.equal(configFailure.canReadExpectedBinding, false);

  const selectFailure = evaluateWebsiteKompisRuntimeTrustDiagnostic(
    baseProbe({
      serviceRoleSelectWorked: false,
      hasResolvableBinding: false,
    }),
  );
  assert.equal(selectFailure.serviceRoleSelectWorked, false);
  assert.equal(selectFailure.failureStage, "service_role_select");
  assert.equal(selectFailure.canReadExpectedBinding, false);

  const success = evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe());
  assert.equal(success.ok, true);
  assert.equal(success.failureStage, "none");
  assert.equal(success.canReadExpectedBinding, true);
  assert.equal(success.domainInstallMatch, true);

  const mismatch = evaluateWebsiteKompisRuntimeTrustDiagnostic(
    baseProbe({
      domainInstallMatch: false,
      hasResolvableBinding: false,
    }),
  );
  assert.equal(mismatch.failureStage, "domain_install_mismatch");
  assert.equal(mismatch.canReadExpectedBinding, false);
  assert.equal(mismatch.ok, false);

  const missingInput = evaluateWebsiteKompisRuntimeTrustDiagnostic(
    baseProbe({
      domainInputPresent: false,
      installIdInputPresent: false,
      hasResolvableBinding: false,
    }),
  );
  assert.equal(missingInput.failureStage, "missing_input");

  const successRecord = success as Record<string, unknown>;
  assert.equal(
    successRecord.tenant_id,
    undefined,
    "tenant_id must not appear in evaluated response",
  );
  assert.equal(
    successRecord.customer_id,
    undefined,
    "customer_id must not appear in evaluated response",
  );

  void NEUTRAL_DOMAIN;
  void NEUTRAL_INSTALL_ID;
}

runWebsiteKompisRuntimeTrustDiagnosticTests()
  .then(() => {
    console.log("website-kompis-runtime-trust-diagnostic.test.ts: all tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
