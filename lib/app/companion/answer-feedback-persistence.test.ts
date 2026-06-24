import assert from "node:assert/strict";
import { mapServerMessagesToChat } from "@/lib/app/companion/chat-queue/message-payload";

const mapped = mapServerMessagesToChat([
  {
    id: "assistant-msg-1",
    server_id: "srv-1",
    role: "assistant",
    content: "The fox says ring-ding-ding.",
    timestamp: 1_700_000_000_000,
    feedback_type: "helpful",
  },
  {
    id: "user-msg-1",
    role: "user",
    content: "What does the fox say?",
    timestamp: 1_699_999_000_000,
  },
]);

assert.equal(mapped.length, 2);
assert.equal(mapped[0]?.feedback, "helpful");
assert.equal(mapped[1]?.feedback, undefined);

console.log("companion-answer-feedback-persistence.test.ts passed");
