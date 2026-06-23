import assert from "node:assert/strict";
import {
  COMPANION_QUEUE_LEASE_SECONDS,
  COMPANION_QUEUE_MAX_ATTEMPTS,
  COMPANION_QUEUE_WORKER_BATCH_SIZE,
  COMPANION_QUEUE_WORKER_MAX_ROUNDS,
  resolveCompanionQueueRetry,
  shouldNotifyCompanionReply,
} from "./worker-config";

function testWorkerConfigDefaults() {
  assert.equal(COMPANION_QUEUE_LEASE_SECONDS, 300);
  assert.equal(COMPANION_QUEUE_MAX_ATTEMPTS, 3);
  assert.equal(COMPANION_QUEUE_WORKER_BATCH_SIZE, 5);
  assert.equal(COMPANION_QUEUE_WORKER_MAX_ROUNDS, 12);
}

function testPermanentRetryCodes() {
  for (const code of ["empty_query", "unauthorized", "no_profile", "tenant_mismatch", "turn_failed"]) {
    const decision = resolveCompanionQueueRetry(code);
    assert.equal(decision.retryable, false, `${code} should not retry`);
    assert.equal(decision.permanent, true);
  }
}

function testTransientRetryCodes() {
  for (const code of ["complete_failed", "unexpected_error", "lease_expired"]) {
    const decision = resolveCompanionQueueRetry(code);
    assert.equal(decision.retryable, true, `${code} should retry`);
    assert.equal(decision.permanent, false);
  }
}

function testNotifyWhenCompanionClosed() {
  assert.equal(shouldNotifyCompanionReply(false), true);
  assert.equal(shouldNotifyCompanionReply(true), false);
}

testWorkerConfigDefaults();
testPermanentRetryCodes();
testTransientRetryCodes();
testNotifyWhenCompanionClosed();

console.log("worker-config.test.ts: all assertions passed");
