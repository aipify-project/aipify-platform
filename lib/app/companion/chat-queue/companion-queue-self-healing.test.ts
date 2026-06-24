import assert from "node:assert/strict";
import { classifyCompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import { buildLightweightConversationalAnswer } from "@/lib/companion-runtime/lightweight-conversational-answer";
import { resolveCompanionQueueRetry } from "./worker-config";
import { resolveCompanionTurnTimeoutMs } from "./worker-route-timeout";
import { resolveCompanionQueueDisplayError } from "./queue-user-messages";

function testLightweightRouteClassification() {
  assert.equal(classifyCompanionTurnRoute("Kan du le?", "no"), "lightweight");
  assert.equal(classifyCompanionTurnRoute("Hei!", "no"), "lightweight");
  assert.equal(classifyCompanionTurnRoute("hva sier Aipify", "no"), "lightweight");
  assert.equal(classifyCompanionTurnRoute("fortell meg om dagen din", "no"), "lightweight");
  assert.equal(classifyCompanionTurnRoute("Hva er Self Love?", "no"), "foundation");
  assert.equal(classifyCompanionTurnRoute("Vis aktive medlemmer", "no"), "exact_source");
}

function testRouteTimeouts() {
  assert.equal(resolveCompanionTurnTimeoutMs("lightweight"), 8_000);
  assert.equal(resolveCompanionTurnTimeoutMs("foundation"), 15_000);
  assert.equal(resolveCompanionTurnTimeoutMs("exact_source"), 30_000);
  assert.equal(resolveCompanionTurnTimeoutMs("full"), 60_000);
}

function testTurnTimeoutIsPermanent() {
  const decision = resolveCompanionQueueRetry("turn_timeout");
  assert.equal(decision.retryable, false);
  assert.equal(decision.permanent, true);
}

function testMaxAttemptsNeverRetry() {
  const decision = resolveCompanionQueueRetry("worker_heartbeat_stale_max_attempts");
  assert.equal(decision.retryable, false);
  assert.equal(decision.permanent, true);
}

function testLocalizedTimeoutCopy() {
  const display = resolveCompanionQueueDisplayError(
    { error_code: "turn_timeout", error_message: "Companion turn exceeded the production time budget." },
    {
      turnTimeoutPrimary: "Aipify klarte ikke å fullføre svaret denne gangen.",
      turnTimeoutSecondary: "Oppgaven er stoppet, slik at den ikke blir stående fast. Du kan prøve igjen.",
      generic: "Noe gikk galt",
    },
  );
  assert.equal(
    display.primary,
    "Aipify klarte ikke å fullføre svaret denne gangen.",
  );
  assert.match(display.secondary ?? "", /prøve igjen/i);
}

function testMaxAttemptsEnglishDiagnosticIsHidden() {
  const display = resolveCompanionQueueDisplayError(
    {
      error_code: "worker_heartbeat_stale_max_attempts",
      error_message: "Worker stopped responding — maximum attempts reached",
    },
    {
      turnTimeoutPrimary: "Aipify klarte ikke å fullføre svaret denne gangen.",
      turnTimeoutSecondary: "Oppgaven er stoppet og kan prøves på nytt eller fjernes.",
      generic: "Noe gikk galt",
    },
  );
  assert.equal(display.primary, "Aipify klarte ikke å fullføre svaret denne gangen.");
  assert.notEqual(display.primary, "Worker stopped responding — maximum attempts reached");
}

function testUnknownSmalltalkUsesLightweightRoute() {
  assert.equal(classifyCompanionTurnRoute("Hva tenker du om kaffe?", "no"), "lightweight");
}

function testLightweightSmalltalkAnswerUnder3s() {
  const started = Date.now();
  const t = (key: string) =>
    key.endsWith(".general")
      ? "Jeg er her med deg. Spør med dine egne ord — jeg svarer så tydelig jeg kan."
      : key;
  const answer = buildLightweightConversationalAnswer({
    query: "Hva tenker du om kaffe?",
    t,
    identity: null,
  });
  const elapsed = Date.now() - started;
  assert.ok(answer.directAnswer.length > 10);
  assert.ok(elapsed < 3000, `lightweight answer path too slow: ${elapsed}ms`);
  console.log(`lightweight smalltalk answer ready in ${elapsed}ms`);
}

testLightweightRouteClassification();
testRouteTimeouts();
testTurnTimeoutIsPermanent();
testMaxAttemptsNeverRetry();
testLocalizedTimeoutCopy();
testMaxAttemptsEnglishDiagnosticIsHidden();
testUnknownSmalltalkUsesLightweightRoute();
testLightweightSmalltalkAnswerUnder3s();

console.log("companion-queue-self-healing.test.ts: all assertions passed");
