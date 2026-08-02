import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parsePersistedInstallationHandoff,
  resolveHydratedInstallationState,
} from "./hydrate-state";
import {
  listRelevantInstallAssistanceActions,
  resolveInstallSupportLifecycle,
} from "./install-selection";
import type { InstallationAssistanceAction } from "./types";
import type { InstallationSessionSnapshot } from "./types";

const sessionInProgress: InstallationSessionSnapshot = {
  session_id: "s1",
  provider_key: "p",
  contract_version: "1",
  support_mode: "aipify_managed",
  state: "in_progress",
  current_step_key: "choose_support",
  completed_step_keys: ["introduction"],
  field_values: {},
  paused: false,
  last_test_status: null,
  last_error_code: null,
  updated_at: "",
};

const openAipifyHandoff = {
  handoff_request_id: "hr_1",
  status: "requested",
  support_mode: "aipify_managed" as const,
  assigned_party_type: "aipify",
  requested_at: "2026-08-01T12:00:00.000Z",
  created_at: "2026-08-01T12:00:00.000Z",
  recipient_email: null,
  lifecycle_state: "awaiting_aipify",
  next_step: "aipify_setup",
  handoff_type: "aipify_managed_setup",
};

// A. Existing Aipify handoff — open overrides ready_for_handoff
{
  const hydrated = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: openAipifyHandoff,
    handoffLoadState: "ready",
  });
  assert.equal(hydrated.lifecycle, "handed_off");
  assert.equal(hydrated.hasOpenHandoff, true);
  assert.equal(hydrated.showHandoffCta, false);
  assert.equal(hydrated.showWaitingPresentation, true);
  assert.equal(hydrated.presentationState, "awaiting_aipify");
  assert.equal(hydrated.waitingCopyParty, "aipify");
  assert.equal(hydrated.confirmation?.reference, "hr_1");
  assert.equal(hydrated.statusPendingHydration, false);
}

assert.equal(
  resolveInstallSupportLifecycle({
    localSupportMode: null,
    session: sessionInProgress,
    hasOpenHandoff: true,
  }),
  "handed_off"
);

const actions: InstallationAssistanceAction[] = [
  {
    action_key: "aipify_managed",
    label: { kind: "locale_key", key: "x" },
    support_mode: "aipify_managed",
    handoff: "request",
  },
];
assert.deepEqual(
  listRelevantInstallAssistanceActions({
    actions,
    supportMode: "aipify_managed",
    lifecycle: "handed_off",
  }),
  []
);

// B. Guided open handoff
{
  const hydrated = resolveHydratedInstallationState({
    session: { ...sessionInProgress, support_mode: "guided", state: "in_progress" },
    localSupportMode: null,
    handoff: {
      ...openAipifyHandoff,
      support_mode: "guided",
      handoff_type: "guided_setup_request",
    },
    handoffLoadState: "ready",
  });
  assert.equal(hydrated.lifecycle, "handed_off");
  assert.equal(hydrated.showHandoffCta, false);
  assert.equal(hydrated.waitingCopyParty, "aipify_guided");
  assert.equal(hydrated.presentationState, "awaiting_aipify");
}

// C. Customer IT open handoff
{
  const hydrated = resolveHydratedInstallationState({
    session: {
      ...sessionInProgress,
      support_mode: "customer_it_managed",
      state: "in_progress",
    },
    localSupportMode: null,
    handoff: {
      ...openAipifyHandoff,
      support_mode: "customer_it_managed",
      assigned_party_type: "customer_it",
      recipient_email: "it@customer.example",
      handoff_type: "customer_it_invitation",
    },
    handoffLoadState: "ready",
  });
  assert.equal(hydrated.lifecycle, "handed_off");
  assert.equal(hydrated.presentationState, "awaiting_customer_it");
  assert.equal(hydrated.waitingCopyParty, "customer_it");
  assert.equal(hydrated.confirmation?.recipientEmail, "it@customer.example");
  assert.equal(hydrated.showHandoffCta, false);
}

// D. No handoff — ready for CTA
{
  const hydrated = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: null,
    handoffLoadState: "ready",
  });
  assert.equal(hydrated.lifecycle, "confirmed");
  assert.equal(hydrated.showHandoffCta, true);
  assert.equal(hydrated.showWaitingPresentation, false);
}

// E. Completed handoff — no active CTA
{
  const hydrated = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: { ...openAipifyHandoff, status: "completed" },
    handoffLoadState: "ready",
  });
  assert.equal(hydrated.handoffKind, "completed");
  assert.equal(hydrated.showHandoffCta, false);
  assert.equal(hydrated.presentationState, "completed");
  assert.equal(hydrated.showWaitingPresentation, false);
}

// F. Cancelled/failed — recovery CTA allowed
{
  const cancelled = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: { ...openAipifyHandoff, status: "cancelled" },
    handoffLoadState: "ready",
  });
  assert.equal(cancelled.handoffKind, "cancelled");
  assert.equal(cancelled.showHandoffCta, true);
  assert.equal(cancelled.lifecycle, "confirmed");

  const failed = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: { ...openAipifyHandoff, status: "failed" },
    handoffLoadState: "ready",
  });
  assert.equal(failed.handoffKind, "failed");
  assert.equal(failed.showHandoffCta, true);
}

// G. Hydration loading — no CTA flash / status pending
{
  const loading = resolveHydratedInstallationState({
    session: sessionInProgress,
    localSupportMode: null,
    handoff: null,
    handoffLoadState: "loading",
  });
  assert.equal(loading.statusPendingHydration, true);
  assert.equal(loading.showHandoffCta, false);
  assert.equal(loading.hasOpenHandoff, null);
}

// H. Parser
{
  const parsed = parsePersistedInstallationHandoff({
    handoff: {
      handoff_request_id: "hr_9",
      status: "assigned",
      support_mode: "aipify_managed",
      assigned_party_type: "aipify",
      requested_at: "2026-08-01T10:00:00.000Z",
      created_at: "2026-08-01T10:00:00.000Z",
    },
  });
  assert.ok(parsed);
  assert.equal(parsed?.handoff_request_id, "hr_9");
  assert.equal(parsePersistedInstallationHandoff(null), null);
  assert.equal(parsePersistedInstallationHandoff({ handoff: { status: "requested" } }), null);
}

// I. Source contracts — wizard uses hydrate resolver; GET remains read-only
{
  const wizardSrc = readFileSync(
    join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx"),
    "utf8"
  );
  const routeSrc = readFileSync(
    join(
      process.cwd(),
      "app/api/app-portal/integrations/[providerKey]/installation/handoff/route.ts"
    ),
    "utf8"
  );
  assert.match(wizardSrc, /resolveHydratedInstallationState/);
  assert.match(wizardSrc, /parsePersistedInstallationHandoff/);
  assert.match(wizardSrc, /statusPendingHydration/);
  assert.match(wizardSrc, /showWaitingPresentation/);
  assert.equal(wizardSrc.includes("Venter på Aipify"), false);
  assert.match(routeSrc, /get_app_portal_installation_handoff/);
  assert.match(routeSrc, /create_app_portal_installation_handoff/);
  // GET must not create handoffs
  const getBlock = routeSrc.slice(
    routeSrc.indexOf("export async function GET"),
    routeSrc.indexOf("export async function POST")
  );
  assert.equal(getBlock.includes("create_app_portal_installation_handoff"), false);
}

// J. Rule updated
{
  const rule = readFileSync(
    join(process.cwd(), ".cursor/rules/core-app-generic-installation-wizard.mdc"),
    "utf8"
  );
  assert.match(rule, /persisted open handoff has highest read-side priority/i);
}

console.log("hydrate-state-v6.test.ts: ok");
