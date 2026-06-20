#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

export const DATASET_KEY = "phase620_app_showcase_v1";
export const PROJECT_REF = "qbcqoixhrvhnuwphefvw";

export function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

export function parseArgs(argv = process.argv.slice(2)) {
  const get = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  return {
    organizationId: get("--organization"),
    mode: get("--mode") ?? "baseline",
    datasetKey: get("--dataset") ?? DATASET_KEY,
    confirmProduction: argv.includes("--confirm-production"),
    dryRun: argv.includes("--dry-run"),
    confirm: argv.includes("--confirm"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

export function printHelp(scriptName) {
  console.log(`Usage: node scripts/${scriptName} --organization <organization_uuid> [options]

Options:
  --organization <uuid>     Target APP organization (customers.id / organizations.id)
  --dataset <key>           Dataset key (default: ${DATASET_KEY})
  --mode baseline|dense|empty   Seed mode (default: baseline)
  --confirm-production      Required when targeting production Supabase project
  --dry-run                 Preview remove actions without deleting
  --confirm                 Required for destructive remove (non dry-run)
  --help                    Show this help
`);
}

export function getManagementToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, "utf8").trim();
  }
  return null;
}

export function isProductionTarget() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  return url.includes(PROJECT_REF) || process.env.AIPIFY_ENV === "production";
}

export function assertProductionGuard(args) {
  if (isProductionTarget() && !args.confirmProduction) {
    console.error(
      "Production Supabase project detected. Re-run with --confirm-production to proceed."
    );
    process.exit(1);
  }
}

export function assertOrganizationId(orgId) {
  if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) {
    console.error("--organization <uuid> is required.");
    process.exit(1);
  }
}

export function createServiceClient() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.");
    process.exit(1);
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function execManagementSql(query) {
  const token = getManagementToken();
  if (!token) {
    throw new Error("Supabase management token not available.");
  }
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text);
  }
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed?.result ?? parsed;
}

export function printJsonReport(title, data) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(data, null, 2));
}
