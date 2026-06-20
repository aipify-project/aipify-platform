#!/usr/bin/env node
/**
 * Phase 620 — verify synthetic APP showcase data integrity.
 */
import {
  assertOrganizationId,
  assertProductionGuard,
  createServiceClient,
  DATASET_KEY,
  parseArgs,
  printHelp,
  printJsonReport,
} from "./lib/app-showcase-shared.mjs";

const args = parseArgs();
if (args.help) {
  printHelp("verify-app-showcase-data.mjs");
  process.exit(0);
}

assertOrganizationId(args.organizationId);
assertProductionGuard(args);

const supabase = createServiceClient();
const { data, error } = await supabase.rpc("verify_app_showcase_data", {
  p_organization_id: args.organizationId,
  p_dataset_key: args.datasetKey,
});

if (error) {
  console.error("Verify failed:", error.message);
  process.exit(1);
}

printJsonReport("APP Showcase Verify", data);

const failed =
  data?.ok !== true ||
  data?.external_side_effects_triggered !== 0 ||
  data?.subscription_changed === true ||
  data?.license_changed === true ||
  data?.permissions_changed === true ||
  (data?.direct_user_grants_created ?? 0) !== 0;

process.exit(failed ? 1 : 0);
