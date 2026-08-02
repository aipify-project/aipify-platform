import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildHandoffIdempotencyKey,
  handoffTypeForSupportMode,
  isValidInviteEmail,
  listRelevantInstallAssistanceActions,
  waitingStateAfterRealHandoff,
  sessionStateAfterSupportConfirm,
} from "./index";

const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");
const HANDOFF_ROUTE = join(
  process.cwd(),
  "app/api/app-portal/integrations/[providerKey]/installation/handoff/route.ts"
);
const DERIVE = join(
  process.cwd(),
  "lib/app-portal/integrations/installation/derive-from-onboarding.ts"
);
const MIGRATION = join(
  process.cwd(),
  "supabase/migrations/20261937200000_core_app_installation_handoff_lifecycle_v1.sql"
);
const RULE = join(process.cwd(), ".cursor/rules/core-app-generic-installation-wizard.mdc");

const wizardSrc = readFileSync(WIZARD, "utf8");
const routeSrc = readFileSync(HANDOFF_ROUTE, "utf8");
const deriveSrc = readFileSync(DERIVE, "utf8");
const migrationSrc = readFileSync(MIGRATION, "utf8");
const ruleSrc = readFileSync(RULE, "utf8");

// A. Root cause regression — no premature waiting + comingLater for active CTAs
assert.equal(wizardSrc.includes("setHandoffNotice(wizLabels.comingLater)"), true);
assert.match(wizardSrc, /action\.handoff === "request"/);
assert.match(wizardSrc, /submitInstallationHandoff/);
assert.match(
  wizardSrc,
  /\/api\/app-portal\/integrations\/\$\{encodeURIComponent\(providerKey\)\}\/installation\/handoff/
);
assert.equal(wizardSrc.includes("waitingStateAfterRealHandoff(modeForHandoff)"), false);
assert.match(deriveSrc, /action_key: "aipify_managed"[\s\S]*?handoff: "request" as const/);
assert.match(deriveSrc, /action_key: "request_guided"[\s\S]*?handoff: "request" as const/);
assert.match(deriveSrc, /action_key: "invite_it"[\s\S]*?handoff: "invite" as const/);
assert.equal(deriveSrc.includes('handoff: "coming_later"'), false);

// B–E contract helpers
assert.equal(handoffTypeForSupportMode("aipify_managed"), "aipify_managed_setup");
assert.equal(handoffTypeForSupportMode("guided"), "guided_setup_request");
assert.equal(handoffTypeForSupportMode("customer_it_managed"), "customer_it_invitation");
assert.equal(handoffTypeForSupportMode("self_service"), "self_service_start");
assert.equal(waitingStateAfterRealHandoff("aipify_managed"), "awaiting_aipify");
assert.equal(waitingStateAfterRealHandoff("guided"), "awaiting_aipify");
assert.equal(waitingStateAfterRealHandoff("self_service"), null);
assert.equal(sessionStateAfterSupportConfirm("aipify_managed"), "in_progress");
assert.ok(isValidInviteEmail("ops@example.com"));
assert.equal(isValidInviteEmail("bad"), false);
assert.match(
  buildHandoffIdempotencyKey({
    providerKey: "demo",
    handoffType: "aipify_managed_setup",
    sessionId: "sess-1",
  }),
  /^handoff:demo:aipify_managed_setup:sess-1$/
);

// F. UI — no duplicate CTA after handoff; loading/disabled wiring
assert.match(wizardSrc, /installLifecycle === "handed_off"/);
assert.match(wizardSrc, /data-handoff-cta=/);
assert.match(wizardSrc, /handoffSubmitting/);
assert.match(wizardSrc, /data-handoff-confirmation/);
assert.match(wizardSrc, /data-it-recipient-email/);
assert.equal(
  listRelevantInstallAssistanceActions({
    actions: [
      {
        action_key: "aipify_managed",
        label: { kind: "locale_key", key: "x" },
        support_mode: "aipify_managed",
        handoff: "request",
      },
    ],
    supportMode: "aipify_managed",
    lifecycle: "handed_off",
  }).length,
  0
);
assert.equal(
  listRelevantInstallAssistanceActions({
    actions: [
      {
        action_key: "aipify_managed",
        label: { kind: "locale_key", key: "x" },
        support_mode: "aipify_managed",
        handoff: "coming_later",
      },
    ],
    supportMode: "aipify_managed",
    lifecycle: "confirmed",
  }).length,
  0
);

// G/H security route gates
assert.match(routeSrc, /client_org_forbidden/);
assert.match(routeSrc, /preview_readonly/);
assert.match(routeSrc, /create_app_portal_installation_handoff/);
assert.match(routeSrc, /get_app_portal_installation_handoff/);
assert.match(routeSrc, /export async function GET/);
assert.match(routeSrc, /idempotency_key/);
assert.match(wizardSrc, /hasOpenHandoff/);
assert.match(wizardSrc, /resolveHydratedInstallationState/);
assert.match(wizardSrc, /parsePersistedInstallationHandoff/);
// Open-status check lives in read-side hydrate parser (not duplicated in wizard).
const hydrateSrc = readFileSync(
  join(process.cwd(), "lib/app-portal/integrations/installation/hydrate-state.ts"),
  "utf8"
);
assert.match(hydrateSrc, /isOpenHandoffStatus/);

// Migration contract
assert.match(migrationSrc, /app_portal_installation_handoffs/);
assert.match(migrationSrc, /aipify_managed_setup/);
assert.match(migrationSrc, /guided_setup_request/);
assert.match(migrationSrc, /customer_it_invitation/);
assert.match(migrationSrc, /list_platform_installation_handoffs/);
assert.match(migrationSrc, /record_presence_notification/);
assert.match(migrationSrc, /idempotency_key/);

// Cursor rule
assert.match(ruleSrc, /Handoff CTAs must map to a real tenant-bound server action/);
assert.match(ruleSrc, /Waiting states/);
assert.match(ruleSrc, /Guided mode creates a guided setup request/);

// I. Locale keys present — no raw keys / waiting-before-handoff copy
for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const json = JSON.parse(
    readFileSync(
      join(process.cwd(), `locales/${locale}/customer-app/portalStructure.json`),
      "utf8"
    )
  );
  const wiz = json.portalStructure.integrations.installationWizard;
  assert.ok(wiz.handoff.success.aipifyManaged);
  assert.ok(wiz.handoff.success.guided);
  assert.ok(wiz.install.statusAfterHandoff.guided);
  assert.equal(String(wiz.install.status.aipifyManaged).includes("Venter"), false);
  assert.equal(String(wiz.install.status.aipifyManaged).includes("Waiting"), false);
}

const no = JSON.parse(
  readFileSync(join(process.cwd(), "locales/no/customer-app/portalStructure.json"), "utf8")
).portalStructure.integrations.installationWizard;
assert.equal(no.install.status.aipifyManaged, "Klar til å be Aipify om oppsett");
assert.equal(no.install.statusAfterHandoff.guided, "Veiledning er forespurt");
assert.match(no.handoff.success.aipifyManaged, /Referanse/);

// J. Preview / frozen paths untouched for mutation
const dialogSrc = readFileSync(
  join(process.cwd(), "components/app/app-portal/InstallationWizardPreviewDialog.tsx"),
  "utf8"
);
assert.match(dialogSrc, /mode="preview"/);
assert.equal(dialogSrc.includes("installation/handoff"), false);

console.log("handoff-runtime-v4.test.ts: ok");
