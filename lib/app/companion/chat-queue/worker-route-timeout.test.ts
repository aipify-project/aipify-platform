import assert from "node:assert/strict";
import {
  COMPANION_TURN_TIMEOUT_FOUNDATION_MS,
  COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS,
  resolveCompanionTurnTimeoutMs,
} from "./worker-route-timeout";

function testLightweightSmalltalkKeepsShortBudget() {
  assert.equal(
    resolveCompanionTurnTimeoutMs("lightweight", { query: "Hei!" }),
    COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS,
  );
  assert.equal(
    resolveCompanionTurnTimeoutMs("lightweight", { query: "Hva tenker du om kaffe?" }),
    COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS,
  );
}

function testLightweightCoreBootstrapUsesFoundationBudget() {
  assert.equal(
    resolveCompanionTurnTimeoutMs("lightweight", { query: "Hvem jobber du for?" }),
    COMPANION_TURN_TIMEOUT_FOUNDATION_MS,
  );
  assert.equal(
    resolveCompanionTurnTimeoutMs("lightweight", { query: "Hvilke løsninger har Aipify?" }),
    COMPANION_TURN_TIMEOUT_FOUNDATION_MS,
  );
}

function testRouteDefaultsUnchangedWithoutQuery() {
  assert.equal(resolveCompanionTurnTimeoutMs("lightweight"), COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS);
  assert.equal(resolveCompanionTurnTimeoutMs("foundation"), COMPANION_TURN_TIMEOUT_FOUNDATION_MS);
  assert.equal(resolveCompanionTurnTimeoutMs("exact_source"), 30_000);
  assert.equal(resolveCompanionTurnTimeoutMs("full"), 60_000);
}

testLightweightSmalltalkKeepsShortBudget();
testLightweightCoreBootstrapUsesFoundationBudget();
testRouteDefaultsUnchangedWithoutQuery();

console.log("worker-route-timeout.test.ts: all assertions passed");
