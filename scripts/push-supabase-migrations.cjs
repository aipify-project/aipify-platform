#!/usr/bin/env node
/**
 * Push pending Supabase migrations to the linked Aipify Core project.
 *
 * Prerequisites:
 *   npx supabase login
 *   npm run supabase:link
 *
 * Usage:
 *   npm run supabase:push
 *   npm run supabase:push:dry
 */
const { execSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const configPath = join(root, "supabase", "config.toml");
const dryRun = process.argv.includes("--dry-run");

if (!existsSync(configPath)) {
  console.error("Missing supabase/config.toml — run from repo root.");
  process.exit(1);
}

const pushArgs = ["db", "push", "--linked", "--include-all", "--yes"];
if (dryRun) pushArgs.splice(1, 0, "--dry-run");

try {
  execSync(`npx supabase ${pushArgs.join(" ")}`, {
    cwd: root,
    stdio: "inherit",
  });
  console.log(dryRun ? "Dry run complete." : "Supabase migrations pushed.");
} catch (error) {
  console.error(
    "\nPush failed (often due to migration history drift).\n" +
      "Use the Management API workflow instead:\n" +
      "  npm run supabase:sql              # list pending\n" +
      "  npm run supabase:sql:apply        # apply all pending\n" +
      "  npm run supabase:sql:apply -- --from 20261469000000\n\n" +
      "Or retry CLI push after login/link:\n" +
      "  npx supabase login\n" +
      "  npm run supabase:link\n" +
      "  npm run supabase:push\n"
  );
  process.exit(error.status ?? 1);
}
