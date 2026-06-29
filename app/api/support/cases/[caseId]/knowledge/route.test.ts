import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isValidSupportCaseId,
  mapSupportCaseKnowledgeRpcError,
  processSupportCaseKnowledgeRequest,
  SUPPORT_KNOWLEDGE_RETRIEVE_RPC,
  SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED,
  SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE,
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
  await test("processSupportCaseKnowledgeRequest calls retrieve RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: VALID_CASE_ID,
            created: true,
            status: "complete",
            sources: [
              {
                source_id: "11111111-1111-4111-8111-111111111111",
                source_type: "article",
                title: "Refund policy",
                slug: "refund-policy",
                language: "en",
                version: 2,
                relevance_score: 0.75,
                relevance_reason_code: "category_match",
                updated_at: "2026-06-29T12:00:00.000Z",
              },
            ],
            source_count: 1,
            engine_key: "canonical_support_knowledge_rules",
            engine_version: "rules-v1",
            retrieved_at: "2026-06-29T12:00:00.000Z",
          },
          error: null,
        };
      },
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.equal(result.body.created, true);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_KNOWLEDGE_RETRIEVE_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: VALID_CASE_ID });
  });

  await test("processSupportCaseKnowledgeRequest maps understanding required to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_knowledge_understanding_required" },
      }),
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED);
  });

  await test("processSupportCaseKnowledgeRequest maps stale understanding to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "support_knowledge_understanding_stale" },
      }),
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE);
  });

  await test("processSupportCaseKnowledgeRequest maps foreign case to 404", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "Case not found" },
      }),
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 404);
    assert.equal(result.body.error, "Case not found");
  });

  await test("processSupportCaseKnowledgeRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 401);
  });

  await test("processSupportCaseKnowledgeRequest rejects invalid UUID with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };

    const result = await processSupportCaseKnowledgeRequest(supabase, "bad-id");
    assert.equal(result.status, 400);
  });

  await test("mapSupportCaseKnowledgeRpcError maps permission errors to 403", async () => {
    const mapped = mapSupportCaseKnowledgeRpcError("permission denied for support.view");
    assert.equal(mapped.status, 403);
  });

  await test("isValidSupportCaseId accepts valid UUID", async () => {
    assert.equal(isValidSupportCaseId(VALID_CASE_ID), true);
  });

  await test("route uses RPC-only knowledge path without service role or direct table writes", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/support/cases/[caseId]/knowledge/route.ts"
    );
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCaseKnowledgeRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /organization_id/);
    assert.doesNotMatch(routeSource, /request\.json\(/);
  });

  await test("migration SQL contract includes durable metadata-only knowledge context", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931800000_canonical_support_knowledge_p1_13cl.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /create table if not exists public\.organization_support_case_knowledge_contexts/);
    assert.match(sql, /understanding_message_set_hash text not null/);
    assert.match(sql, /knowledge_catalog_hash text not null/);
    assert.match(sql, /engine_key text not null/);
    assert.match(sql, /engine_version text not null/);
    assert.match(sql, /constraint organization_support_case_knowledge_contexts_sources_array check/);
    assert.match(sql, /needs_human_knowledge_review/);
    assert.match(sql, /revoke all on public\.organization_support_case_knowledge_contexts from public, authenticated, anon/);
    assert.match(sql, /retrieve_organization_support_case_knowledge\(p_case_id uuid\)/);
    assert.match(sql, /support_knowledge_understanding_required/);
    assert.match(sql, /support_knowledge_understanding_stale/);
    assert.match(sql, /canonical_support_knowledge_rules/);
    assert.match(sql, /rules-v1/);
    assert.match(sql, /_sai_knowledge_catalog_hash/);
    assert.match(sql, /pg_advisory_xact_lock\(public\._sai_knowledge_retrieve_lock_key/);
    assert.match(sql, /support_case_knowledge_retrieved/);
    assert.match(sql, /visibility in \('customer', 'public'\)/);
    assert.match(sql, /a\.status = 'published'/);
    assert.match(sql, /f\.status = 'published'/);
    assert.match(sql, /0\.20/);
    assert.match(sql, /category_match/);
    assert.match(sql, /language_fallback/);
    assert.match(sql, /organizations o/);
    assert.match(sql, /default_language/);
    assert.doesNotMatch(sql, /support_knowledge_items/);
    assert.doesNotMatch(sql, /employee_knowledge_items/);
    assert.doesNotMatch(sql, /suggest_support_ai_response/);
    assert.doesNotMatch(sql, /retrieve_knowledge_for_ai/);
    assert.doesNotMatch(sql, /search_organization_knowledge/);
    assert.doesNotMatch(sql, /insert into public\.support_cases/);
    assert.doesNotMatch(sql, /refund.*support/);
    assert.doesNotMatch(sql, /payment.*faq/);

    const auditStart = sql.indexOf("'support_case_knowledge_retrieved'");
    assert.ok(auditStart > -1, "knowledge audit action exists");
    const auditBlock = sql.slice(auditStart, auditStart + 700);
    assert.doesNotMatch(auditBlock, /'summary'/);
    assert.doesNotMatch(auditBlock, /'intent'/);
    assert.doesNotMatch(auditBlock, /'subject'/);
    assert.doesNotMatch(auditBlock, /'body'/);
    assert.doesNotMatch(auditBlock, /message_set_hash/);
    assert.doesNotMatch(auditBlock, /catalog_hash/);
    assert.doesNotMatch(auditBlock, /'answer'/);
  });

  await test("migration ranking uses exact category slug match only", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931800000_canonical_support_knowledge_p1_13cl.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /c\.slug = v_category/);
    assert.doesNotMatch(sql, /when 'refund' then 'support'/);
    assert.doesNotMatch(sql, /case v_category[\s\S]*when 'refund'/);
  });

  await test("migration stores metadata-only source contract without content fields", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931800000_canonical_support_knowledge_p1_13cl.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /'source_id', source_id/);
    assert.match(sql, /'source_type', source_type/);
    assert.match(sql, /'relevance_score', relevance_score/);
    assert.match(sql, /'relevance_reason_code', relevance_reason_code/);
    assert.doesNotMatch(sql, /jsonb_build_object\([\s\S]*'content'/);
    assert.doesNotMatch(sql, /jsonb_build_object\([\s\S]*'answer',/);
  });

  await test("migration catalog refresh preserves retrieved_at when only hash changes", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261931800000_canonical_support_knowledge_p1_13cl.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /knowledge_catalog_hash is distinct from v_catalog_hash/);
    assert.match(sql, /public\._sai_knowledge_sources_equal/);
    assert.match(sql, /'created', false/);
    assert.match(sql, /retrieved_at', v_existing\.retrieved_at/);
  });

  console.log("All support case knowledge route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
