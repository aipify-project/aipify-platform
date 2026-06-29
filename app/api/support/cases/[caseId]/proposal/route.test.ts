import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isValidSupportCaseId,
  mapSupportCaseProposalRpcError,
  processSupportCaseProposalRequest,
  SUPPORT_PROPOSAL_KNOWLEDGE_REQUIRED,
  SUPPORT_PROPOSAL_KNOWLEDGE_STALE,
  SUPPORT_PROPOSAL_RPC,
  SUPPORT_PROPOSAL_UNDERSTANDING_REQUIRED,
  SUPPORT_PROPOSAL_UNDERSTANDING_STALE,
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
  await test("processSupportCaseProposalRequest calls propose RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            created: true,
            status: "proposed",
            proposed_body: "Submit refund request within 5 days.",
            language: "en",
            sources: [
              {
                source_id: "11111111-1111-4111-8111-111111111111",
                source_type: "faq",
                language: "en",
                version: 1,
                relevance_score: 0.75,
                relevance_reason: "category_match",
              },
            ],
            source_count: 1,
            engine_key: "canonical_support_response_proposal_rules",
            engine_version: "rules-v1",
            proposed_at: "2026-06-29T12:00:00.000Z",
          },
          error: null,
        };
      },
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.equal(result.body.created, true);
    assert.equal(result.body.status, "proposed");
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PROPOSAL_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: VALID_CASE_ID });
  });

  await test("processSupportCaseProposalRequest returns needs_human_review with 200", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: {
          case_id: VALID_CASE_ID,
          created: true,
          status: "needs_human_review",
          proposed_body: null,
          language: "en",
          sources: [],
          source_count: 0,
          engine_key: "canonical_support_response_proposal_rules",
          engine_version: "rules-v1",
          proposed_at: "2026-06-29T12:00:00.000Z",
        },
        error: null,
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.equal(result.body.status, "needs_human_review");
    assert.equal(result.body.proposed_body, null);
  });

  await test("processSupportCaseProposalRequest maps understanding required to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_proposal_understanding_required" },
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_UNDERSTANDING_REQUIRED);
  });

  await test("processSupportCaseProposalRequest maps stale understanding to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_proposal_understanding_stale" },
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_UNDERSTANDING_STALE);
  });

  await test("processSupportCaseProposalRequest maps knowledge required to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_proposal_knowledge_required" },
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_KNOWLEDGE_REQUIRED);
  });

  await test("processSupportCaseProposalRequest maps stale knowledge to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_proposal_knowledge_stale" },
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_KNOWLEDGE_STALE);
  });

  await test("processSupportCaseProposalRequest maps foreign case to 404", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "Case not found" },
      }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 404);
  });

  await test("processSupportCaseProposalRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 401);
  });

  await test("processSupportCaseProposalRequest rejects invalid UUID with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseProposalRequest(supabase, "bad-id");
    assert.equal(result.status, 400);
  });

  await test("mapSupportCaseProposalRpcError maps permission errors to 403", async () => {
    const mapped = mapSupportCaseProposalRpcError("permission denied for support.view");
    assert.equal(mapped.status, 403);
  });

  await test("route uses RPC-only proposal path without service role or outbound side effects", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/support/cases/[caseId]/proposal/route.ts"
    );
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCaseProposalRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /organization_id/);
    assert.doesNotMatch(routeSource, /request\.json\(/);
    assert.doesNotMatch(routeSource, /suggest_support_ai_response/);
    assert.doesNotMatch(routeSource, /send_support_reply/);
    assert.doesNotMatch(routeSource, /organization_support_case_messages/);
  });

  await test("migration SQL contract includes durable proposal-only storage", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931900000_canonical_support_response_proposal_p1_13cq.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /create table if not exists public\.organization_support_case_response_proposals/);
    assert.match(sql, /proposal_input_hash text not null/);
    assert.match(sql, /needs_human_review/);
    assert.match(sql, /proposed_body text/);
    assert.match(sql, /revoke all on public\.organization_support_case_response_proposals from public, authenticated, anon/);
    assert.match(sql, /propose_organization_support_case_response\(p_case_id uuid\)/);
    assert.match(sql, /support_proposal_understanding_required/);
    assert.match(sql, /support_proposal_knowledge_stale/);
    assert.match(sql, /canonical_support_response_proposal_rules/);
    assert.match(sql, /rules-v1/);
    assert.match(sql, /pg_advisory_xact_lock\(public\._sai_proposal_lock_key/);
    assert.match(sql, /support_case_response_proposed/);
    assert.match(sql, /f\.answer/);
    assert.match(sql, /a\.content/);
    assert.doesNotMatch(sql, /suggest_support_ai_response/);
    assert.doesNotMatch(sql, /send_support_reply/);
    assert.doesNotMatch(sql, /insert into public\.organization_support_case_messages/);
    assert.doesNotMatch(sql, /support_ai_responses/);

    const auditStart = sql.indexOf("'support_case_response_proposed'");
    assert.ok(auditStart > -1, "proposal audit action exists");
    const auditBlock = sql.slice(auditStart, auditStart + 600);
    assert.doesNotMatch(auditBlock, /proposed_body/);
    assert.doesNotMatch(auditBlock, /'answer'/);
    assert.doesNotMatch(auditBlock, /'content'/);
    assert.doesNotMatch(auditBlock, /'subject'/);
    assert.doesNotMatch(auditBlock, /'summary'/);
    assert.doesNotMatch(auditBlock, /hash/);
  });

  await test("isValidSupportCaseId accepts valid UUID", async () => {
    assert.equal(isValidSupportCaseId(VALID_CASE_ID), true);
  });

  console.log("All support case proposal route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
