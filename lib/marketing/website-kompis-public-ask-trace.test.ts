import assert from "node:assert/strict";
import {
  assertWebsiteKompisPublicAskTraceRedacted,
  buildWebsiteKompisPublicAskTracePayload,
  createWebsiteKompisPublicAskCorrelationId,
  estimatePublicPageContextChars,
  listAvailablePublicPageSignals,
  logWebsiteKompisPublicAskTrace,
  pseudonymizeDomainHost,
  pseudonymizeInstallId,
  WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID,
  WEBSITE_KOMPIS_PUBLIC_ASK_TRACE_EVENT,
} from "./website-kompis-public-ask-trace";

const correlationId = createWebsiteKompisPublicAskCorrelationId();
assert.match(correlationId, /^[0-9a-f-]{36}$/i);

assert.equal(
  pseudonymizeInstallId("180c9d31-3340-4633-b210-3b64edf1e1be"),
  "edf1e1be",
);
assert.equal(pseudonymizeInstallId("180c9d31-3340-4633-b210-3b64edf1e1be")?.length, 8);
assert.equal(pseudonymizeDomainHost("www.unonight.com"), "www.unonight.com");
assert.equal(pseudonymizeDomainHost("https://www.unonight.com/no/faq"), "www.unonight.com");

const signals = listAvailablePublicPageSignals({
  pathname: "/no/faq/marketplace-listing-push",
  title: "Push",
  textSnippets: ["x"],
});
assert.deepEqual(signals, ["pathname", "title", "textSnippets"]);

assert.ok(
  estimatePublicPageContextChars({
    pathname: "/no",
    title: "Home",
    textSnippets: ["abc"],
  }) >= 10,
);

const payload = buildWebsiteKompisPublicAskTracePayload({
  correlationId,
  installValidated: true,
  installId: "180c9d31-3340-4633-b210-3b64edf1e1be",
  domain: "www.unonight.com",
  pagePathname: "/no/faq/marketplace-listing-push",
  pageLocale: "no",
  titlePresent: true,
  pageContextPresent: true,
  pageSignalsAvailable: signals,
  pageSignalsUsed: ["pathname", "title", "textSnippets"],
  sourceRoutes: ["https://www.unonight.com/no/faq/marketplace-listing-push"],
  contextChars: 120,
  answerPath: "current_page",
});

assert.equal(payload.policy, WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID);
assert.equal(payload.event, "public_ask_complete");
assert.equal(payload.installRef, "edf1e1be");
assert.equal(payload.answerPath, "current_page");
assert.doesNotMatch(JSON.stringify(payload), /Push er en funksjon/);
assertWebsiteKompisPublicAskTraceRedacted(payload as unknown as Record<string, unknown>);

assert.throws(() =>
  assertWebsiteKompisPublicAskTraceRedacted({
    question: "secret",
    correlationId,
  }),
);

const originalInfo = console.info;
let loggedEvent = "";
let loggedPayload: unknown = null;
console.info = ((event: unknown, payloadArg?: unknown) => {
  loggedEvent = String(event);
  loggedPayload = payloadArg;
}) as typeof console.info;
try {
  logWebsiteKompisPublicAskTrace(payload);
} finally {
  console.info = originalInfo;
}
assert.equal(loggedEvent, WEBSITE_KOMPIS_PUBLIC_ASK_TRACE_EVENT);
assert.equal((loggedPayload as { answerPath: string }).answerPath, "current_page");

console.log("website-kompis-public-ask-trace.test.ts: all assertions passed");
