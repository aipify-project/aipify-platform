import assert from "node:assert/strict";
import { formatLiveRefreshStatus } from "@/lib/command-center/format-live-refresh-status";

const labels = {
  updatedNow: "Updated just now",
  updatedSecondsAgo: "Updated {seconds} seconds ago",
  updatedMinutesAgo: "Updated {minutes} minutes ago",
  refreshFailed: "Could not refresh.",
};

assert.equal(formatLiveRefreshStatus(null, null, labels), "");
assert.equal(formatLiveRefreshStatus(Date.now(), null, labels, Date.now()), labels.updatedNow);
assert.equal(
  formatLiveRefreshStatus(Date.now() - 12_000, null, labels, Date.now()),
  "Updated 12 seconds ago",
);
assert.equal(
  formatLiveRefreshStatus(Date.now() - 120_000, null, labels, Date.now()),
  "Updated 2 minutes ago",
);
assert.equal(formatLiveRefreshStatus(Date.now(), "failed", labels, Date.now()), labels.refreshFailed);

console.log("command-center-silent-live-refresh.test.ts passed");
