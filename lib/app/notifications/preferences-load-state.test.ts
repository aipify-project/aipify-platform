import assert from "node:assert/strict";
import {
  canStartPreferencesLoad,
  nextPreferencesStatusOnManualRetry,
  preferencesStatusIsError,
  preferencesStatusIsLoading,
  type NotificationPreferencesStatus,
} from "@/lib/app/notifications/preferences-load-state";
import {
  countPreferencesRequestsInWindow,
  recordPreferencesLoadAttempt,
  resetPreferencesDiagnosticsForTests,
} from "@/lib/app/notifications/preferences-load-diagnostics";

function transition(
  status: NotificationPreferencesStatus,
  event: "start" | "success" | "error" | "manual_retry",
): NotificationPreferencesStatus {
  if (event === "manual_retry") {
    assert.equal(canStartPreferencesLoad(status, true), true);
    return nextPreferencesStatusOnManualRetry();
  }
  if (event === "start") {
    assert.equal(canStartPreferencesLoad(status, false), true);
    return "loading";
  }
  if (event === "success") return "ready";
  return "error";
}

assert.equal(canStartPreferencesLoad("idle", false), true);
assert.equal(canStartPreferencesLoad("loading", false), false);
assert.equal(canStartPreferencesLoad("ready", false), false);
assert.equal(canStartPreferencesLoad("error", false), false);
assert.equal(canStartPreferencesLoad("error", true), true);
assert.equal(canStartPreferencesLoad("loading", true), false);

assert.equal(preferencesStatusIsLoading("loading"), true);
assert.equal(preferencesStatusIsError("error"), true);

let status: NotificationPreferencesStatus = "idle";
status = transition(status, "start");
assert.equal(status, "loading");
status = transition(status, "error");
assert.equal(status, "error");
assert.equal(canStartPreferencesLoad(status, false), false);
status = transition(status, "manual_retry");
assert.equal(status, "loading");
status = transition(status, "success");
assert.equal(status, "ready");
assert.equal(canStartPreferencesLoad(status, false), false);

resetPreferencesDiagnosticsForTests();
recordPreferencesLoadAttempt({
  stableRequestKey: "org-unonight:customer-1:user-42",
  source: "initial_load",
  outcome: "start",
});
recordPreferencesLoadAttempt({
  stableRequestKey: "org-unonight:customer-1:user-42",
  source: "initial_load",
  outcome: "error",
  httpStatus: 500,
  errorCode: "page_load_error",
});
assert.equal(canStartPreferencesLoad("error", false), false);
recordPreferencesLoadAttempt({
  stableRequestKey: "org-unonight:customer-1:user-42",
  source: "manual_retry",
  outcome: "start",
});
assert.equal(countPreferencesRequestsInWindow(30_000), 2);

console.log("preferences-load-state.test.ts passed");
