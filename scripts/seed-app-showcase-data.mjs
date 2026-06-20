#!/usr/bin/env node
/**
 * Phase 620 — seed synthetic APP showcase data for design validation.
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
  printHelp("seed-app-showcase-data.mjs");
  process.exit(0);
}

assertOrganizationId(args.organizationId);
assertProductionGuard(args);

if (args.mode === "empty") {
  console.log("Mode empty — delegating to remove script semantics. Run app:showcase:remove instead.");
  process.exit(1);
}

const supabase = createServiceClient();
const { data, error } = await supabase.rpc("seed_app_showcase_data", {
  p_organization_id: args.organizationId,
  p_dataset_key: args.datasetKey,
  p_mode: args.mode,
});

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

printJsonReport("APP Showcase Seed", data);
