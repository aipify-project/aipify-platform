import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isValidSupportCaseId,
  mapSupportCaseProposalApprovalRpcError,
  processSupportCaseProposalApprovalRequest,
  SUPPORT_PROPOSAL_APPROVAL_EXPECTED_HASH_INVALID,
  SUPPORT_PROPOSAL_APPROVAL_HASH_MISMATCH,
  SUPPORT_PROPOSAL_APPROVAL_NOT_APPROVABLE,
  SUPPORT_PROPOSAL_APPROVAL_RPC,
  SUPPORT_PROPOSAL_KNOWLEDGE_STALE,
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
const VALID_PROPOSAL_HASH =
  "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456";

async function main() {
  await test("processSupportCaseProposalApprovalRequest calls approval RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            proposal_id: "11111111-1111-4111-8111-111111111111",
            case_id: VALID_CASE_ID,
            approval_status: "approved",
            approved_at: "2026-06-29T12:00:00.000Z",
            created: true,
          },
          error: null,
        };
      },
    };

    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.created, true);
    assert.equal(result.body.approvalStatus, "approved");
    assert.equal(result.body.proposalId, "11111111-1111-4111-8111-111111111111");
    assert.equal(result.body.proposedBody, undefined);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PROPOSAL_APPROVAL_RPC);
    assert.deepEqual(rpcCalls[0]?.params, {
      p_case_id: VALID_CASE_ID,
      p_expected_proposal_input_hash: VALID_PROPOSAL_HASH,
    });
  });

  await test("processSupportCaseProposalApprovalRequest idempotent created=false", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: {
          proposal_id: "11111111-1111-4111-8111-111111111111",
          case_id: VALID_CASE_ID,
          approval_status: "approved",
          approved_at: "2026-06-29T12:00:00.000Z",
          created: false,
        },
        error: null,
      }),
    };

    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.created, false);
  });

  await test("processSupportCaseProposalApprovalRequest returns 401 when unauthenticated", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 401);
  });

  await test("processSupportCaseProposalApprovalRequest rejects invalid UUID with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, "bad-id", {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 400);
  });

  await test("processSupportCaseProposalApprovalRequest rejects missing body hash with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {});
    assert.equal(result.status, 400);
  });

  await test("processSupportCaseProposalApprovalRequest rejects invalid hash with 400", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: "short",
    });
    assert.equal(result.status, 400);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_APPROVAL_EXPECTED_HASH_INVALID);
  });

  await test("processSupportCaseProposalApprovalRequest maps permission errors to 403", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "permission denied for support.reply" },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 403);
  });

  await test("processSupportCaseProposalApprovalRequest maps foreign case to 404", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: "Case not found" },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 404);
  });

  await test("processSupportCaseProposalApprovalRequest maps hash mismatch to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: SUPPORT_PROPOSAL_APPROVAL_HASH_MISMATCH },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_APPROVAL_HASH_MISMATCH);
  });

  await test("processSupportCaseProposalApprovalRequest maps not approvable to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: SUPPORT_PROPOSAL_APPROVAL_NOT_APPROVABLE },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 409);
  });

  await test("processSupportCaseProposalApprovalRequest maps stale understanding to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: SUPPORT_PROPOSAL_UNDERSTANDING_STALE },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 409);
  });

  await test("processSupportCaseProposalApprovalRequest maps stale knowledge to 409", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: SUPPORT_PROPOSAL_KNOWLEDGE_STALE },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(supabase, VALID_CASE_ID, {
      expectedProposalInputHash: VALID_PROPOSAL_HASH,
    });
    assert.equal(result.status, 409);
  });

  await test("mapSupportCaseProposalApprovalRpcError maps permission to 403", async () => {
    const mapped = mapSupportCaseProposalApprovalRpcError("permission denied for support.reply");
    assert.equal(mapped.status, 403);
  });

  await test("route uses RPC-only approval path without outbound side effects", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/support/cases/[caseId]/proposal/approve/route.ts"
    );
    const routeSource = fs.readFileSync(routePath, "utf8");
    assert.match(routeSource, /processSupportCaseProposalApprovalRequest/);
    assert.doesNotMatch(routeSource, /\.from\(/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /approve_support_ai_response/);
    assert.doesNotMatch(routeSource, /send_support_reply/);
    assert.doesNotMatch(routeSource, /organization_support_case_messages/);
    assert.doesNotMatch(routeSource, /companion_action_requests/);
  });

  await test("migration SQL contract includes approval columns and audit without body", async () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20261932000000_canonical_support_response_proposal_approval_p1_13cv.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    assert.match(sql, /approval_status text not null default 'pending'/);
    assert.match(sql, /approved_by_user_id uuid references public\.users/);
    assert.match(sql, /approved_proposal_input_hash text/);
    assert.match(
      sql,
      /approve_organization_support_case_response_proposal[\s\S]*p_expected_proposal_input_hash text/
    );
    assert.match(sql, /perform public\._irp_require_permission\('support\.reply'\)/);
    assert.match(sql, /support_case_response_proposal_approved/);
    assert.doesNotMatch(sql, /send_support_reply/);
    assert.doesNotMatch(sql, /approve_support_ai_response/);
    assert.doesNotMatch(sql, /companion_action_requests/);
    assert.doesNotMatch(sql, /insert into public\.organization_support_case_messages/);

    const auditStart = sql.indexOf("'support_case_response_proposal_approved'");
    assert.ok(auditStart > -1, "approval audit action exists");
    const auditBlock = sql.slice(auditStart, auditStart + 700);
    assert.doesNotMatch(auditBlock, /proposed_body/);
    assert.doesNotMatch(auditBlock, /proposal_input_hash/);
    assert.doesNotMatch(auditBlock, /approved_proposal_input_hash/);
    assert.doesNotMatch(auditBlock, /'answer'/);
    assert.doesNotMatch(auditBlock, /'content'/);
  });

  await test("isValidSupportCaseId accepts valid UUID", async () => {
    assert.equal(isValidSupportCaseId(VALID_CASE_ID), true);
  });

  console.log("All support case proposal approval route tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
