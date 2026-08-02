import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveInstallationWaitingCopyParty } from "./waiting-copy";

const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");
const HANDOFF_ROUTE = join(
  process.cwd(),
  "app/api/app-portal/integrations/[providerKey]/installation/handoff/route.ts"
);
const MIGRATION = join(
  process.cwd(),
  "supabase/migrations/20261937200000_core_app_installation_handoff_lifecycle_v1.sql"
);

const wizardSrc = readFileSync(WIZARD, "utf8");
const routeSrc = readFileSync(HANDOFF_ROUTE, "utf8");
const migrationSrc = readFileSync(MIGRATION, "utf8");

// A–D contextual mapping
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: "aipify",
    supportMode: "aipify_managed",
    sessionState: "awaiting_aipify",
  }),
  "aipify"
);
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: "aipify",
    supportMode: "guided",
    sessionState: "awaiting_aipify",
  }),
  "aipify_guided"
);
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: "customer_it",
    supportMode: "customer_it_managed",
    sessionState: "awaiting_customer_it",
  }),
  "customer_it"
);
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: null,
    supportMode: null,
    sessionState: "in_progress",
  }),
  "unknown"
);
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: null,
    supportMode: "aipify_managed",
    sessionState: "awaiting_aipify",
  }),
  "aipify"
);
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: "partner",
    supportMode: "partner_managed",
    sessionState: "awaiting_partner",
  }),
  "partner"
);

// Wizard uses presentation helper — not bare generic waiting in handed_off card
assert.match(wizardSrc, /resolveInstallationWaitingCopyParty/);
assert.match(wizardSrc, /waitingForParty/);
assert.match(wizardSrc, /data-waiting-party=\{waitingCopyParty\}/);
assert.equal(wizardSrc.includes("<p className=\"font-medium\">{wizLabels.waiting}</p>"), false);

// E. Lifecycle / API / RPC / migration untouched by this presentation change
assert.match(routeSrc, /create_app_portal_installation_handoff/);
assert.match(migrationSrc, /app_portal_installation_handoffs/);
assert.equal(wizardSrc.includes("waitingStateAfterRealHandoff(modeForHandoff)"), false);

// F. Locale keys
for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const json = JSON.parse(
    readFileSync(
      join(process.cwd(), `locales/${locale}/customer-app/portalStructure.json`),
      "utf8"
    )
  );
  const wiz = json.portalStructure.integrations.installationWizard;
  assert.ok(wiz.waitingByParty.aipify);
  assert.ok(wiz.waitingByParty.aipifyGuided);
  assert.ok(wiz.waitingByParty.customerIt);
  assert.ok(wiz.waitingByParty.partner);
  assert.ok(wiz.waiting);
  assert.notEqual(wiz.waitingByParty.aipify, wiz.waiting);
}

const no = JSON.parse(
  readFileSync(join(process.cwd(), "locales/no/customer-app/portalStructure.json"), "utf8")
).portalStructure.integrations.installationWizard;
assert.equal(no.waitingByParty.aipify, "Venter på Aipify");
assert.equal(no.waitingByParty.aipifyGuided, "Venter på veiledning fra Aipify");
assert.equal(no.waitingByParty.customerIt, "Venter på IT-leverandør");
assert.equal(no.waiting, "Venter på ansvarlig part");

const rule = readFileSync(
  join(process.cwd(), ".cursor/rules/core-app-generic-installation-wizard.mdc"),
  "utf8"
);
assert.match(rule, /known responsible party/);
assert.match(rule, /must not alter lifecycle/);

console.log("waiting-copy-v5.test.ts: ok");
