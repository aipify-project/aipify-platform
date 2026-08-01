import assert from "node:assert/strict";
import {
  canShowInstallContinueLater,
  listRelevantInstallAssistanceActions,
  primaryInstallActionKeyForMode,
  resolveInstallSupportLifecycle,
  sessionStateAfterSupportConfirm,
  waitingStateAfterRealHandoff,
  waitingStateForSupportMode,
} from "./index";
import type { InstallationAssistanceAction } from "./types";
import type { InstallationSessionSnapshot } from "./types";

assert.equal(sessionStateAfterSupportConfirm("customer_it_managed"), "in_progress");
assert.notEqual(
  sessionStateAfterSupportConfirm("customer_it_managed"),
  waitingStateForSupportMode("customer_it_managed")
);
assert.equal(waitingStateAfterRealHandoff("customer_it_managed"), "awaiting_customer_it");
assert.equal(waitingStateAfterRealHandoff("self_service"), null);

assert.equal(
  resolveInstallSupportLifecycle({ localSupportMode: null, session: null }),
  "choose"
);
assert.equal(
  resolveInstallSupportLifecycle({
    localSupportMode: "guided",
    session: null,
  }),
  "selected"
);
assert.equal(
  resolveInstallSupportLifecycle({
    localSupportMode: null,
    session: {
      session_id: "s1",
      provider_key: "p",
      contract_version: "1",
      support_mode: "guided",
      state: "in_progress",
      current_step_key: "x",
      completed_step_keys: ["introduction"],
      field_values: {},
      paused: false,
      last_test_status: null,
      last_error_code: null,
      updated_at: "",
    } satisfies InstallationSessionSnapshot,
  }),
  "confirmed"
);
assert.equal(
  resolveInstallSupportLifecycle({
    localSupportMode: null,
    session: {
      session_id: "s1",
      provider_key: "p",
      contract_version: "1",
      support_mode: "customer_it_managed",
      state: "awaiting_customer_it",
      current_step_key: "x",
      completed_step_keys: ["introduction"],
      field_values: {},
      paused: false,
      last_test_status: null,
      last_error_code: null,
      updated_at: "",
    } satisfies InstallationSessionSnapshot,
  }),
  "handed_off"
);

assert.equal(canShowInstallContinueLater(null), false);
assert.equal(
  canShowInstallContinueLater({
    session_id: "s1",
    provider_key: "p",
    contract_version: "1",
    support_mode: "guided",
    state: "in_progress",
    current_step_key: "x",
    completed_step_keys: ["introduction"],
    field_values: {},
    paused: false,
    last_test_status: null,
    last_error_code: null,
    updated_at: "",
  }),
  true
);

assert.equal(primaryInstallActionKeyForMode("aipify_managed"), "aipify_managed");
assert.equal(primaryInstallActionKeyForMode("customer_it_managed"), "invite_it");

const actions: InstallationAssistanceAction[] = [
  {
    action_key: "invite_it",
    label: { kind: "locale_key", key: "x" },
    support_mode: "customer_it_managed",
    handoff: "invite",
  },
  {
    action_key: "invite_partner",
    label: { kind: "locale_key", key: "y" },
    support_mode: "partner_managed",
    handoff: "invite_placeholder",
  },
  {
    action_key: "continue_later",
    label: { kind: "locale_key", key: "z" },
  },
  {
    action_key: "aipify_managed",
    label: { kind: "locale_key", key: "a" },
    support_mode: "aipify_managed",
    handoff: "request",
  },
];

assert.deepEqual(
  listRelevantInstallAssistanceActions({
    actions,
    supportMode: null,
    lifecycle: "choose",
  }),
  []
);
assert.deepEqual(
  listRelevantInstallAssistanceActions({
    actions,
    supportMode: "customer_it_managed",
    lifecycle: "selected",
  }).map((a) => a.action_key),
  ["invite_it"]
);
assert.equal(
  listRelevantInstallAssistanceActions({
    actions,
    supportMode: "aipify_managed",
    lifecycle: "selected",
  }).some((a) => a.action_key === "invite_partner"),
  false
);

console.log("install-selection.test.ts: ok");
