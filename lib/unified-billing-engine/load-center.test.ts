import assert from "node:assert/strict";
import { loadUnifiedBillingCenter } from "./load-center";

type FakeResult = { data?: unknown; error?: { message: string } | null };

function fakeClient(result: FakeResult) {
  return {
    rpc: async () => result,
  } as never;
}

async function run() {
  const ok = await loadUnifiedBillingCenter(
    fakeClient({
      data: {
        found: true,
        profiles: [{ profile_key: "primary", profile_label: "Primary" }],
        subscriptions: [],
        invoices: [],
        licenses: [],
        recent_events: [],
        checkout_flow: ["payment"],
        stats: { profile_count: 1 },
      },
      error: null,
    })
  );
  assert.equal(ok.status, 200);
  assert.equal(ok.degraded, false);
  assert.equal(ok.center.found, true);
  assert.equal(ok.center.profiles?.length, 1);

  const degraded = await loadUnifiedBillingCenter(
    fakeClient({
      error: { message: "cannot execute INSERT in a read-only transaction" },
    })
  );
  assert.equal(degraded.status, 200);
  assert.equal(degraded.degraded, true);
  assert.equal(degraded.center.found, true);
  assert.equal(degraded.center.error, "billing_center_partial");
  assert.deepEqual(degraded.center.profiles, []);
  assert.deepEqual(degraded.center.subscriptions, []);

  const fatal = await loadUnifiedBillingCenter(
    fakeClient({
      error: { message: "Permission denied: billing.view" },
    })
  );
  assert.equal(fatal.status, 500);
  assert.equal(fatal.center.found, false);
  assert.equal(fatal.center.error, "billing_center_unavailable");

  console.log("load-center.test.ts: ok");
}

void run();
