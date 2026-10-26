import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  mapSupportCaseProposalApprovalRpcError,
  parseSupportProposalApprovalBody,
  processSupportCaseProposalApprovalRequest,
  processSupportCaseProposalRequest,
  SUPPORT_PROPOSAL_APPROVAL_BODY_REJECTED,
  SUPPORT_PROPOSAL_APPROVAL_CASE_NOT_OPEN,
  SUPPORT_PROPOSAL_APPROVAL_CONTRACT_MISSING,
  SUPPORT_PROPOSAL_APPROVAL_EXPECTED_HASH_INVALID,
  SUPPORT_PROPOSAL_APPROVAL_HASH_MISMATCH,
  SUPPORT_PROPOSAL_APPROVAL_NOT_APPROVABLE,
  SUPPORT_PROPOSAL_APPROVAL_PERMISSION_DENIED,
  SUPPORT_PROPOSAL_APPROVAL_REQUIRED,
  SUPPORT_PROPOSAL_APPROVAL_RPC,
  SUPPORT_PROPOSAL_KNOWLEDGE_STALE,
  SUPPORT_PROPOSAL_RPC,
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
const INPUT_HASH = "a".repeat(64);
const BODY_HASH = "b".repeat(64);
const OTHER_HASH = "c".repeat(64);

const approvalBody = {
  expected_proposal_input_hash: INPUT_HASH,
  expected_proposed_body_hash: BODY_HASH,
};

function approvedPayload(created: boolean) {
  return {
    approval_id: "11111111-1111-4111-8111-111111111111",
    proposal_id: "22222222-2222-4222-8222-222222222222",
    case_id: VALID_CASE_ID,
    approval_status: "approved",
    approved_at: "2026-10-20T00:00:00.000Z",
    approved_by_user_id: "33333333-3333-4333-8333-333333333333",
    proposal_input_hash: INPUT_HASH,
    proposed_body_hash: BODY_HASH,
    created,
  };
}

async function main() {
  await test("approval happy path calls only the approval RPC and returns no body text", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn, params) => {
        rpcCalls.push({ fn, params });
        return {
          data: { ...approvedPayload(true), proposed_body: "must not leave the handler" },
          error: null,
        };
      },
    };

    const result = await processSupportCaseProposalApprovalRequest(
      supabase,
      VALID_CASE_ID,
      approvalBody
    );
    assert.equal(result.status, 200);
    assert.equal(result.body.approval_status, "approved");
    assert.equal(result.body.created, true);
    assert.equal("proposed_body" in result.body, false);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PROPOSAL_APPROVAL_RPC);
    assert.notEqual(rpcCalls[0]?.fn, SUPPORT_PROPOSAL_RPC);
    assert.deepEqual(rpcCalls[0]?.params, {
      p_case_id: VALID_CASE_ID,
      p_expected_proposal_input_hash: INPUT_HASH,
      p_expected_proposed_body_hash: BODY_HASH,
    });
    assert.equal("p_organization_id" in (rpcCalls[0]?.params ?? {}), false);
  });

  await test("approval is idempotent when Core reports an existing matching approval", async () => {
    const rpcCalls: string[] = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn) => {
        rpcCalls.push(fn);
        return { data: approvedPayload(false), error: null };
      },
    };

    const result = await processSupportCaseProposalApprovalRequest(
      supabase,
      VALID_CASE_ID,
      approvalBody
    );
    assert.equal(result.status, 200);
    assert.equal(result.body.created, false);
    assert.equal(result.body.approval_status, "approved");
    assert.deepEqual(rpcCalls, [SUPPORT_PROPOSAL_APPROVAL_RPC]);
  });

  await test("approval fails closed without a session and does not call Core", async () => {
    let called = false;
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => {
        called = true;
        return { data: null, error: null };
      },
    };
    const result = await processSupportCaseProposalApprovalRequest(
      supabase,
      VALID_CASE_ID,
      approvalBody
    );
    assert.equal(result.status, 401);
    assert.equal(called, false);
  });

  await test("approval rejects a foreign organization id in the body", async () => {
    const result = await processSupportCaseProposalApprovalRequest(
      {
        auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
        rpc: async () => ({ data: null, error: null }),
      },
      VALID_CASE_ID,
      { ...approvalBody, organization_id: "44444444-4444-4444-8444-444444444444" }
    );
    assert.equal(result.status, 400);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_APPROVAL_BODY_REJECTED);
  });

  await test("approval rejects proposal text in the body", async () => {
    const parsed = parseSupportProposalApprovalBody({
      ...approvalBody,
      proposed_body: "customer reply text",
    });
    assert.equal(parsed.ok, false);
  });

  await test("approval rejects a hash mismatch from Core", async () => {
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: null,
        error: { message: `support_proposal_approval_hash_mismatch ${OTHER_HASH}` },
      }),
    };
    const result = await processSupportCaseProposalApprovalRequest(
      supabase,
      VALID_CASE_ID,
      approvalBody
    );
    assert.equal(result.status, 409);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_APPROVAL_HASH_MISMATCH);
  });

  await test("approval rejects a stale proposal from Core", async () => {
    const mapped = mapSupportCaseProposalApprovalRpcError(SUPPORT_PROPOSAL_KNOWLEDGE_STALE);
    assert.equal(mapped.status, 409);
    assert.equal(mapped.error, SUPPORT_PROPOSAL_KNOWLEDGE_STALE);
  });

  await test("approval rejects a closed case and a proposal that is not approvable", async () => {
    assert.equal(
      mapSupportCaseProposalApprovalRpcError(SUPPORT_PROPOSAL_APPROVAL_CASE_NOT_OPEN).status,
      409
    );
    assert.equal(
      mapSupportCaseProposalApprovalRpcError(SUPPORT_PROPOSAL_APPROVAL_NOT_APPROVABLE).status,
      409
    );
  });

  await test("approval requires support.reply", async () => {
    const mapped = mapSupportCaseProposalApprovalRpcError(
      SUPPORT_PROPOSAL_APPROVAL_PERMISSION_DENIED
    );
    assert.equal(mapped.status, 403);
    assert.equal(mapped.error, SUPPORT_PROPOSAL_APPROVAL_PERMISSION_DENIED);
  });

  await test("approval reports a missing Core contract without calling send", async () => {
    const rpcCalls: string[] = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn) => {
        rpcCalls.push(fn);
        return {
          data: null,
          error: {
            message:
              "Could not find the function public.approve_organization_support_case_response_proposal in the schema cache",
          },
        };
      },
    };
    const result = await processSupportCaseProposalApprovalRequest(
      supabase,
      VALID_CASE_ID,
      approvalBody
    );
    assert.equal(result.status, 501);
    assert.equal(result.body.error, SUPPORT_PROPOSAL_APPROVAL_CONTRACT_MISSING);
    assert.deepEqual(rpcCalls, [SUPPORT_PROPOSAL_APPROVAL_RPC]);
  });

  await test("approval maps a missing proposal and an invalid hash", async () => {
    assert.equal(
      mapSupportCaseProposalApprovalRpcError(SUPPORT_PROPOSAL_APPROVAL_REQUIRED).status,
      409
    );
    const parsed = parseSupportProposalApprovalBody({
      expected_proposal_input_hash: "abc",
      expected_proposed_body_hash: BODY_HASH,
    });
    assert.equal(parsed.ok, false);
    if (!parsed.ok) {
      assert.equal(parsed.error, SUPPORT_PROPOSAL_APPROVAL_EXPECTED_HASH_INVALID);
    }
  });

  await test("approval does not replace the propose route", async () => {
    const rpcCalls: string[] = [];
    const supabase: MockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async (fn) => {
        rpcCalls.push(fn);
        return { data: { case_id: VALID_CASE_ID, created: false, status: "proposed" }, error: null };
      },
    };
    const result = await processSupportCaseProposalRequest(supabase, VALID_CASE_ID);
    assert.equal(result.status, 200);
    assert.deepEqual(rpcCalls, [SUPPORT_PROPOSAL_RPC]);
  });

  await test("route and SQL candidate have no outbound side effects", async () => {
    const routeSource = fs.readFileSync(
      path.join(process.cwd(), "app/api/support/cases/[caseId]/proposal/approve/route.ts"),
      "utf8"
    );
    const sql = fs.readFileSync(
      path.join(
        process.cwd(),
        "docs/platform/NOT_APPLIED_canonical_support_response_proposal_approval_v1.sql"
      ),
      "utf8"
    );
    const migrationSlot = path.join(
      process.cwd(),
      "supabase/migrations/20261932000000_canonical_support_response_proposal_approval_p1_13cv.sql"
    );

    assert.match(routeSource, /processSupportCaseProposalApprovalRequest/);
    assert.doesNotMatch(routeSource, /send_support_reply/);
    assert.doesNotMatch(routeSource, /service_role/);
    assert.doesNotMatch(routeSource, /organization_id/);
    assert.equal(fs.existsSync(migrationSlot), false);

    assert.match(sql, /NOT APPLIED/);
    assert.match(sql, /approve_organization_support_case_response_proposal/);
    assert.match(sql, /_irp_require_permission\('support\.reply'\)/);
    assert.match(sql, /c\.organization_id = v_org_id/);
    assert.match(sql, /support_proposal_approval_case_not_open/);
    assert.match(sql, /on conflict \(organization_id, case_id, proposal_id, proposal_input_hash, proposed_body_hash\)/);
    assert.match(sql, /do nothing/);
    assert.match(sql, /support_case_response_proposal_approved/);
    assert.match(sql, /revoke all on function public\.approve_organization_support_case_response_proposal\(uuid, text, text\) from public, anon/);
    assert.match(sql, /grant execute on function public\.approve_organization_support_case_response_proposal\(uuid, text, text\) to authenticated/);
    assert.doesNotMatch(sql, /create or replace function public\.propose_organization_support_case_response/);
    assert.doesNotMatch(sql, /send_support_reply/);
    assert.doesNotMatch(sql, /support_ai_responses/);
    assert.doesNotMatch(sql, /organization_support_case_messages/);
    assert.doesNotMatch(sql, /delete from/i);
    assert.doesNotMatch(sql, /20261932000000/);

    const functionStart = sql.indexOf("create or replace function public.approve_organization");
    assert.ok(functionStart > -1);
    const functionBody = sql.slice(functionStart);
    assert.doesNotMatch(functionBody, /update public\.organization_support_cases/);
    assert.doesNotMatch(functionBody, /update public\.organization_support_case_response_proposals/);

    const auditStart = sql.indexOf("'support_case_response_proposal_approved'");
    const auditBlock = sql.slice(auditStart, auditStart + 700);
    assert.match(auditBlock, /proposal_input_hash/);
    assert.match(auditBlock, /proposed_body_hash/);
    assert.doesNotMatch(auditBlock, /proposed_body(?!_hash)/);
    assert.doesNotMatch(auditBlock, /'subject'/);
    assert.doesNotMatch(auditBlock, /'content'/);
  });

  console.log("All support proposal approval tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
