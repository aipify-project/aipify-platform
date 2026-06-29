import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isValidSupportCaseId,
  mapSupportCasePrioritizeRpcError,
  parseSupportPrioritizeBody,
  processSupportCasePrioritizeRequest,
  SUPPORT_PRIORITY_MANUAL_CLEAR_NOT_MANUAL,
  SUPPORT_PRIORITY_UNDERSTANDING_REQUIRED,
  SUPPORT_PRIORITY_UNDERSTANDING_STALE,
  SUPPORT_PRIORITIZE_ASSESS_RPC,
  SUPPORT_PRIORITIZE_CLEAR_RPC,
  SUPPORT_PRIORITIZE_MANUAL_RPC,
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
  await test("parseSupportPrioritizeBody rejects invalid action", async () => {
    const parsed = parseSupportPrioritizeBody({ action: "unknown" });
    assert.equal(parsed.ok, false);
  });

  await test("parseSupportPrioritizeBody rejects set_manual without valid priority", async () => {
    const parsed = parseSupportPrioritizeBody({ action: "set_manual", priority: "critical" });
    assert.equal(parsed.ok, false);
  });

  await test("processSupportCasePrioritizeRequest assess calls assess RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            priority: "high",
            priority_source: "automatic",
            reason_code: "category_refund",
            confidence: 0.75,
            created: true,
            protected: false,
            engine_key: "canonical_support_priority_rules",
            engine_version: "rules-v1",
            assessed_at: "2026-06-29T12:00:00.000Z",
          },
          error: null,
        };
      },
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, { action: "assess" });
    assert.equal(result.status, 200);
    assert.equal(result.body.created, true);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PRIORITIZE_ASSESS_RPC);
  });

  await test("processSupportCasePrioritizeRequest maps understanding required to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_priority_understanding_required" },
      }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, undefined);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PRIORITY_UNDERSTANDING_REQUIRED);
  });

  await test("processSupportCasePrioritizeRequest maps stale understanding to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_priority_understanding_stale" },
      }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, { action: "assess" });
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PRIORITY_UNDERSTANDING_STALE);
  });

  await test("processSupportCasePrioritizeRequest returns protected assess result", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: {
          case_id: VALID_CASE_ID,
          priority: "medium",
          priority_source: "manual",
          created: false,
          protected: true,
        },
        error: null,
      }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, undefined);
    assert.equal(result.status, 200);
    assert.equal(result.body.protected, true);
    assert.equal(result.body.created, false);
  });

  await test("processSupportCasePrioritizeRequest set_manual calls manual RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            priority: "low",
            priority_source: "manual",
            reason_code: "manual_override",
            created: true,
          },
          error: null,
        };
      },
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, {
      action: "set_manual",
      priority: "low",
    });
    assert.equal(result.status, 200);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PRIORITIZE_MANUAL_RPC);
  });

  await test("processSupportCasePrioritizeRequest clear_manual calls clear RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            priority: "low",
            priority_source: "default",
            created: true,
          },
          error: null,
        };
      },
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, {
      action: "clear_manual",
    });
    assert.equal(result.status, 200);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PRIORITIZE_CLEAR_RPC);
  });

  await test("processSupportCasePrioritizeRequest rejects invalid UUID with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, "bad-id", undefined);
    assert.equal(result.status, 400);
  });

  await test("processSupportCasePrioritizeRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, undefined);
    assert.equal(result.status, 401);
  });

  await test("processSupportCasePrioritizeRequest maps foreign case to 404", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "Case not found" },
      }),
    };

    const result = await processSupportCasePrioritizeRequest(supabase, VALID_CASE_ID, { action: "assess" });
    assert.equal(result.status, 404);
    assert.equal(result.body.error, "Case not found");
  });

  await test("mapSupportCasePrioritizeRpcError maps permission errors to 403", async () => {
    const mapped = mapSupportCasePrioritizeRpcError("permission denied for support.view");
    assert.equal(mapped.status, 403);
    assert.equal(mapped.error, "permission denied for support.view");
  });

  await test("mapSupportCasePrioritizeRpcError maps escalate permission errors to 403", async () => {
    const mapped = mapSupportCasePrioritizeRpcError("permission denied for support.escalate");
    assert.equal(mapped.status, 403);
  });

  await test("mapSupportCasePrioritizeRpcError maps manual clear conflict to 409", async () => {
    const mapped = mapSupportCasePrioritizeRpcError("support_priority_manual_clear_not_manual");
    assert.equal(mapped.status, 409);
    assert.equal(mapped.error, SUPPORT_PRIORITY_MANUAL_CLEAR_NOT_MANUAL);
  });

  await test("isValidSupportCaseId accepts valid UUID", async () => {
    assert.equal(isValidSupportCaseId(VALID_CASE_ID), true);
  });

  await test("route uses RPC-only prioritize path without service role or direct table writes", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/support/cases/[caseId]/prioritize/route.ts"
    );
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCasePrioritizeRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /organization_id/);
  });

  await test("migration SQL contract includes priority provenance on case row", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931700000_canonical_support_priority_p1_13ch.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /add column if not exists priority_source text/);
    assert.match(sql, /add column if not exists priority_reason_code text/);
    assert.match(sql, /add column if not exists priority_confidence numeric/);
    assert.match(sql, /add column if not exists priority_assessed_at timestamptz/);
    assert.match(sql, /add column if not exists priority_engine_key text/);
    assert.match(sql, /add column if not exists priority_engine_version text/);
    assert.match(sql, /add column if not exists priority_understanding_message_set_hash text/);
    assert.match(sql, /add column if not exists priority_manual_set_at timestamptz/);
    assert.match(sql, /set priority_source = 'legacy'/);
    assert.match(sql, /p_priority_explicit boolean default false/);
    assert.match(sql, /drop function if exists public\.create_organization_support_case\(text, text, text, text, text, text\)/);
    assert.match(sql, /assess_organization_support_case_priority/);
    assert.match(sql, /set_organization_support_case_priority_manual/);
    assert.match(sql, /clear_organization_support_case_priority_override/);
    assert.match(sql, /severe_risk_signal/);
    assert.match(sql, /high_risk_signal/);
    assert.match(sql, /category_refund/);
    assert.match(sql, /understanding_low_confidence_review/);
    assert.match(sql, /support_case_priority_assessed/);
    assert.match(sql, /support_case_priority_manual_set/);
    assert.match(sql, /support_case_priority_manual_cleared/);
    assert.match(sql, /pg_advisory_xact_lock\(public\._sai_priority_assess_lock_key/);
    assert.match(sql, /priority_source = 'escalation'/);
    assert.match(sql, /protected', true/);
    assert.doesNotMatch(sql, /organization_support_case_priority_assessments/);
    assert.doesNotMatch(sql, /triage_support_case/);
    assert.doesNotMatch(sql, /insert into public\.support_cases/);
    const assessedAuditStart = sql.indexOf("'support_case_priority_assessed'");
    assert.ok(assessedAuditStart > -1, "assessed audit action exists");
    const assessedAudit = sql.slice(assessedAuditStart, assessedAuditStart + 600);
    assert.doesNotMatch(assessedAudit, /'message_set_hash'/);
    assert.doesNotMatch(assessedAudit, /'analysis_text'/);
    assert.doesNotMatch(assessedAudit, /'customer_identifier'/);
    assert.doesNotMatch(assessedAudit, /'summary'/);
    assert.doesNotMatch(assessedAudit, /'subject'/);
    assert.doesNotMatch(assessedAudit, /'body'/);
  });

  await test("migration rules distinguish severe and broad risk without urgent refund alone", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931700000_canonical_support_priority_p1_13ch.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /_sai_priority_severe_risk_signal/);
    assert.match(sql, /_sai_priority_broad_risk_signal/);
    assert.match(sql, /security breach\|data leak/);
    assert.match(sql, /chargeback\|billing/);
    assert.doesNotMatch(sql, /_sai_detect_high_risk/);
  });

  console.log("All support case prioritize route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
