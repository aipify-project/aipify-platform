import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { shouldAutoSubmitHandoffQuery } from "./handoff-query";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function testHandoffAutoSubmitContract() {
  const query = "Hvilke løsninger har Aipify?";
  assert.equal(shouldAutoSubmitHandoffQuery(query, true, null), true);
  assert.equal(shouldAutoSubmitHandoffQuery(query, true, query), false);
  assert.equal(shouldAutoSubmitHandoffQuery(query, false, null), false);
}

function testCompanionPanelSubmitLifecycle() {
  const panelSource = readRepoFile("components/app/companion-experience/CompanionPanel.tsx");

  assert.match(panelSource, /submitInFlightRef/);
  assert.match(panelSource, /setSubmitting\(true\)/);
  assert.match(panelSource, /loading=\{loading \|\| submitting\}/);
  assert.match(
    panelSource,
    /alreadySubmitted = lastHandoffQueryRef\.current === trimmed/,
    "handoff must not repopulate composer after accepted submit",
  );
  assert.match(
    panelSource,
    /handoffInFlightRef\.current = trimmed;\s*\n\s*companionCtx\?\.clearDrawerQuery\(\);/,
    "handoff query must clear before auto-submit to avoid stale repopulation",
  );
}

function testPersistentChatProcessingState() {
  const chatSource = readRepoFile("lib/app/companion/chat-queue/use-companion-persistent-chat.ts");

  assert.match(
    chatSource,
    /item\.status === "waiting" \|\| item\.status === "processing"/,
    "processing UI must include waiting queue items",
  );
}

function testEnqueueClientQueuedSuccessContract() {
  const clientSource = readRepoFile("lib/app/companion/chat-queue/client.ts");
  const chatSource = readRepoFile("lib/app/companion/chat-queue/use-companion-persistent-chat.ts");

  assert.match(clientSource, /if \(!res\.ok\)/);
  assert.match(chatSource, /if \(!result\.ok\)/);
  assert.match(chatSource, /await refreshState\(\)/);
  assert.match(chatSource, /await triggerCompanionQueueProcess/);
}

function runTests() {
  testHandoffAutoSubmitContract();
  testCompanionPanelSubmitLifecycle();
  testPersistentChatProcessingState();
  testEnqueueClientQueuedSuccessContract();
  console.log("companion-submit-state.test.ts: all assertions passed");
}

runTests();
