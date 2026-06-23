import assert from "node:assert/strict";
import {
  COMPANION_QUEUE_DISPATCH_STALL_MS,
  COMPANION_QUEUE_LEASE_SECONDS,
  isCompanionWorkerConfigured,
} from "./worker-config";

function testDispatchStallThreshold() {
  assert.equal(COMPANION_QUEUE_DISPATCH_STALL_MS, 90_000);
  assert.ok(COMPANION_QUEUE_DISPATCH_STALL_MS < COMPANION_QUEUE_LEASE_SECONDS * 1000);
}

function testWorkerConfiguredRequiresServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    assert.equal(isCompanionWorkerConfigured(), false);
  } finally {
    if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    if (key) process.env.SUPABASE_SERVICE_ROLE_KEY = key;
  }
}

testDispatchStallThreshold();
testWorkerConfiguredRequiresServiceRole();

console.log("dispatch-worker.test.ts: all assertions passed");
