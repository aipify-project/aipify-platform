import assert from "node:assert/strict";
import {
  COMPANION_ASSISTANT_FEEDBACK_CONTROLS,
  COMPANION_USER_MESSAGE_CARD_V1_FLAG,
  COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS,
  COMPANION_USER_MESSAGE_IDENTITY_ICON,
  COMPANION_USER_MESSAGE_PRESENTATION,
  isCompanionUserMessageCardV1Enabled,
} from "./companion-user-message-policy";

assert.equal(COMPANION_USER_MESSAGE_PRESENTATION, "card");
assert.equal(COMPANION_USER_MESSAGE_IDENTITY_ICON, "speech_bubble");
assert.equal(COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS, "none");
assert.equal(COMPANION_ASSISTANT_FEEDBACK_CONTROLS, "allowed");
assert.equal(COMPANION_USER_MESSAGE_CARD_V1_FLAG, "companionUserMessageCardV1");

const envSnapshot = process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1;
try {
  delete process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1;
  assert.equal(isCompanionUserMessageCardV1Enabled(), false);
  assert.equal(isCompanionUserMessageCardV1Enabled({ companionUserMessageCardV1: true }), true);
  assert.equal(isCompanionUserMessageCardV1Enabled({ companionUserMessageCardV1: false }), false);

  process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1 = "true";
  assert.equal(isCompanionUserMessageCardV1Enabled(), true);

  process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1 = "false";
  assert.equal(isCompanionUserMessageCardV1Enabled(), false);
} finally {
  if (envSnapshot === undefined) {
    delete process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1;
  } else {
    process.env.NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1 = envSnapshot;
  }
}

console.log("companion-user-message-policy.test.ts: all assertions passed");
