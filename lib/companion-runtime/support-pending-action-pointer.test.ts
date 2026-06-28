import assert from "node:assert/strict";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import {
  deserializeAssistantMessage,
  serializeAssistantPayload,
} from "@/lib/app/companion/chat-queue/message-payload";
import {
  coercePendingSupportWrite,
  isReplayEligibleTerminalSupportResume,
  normalizePendingSupportWrite,
  resolvePendingSupportWritePointer,
  serializePendingSupportWrite,
  SUPPORT_RESUME_SOURCE_ID,
  SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META,
} from "@/lib/companion-runtime/support-pending-action-pointer";
import { resolvePendingBookingWritePointer } from "@/lib/companion-runtime/booking-pending-action-pointer";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OLDER_ID = "b2c3d4e5-f6a7-4890-b123-456789abcdef0";
const BOOKING_ID = "c3d4e5f6-a7b8-4901-c234-567890abcdef";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

type AssistantMessage = CompanionChatMessage & {
  pendingSupportWrite?: { actionRequestId: string } | null;
};

function assistant(
  id: string,
  content: string,
  pendingSupportWrite?: AssistantMessage["pendingSupportWrite"],
): AssistantMessage {
  return {
    id,
    role: "aipify",
    content,
    timestamp: Date.now(),
    ...(pendingSupportWrite !== undefined ? { pendingSupportWrite } : {}),
  };
}

function user(id: string, content: string): CompanionChatMessage {
  return { id, role: "user", content, timestamp: Date.now() };
}

function supportProposal(
  id: string,
  content: string,
  actionRequestId: string,
): AssistantMessage {
  return {
    ...assistant(id, content, { actionRequestId }),
    sourceId: "support-proposal",
  };
}

function terminalSupportResume(
  id: string,
  content: string,
  consumed = true,
): AssistantMessage {
  return {
    ...assistant(id, content, null),
    sourceId: SUPPORT_RESUME_SOURCE_ID,
    sources: [
      {
        id: SUPPORT_RESUME_SOURCE_ID,
        label: "Support operations",
        kind: "customer_context",
        ...(consumed ? { meta: SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META } : {}),
      },
    ],
  };
}

const RESUME_QUERY = "Fortsett";

assert.deepEqual(serializePendingSupportWrite({ actionRequestId: VALID_ID }), {
  action_request_id: VALID_ID,
});

assert.deepEqual(
  normalizePendingSupportWrite({ action_request_id: VALID_ID }),
  { action_request_id: VALID_ID },
);

assert.deepEqual(coercePendingSupportWrite({ actionRequestId: VALID_ID }), {
  actionRequestId: VALID_ID,
});

for (const invalid of ["not-a-uuid", "", "   ", NIL_UUID, null, undefined, {}, { action_request_id: "x" }]) {
  assert.equal(normalizePendingSupportWrite(invalid), null);
  assert.equal(coercePendingSupportWrite(invalid), null);
}

const roundtripMessage = assistant("a-roundtrip", "Assign case?", {
  actionRequestId: VALID_ID,
});
const serialized = serializeAssistantPayload(roundtripMessage);
assert.deepEqual(serialized.pending_support_write, { action_request_id: VALID_ID });
assert.equal(serialized.pending_booking_write, undefined);
assert.deepEqual(Object.keys(serialized.pending_support_write ?? {}), ["action_request_id"]);

const roundtripped = deserializeAssistantMessage(
  "server-roundtrip",
  "client-roundtrip",
  roundtripMessage.content,
  serialized as Record<string, unknown>,
  roundtripMessage.timestamp,
) as AssistantMessage;
assert.deepEqual(roundtripped.pendingSupportWrite, { actionRequestId: VALID_ID });
assert.equal(roundtripped.pendingBookingWrite, undefined);

const extraFieldsPayload = {
  ...serialized,
  pending_support_write: {
    action_request_id: VALID_ID,
    case_id: "case-1",
    assignee_user_id: "user-1",
  },
};
const stripped = deserializeAssistantMessage(
  "server-extra",
  "client-extra",
  "Assign?",
  extraFieldsPayload as Record<string, unknown>,
  Date.now(),
) as AssistantMessage;
assert.deepEqual(stripped.pendingSupportWrite, { actionRequestId: VALID_ID });
assert.deepEqual(Object.keys(stripped.pendingSupportWrite ?? {}), ["actionRequestId"]);

assert.deepEqual(
  resolvePendingSupportWritePointer([
    user("u1", "Assign this case"),
    assistant("a1", "Confirm assignment?", { actionRequestId: VALID_ID }),
  ]),
  { actionRequestId: VALID_ID },
);

assert.deepEqual(
  resolvePendingSupportWritePointer([
    assistant("a1", "Confirm assignment?", { actionRequestId: VALID_ID }),
    user("u2", "ja"),
  ]),
  { actionRequestId: VALID_ID },
);

assert.equal(
  resolvePendingSupportWritePointer([
    assistant("a1", "Earlier", { actionRequestId: OLDER_ID }),
    assistant("a2", "Follow-up without pointer"),
    user("u3", "ok"),
  ]),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer([
    assistant("a1", "Cancelled handoff", { actionRequestId: VALID_ID }),
    assistant("a2", "No pending action", null),
  ]),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer([
    assistant("a-text", `Please confirm ${VALID_ID}`, undefined),
  ]),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer([user("u1", "Hello"), user("u2", "Still waiting")]),
  null,
);

assert.equal(
  resolvePendingBookingWritePointer([
    {
      ...assistant("a-booking", "Confirm booking?"),
      pendingBookingWrite: { actionRequestId: BOOKING_ID },
    },
    assistant("a-support", "Confirm assign?", { actionRequestId: VALID_ID }),
  ]),
  null,
);

assert.deepEqual(
  resolvePendingSupportWritePointer([
    {
      ...assistant("a-booking", "Confirm booking?"),
      pendingBookingWrite: { actionRequestId: BOOKING_ID },
    },
    assistant("a-support", "Confirm assign?", { actionRequestId: VALID_ID }),
  ]),
  { actionRequestId: VALID_ID },
);

assert.deepEqual(
  resolvePendingBookingWritePointer([
    {
      ...assistant("a-booking", "Confirm booking?"),
      pendingBookingWrite: { actionRequestId: BOOKING_ID },
    },
  ]),
  { actionRequestId: BOOKING_ID },
);

assert.equal(
  resolvePendingSupportWritePointer([
    {
      ...assistant("a-booking", "Confirm booking?"),
      pendingBookingWrite: { actionRequestId: BOOKING_ID },
    },
  ]),
  null,
);

assert.deepEqual(
  resolvePendingSupportWritePointer(
    [
      supportProposal("a1", "Approval required?", VALID_ID),
      user("u1", RESUME_QUERY),
      terminalSupportResume("a2", "Supporthandlingen ble utført av den tilkoblede leverandøren."),
    ],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  { actionRequestId: VALID_ID },
);

assert.equal(
  resolvePendingSupportWritePointer(
    [
      supportProposal("a1", "Approval required?", VALID_ID),
      user("u1", RESUME_QUERY),
      terminalSupportResume("a2", "Supporthandlingen ble utført av den tilkoblede leverandøren."),
    ],
    { resumeContinuationQuery: "Hei" },
  ),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer(
    [
      supportProposal("a1", "Approval required?", VALID_ID),
      user("u1", RESUME_QUERY),
      terminalSupportResume("a2", "Supporthandlingen kunne ikke fullføres", false),
    ],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer(
    [terminalSupportResume("a2", "Supporthandlingen ble utført av den tilkoblede leverandøren.")],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  null,
);

assert.equal(
  resolvePendingSupportWritePointer(
    [
      supportProposal("a1", "Approval required?", VALID_ID),
      user("u1", RESUME_QUERY),
      terminalSupportResume("a2", "Supporthandlingen ble utført av den tilkoblede leverandøren."),
      user("u2", "Hei"),
      assistant("a3", "Vanlig assistant-svar"),
    ],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  null,
);

assert.deepEqual(
  resolvePendingSupportWritePointer(
    [
      supportProposal("a-old", "Older assignment", OLDER_ID),
      user("u-old", RESUME_QUERY),
      terminalSupportResume("a-term", "Done"),
      user("u-mid", "ok"),
      supportProposal("a-new", "New assignment?", VALID_ID),
    ],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  { actionRequestId: VALID_ID },
);

assert.equal(
  resolvePendingSupportWritePointer(
    [
      user("u1", "Hei"),
      assistant("a1", "Vanlig assistant-svar"),
    ],
    { resumeContinuationQuery: RESUME_QUERY },
  ),
  null,
);

assert.equal(
  isReplayEligibleTerminalSupportResume(
    terminalSupportResume("a2", "Supporthandlingen ble utført av den tilkoblede leverandøren."),
  ),
  true,
);

assert.equal(
  isReplayEligibleTerminalSupportResume(
    terminalSupportResume("a2", "Supporthandlingen kunne ikke fullføres", false),
  ),
  false,
);

console.log("support-pending-action-pointer.test.ts: all assertions passed");
