import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  mapSupportCaseCreateRpcError,
  parseSupportCaseCreateBody,
  processSupportCaseCreateRequest,
  SUPPORT_CASE_CREATE_RPC,
  SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT,
  SUPPORT_INTAKE_LIMITS,
} from "@/lib/core/support-ai";

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

type MockSupabase = {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

async function main() {
  await test("parseSupportCaseCreateBody accepts legacy subject-only request", async () => {
    const parsed = parseSupportCaseCreateBody({ subject: "Password reset" });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.rpcParams.p_subject, "Password reset");
    assert.equal(parsed.rpcParams.p_initial_message, null);
    assert.equal(parsed.rpcParams.p_idempotency_key, null);
  });

  await test("parseSupportCaseCreateBody accepts message without key", async () => {
    const parsed = parseSupportCaseCreateBody({
      subject: "Help",
      message: "Need assistance with billing.",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.rpcParams.p_initial_message, "Need assistance with billing.");
    assert.equal(parsed.rpcParams.p_idempotency_key, null);
  });

  await test("parseSupportCaseCreateBody accepts key with message", async () => {
    const parsed = parseSupportCaseCreateBody({
      subject: "Help",
      message: "Need assistance.",
      idempotency_key: "idem-1",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.rpcParams.p_idempotency_key, "idem-1");
  });

  await test("parseSupportCaseCreateBody rejects key without message", async () => {
    const parsed = parseSupportCaseCreateBody({
      subject: "Help",
      idempotency_key: "idem-1",
    });
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.equal(parsed.status, 400);
  });

  await test("parseSupportCaseCreateBody rejects empty or too long subject", async () => {
    assert.equal(parseSupportCaseCreateBody({ subject: "   " }).ok, false);
    assert.equal(
      parseSupportCaseCreateBody({ subject: "x".repeat(SUPPORT_INTAKE_LIMITS.subjectMax + 1) }).ok,
      false
    );
  });

  await test("parseSupportCaseCreateBody rejects empty or too long message", async () => {
    assert.equal(parseSupportCaseCreateBody({ subject: "Help", message: "   " }).ok, true);
    assert.equal(
      parseSupportCaseCreateBody({
        subject: "Help",
        message: "x".repeat(SUPPORT_INTAKE_LIMITS.messageMax + 1),
      }).ok,
      false
    );
  });

  await test("parseSupportCaseCreateBody rejects too long idempotency key", async () => {
    const parsed = parseSupportCaseCreateBody({
      subject: "Help",
      message: "Body",
      idempotency_key: "k".repeat(SUPPORT_INTAKE_LIMITS.idempotencyKeyMax + 1),
    });
    assert.equal(parsed.ok, false);
  });

  await test("parseSupportCaseCreateBody rejects organization_id from client", async () => {
    const parsed = parseSupportCaseCreateBody({
      subject: "Help",
      organization_id: "32d748eb-9a66-4174-a416-18a813610d3e",
    });
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.equal(parsed.status, 400);
  });

  await test("mapSupportCaseCreateRpcError maps conflict to 409", async () => {
    const mapped = mapSupportCaseCreateRpcError("support_intake_idempotency_conflict");
    assert.equal(mapped.status, 409);
    assert.equal(mapped.error, SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT);
  });

  await test("processSupportCaseCreateRequest legacy subject-only succeeds via RPC only", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            id: "case-1",
            case_number: "SUP-00001",
            status: "new",
            created: true,
            message_id: null,
          },
          error: null,
        };
      },
    };

    const result = await processSupportCaseCreateRequest(supabase, { subject: "Password reset" });
    assert.equal(result.status, 200);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_CASE_CREATE_RPC);
    assert.equal(rpcCalls[0]?.params?.p_initial_message, null);
    assert.equal(rpcCalls[0]?.params?.p_idempotency_key, null);
  });

  await test("processSupportCaseCreateRequest maps idempotency conflict to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_intake_idempotency_conflict" },
      }),
    };

    const result = await processSupportCaseCreateRequest(supabase, {
      subject: "Help",
      message: "Different body",
      idempotency_key: "idem-1",
    });
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT);
  });

  await test("processSupportCaseCreateRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseCreateRequest(supabase, { subject: "Help" });
    assert.equal(result.status, 401);
    assert.equal(result.body.error, "Unauthorized");
  });

  await test("route uses RPC-only create path without service role or direct table writes", async () => {
    const routePath = path.join(process.cwd(), "app/api/support/cases/route.ts");
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCaseCreateRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
  });

  await test("migration SQL contract includes single create function strategy", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931500000_canonical_support_intake_storage_p1_13bz.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /create table if not exists public\.organization_support_case_messages/);
    assert.match(sql, /intake_idempotency_key text/);
    assert.match(sql, /intake_payload_hash text/);
    assert.match(sql, /organization_support_cases_intake_idempotency_idx/);
    assert.match(sql, /drop function if exists public\.create_organization_support_case\(text, text, text, text\)/);
    assert.match(sql, /p_initial_message text default null/);
    assert.match(sql, /p_idempotency_key text default null/);
    assert.match(sql, /pg_advisory_xact_lock\(public\._sai_intake_lock_key/);
    assert.match(sql, /extensions\.digest\(/);
    assert.match(sql, /raise exception 'support_intake_idempotency_conflict'/);
    assert.match(sql, /revoke all on public\.organization_support_case_messages from public, authenticated, anon/);
    assert.match(
      sql,
      /revoke all on function public\.create_organization_support_case\(text, text, text, text, text, text\) from public, anon/
    );
    assert.match(
      sql,
      /grant execute on function public\.create_organization_support_case\(text, text, text, text, text, text\) to authenticated/
    );
    assert.doesNotMatch(
      sql,
      /grant execute on function public\.create_organization_support_case\(text, text, text, text\) to authenticated/
    );
  });

  console.log("All support cases route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
