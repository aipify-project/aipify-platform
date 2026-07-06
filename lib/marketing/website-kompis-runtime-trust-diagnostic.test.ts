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
    bucketWebsiteKompisLicenseStatusForProbe,
    evaluateWebsiteKompisAvailabilityProbeDiagnostic,
    evaluateWebsiteKompisMetadataPipelineDiagnostic,
    evaluateWebsiteKompisRuntimeTrustDiagnostic,
    FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS,
    isWebsiteKompisDiagnosticGuardConfigured,
    sanitizeWebsiteKompisAvailabilityProbeDiagnosticResponse,
    sanitizeWebsiteKompisMetadataPipelineDiagnosticResponse,
    sanitizeWebsiteKompisRuntimeTrustDiagnosticResponse,
    verifyWebsiteKompisDiagnosticToken,
    WEBSITE_KOMPIS_AVAILABILITY_PROBE_FAILURE_STAGES,
    WEBSITE_KOMPIS_METADATA_PIPELINE_FAILURE_STAGES,
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

  const defaultModeShape = evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe());
  assert.equal(typeof defaultModeShape.ok, "boolean");
  assert.equal(typeof defaultModeShape.serviceRoleConfigured, "boolean");
  assert.equal(typeof defaultModeShape.canReadExpectedBinding, "boolean");
  assert.equal(defaultModeShape.failureStage, "none");
  assert.equal("mode" in (defaultModeShape as Record<string, unknown>), false);

  const pipelineSuccess = evaluateWebsiteKompisMetadataPipelineDiagnostic({
    hasInstallSelector: true,
    visitorContextOk: true,
    trustTrusted: true,
    trustReason: "available",
    availabilityAvailable: true,
    availabilityReason: "available",
    installConfigLoaded: true,
    installConfigEnabled: true,
    finalMetadataEnabled: true,
    finalMetadataAvailable: true,
    finalUnavailableReason: null,
  });
  assert.equal(pipelineSuccess.mode, "metadataPipeline");
  assert.equal(pipelineSuccess.ok, true);
  assert.equal(pipelineSuccess.failureStage, "none");
  assert.equal(pipelineSuccess.finalMetadataEnabled, true);
  assert.equal(pipelineSuccess.finalMetadataAvailable, true);

  const pipelineTrustFailure = evaluateWebsiteKompisMetadataPipelineDiagnostic({
    hasInstallSelector: true,
    visitorContextOk: true,
    trustTrusted: false,
    trustReason: "domain_unverified",
    availabilityAvailable: false,
    availabilityReason: null,
    installConfigLoaded: false,
    installConfigEnabled: null,
    finalMetadataEnabled: false,
    finalMetadataAvailable: false,
    finalUnavailableReason: "not_available",
  });
  assert.equal(pipelineTrustFailure.failureStage, "trust");
  assert.equal(pipelineTrustFailure.trustReason, "domain_unverified");
  assert.equal(pipelineTrustFailure.ok, false);

  const pipelineAvailabilityFailure = evaluateWebsiteKompisMetadataPipelineDiagnostic({
    hasInstallSelector: true,
    visitorContextOk: true,
    trustTrusted: true,
    trustReason: "available",
    availabilityAvailable: false,
    availabilityReason: "license_unknown",
    installConfigLoaded: false,
    installConfigEnabled: null,
    finalMetadataEnabled: false,
    finalMetadataAvailable: false,
    finalUnavailableReason: "not_available",
  });
  assert.equal(pipelineAvailabilityFailure.failureStage, "availability");
  assert.equal(pipelineAvailabilityFailure.availabilityReason, "license_unknown");

  const pipelineConfigFailure = evaluateWebsiteKompisMetadataPipelineDiagnostic({
    hasInstallSelector: true,
    visitorContextOk: true,
    trustTrusted: true,
    trustReason: "available",
    availabilityAvailable: true,
    availabilityReason: "available",
    installConfigLoaded: true,
    installConfigEnabled: false,
    finalMetadataEnabled: false,
    finalMetadataAvailable: false,
    finalUnavailableReason: "not_available",
  });
  assert.equal(pipelineConfigFailure.failureStage, "install_config");

  const sanitizedPipeline = sanitizeWebsiteKompisMetadataPipelineDiagnosticResponse({
    ok: false,
    mode: "metadataPipeline",
    visitorContextOk: true,
    trustTrusted: false,
    trustReason: "install_missing",
    availabilityAvailable: false,
    availabilityReason: null,
    installConfigLoaded: false,
    installConfigEnabled: null,
    finalMetadataEnabled: false,
    finalMetadataAvailable: false,
    finalUnavailableReason: "not_available",
    failureStage: "trust",
    tenant_id: "secret-tenant",
    customer_id: "secret-customer",
    user_id: "secret-user",
    profile_id: "secret-profile",
    membership_id: "secret-membership",
    tenantId: "secret-tenant-id",
    installId: NEUTRAL_INSTALL_ID,
    domain: NEUTRAL_DOMAIN,
  });

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    assert.equal(
      forbidden in sanitizedPipeline,
      false,
      `metadataPipeline forbidden field leaked: ${forbidden}`,
    );
  }

  assert.equal(
    WEBSITE_KOMPIS_METADATA_PIPELINE_FAILURE_STAGES.includes(sanitizedPipeline.failureStage),
    true,
  );

  const pipelineRecord = sanitizedPipeline as Record<string, unknown>;
  assert.equal(pipelineRecord.tenant_id, undefined);
  assert.equal(pipelineRecord.installId, undefined);
  assert.equal(pipelineRecord.domain, undefined);
  assert.match(String(pipelineTrustFailure.trustReason ?? ""), /^[a-z_]+$/);

  assert.equal(bucketWebsiteKompisLicenseStatusForProbe(null), "missing");
  assert.equal(bucketWebsiteKompisLicenseStatusForProbe(""), "missing");
  assert.equal(bucketWebsiteKompisLicenseStatusForProbe("active"), "active");
  assert.equal(bucketWebsiteKompisLicenseStatusForProbe("trialing"), "unrecognized");

  const probeMissingLicense = evaluateWebsiteKompisAvailabilityProbeDiagnostic({
    trustTrusted: true,
    trustReason: "available",
    entitlementRpcOk: false,
    entitlementEnabled: null,
    licenseRpcOk: false,
    licenseStatusPresent: false,
    licenseStatusBucket: "missing",
    availabilityAvailable: false,
    availabilityReason: "license_unknown",
  });
  assert.equal(probeMissingLicense.mode, "availabilityProbe");
  assert.equal(probeMissingLicense.failureStage, "license_rpc");
  assert.equal(probeMissingLicense.evaluatorBranch, "licenseResolvable");

  const probeUnrecognizedLicense = evaluateWebsiteKompisAvailabilityProbeDiagnostic({
    trustTrusted: true,
    trustReason: "available",
    entitlementRpcOk: true,
    entitlementEnabled: true,
    licenseRpcOk: true,
    licenseStatusPresent: true,
    licenseStatusBucket: "unrecognized",
    availabilityAvailable: false,
    availabilityReason: "license_unknown",
  });
  assert.equal(probeUnrecognizedLicense.failureStage, "license_status");
  assert.equal(probeUnrecognizedLicense.evaluatorBranch, "licenseActive");

  const probeEntitlementNull = evaluateWebsiteKompisAvailabilityProbeDiagnostic({
    trustTrusted: true,
    trustReason: "available",
    entitlementRpcOk: false,
    entitlementEnabled: null,
    licenseRpcOk: true,
    licenseStatusPresent: true,
    licenseStatusBucket: "active",
    availabilityAvailable: false,
    availabilityReason: "license_unknown",
  });
  assert.equal(probeEntitlementNull.failureStage, "entitlement_rpc");
  assert.equal(probeEntitlementNull.evaluatorBranch, "entitlementNull");

  const probeAvailable = evaluateWebsiteKompisAvailabilityProbeDiagnostic({
    trustTrusted: true,
    trustReason: "available",
    entitlementRpcOk: true,
    entitlementEnabled: true,
    licenseRpcOk: true,
    licenseStatusPresent: true,
    licenseStatusBucket: "active",
    availabilityAvailable: true,
    availabilityReason: "available",
  });
  assert.equal(probeAvailable.ok, true);
  assert.equal(probeAvailable.failureStage, "none");
  assert.equal(probeAvailable.evaluatorBranch, "available");

  const sanitizedProbe = sanitizeWebsiteKompisAvailabilityProbeDiagnosticResponse({
    ok: false,
    mode: "availabilityProbe",
    trustTrusted: true,
    trustReason: "available",
    entitlementRpcOk: false,
    entitlementEnabled: null,
    licenseRpcOk: true,
    licenseStatusPresent: true,
    licenseStatusBucket: "unrecognized",
    evaluatorBranch: "licenseActive",
    availabilityAvailable: false,
    availabilityReason: "license_unknown",
    failureStage: "license_status",
    tenant_id: "secret-tenant",
    customer_id: "secret-customer",
    installId: NEUTRAL_INSTALL_ID,
    domain: NEUTRAL_DOMAIN,
  });

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    assert.equal(
      forbidden in sanitizedProbe,
      false,
      `availabilityProbe forbidden field leaked: ${forbidden}`,
    );
  }

  assert.equal(
    WEBSITE_KOMPIS_AVAILABILITY_PROBE_FAILURE_STAGES.includes(sanitizedProbe.failureStage),
    true,
  );
}

runWebsiteKompisRuntimeTrustDiagnosticTests()
  .then(() => {
    console.log("website-kompis-runtime-trust-diagnostic.test.ts: all tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
