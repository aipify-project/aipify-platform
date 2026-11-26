import assert from "node:assert/strict";
import {
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
  AIPIFY_CORE_STAGING_PROJECT_REF,
  isSupportCenterCoreLiveBound,
  isSupportCenterProductionCoreBound,
  isSupportCenterStagingCoreBound,
  resolveConfiguredSupabaseProjectRef,
  resolveSupportCenterLiveGates,
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

assert.equal(
  isSupportCenterStagingCoreBound(
    `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
  ),
  true,
);
assert.equal(
  isSupportCenterProductionCoreBound(
    `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
  ),
  true,
);
assert.equal(
  isSupportCenterCoreLiveBound(
    `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
  ),
  true,
);
assert.equal(
  isSupportCenterCoreLiveBound(
    `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
  ),
  true,
);

const production = resolveSupportCenterLiveGates(
  `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`,
);
assert.equal(production.productionBound, true);
assert.equal(production.liveBound, true);
assert.equal(production.readRpcConnected, true);
assert.equal(production.writeRpcConnected, true);
assert.equal(production.intakeRpcConnected, false);
assert.equal(production.emailSendConfigured, false);

const staging = resolveSupportCenterLiveGates(
  `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`,
);
assert.equal(staging.stagingBound, true);
assert.equal(staging.readRpcConnected, true);
assert.equal(staging.intakeRpcConnected, false);

const unknown = resolveSupportCenterLiveGates("https://example.supabase.co");
assert.equal(unknown.liveBound, false);
assert.equal(unknown.readRpcConnected, false);

console.log("staging-core-activation.test.ts: ok");
