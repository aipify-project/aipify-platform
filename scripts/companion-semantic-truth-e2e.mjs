#!/usr/bin/env node
/**
 * Semantic truth check — authenticated companion enqueue for org/knowledge questions.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { buildSupabaseAuthCookieHeader } from "./lib/companion-e2e-auth.mjs";

const BASE_URL = (process.env.COMPANION_E2E_BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");

const QUESTIONS = [
  "Hvor mange medlemmer har vi?",
  "Siste hendelser",
  "Er Google Analytics installert riktig?",
  "Hent FAQ-seksjonen fra Nordic Ledger Partners",
  "Kan du verifisere bilder?",
  "Hva er Self Love?",
];

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
    for (const [key, value] of Object.entries(parseEnvFile(path.join(process.cwd(), file)))) {
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
  return entries.find((entry) => entry.name === "service_role")?.api_key?.trim();
}

async function authenticateSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.APP_LIVE_E2E_EMAIL?.trim()?.toLowerCase();
  const anon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const admin = createClient(supabaseUrl, resolveServiceRoleKey(), { auth: { persistSession: false } });
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (linkError || !linkData?.properties?.hashed_token) throw new Error(linkError?.message ?? "magiclink failed");
  const { data: otpData, error: otpError } = await anon.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpError || !otpData.session) throw new Error(otpError?.message ?? "verify failed");
  return otpData.session;
}

function excerpt(text, max = 320) {
  return String(text ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isGenericFallback(text) {
  const n = String(text ?? "");
  return (
    n.includes("Jeg er her med deg") ||
    n.includes("Spør med dine egne ord") ||
    n.includes("I'm here with you")
  );
}

async function ask(session, question) {
  const conversationId = randomUUID();
  const clientMessageId = `sem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${BASE_URL}/api/aipify/companion/chat/enqueue`, {
    method: "POST",
    headers: {
      Cookie: buildSupabaseAuthCookieHeader(session),
      "Content-Type": "application/json",
      "x-timezone": "Europe/Oslo",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      idempotency_key: `${conversationId}:${clientMessageId}`,
      question,
      locale: "no",
      timezone: "Europe/Oslo",
      companion_active: true,
    }),
  });
  const json = await res.json().catch(() => ({}));
  const stateRes = await fetch(
    `${BASE_URL}/api/aipify/companion/chat/state?conversation_id=${encodeURIComponent(conversationId)}`,
    { headers: { Cookie: buildSupabaseAuthCookieHeader(session) } },
  );
  const state = await stateRes.json().catch(() => ({}));
  const assistant = (state.messages ?? []).find((m) => m.role === "assistant");
  const content = assistant?.content ?? json.assistant_content ?? "";
  const payload = assistant?.payload ?? {};
  return {
    httpStatus: res.status,
    execution: json.execution ?? null,
    route: json.route ?? payload.route ?? null,
    queue_inserted: json.queue_inserted ?? null,
    capability: payload.capability ?? payload.sourceId ?? null,
    direct_answer: excerpt(content),
    generic_fallback: isGenericFallback(content),
    request_id: json.request_id ?? null,
    duration_ms: json.duration_ms ?? null,
  };
}

async function main() {
  loadEnv();
  const session = await authenticateSession();
  const results = [];
  for (const question of QUESTIONS) {
    const result = await ask(session, question);
    results.push({ question, ...result });
    console.log(JSON.stringify({ phase: "semantic_truth_question", question, ...result }));
  }
  const pass = results.every((r) => r.httpStatus === 200 && r.execution === "direct" && !r.generic_fallback);
  console.log(JSON.stringify({ phase: "semantic_truth_summary", pass, results }));
  process.exit(pass ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({ phase: "semantic_truth_fatal", message: error.message }));
  process.exit(1);
});
