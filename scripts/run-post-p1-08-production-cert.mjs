/**
 * POST-P1.08 production live E2E certification runner — never logs secret values.
 * Usage: node scripts/run-post-p1-08-production-cert.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const repoRoot = process.cwd();
const PRODUCTION_BASE_URL = "https://app.aipify.ai";

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const parsed = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && value.trim()) parsed[key] = value.trim();
  }
  return parsed;
}

function loadMergedEnv() {
  const merged = {
    ...parseEnvFile(path.join(repoRoot, ".env.production-cert.tmp")),
    ...parseEnvFile(path.join(repoRoot, ".env.local")),
  };
  for (const [key, value] of Object.entries(merged)) {
    process.env[key] = value;
  }
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
  }
  const raw = execSync(
    "npx supabase projects api-keys --project-ref qbcqoixhrvhnuwphefvw -o json",
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.keys ?? [];
  const key = entries.find((entry) => entry.name === "service_role")?.api_key;
  if (!key?.trim()) throw new Error("service_role key unavailable");
  process.env.SUPABASE_SERVICE_ROLE_KEY = key.trim();
  return key.trim();
}

function vercelEnvConfigured(name) {
  try {
    const listing = execSync("npx vercel env ls production", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return listing.includes(name);
  } catch {
    return false;
  }
}

function addVercelEnv(name, value) {
  execSync(`npx vercel env add ${name} production --force`, {
    input: value,
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
}

async function resetPasswords(serviceRoleKey) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");

  const tempPassword = execSync("openssl rand -base64 24", { encoding: "utf8" })
    .trim()
    .replace(/[^a-zA-Z0-9!@#$%^&*]/g, "")
    .slice(0, 24);
  if (tempPassword.length < 16) throw new Error("temp password generation failed");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const users = [
    { email: "admin@unonight.com", label: "primary" },
    { email: "support@aipify.ai", label: "isolation" },
  ];

  for (const user of users) {
    const { data: listed, error: listError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listError) throw new Error(`listUsers failed: ${listError.message}`);
    const match = listed.users.find(
      (entry) => entry.email?.trim().toLowerCase() === user.email,
    );
    if (!match?.id) throw new Error(`user not found: ${user.label}`);

    const { error: updateError } = await admin.auth.admin.updateUserById(match.id, {
      password: tempPassword,
    });
    if (updateError) throw new Error(`password reset failed: ${user.label}`);
  }

  process.env.APP_LIVE_E2E_EMAIL = users[0].email;
  process.env.APP_LIVE_E2E_PASSWORD = tempPassword;
  process.env.APP_LIVE_E2E_ISOLATION_EMAIL = users[1].email;
  process.env.APP_LIVE_E2E_ISOLATION_PASSWORD = tempPassword;
}

async function main() {
  loadMergedEnv();

  process.env.APP_LIVE_E2E_ENABLED = "1";
  process.env.APP_LIVE_E2E_ENVIRONMENT = "production";
  process.env.APP_LIVE_E2E_BASE_URL = PRODUCTION_BASE_URL;

  const serviceRoleKey = resolveServiceRoleKey();
  const cronOnVercel = vercelEnvConfigured("CRON_SECRET");
  const serviceRoleOnVercel = vercelEnvConfigured("SUPABASE_SERVICE_ROLE_KEY");

  console.log(
    "production_setup: env_presence",
    JSON.stringify({
      cron_secret_on_vercel: cronOnVercel,
      service_role_on_vercel: serviceRoleOnVercel,
      cron_secret_local: Boolean(process.env.CRON_SECRET?.trim()),
      service_role_local: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    }),
  );

  if (!cronOnVercel) {
    throw new Error("CRON_SECRET not configured on Vercel production");
  }
  if (!serviceRoleOnVercel) {
    addVercelEnv("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey);
    console.log("production_setup: synced SUPABASE_SERVICE_ROLE_KEY to Vercel production");
  }

  let cronSecret = process.env.CRON_SECRET?.trim() ?? null;
  if (!cronSecret) {
    cronSecret = execSync("openssl rand -base64 32", { encoding: "utf8" }).trim();
    addVercelEnv("CRON_SECRET", cronSecret);
    console.log("production_setup: synced CRON_SECRET to Vercel production (value not logged)");
    execSync("npx vercel deploy --prod --yes --archive=tgz", {
      stdio: ["ignore", "inherit", "inherit"],
      cwd: repoRoot,
    });
    console.log("production_setup: redeployed production for CRON_SECRET propagation");
  }

  process.env.CRON_SECRET = cronSecret;
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

  console.log("production_setup: resetting E2E account passwords (values not logged)");
  await resetPasswords(serviceRoleKey);

  const cronProbe = await fetch(`${PRODUCTION_BASE_URL}/api/cron/companion-queue-worker`, {
    headers: { authorization: `Bearer ${cronSecret}` },
  });
  if (!cronProbe.ok) {
    throw new Error(`cron_probe_failed status=${cronProbe.status}`);
  }
  console.log("production_setup: cron probe ok");

  console.log("production_setup: running POST-P1 production readiness certification");
  execSync("npx --yes tsx lib/companion-runtime/post-p1-companion-production-readiness.test.ts", {
    stdio: "inherit",
    cwd: repoRoot,
    env: process.env,
  });
}

main().catch((error) => {
  console.error(`production_setup_failed: ${error instanceof Error ? error.message : "unknown"}`);
  process.exit(1);
});
