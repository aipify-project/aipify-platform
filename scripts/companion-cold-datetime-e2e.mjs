#!/usr/bin/env node
/**
 * Cold-start datetime proof — 5 dev-server restarts, first request each run.
 * Never logs secrets.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { buildSupabaseAuthCookieHeader } from "./lib/companion-e2e-auth.mjs";

const repoRoot = process.cwd();
const BASE_URL = (process.env.COMPANION_E2E_BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const RUNS = Number(process.env.COMPANION_COLD_RUNS ?? 5);
const QUESTION = "Hva er datoen i dag?";
const USE_PROD_SERVER = process.env.COMPANION_COLD_PROD === "1";

function ensureProductionBuild() {
  if (!USE_PROD_SERVER) return;
  if (process.env.COMPANION_COLD_SKIP_BUILD === "1" && fs.existsSync(path.join(repoRoot, ".next/BUILD_ID"))) {
    return;
  }
  execSync("npm run build", { cwd: repoRoot, stdio: "inherit" });
}

function startServer() {
  if (USE_PROD_SERVER) {
    return spawn("npx", ["next", "start", "--port", "3001"], {
      cwd: repoRoot,
      stdio: "ignore",
      detached: true,
      env: { ...process.env, NODE_ENV: "production" },
    });
  }
  return spawn("npm", ["run", "dev"], {
    cwd: repoRoot,
    stdio: "ignore",
    detached: true,
    env: { ...process.env },
  });
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const parsed = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && value) parsed[key] = value;
  }
  return parsed;
}

function loadEnv() {
  for (const file of [".env.local", ".env.vercel.prod"]) {
    for (const [key, value] of Object.entries(parseEnvFile(path.join(repoRoot, file)))) {
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
  const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  const raw = execSync(`npx supabase projects api-keys --project-ref ${ref} -o json`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.keys ?? [];
  const key = entries.find((entry) => entry.name === "service_role")?.api_key;
  if (!key?.trim()) throw new Error("service_role unavailable");
  return key.trim();
}

async function authenticateSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.APP_LIVE_E2E_EMAIL?.trim()?.toLowerCase();
  const anon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const admin = createClient(supabaseUrl, resolveServiceRoleKey(), { auth: { persistSession: false } });
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData?.properties?.hashed_token) throw new Error(linkError?.message ?? "magiclink failed");
  const { data: otpData, error: otpError } = await anon.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpError || !otpData.session) throw new Error(otpError?.message ?? "verify failed");
  return otpData.session;
}

function authCookie(session) {
  return buildSupabaseAuthCookieHeader(session);
}

function killPort3001() {
  try {
    execSync("lsof -ti :3001 | xargs kill -9 2>/dev/null || true", { stdio: "ignore", shell: true });
  } catch {
    // ignore
  }
}

async function waitForServer(timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
      if (res.status >= 200 && res.status < 500) return;
    } catch {
      // not ready
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not become ready on :3001");
}

async function coldDateRequest(session, attempt = 1) {
  const conversationId = randomUUID();
  const clientMessageId = `cold-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timeZone = "Europe/Oslo";
  const body = {
    conversation_id: conversationId,
    idempotency_key: `${conversationId}:${clientMessageId}`,
    question: QUESTION,
    locale: "no",
    timezone: timeZone,
    companion_active: true,
  };

  const started = Date.now();
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/aipify/companion/chat/enqueue`, {
      method: "POST",
      headers: {
        Cookie: authCookie(session),
        "Content-Type": "application/json",
        "x-timezone": timeZone,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 2000));
      return coldDateRequest(session, attempt + 1);
    }
    throw error;
  }
  const clientLatencyMs = Date.now() - started;
  const json = await res.json().catch(() => ({}));
  if ((res.status === 401 || res.status >= 500 || !json.execution) && attempt < 3) {
    await new Promise((r) => setTimeout(r, 1500));
    return coldDateRequest(session, attempt + 1);
  }
  return { httpStatus: res.status, clientLatencyMs, json, conversationId };
}

async function main() {
  loadEnv();
  ensureProductionBuild();
  const session = await authenticateSession();
  const results = [];

  for (let run = 1; run <= RUNS; run += 1) {
    killPort3001();
    await new Promise((r) => setTimeout(r, 2500));
    const child = startServer();
    child.unref();
    await waitForServer();
    await new Promise((r) => setTimeout(r, USE_PROD_SERVER ? 3000 : 10000));

    const result = await coldDateRequest(session);
    const json = result.json;
    const stageTimings = json.stage_timings ?? null;
    const serverDurationMs = json.duration_ms ?? stageTimings?.total_ms ?? null;
    const pass =
      json.execution === "direct" &&
      json.queue_inserted === false &&
      json.route === "datetime" &&
      serverDurationMs !== null &&
      serverDurationMs < 1000 &&
      json.user_message_id &&
      json.response_to_message_id === json.user_message_id;

    results.push({
      run,
      pass,
      http_status: result.httpStatus,
      server_duration_ms: serverDurationMs,
      client_latency_ms: result.clientLatencyMs,
      execution: json.execution ?? null,
      route: json.route ?? null,
      queue_inserted: json.queue_inserted ?? null,
      request_id: json.request_id ?? null,
      user_message_id: json.user_message_id ?? null,
      response_to_message_id: json.response_to_message_id ?? null,
      stage_timings: stageTimings,
      conversation_id: result.conversationId,
    });

    console.log(JSON.stringify({ phase: "cold_datetime_run", ...results[results.length - 1] }));
  }

  const allPass = results.every((entry) => entry.pass);
  console.log(
    JSON.stringify({
      phase: "cold_datetime_summary",
      pass: allPass,
      runs: RUNS,
      passed: results.filter((entry) => entry.pass).length,
      failed: results.filter((entry) => !entry.pass).length,
      results: results.map((entry) => ({
        run: entry.run,
        pass: entry.pass,
        client_latency_ms: entry.client_latency_ms,
        stage_timings: entry.stage_timings,
      })),
    }),
  );

  process.exit(allPass ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({ phase: "cold_datetime_fatal", message: error.message }));
  process.exit(1);
});
