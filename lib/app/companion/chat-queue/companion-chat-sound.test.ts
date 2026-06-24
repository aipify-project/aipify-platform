import assert from "node:assert/strict";
import {
  detectNewAssistantMessagesForSound,
  playCompanionAssistantMessageSound,
} from "./companion-chat-sound";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";

const enabledPrefs = {
  channel_in_app: true,
  sound_enabled: true,
  quiet_hours_enabled: false,
} as PresenceNotificationPreferences;

function testDetectNewAssistantMessages() {
  const previous = [{ role: "aipify" as const, serverId: "a1", clientId: "c1" }];
  const next = [
    { role: "aipify" as const, serverId: "a1", clientId: "c1" },
    { role: "aipify" as const, serverId: "a2", clientId: "c2" },
  ];
  const detected = detectNewAssistantMessagesForSound(previous, next);
  assert.equal(detected.length, 1);
  assert.equal(detected[0]?.serverId, "a2");
}

function testNoReplayForKnownMessages() {
  const messages = [{ role: "aipify" as const, serverId: "a1", clientId: "c1" }];
  assert.equal(detectNewAssistantMessagesForSound(messages, messages).length, 0);
}

async function testDedupePlayedKeys() {
  const playedKeys = new Set<string>();
  const message = { role: "aipify" as const, serverId: "msg-1", clientId: "c1" };

  const muted = await playCompanionAssistantMessageSound({
    message,
    preferences: { ...enabledPrefs, sound_enabled: false },
    playedKeys,
  });
  assert.equal(muted, "muted");
  assert.equal(playedKeys.has("msg-1"), false);

  playedKeys.add("msg-1");
  const skipped = await playCompanionAssistantMessageSound({
    message,
    preferences: enabledPrefs,
    playedKeys,
  });
  assert.equal(skipped, "skipped");
}

testDetectNewAssistantMessages();
testNoReplayForKnownMessages();
void testDedupePlayedKeys().then(() => {
  console.log("companion-chat-sound.test.ts: all assertions passed");
});
