#!/usr/bin/env node
/**
 * Phase 620 — remove synthetic APP showcase data for a dataset.
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
  printHelp("remove-app-showcase-data.mjs");
  process.exit(0);
}

assertOrganizationId(args.organizationId);
assertProductionGuard(args);

if (!args.dryRun && !args.confirm) {
  console.error("Destructive remove requires --confirm (or use --dry-run for preview).");
  process.exit(1);
}

const supabase = createServiceClient();
const { data, error } = await supabase.rpc("remove_app_showcase_data", {
  p_organization_id: args.organizationId,
  p_dataset_key: args.datasetKey,
  p_dry_run: args.dryRun,
  p_confirm: args.confirm,
});

if (error) {
  console.error("Remove failed:", error.message);
  process.exit(1);
}

printJsonReport(args.dryRun ? "APP Showcase Remove (dry run)" : "APP Showcase Remove", data);
