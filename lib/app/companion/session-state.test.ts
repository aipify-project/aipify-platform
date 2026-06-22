import assert from "node:assert/strict";
import {
  clearCompanionUiSession,
  patchCompanionUiSession,
  readCompanionUiSession,
} from "./session-state";

if (typeof sessionStorage === "undefined") {
  console.log("companion session state tests skipped — no sessionStorage");
} else {
  clearCompanionUiSession();

  const saved = patchCompanionUiSession(
    {
      panelOpen: true,
      activeConversationId: "conv-1",
      draftText: "hello draft",
      organizationKey: "org-a",
    },
    "org-a",
  );

  assert.equal(saved.panelOpen, true);
  assert.equal(saved.activeConversationId, "conv-1");
  assert.equal(saved.draftText, "hello draft");

  const restored = readCompanionUiSession("org-a");
  assert.ok(restored);
  assert.equal(restored?.panelOpen, true);
  assert.equal(restored?.activeConversationId, "conv-1");

  assert.equal(readCompanionUiSession("org-b"), null);

  clearCompanionUiSession();
  assert.equal(readCompanionUiSession(), null);

  console.log("companion session state tests passed");
}
