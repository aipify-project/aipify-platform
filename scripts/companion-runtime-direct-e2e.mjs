#!/usr/bin/env node
/**
 * Authenticated runtime E2E for Companion direct-path + correlation.
 * Uses the same POST /api/aipify/companion/chat/enqueue body as APP client.
 *
 * Usage:
 *   source .env.local
 *   node scripts/companion-runtime-direct-e2e.mjs
 *
 * Requires: APP_LIVE_E2E_EMAIL, APP_LIVE_E2E_PASSWORD (or COMPANION_E2E_*),
 *           NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *           APP_LIVE_E2E_BASE_URL or NEXT_PUBLIC_APP_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email =
  process.env.COMPANION_E2E_EMAIL ??
  process.env.APP_LIVE_E2E_EMAIL ??
  process.env.APP_LIVE_E2E_ISOLATION_EMAIL;
const password =
  process.env.COMPANION_E2E_PASSWORD ??
  process.env.APP_LIVE_E2E_PASSWORD ??
  process.env.APP_LIVE_E2E_ISOLATION_PASSWORD;
const baseUrl = (
  process.env.COMPANION_E2E_BASE_URL ??
  process.env.APP_LIVE_E2E_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

if (!supabaseUrl || !supabaseAnonKey || !email || !password) {
  console.error(
    "Missing auth env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, APP_LIVE_E2E_EMAIL, APP_LIVE_E2E_PASSWORD",
  );
  process.exit(1);
}

const GENERIC_FALLBACK_SNIPPETS = [
  "Jeg er her med deg",
  "Spør med dine egne ord",
  "I'm here with you",
  "Ask in your own words",
];

const TEST_CASES = [
  {
    id: "date",
    question: "Hva er datoen i dag?",
    expectExecution: "direct",
    maxMs: 1000,
    forbidQueue: true,
    forbidGenericFallback: true,
  },
  {
    id: "time",
    question: "Hva er klokken nå?",
    expectExecution: "direct",
    maxMs: 1000,
    forbidQueue: true,
    forbidGenericFallback: true,
  },
  {
    id: "humor",
    question: "Kan du le?",
    expectExecution: "direct",
    maxMs: 3000,
    forbidQueue: true,
    forbidGenericFallback: false,
  },
  {
    id: "self_love",
    question: "Hva er Self Love?",
    expectExecution: "direct",
    maxMs: 5000,
    forbidQueue: true,
    forbidGenericFallback: true,
  },
  {
    id: "member_count",
    question: "Hvor mange medlemmer har vi?",
    expectExecution: ["direct", "queued"],
    maxMs: 8000,
    forbidQueue: false,
    forbidGenericFallback: true,
  },
  {
    id: "recent_events",
    question: "Siste hendelser",
    expectExecution: "direct",
    maxMs: 5000,
    forbidQueue: true,
    forbidGenericFallback: true,
  },
];

function createClientMessageId() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createIdempotencyKey(conversationId, clientMessageId) {
  return `${conversationId}:${clientMessageId}`;
}

function authCookie(session) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
    }),
  );
  return `${cookieName}=${cookieValue}`;
}

function excerpt(text, max = 160) {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, max)}…`;
}

function isGenericFallback(text) {
  const normalized = String(text ?? "");
  return GENERIC_FALLBACK_SNIPPETS.some((snippet) => normalized.includes(snippet));
}

async function fetchChatState(session, conversationId) {
  const res = await fetch(
    `${baseUrl}/api/aipify/companion/chat/state?conversation_id=${encodeURIComponent(conversationId)}`,
    {
      headers: { Cookie: authCookie(session) },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

async function submitQuestion(session, conversationId, question) {
  const clientMessageId = createClientMessageId();
  const idempotencyKey = createIdempotencyKey(conversationId, clientMessageId);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Europe/Oslo";

  const body = {
    conversation_id: conversationId,
    idempotency_key: idempotencyKey,
    question,
    attachment_ids: [],
    active_artifact_id: null,
    attachment_summaries: [],
    locale: "no",
    pathname: "/app/command-center",
    platform_active_modules: null,
    title: question.slice(0, 120),
    companion_active: true,
    timezone: timeZone,
  };

  const started = Date.now();
  const res = await fetch(`${baseUrl}/api/aipify/companion/chat/enqueue`, {
    method: "POST",
    headers: {
      Cookie: authCookie(session),
      "Content-Type": "application/json",
      "x-timezone": timeZone,
    },
    body: JSON.stringify(body),
  });
  const durationMs = Date.now() - started;
  const json = await res.json().catch(() => ({}));

  return {
    httpStatus: res.status,
    durationMs,
    request: {
      url: `${baseUrl}/api/aipify/companion/chat/enqueue`,
      method: "POST",
      body,
      clientMessageId,
    },
    response: json,
  };
}

async function resolveAssistantForUser(state, userMessageId) {
  if (!state?.messages?.length || !userMessageId) return null;
  const linked = state.messages.find(
    (m) =>
      m.role === "assistant" &&
      m.payload &&
      typeof m.payload === "object" &&
      m.payload.response_to_message_id === userMessageId,
  );
  if (linked) return linked;

  const userMsg = state.messages.find((m) => m.id === userMessageId || m.server_id === userMessageId);
  if (!userMsg?.sequence_no) return null;
  return (
    state.messages.find(
      (m) =>
        m.role === "assistant" &&
        typeof m.sequence_no === "number" &&
        m.sequence_no > userMsg.sequence_no,
    ) ?? null
  );
}

async function waitForAssistant(session, conversationId, userMessageId, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const state = await fetchChatState(session, conversationId);
    const assistant = await resolveAssistantForUser(state, userMessageId);
    if (assistant?.content) return { state, assistant };
    const activeQueue = state?.queue?.some(
      (q) => q.status === "waiting" || q.status === "processing",
    );
    if (!activeQueue && state?.messages?.length) {
      const fallback = await resolveAssistantForUser(state, userMessageId);
      if (fallback) return { state, assistant: fallback };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return { state: await fetchChatState(session, conversationId), assistant: null };
}

async function countQueueRowsForConversation(conversationId) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { count } = await admin
    .from("companion_message_queue")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId);
  return count ?? 0;
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (authError || !authData.session) {
  console.error("Auth failed:", authError?.message ?? "no session");
  process.exit(1);
}

const session = authData.session;
const conversationId = randomUUID();
const results = [];
let failed = 0;

console.log(
  JSON.stringify({
    phase: "e2e_start",
    baseUrl,
    conversation_id: conversationId,
    user: email.replace(/(.{2}).+(@.+)/, "$1***$2"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
);

for (const testCase of TEST_CASES) {
  const queueBefore = await countQueueRowsForConversation(conversationId);
  const submit = await submitQuestion(session, conversationId, testCase.question);
  const execution = submit.response.execution ?? "unknown";
  const queueInserted = submit.response.queue_inserted === true;
  const userMessageId = submit.response.user_message_id ?? null;

  let assistantContent = null;
  let responseToOk = false;
  let capability = null;
  let route = submit.response.route ?? null;

  if (execution === "direct" && userMessageId) {
    const resolved = await waitForAssistant(session, conversationId, userMessageId, 3000);
    assistantContent = resolved.assistant?.content ?? null;
    const payload = resolved.assistant?.payload;
    responseToOk =
      payload &&
      typeof payload === "object" &&
      payload.response_to_message_id === userMessageId;
    capability = payload?.capability ?? payload?.sourceId ?? null;
    route = payload?.route ?? route;
  } else if (execution === "queued") {
    const resolved = await waitForAssistant(session, conversationId, userMessageId, 20000);
    assistantContent = resolved.assistant?.content ?? null;
    const payload = resolved.assistant?.payload;
    responseToOk =
      payload &&
      typeof payload === "object" &&
      payload.response_to_message_id === userMessageId;
    capability = payload?.capability ?? payload?.sourceId ?? null;
    route = payload?.route ?? route;
  }

  const queueAfter = await countQueueRowsForConversation(conversationId);
  const queueDelta = queueBefore !== null && queueAfter !== null ? queueAfter - queueBefore : null;

  const expectExecutions = Array.isArray(testCase.expectExecution)
    ? testCase.expectExecution
    : [testCase.expectExecution];
  const executionOk = expectExecutions.includes(execution);
  const durationOk = submit.durationMs <= testCase.maxMs || execution === "queued";
  const queueOk = testCase.forbidQueue ? !queueInserted && (queueDelta === null || queueDelta === 0) : true;
  const correlationOk = execution === "direct" ? responseToOk !== false : true;
  const fallbackOk = testCase.forbidGenericFallback ? !isGenericFallback(assistantContent) : true;
  const pass = executionOk && durationOk && queueOk && fallbackOk && (execution !== "direct" || correlationOk);

  if (!pass) failed += 1;

  const row = {
    id: testCase.id,
    question: testCase.question,
    pass,
    http_status: submit.httpStatus,
    execution,
    route,
    queue_inserted: queueInserted,
    queue_delta: queueDelta,
    worker_dispatch: submit.response.worker_dispatch ?? null,
    request_id: submit.response.request_id ?? null,
    user_message_id: userMessageId,
    response_to_message_id_ok: responseToOk,
    duration_ms: submit.durationMs,
    capability,
    answer_excerpt: excerpt(assistantContent),
    failures: [
      !executionOk ? `execution=${execution} expected ${expectExecutions.join("|")}` : null,
      !durationOk ? `duration ${submit.durationMs}ms > ${testCase.maxMs}ms` : null,
      !queueOk ? "queue_inserted_or_delta" : null,
      !correlationOk ? "missing response_to_message_id" : null,
      !fallbackOk ? "generic_fallback_on_org_question" : null,
    ].filter(Boolean),
  };

  results.push(row);
  console.log(JSON.stringify(row));
}

console.log(
  JSON.stringify({
    phase: "e2e_summary",
    pass: failed === 0,
    failed,
    total: TEST_CASES.length,
    authoritative_endpoint: `${baseUrl}/api/aipify/companion/chat/enqueue`,
    method: "POST",
  }),
);

process.exit(failed === 0 ? 0 : 1);
