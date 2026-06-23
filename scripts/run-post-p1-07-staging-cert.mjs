/**
 * POST-P1.07 staging certification runner — never logs secret values.
 * Usage: node scripts/run-post-p1-07-staging-cert.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const repoRoot = process.cwd();

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
    if (key) parsed[key] = value;
  }
  return parsed;
}

function loadMergedEnv() {
  const localEnv = parseEnvFile(path.join(repoRoot, ".env.local"));
  const stagingEnv = parseEnvFile(path.join(repoRoot, ".env.staging-cert.tmp"));
  for (const [key, value] of Object.entries({ ...stagingEnv, ...localEnv })) {
    if (value?.trim() && !process.env[key]?.trim()) {
      process.env[key] = value.trim();
    }
  }
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
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

  const primary = users.find((entry) => entry.label === "primary");
  const isolation = users.find((entry) => entry.label === "isolation");
  if (!primary || !isolation) throw new Error("E2E user mapping incomplete");

  process.env.APP_LIVE_E2E_EMAIL = primary.email;
  process.env.APP_LIVE_E2E_PASSWORD = tempPassword;
  process.env.APP_LIVE_E2E_ISOLATION_EMAIL = isolation.email;
  process.env.APP_LIVE_E2E_ISOLATION_PASSWORD = tempPassword;
  process.env.APP_LIVE_E2E_ENABLED = "1";
  process.env.APP_LIVE_E2E_ENVIRONMENT = "staging";
  process.env.APP_LIVE_E2E_BASE_URL = "https://app.aipify.ai";
}

async function main() {
  loadMergedEnv();
  const serviceRoleKey = resolveServiceRoleKey();
  const cronSecret = execSync("openssl rand -base64 32", { encoding: "utf8" }).trim();

  console.log("staging_setup: syncing CRON_SECRET on Vercel production");
  addVercelEnv("CRON_SECRET", cronSecret);
  if (!vercelEnvConfigured("SUPABASE_SERVICE_ROLE_KEY")) {
    addVercelEnv("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey);
  }

  console.log("staging_setup: redeploying production for env propagation");
  execSync("npx vercel deploy --prod --yes --archive=tgz", {
    stdio: ["ignore", "inherit", "inherit"],
    cwd: repoRoot,
  });

  console.log("staging_setup: resetting E2E account passwords (values not logged)");
  await resetPasswords(serviceRoleKey);

  const envStash = {
    CRON_SECRET: cronSecret,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    APP_LIVE_E2E_ENABLED: process.env.APP_LIVE_E2E_ENABLED,
    APP_LIVE_E2E_ENVIRONMENT: process.env.APP_LIVE_E2E_ENVIRONMENT,
    APP_LIVE_E2E_EMAIL: process.env.APP_LIVE_E2E_EMAIL,
    APP_LIVE_E2E_PASSWORD: process.env.APP_LIVE_E2E_PASSWORD,
    APP_LIVE_E2E_ISOLATION_EMAIL: process.env.APP_LIVE_E2E_ISOLATION_EMAIL,
    APP_LIVE_E2E_ISOLATION_PASSWORD: process.env.APP_LIVE_E2E_ISOLATION_PASSWORD,
    APP_LIVE_E2E_BASE_URL: process.env.APP_LIVE_E2E_BASE_URL,
  };

  execSync("npx vercel env pull .env.staging-cert.tmp --environment=production --yes", {
    stdio: ["ignore", "ignore", "inherit"],
    cwd: repoRoot,
  });
  loadMergedEnv();
  Object.assign(process.env, envStash);

  const cronProbe = await fetch(`${envStash.APP_LIVE_E2E_BASE_URL}/api/cron/companion-queue-worker`, {
    headers: { authorization: `Bearer ${cronSecret}` },
  });
  if (!cronProbe.ok) {
    throw new Error(`cron_probe_failed status=${cronProbe.status}`);
  }
  console.log("staging_setup: cron probe ok");

  console.log("staging_setup: running post-P1 production readiness certification");
  execSync("npx --yes tsx lib/companion-runtime/post-p1-companion-production-readiness.test.ts", {
    stdio: "inherit",
    cwd: repoRoot,
    env: process.env,
  });
}

main().catch((error) => {
  console.error(`staging_setup_failed: ${error instanceof Error ? error.message : "unknown"}`);
  process.exit(1);
});
