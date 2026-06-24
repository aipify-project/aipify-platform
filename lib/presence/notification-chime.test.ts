import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  NOTIFICATION_CHIME_SRC,
  mapPlaybackResultToTestResult,
} from "@/lib/presence/notification-chime";

const wavPath = path.join(process.cwd(), "public/audio/notification-chime.wav");
assert.ok(fs.existsSync(wavPath), "notification chime wav must exist");

const stat = fs.statSync(wavPath);
assert.ok(stat.size > 1000, "notification chime wav must have content");
assert.equal(NOTIFICATION_CHIME_SRC, "/audio/notification-chime.wav");

assert.equal(mapPlaybackResultToTestResult({ status: "completed", ended: true }), "played");
assert.equal(
  mapPlaybackResultToTestResult({ status: "autoplay_blocked", error: "NotAllowedError" }),
  "blocked",
);
assert.equal(mapPlaybackResultToTestResult({ status: "file_missing" }), "file_error");
assert.equal(
  mapPlaybackResultToTestResult({ status: "incomplete", error: "ended_not_received" }),
  "incomplete",
);

console.log("notification-chime.test.ts passed");
