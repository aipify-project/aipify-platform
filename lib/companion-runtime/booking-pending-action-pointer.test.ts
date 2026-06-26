import assert from "node:assert/strict";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import { resolvePendingBookingWritePointer } from "@/lib/companion-runtime/booking-pending-action-pointer";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OLDER_ID = "b2c3d4e5-f6a7-4890-b123-456789abcdef0";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

function assistant(
  id: string,
  content: string,
  pendingBookingWrite?: CompanionChatMessage["pendingBookingWrite"],
): CompanionChatMessage {
  return {
    id,
    role: "aipify",
    content,
    timestamp: Date.now(),
    ...(pendingBookingWrite !== undefined ? { pendingBookingWrite } : {}),
  };
}

function user(id: string, content: string): CompanionChatMessage {
  return { id, role: "user", content, timestamp: Date.now() };
}

function snapshotMessages(messages: CompanionChatMessage[]): string {
  return JSON.stringify(messages);
}

const newestAssistantHasValidPointer = resolvePendingBookingWritePointer([
  user("u1", "Book appointment"),
  assistant("a1", "Confirm booking?", { actionRequestId: VALID_ID }),
]);
assert.deepEqual(newestAssistantHasValidPointer, { actionRequestId: VALID_ID });

const userAfterAssistantKeepsPointer = resolvePendingBookingWritePointer([
  assistant("a1", "Confirm booking?", { actionRequestId: VALID_ID }),
  user("u2", "ja"),
]);
assert.deepEqual(userAfterAssistantKeepsPointer, { actionRequestId: VALID_ID });

const staleOlderPointerIgnored = resolvePendingBookingWritePointer([
  assistant("a1", "Earlier", { actionRequestId: OLDER_ID }),
  assistant("a2", "Follow-up without pointer"),
  user("u3", "ok"),
]);
assert.equal(staleOlderPointerIgnored, null);

const explicitNullPointer = resolvePendingBookingWritePointer([
  assistant("a1", "Cancelled handoff", { actionRequestId: VALID_ID }),
  assistant("a2", "No pending action", null),
]);
assert.equal(explicitNullPointer, null);

const invalidUuidCases = ["not-a-uuid", "", "   ", NIL_UUID];
for (const actionRequestId of invalidUuidCases) {
  assert.equal(
    resolvePendingBookingWritePointer([
      assistant("a-invalid", "Confirm?", { actionRequestId }),
    ]),
    null,
    `expected null for ${JSON.stringify(actionRequestId)}`,
  );
}

const textUuidIgnored = resolvePendingBookingWritePointer([
  assistant("a-text", `Please confirm ${VALID_ID}`, undefined),
]);
assert.equal(textUuidIgnored, null);

const noAssistantMessages = resolvePendingBookingWritePointer([
  user("u1", "Hello"),
  user("u2", "Still waiting"),
]);
assert.equal(noAssistantMessages, null);

const immutableInput = [
  assistant("a1", "Confirm?", { actionRequestId: VALID_ID }),
  user("u1", "ja"),
];
const before = snapshotMessages(immutableInput);
assert.deepEqual(resolvePendingBookingWritePointer(immutableInput), { actionRequestId: VALID_ID });
assert.equal(snapshotMessages(immutableInput), before);

console.log("booking-pending-action-pointer.test.ts: all assertions passed");
