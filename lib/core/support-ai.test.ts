import assert from "node:assert/strict";
import {
  buildSupportCaseCreateRpcParams,
  createSupportCase,
  parseSupportCaseCreateBody,
  parseSupportPrioritizeBody,
  SUPPORT_CASE_CREATE_RPC,
  SUPPORT_PRIORITIZE_ASSESS_RPC,
  SUPPORT_PRIORITIZE_CLEAR_RPC,
  SUPPORT_PRIORITIZE_MANUAL_RPC,
  SUPPORT_UNDERSTAND_RPC,
  SUPPORT_KNOWLEDGE_RETRIEVE_RPC,
  SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED,
  SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE,
  assessSupportCasePriority,
  clearSupportCasePriorityOverride,
  setSupportCasePriorityManual,
  understandSupportCase,
  retrieveSupportCaseKnowledge,
  mapSupportCaseKnowledgeRpcError,
  processSupportCaseKnowledgeRequest,
} from "./support-ai";

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

async function main() {
  await test("legacy params send null initial_message and idempotency_key", async () => {
    const calls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase = {
      rpc: async (fn: string, params?: Record<string, unknown>) => {
        calls.push({ fn, params });
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

    const result = await createSupportCase(supabase, { subject: "Password reset" });

    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.fn, SUPPORT_CASE_CREATE_RPC);
    assert.deepEqual(calls[0]?.params, {
      p_subject: "Password reset",
      p_customer_identifier: null,
      p_channel: "admin_inbox",
      p_priority: "medium",
      p_initial_message: null,
      p_idempotency_key: null,
      p_priority_explicit: false,
    });
    assert.equal(result.created, true);
    assert.equal(result.message_id, null);
  });

  await test("message and idempotency_key are passed to RPC", async () => {
    const calls: Array<Record<string, unknown> | undefined> = [];
    const supabase = {
      rpc: async (_fn: string, params?: Record<string, unknown>) => {
        calls.push(params);
        return {
          data: {
            id: "case-2",
            case_number: "SUP-00002",
            status: "new",
            created: true,
            message_id: "msg-2",
          },
          error: null,
        };
      },
    };

    const result = await createSupportCase(supabase, {
      subject: "Billing question",
      customer_identifier: "billing@example.com",
      channel: "email_support",
      priority: "high",
      initial_message: "I was charged twice.",
      idempotency_key: "intake-key-1",
    });

    assert.deepEqual(
      calls[0],
      buildSupportCaseCreateRpcParams({
        subject: "Billing question",
        customer_identifier: "billing@example.com",
        channel: "email_support",
        priority: "high",
        initial_message: "I was charged twice.",
        idempotency_key: "intake-key-1",
      })
    );
    assert.equal(result.created, true);
    assert.equal(result.message_id, "msg-2");
  });

  await test("idempotent retry preserves created=false and message_id", async () => {
    const supabase = {
      rpc: async () => ({
        data: {
          id: "case-2",
          case_number: "SUP-00002",
          status: "new",
          created: false,
          message_id: "msg-2",
        },
        error: null,
      }),
    };

    const result = await createSupportCase(supabase, {
      subject: "Billing question",
      initial_message: "I was charged twice.",
      idempotency_key: "intake-key-1",
    });

    assert.equal(result.created, false);
    assert.equal(result.id, "case-2");
    assert.equal(result.message_id, "msg-2");
  });

  await test("RPC errors propagate unchanged", async () => {
    const supabase = {
      rpc: async () => ({
        data: null,
        error: { message: "support_intake_idempotency_conflict" },
      }),
    };

    await assert.rejects(
      () =>
        createSupportCase(supabase, {
          subject: "Billing question",
          initial_message: "Different body",
          idempotency_key: "intake-key-1",
        }),
      /support_intake_idempotency_conflict/
    );
  });

  await test("understandSupportCase calls understand RPC with p_case_id", async () => {
    const calls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase = {
      rpc: async (fn: string, params?: Record<string, unknown>) => {
        calls.push({ fn, params });
        return {
          data: {
            case_id: "case-1",
            created: true,
            summary: "Billing: I was charged twice.",
            intent: "Customer inquiry about payment or billing",
            category: "payment",
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

    const result = await understandSupportCase(supabase, "case-1");

    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.fn, SUPPORT_UNDERSTAND_RPC);
    assert.deepEqual(calls[0]?.params, { p_case_id: "case-1" });
    assert.equal(result.created, true);
    assert.equal(result.engine_key, "canonical_support_rules");
  });

  await test("understandSupportCase preserves cached created=false result", async () => {
    const supabase = {
      rpc: async () => ({
        data: {
          case_id: "case-1",
          created: false,
          summary: "Billing: I was charged twice.",
          intent: "Customer inquiry about payment or billing",
          category: "payment",
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

    const result = await understandSupportCase(supabase, "case-1");
    assert.equal(result.created, false);
    assert.equal(result.category, "payment");
  });

  await test("understandSupportCase preserves low-confidence result explicitly", async () => {
    const supabase = {
      rpc: async () => ({
        data: {
          case_id: "case-2",
          created: true,
          summary: "General question: Need help with something.",
          intent: "General customer support inquiry",
          category: "general",
          language: "unknown",
          confidence: 0.35,
          status: "low_confidence",
          message_count: 1,
          engine_key: "canonical_support_rules",
          engine_version: "rules-v1",
          analyzed_at: "2026-06-26T12:00:00.000Z",
        },
        error: null,
      }),
    };

    const result = await understandSupportCase(supabase, "case-2");
    assert.equal(result.status, "low_confidence");
    assert.equal(result.confidence, 0.35);
    assert.equal(result.category, "general");
  });

  await test("understandSupportCase propagates RPC errors", async () => {
    const supabase = {
      rpc: async () => ({
        data: null,
        error: { message: "support_understanding_no_inbound" },
      }),
    };

    await assert.rejects(
      () => understandSupportCase(supabase, "case-3"),
      /support_understanding_no_inbound/
    );
  });

  await test("parseSupportCaseCreateBody marks explicit medium as priority_explicit", async () => {
    const parsed = parseSupportCaseCreateBody({ subject: "Help", priority: "medium" });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.rpcParams.p_priority, "medium");
    assert.equal(parsed.rpcParams.p_priority_explicit, true);
  });

  await test("parseSupportCaseCreateBody omits priority as default provenance", async () => {
    const parsed = parseSupportCaseCreateBody({ subject: "Help" });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.rpcParams.p_priority_explicit, false);
  });

  await test("parseSupportPrioritizeBody defaults empty body to assess", async () => {
    const parsed = parseSupportPrioritizeBody(undefined);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.action, "assess");
  });

  await test("parseSupportPrioritizeBody accepts set_manual with priority", async () => {
    const parsed = parseSupportPrioritizeBody({ action: "set_manual", priority: "low" });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.action, "set_manual");
    assert.equal(parsed.priority, "low");
  });

  await test("assessSupportCasePriority calls assess RPC only", async () => {
    const rpcNames: string[] = [];
    const supabase = {
      rpc: async (fn: string) => {
        rpcNames.push(fn);
        return {
          data: {
            case_id: "case-1",
            priority: "high",
            priority_source: "automatic",
            reason_code: "category_refund",
            confidence: 0.75,
            created: true,
            protected: false,
          },
          error: null,
        };
      },
    };

    const result = await assessSupportCasePriority(supabase, "case-1");
    assert.deepEqual(rpcNames, [SUPPORT_PRIORITIZE_ASSESS_RPC]);
    assert.equal(result.created, true);
    assert.equal(result.priority_source, "automatic");
  });

  await test("setSupportCasePriorityManual calls manual RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase = {
      rpc: async (fn: string, params?: Record<string, unknown>) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: "case-1",
            priority: "low",
            priority_source: "manual",
            created: true,
          },
          error: null,
        };
      },
    };

    await setSupportCasePriorityManual(supabase, "case-1", "low");
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PRIORITIZE_MANUAL_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: "case-1", p_priority: "low" });
  });

  await test("clearSupportCasePriorityOverride calls clear RPC", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase = {
      rpc: async (fn: string, params?: Record<string, unknown>) => {
        rpcCalls.push({ fn, params });
        return {
          data: { case_id: "case-1", priority_source: "default", created: true },
          error: null,
        };
      },
    };

    await clearSupportCasePriorityOverride(supabase, "case-1");
    assert.equal(rpcCalls[0]?.fn, SUPPORT_PRIORITIZE_CLEAR_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: "case-1" });
  });

  await test("assessSupportCasePriority does not call ASO triage RPC", async () => {
    const rpcNames: string[] = [];
    const supabase = {
      rpc: async (fn: string) => {
        rpcNames.push(fn);
        return { data: { created: true, protected: false }, error: null };
      },
    };

    await assessSupportCasePriority(supabase, "case-5");
    assert.deepEqual(rpcNames, [SUPPORT_PRIORITIZE_ASSESS_RPC]);
  });

  await test("understandSupportCase does not call ASO triage RPC", async () => {
    const rpcNames: string[] = [];
    const supabase = {
      rpc: async (fn: string) => {
        rpcNames.push(fn);
        return { data: { created: true }, error: null };
      },
    };

    await understandSupportCase(supabase, "case-4");
    assert.deepEqual(rpcNames, [SUPPORT_UNDERSTAND_RPC]);
  });

  await test("retrieveSupportCaseKnowledge calls retrieve RPC only", async () => {
    const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
    const supabase = {
      rpc: async (fn: string, params?: Record<string, unknown>) => {
        rpcCalls.push({ fn, params });
        return {
          data: {
            case_id: "case-6",
            created: true,
            status: "complete",
            sources: [],
            source_count: 0,
          },
          error: null,
        };
      },
    };

    await retrieveSupportCaseKnowledge(supabase, "case-6");
    assert.equal(rpcCalls[0]?.fn, SUPPORT_KNOWLEDGE_RETRIEVE_RPC);
    assert.deepEqual(rpcCalls[0]?.params, { p_case_id: "case-6" });
  });

  await test("mapSupportCaseKnowledgeRpcError maps understanding required to 409", async () => {
    const mapped = mapSupportCaseKnowledgeRpcError(SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED);
    assert.equal(mapped.status, 409);
    assert.equal(mapped.error, SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED);
  });

  await test("mapSupportCaseKnowledgeRpcError maps stale understanding to 409", async () => {
    const mapped = mapSupportCaseKnowledgeRpcError(SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE);
    assert.equal(mapped.status, 409);
    assert.equal(mapped.error, SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE);
  });

  await test("mapSupportCaseKnowledgeRpcError maps foreign case to 404", async () => {
    const mapped = mapSupportCaseKnowledgeRpcError("Case not found");
    assert.equal(mapped.status, 404);
  });

  await test("mapSupportCaseKnowledgeRpcError maps permission errors to 403", async () => {
    const mapped = mapSupportCaseKnowledgeRpcError("permission denied for support.view");
    assert.equal(mapped.status, 403);
  });

  await test("processSupportCaseKnowledgeRequest returns 401 when unauthenticated", async () => {
    const supabase = {
      auth: { getUser: async () => ({ data: { user: null } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseKnowledgeRequest(supabase, "b1b2c3d4-e5f6-4789-a012-3456789abcde");
    assert.equal(result.status, 401);
  });

  await test("processSupportCaseKnowledgeRequest rejects invalid UUID with 400", async () => {
    const supabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({ data: null, error: null }),
    };
    const result = await processSupportCaseKnowledgeRequest(supabase, "bad-id");
    assert.equal(result.status, 400);
  });

  await test("processSupportCaseKnowledgeRequest returns RPC result on success", async () => {
    const supabase = {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      rpc: async () => ({
        data: {
          case_id: "b1b2c3d4-e5f6-4789-a012-3456789abcde",
          created: false,
          status: "complete",
          source_count: 1,
        },
        error: null,
      }),
    };
    const result = await processSupportCaseKnowledgeRequest(
      supabase,
      "b1b2c3d4-e5f6-4789-a012-3456789abcde"
    );
    assert.equal(result.status, 200);
    assert.equal(result.body.created, false);
  });

  await test("retrieveSupportCaseKnowledge does not call suggest or ASO RPC", async () => {
    const rpcNames: string[] = [];
    const supabase = {
      rpc: async (fn: string) => {
        rpcNames.push(fn);
        return { data: { created: true }, error: null };
      },
    };
    await retrieveSupportCaseKnowledge(supabase, "case-7");
    assert.deepEqual(rpcNames, [SUPPORT_KNOWLEDGE_RETRIEVE_RPC]);
  });

  console.log("All support-ai tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
