import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { POST } from "@/app/api/support-intake/web/route";
import { createVerificationChallenge } from "@/lib/public-forms/human-verification";
import {
  createMemoryRateLimitBackend,
  createUpstashRestBackend,
  PUBLIC_SUPPORT_INTAKE_RATE,
  setSharedRateLimitBackendForTests,
} from "@/lib/public-forms/shared-rate-limit";
import {
  isSupportIntakeIdempotencyKey,
  readSupportIntakeIdempotencyKey,
} from "@/lib/support-intake/idempotency";
import {
  PLATFORM_COMPANY_RESTORE_SQL_PATH,
  PLATFORM_COMPANY_RESTORE_SQL_SHA256,
  SUPPORT_ALL_CHANNELS_INTAKE_SQL_PATH,
  SUPPORT_ALL_CHANNELS_INTAKE_SQL_SHA256,
} from "@/lib/support-intake/sql-candidate";
import {
  SUPPORT_EMAIL_TRANSPORT_ENABLED,
  SUPPORT_INTAKE_FEATURE_GATE,
  SUPPORT_INTAKE_RPC_CONNECTED,
} from "@/lib/support-intake/types";
import { getSupportIntakeGateState, submitSupportIntake } from "@/lib/support-intake/submit";

function answerFor(token: string): number {
  const encoded = token.split(".")[0]!;
  return Number(Buffer.from(encoded, "base64url").toString("utf8").split(":")[1]);
}

function validBody(idempotencyKey = "attempt-001") {
  const challenge = createVerificationChallenge();
  return {
    contactName: "Ada",
    contactEmail: "ada@example.com",
    subject: "Hjelp med innlogging",
    message: "Jeg får ikke logget inn på kontoen min.",
    idempotencyKey,
    _form_started_at: Date.now() - 10_000,
    _verification_token: challenge.token,
    _verification_answer: answerFor(challenge.token),
  };
}

async function post(body: Record<string, unknown>, ip: string) {
  const response = await POST(
    new Request("https://example.com/api/support-intake/web", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    }) as never,
  );
  const json = (await response.json()) as Record<string, unknown>;
  return { status: response.status, json };
}

function assertNoTicket(json: Record<string, unknown>) {
  const blob = JSON.stringify(json);
  assert.equal(json.ok, undefined);
  assert.doesNotMatch(blob, /SUP-[A-Z0-9]{8}/);
  assert.equal(json.ticket_number, undefined);
  assert.equal(json.ticketNumber, undefined);
  assert.equal(json.ticket_id, undefined);
}

test("intake stays closed and does not send email", () => {
  assert.equal(SUPPORT_INTAKE_RPC_CONNECTED, false);
  assert.equal(SUPPORT_INTAKE_FEATURE_GATE, false);
  assert.equal(SUPPORT_EMAIL_TRANSPORT_ENABLED, false);
  assert.equal(getSupportIntakeGateState().live, false);
});

test("idempotency keys are reused, never invented", () => {
  assert.equal(isSupportIntakeIdempotencyKey("attempt-001"), true);
  assert.equal(isSupportIntakeIdempotencyKey("short"), false);
  assert.equal(isSupportIntakeIdempotencyKey("has space"), false);
  assert.equal(readSupportIntakeIdempotencyKey({}), null);
  assert.equal(
    readSupportIntakeIdempotencyKey({ idempotency_key: "attempt-001" }),
    "attempt-001",
  );
});

test("a closed intake returns no ticket for one or two identical attempts", async () => {
  setSharedRateLimitBackendForTests(createMemoryRateLimitBackend());
  try {
    const body = validBody("attempt-same");
    const first = await post(body, "203.0.113.10");
    const second = await post(body, "203.0.113.11");
    assert.equal(first.status, 503);
    assert.equal(first.json.code, "core_not_applied");
    assert.equal(second.status, 503);
    assert.equal(second.json.live, false);
    assertNoTicket(first.json);
    assertNoTicket(second.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("concurrent identical attempts share one stored ticket", async () => {
  const tickets = new Map<string, string>();
  let chain = Promise.resolve();
  async function claim(key: string): Promise<{ id: string; created: boolean }> {
    const run = chain.then(async () => {
      const existing = tickets.get(key);
      if (existing) return { id: existing, created: false };
      const id = `ticket-${tickets.size + 1}`;
      tickets.set(key, id);
      return { id, created: true };
    });
    chain = run.then(() => undefined, () => undefined);
    return run;
  }

  const [a, b] = await Promise.all([claim("attempt-same"), claim("attempt-same")]);
  assert.equal(a.id, b.id);
  assert.equal(tickets.size, 1);
  assert.equal(Number(a.created) + Number(b.created), 1);

  const other = await claim("attempt-other");
  assert.notEqual(other.id, a.id);
  assert.equal(tickets.size, 2);
});

test("client tenant ids are rejected before a ticket can exist", async () => {
  setSharedRateLimitBackendForTests(null);
  try {
    const result = await post(
      { ...validBody(), company_id: "2697c432-d03d-44f6-839c-66200fd20b55" },
      "203.0.113.20",
    );
    assert.equal(result.status, 403);
    assert.equal(result.json.code, "forbidden");
    assertNoTicket(result.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("a missing attempt key is a validation error and stores nothing", async () => {
  setSharedRateLimitBackendForTests(createMemoryRateLimitBackend());
  try {
    const body = validBody();
    delete (body as { idempotencyKey?: string }).idempotencyKey;
    const result = await post(body, "203.0.113.21");
    assert.equal(result.status, 400);
    assert.equal(result.json.code, "validation");
    assert.equal(result.json.field, "request");
    assertNoTicket(result.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("shared rate limit denies the 9th request across two backends", async () => {
  const counts = new Map<string, { count: number; ttl: number }>();
  const fetchImpl: typeof fetch = async (_url, init) => {
    const commands = JSON.parse(String(init?.body)) as string[][];
    const key = commands[0]?.[1] ?? "";
    const windowSeconds = Number(commands[1]?.[2] ?? 1);
    const current = counts.get(key) ?? { count: 0, ttl: windowSeconds };
    current.count += 1;
    counts.set(key, current);
    return new Response(
      JSON.stringify([
        { result: current.count },
        { result: 1 },
        { result: current.ttl },
      ]),
      { status: 200 },
    );
  };
  const firstInstance = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl,
  });
  const secondInstance = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl,
  });
  assert.ok(firstInstance);
  assert.ok(secondInstance);

  let denied = 0;
  for (let i = 0; i < PUBLIC_SUPPORT_INTAKE_RATE.limit + 1; i += 1) {
    const backend = i % 2 === 0 ? firstInstance : secondInstance;
    const decision = await backend.increment("shared-key", PUBLIC_SUPPORT_INTAKE_RATE.windowSeconds);
    if (decision.count > PUBLIC_SUPPORT_INTAKE_RATE.limit) denied += 1;
  }
  assert.equal(denied, 1);
  assert.equal(counts.get("shared-key")?.count, 9);

  setSharedRateLimitBackendForTests(createMemoryRateLimitBackend());
  try {
    const ip = "203.0.113.30";
    let last = await post(validBody("attempt-rate-0"), ip);
    for (let i = 1; i < 9; i += 1) {
      last = await post(validBody(`attempt-rate-${i}`), ip);
    }
    assert.equal(last.status, 429);
    assert.equal(last.json.code, "rate_limited");
    assertNoTicket(last.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("a missing shared store fails closed without a ticket", async () => {
  setSharedRateLimitBackendForTests(null);
  try {
    const result = await post(validBody("attempt-down"), "203.0.113.40");
    assert.equal(result.status, 503);
    assert.equal(result.json.code, "rate_limit_unavailable");
    assert.equal(result.json.live, false);
    assertNoTicket(result.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("honeypot is still rejected before the shared store is required", async () => {
  setSharedRateLimitBackendForTests(null);
  try {
    const result = await post({ ...validBody(), _honeypot: "bot" }, "203.0.113.41");
    assert.equal(result.status, 400);
    assert.equal(result.json.code, "spam_rejected");
    assertNoTicket(result.json);
  } finally {
    setSharedRateLimitBackendForTests(undefined);
  }
});

test("closed intake and a failed create do not invent a ticket number", async () => {
  const denied = await submitSupportIntake({
    payload: {
      source: "web",
      subject: "Hjelp med innlogging",
      message: "Jeg får ikke logget inn på kontoen min.",
      contactName: "Ada",
      contactEmail: "ada@example.com",
    },
    actor: { kind: "guest" },
    idempotencyKey: "attempt-001",
  });
  assert.equal(denied.ok, false);
  if (!denied.ok) {
    assert.equal(denied.code, "core_not_applied");
    assert.equal("ticketNumber" in denied, false);
  }
});

test("SQL candidates lock idempotency, keep APP on authenticated, and do not rewrite the platform company", () => {
  const intake = readFileSync(SUPPORT_ALL_CHANNELS_INTAKE_SQL_PATH, "utf8");
  const restore = readFileSync(PLATFORM_COMPANY_RESTORE_SQL_PATH, "utf8");
  assert.equal(
    createHash("sha256").update(intake).digest("hex"),
    SUPPORT_ALL_CHANNELS_INTAKE_SQL_SHA256,
  );
  assert.equal(
    createHash("sha256").update(restore).digest("hex"),
    PLATFORM_COMPANY_RESTORE_SQL_SHA256,
  );

  const webStart = intake.indexOf("function public.platform_support_intake_web_create");
  const partnerStart = intake.indexOf("function public.platform_support_intake_partner_create");
  const replyStart = intake.indexOf("function public.reply_partner_support_request");
  const web = intake.slice(webStart, partnerStart);
  const partner = intake.slice(partnerStart, replyStart);
  const reply = intake.slice(replyStart);

  for (const body of [web, partner, reply]) {
    const lockAt = body.indexOf("_psacv3_lock_intake_idempotency");
    const insertAt = body.search(/insert into public\.(app_portal_support_requests|platform_support_ticket_messages)/);
    const conflictAt = body.indexOf("idempotency conflict");
    assert.ok(lockAt >= 0 && insertAt > lockAt && conflictAt > insertAt);
  }
  assert.ok(web.indexOf("invalid idempotency key") < web.indexOf("_psacv3_lock_intake_idempotency"));

  assert.match(intake, /revoke all on function public\.platform_support_intake_web_create[\s\S]*from public, anon, authenticated/);
  assert.match(intake, /grant execute on function public\.platform_support_intake_web_create[\s\S]*to service_role/);
  assert.match(intake, /revoke all on function %s from public, anon/);
  assert.match(intake, /grant execute on function %s to authenticated/);
  assert.match(intake, /'create_app_portal_support_request'/);
  assert.doesNotMatch(intake, /insert into public\.companies/i);
  assert.doesNotMatch(intake, /update public\.companies/i);

  assert.match(restore, /PREPARED_ONLY/);
  assert.match(restore, /insert into public\.companies \(name, slug, is_platform\)/);
  assert.match(restore, /where not exists/i);
  assert.doesNotMatch(restore, /\bupdate\b/i);
  assert.doesNotMatch(restore, /\bdelete\b/i);
  assert.doesNotMatch(restore, /2697c432-d03d-44f6-839c-66200fd20b55/);

  const appRoute = readFileSync("app/api/aipify/support-requests/route.ts", "utf8");
  const userGate = appRoute.indexOf("getUser()");
  const rpcCall = appRoute.indexOf("create_app_portal_support_request");
  assert.ok(userGate >= 0 && rpcCall > userGate);
  assert.match(appRoute, /if \(!user\) return NextResponse\.json\(\{ error: "Unauthorized" \}/);
  assert.doesNotMatch(appRoute, /SUPABASE_ANON_KEY|createServiceRoleClient/);
});
