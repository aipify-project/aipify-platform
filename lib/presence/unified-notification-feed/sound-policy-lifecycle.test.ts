import assert from "node:assert/strict";
import {
  getNotificationAudioContextState,
  primeSoftBellAudio,
} from "@/lib/presence/unified-notification-feed/sound-policy";

const before = getNotificationAudioContextState();
assert.equal(before.activeContextInstances, 0);
assert.ok(before.state === "idle" || before.state === "unsupported");

primeSoftBellAudio();
const afterPrime = getNotificationAudioContextState();
if (typeof window !== "undefined") {
  assert.equal(afterPrime.primed, true);
}
assert.equal(afterPrime.activeContextInstances, 0);

console.log("sound-policy-lifecycle.test.ts passed");
