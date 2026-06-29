import assert from "node:assert/strict";
import {
  buildSupportCaseCreateRpcParams,
  createSupportCase,
  SUPPORT_CASE_CREATE_RPC,
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

  console.log("All support-ai tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
