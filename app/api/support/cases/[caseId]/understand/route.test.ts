import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isValidSupportCaseId,
  mapSupportCaseUnderstandRpcError,
  processSupportCaseUnderstandRequest,
  SUPPORT_UNDERSTAND_RPC,
  SUPPORT_UNDERSTANDING_NO_INBOUND,
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

const VALID_CASE_ID = "b1b2c3d4-e5f6-4789-a012-3456789abcde";

async function main() {
  await test("isValidSupportCaseId accepts valid UUID and rejects invalid values", async () => {
    assert.equal(isValidSupportCaseId(VALID_CASE_ID), true);
    assert.equal(isValidSupportCaseId("not-a-uuid"), false);
    assert.equal(isValidSupportCaseId("00000000-0000-0000-0000-000000000000"), false);
    assert.equal(isValidSupportCaseId(""), false);
  });

  await test("processSupportCaseUnderstandRequest calls authenticated RPC with valid UUID", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            created: true,
            summary: "Refund: Please refund my order.",
            intent: "Customer requests a refund or return",
            category: "refund",
            language: "unknown",
            confidence: 0.75,
            status: "complete",
            message_count: 1,
            engine_key: "canonical_support_rules",
            engine_version: "rules-v1",
            analyzed_at: "2026-06-26T12:00:00.000Z",
          },
          error: null,
        };
      },
    };

    const result = await processSupportCaseUnderstandRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.equal(result.body.created, true);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_UNDERSTAND_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: VALID_CASE_ID });
  });

  await test("processSupportCaseUnderstandRequest rejects invalid UUID with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseUnderstandRequest(supabase, "bad-id");
    assert.equal(result.status, 400);
    assert.equal(result.body.error, "Invalid case id");
  });

  await test("processSupportCaseUnderstandRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseUnderstandRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 401);
    assert.equal(result.body.error, "Unauthorized");
  });

  await test("processSupportCaseUnderstandRequest preserves cached created=false", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: {
          case_id: VALID_CASE_ID,
          created: false,
          summary: "Refund: Please refund my order.",
          intent: "Customer requests a refund or return",
          category: "refund",
          language: "unknown",
          confidence: 0.75,
          status: "complete",
          message_count: 1,
          engine_key: "canonical_support_rules",
          engine_version: "rules-v1",
          analyzed_at: "2026-06-26T12:00:00.000Z",
        },
        error: null,
      }),
    };

    const result = await processSupportCaseUnderstandRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.equal(result.body.created, false);
  });

  await test("processSupportCaseUnderstandRequest maps no inbound to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_understanding_no_inbound" },
      }),
    };

    const result = await processSupportCaseUnderstandRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_UNDERSTANDING_NO_INBOUND);
  });

  await test("processSupportCaseUnderstandRequest maps foreign case to 404", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "Case not found" },
      }),
    };

    const result = await processSupportCaseUnderstandRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 404);
    assert.equal(result.body.error, "Case not found");
  });

  await test("mapSupportCaseUnderstandRpcError maps permission errors to 403", async () => {
    const mapped = mapSupportCaseUnderstandRpcError("permission denied for support.view");
    assert.equal(mapped.status, 403);
  });

  await test("route uses RPC-only understand path without service role or direct table writes", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/support/cases/[caseId]/understand/route.ts"
    );
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCaseUnderstandRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /organization_id/);
    assert.doesNotMatch(routeSource, /request\.json\(/);
  });

  await test("migration SQL contract includes canonical understanding table and RPC", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931600000_canonical_support_understanding_p1_13cd.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /create table if not exists public\.organization_support_case_understandings/);
    assert.match(sql, /organization_support_case_understandings_org_case_key/);
    assert.match(sql, /organization_support_case_understandings_case_org_fkey/);
    assert.match(sql, /direction = 'inbound'/);
    assert.match(sql, /extensions\.digest\(/);
    assert.match(sql, /pg_advisory_xact_lock\(public\._sai_understanding_lock_key/);
    assert.match(sql, /classify_support_email_intent/);
    assert.match(sql, /support_case_understood/);
    assert.match(sql, /created', false/);
    assert.match(sql, /on conflict \(organization_id, case_id\) do update/);
    assert.match(
      sql,
      /revoke all on public\.organization_support_case_understandings from public, authenticated, anon/
    );
    assert.match(
      sql,
      /revoke all on function public\._sai_inbound_message_set_context\(uuid, uuid\) from public, anon, authenticated, service_role/
    );
    assert.match(
      sql,
      /grant execute on function public\.understand_organization_support_case\(uuid\) to authenticated/
    );
    assert.doesNotMatch(sql, /triage_support_case/);
    assert.doesNotMatch(sql, /analyze_support_email/);
    assert.doesNotMatch(sql, /insert into public\.support_cases/);
    assert.doesNotMatch(sql, /ai_summary/);
    assert.doesNotMatch(
      sql,
      /perform public\._sai_log\([\s\S]*support_case_understood[\s\S]*message_set_hash/
    );
    assert.doesNotMatch(
      sql,
      /perform public\._sai_log\([\s\S]*support_case_understood[\s\S]*analysis_text/
    );
    assert.doesNotMatch(
      sql,
      /perform public\._sai_log\([\s\S]*support_case_understood[\s\S]*customer_identifier/
    );
  });

  console.log("All support case understand route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
