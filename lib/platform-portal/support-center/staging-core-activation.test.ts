import assert from "node:assert/strict";
import {
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
  AIPIFY_CORE_STAGING_PROJECT_REF,
  isSupportCenterStagingCoreBound,
  resolveConfiguredSupabaseProjectRef,
  resolveSupportCenterStagingLiveGates,
} from "./staging-core-activation";

assert.equal(
  resolveConfiguredSupabaseProjectRef(
    `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
  ),
  AIPIFY_CORE_STAGING_PROJECT_REF,
);
assert.equal(
  resolveConfiguredSupabaseProjectRef(
    `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
  ),
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
);
assert.equal(resolveConfiguredSupabaseProjectRef(""), null);
assert.equal(resolveConfiguredSupabaseProjectRef("not-a-url"), null);

assert.equal(
  isSupportCenterStagingCoreBound(
    `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
  ),
  true,
);
assert.equal(
  isSupportCenterStagingCoreBound(
    `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
  ),
  false,
);

const staging = resolveSupportCenterStagingLiveGates(
  `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
);
assert.equal(staging.stagingBound, true);
assert.equal(staging.readRpcConnected, true);
assert.equal(staging.readFeatureGate, true);
assert.equal(staging.writeRpcConnected, true);
assert.equal(staging.writeFeatureGate, true);
assert.equal(staging.intakeRpcConnected, false);
assert.equal(staging.intakeFeatureGate, false);
assert.equal(staging.emailSendConfigured, false);

const production = resolveSupportCenterStagingLiveGates(
  `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
);
assert.equal(production.stagingBound, false);
assert.equal(production.readRpcConnected, false);
assert.equal(production.writeRpcConnected, false);
assert.equal(production.emailSendConfigured, false);

console.log("staging-core-activation.test.ts: ok");
