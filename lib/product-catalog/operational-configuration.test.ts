import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildOperationalConfigurationSnapshot,
  resolveWebQuotaSurfaceStatus,
} from "./operational-configuration";
import { AGENT_CONTRACT_RULES } from "@/lib/commercial-billing-sales/agent-contracts";
import { WEBSITE_KOMPIS_SITE_PROVISION_LIVE } from "@/lib/website-kompis-connection/provision-gate";

assert.equal(WEBSITE_KOMPIS_SITE_PROVISION_LIVE, false);
assert.equal(AGENT_CONTRACT_RULES.agent2.purchaseCtaFromThisModule, false);
assert.equal(AGENT_CONTRACT_RULES.agent2.commissionVisibleInApp, false);
assert.equal(AGENT_CONTRACT_RULES.agent2.catalogBrowseRequiresLicense, false);
assert.equal(AGENT_CONTRACT_RULES.agent2.operationsRequireActiveEntitlement, true);

assert.equal(
  resolveWebQuotaSurfaceStatus({
    kind: "known_plan",
    plan: "standard",
    allowance: 100,
    finalized: 0,
    reserved: 0,
    remaining: 100,
    periodKey: "2026-11",
    acceptsNewAnswers: true,
  }),
  "ready",
);
assert.equal(
  resolveWebQuotaSurfaceStatus({
    kind: "known_plan",
    plan: "standard",
    allowance: 100,
    finalized: 100,
    reserved: 0,
    remaining: 0,
    periodKey: "2026-11",
    acceptsNewAnswers: false,
  }),
  "attention",
);

assert.equal(resolveWebQuotaSurfaceStatus({ kind: "no_module" }), "not_licensed");
assert.equal(resolveWebQuotaSurfaceStatus({ kind: "unavailable" }), "unavailable");
assert.equal(resolveWebQuotaSurfaceStatus({ kind: "unauthenticated" }), "blocked");
assert.equal(resolveWebQuotaSurfaceStatus({ kind: "unknown_plan" }), "attention");

const snap = buildOperationalConfigurationSnapshot({ quota: { kind: "no_module" } });
assert.equal(snap.catalogBrowseRequiresLicense, false);
assert.equal(snap.operationsRequireActiveEntitlement, true);
assert.equal(snap.commissionVisibleInApp, false);
assert.equal(snap.purchaseCtaEnabled, false);
assert.equal(snap.provisionLive, false);
assert.equal(snap.appearanceWriter, "unavailable");
assert.equal(snap.webQuota, "not_licensed");
assert.equal(snap.presenceProducerMount, "blocked_needs_agent4_contract");

const appearancePage = readFileSync(
  join(process.cwd(), "app/app/website-kompis/appearance/page.tsx"),
  "utf8",
);
assert.match(appearancePage, /readWebsiteKompisAppearanceFailClosed/);
assert.match(appearancePage, /appearanceWriterUnavailableTitle/);
assert.match(appearancePage, /appearanceWriterBlockedBody/);
assert.match(appearancePage, /appearanceCandidateReadyNote/);
assert.match(appearancePage, /appearanceInstallChromeCard/);
assert.doesNotMatch(appearancePage, /onSubmit|fakeSuccess/);
assert.doesNotMatch(appearancePage, /writeWebsiteKompisAppearanceFailClosed/);

const sql = readFileSync(
  join(process.cwd(), "docs/platform/sql-candidates/website_kompis_appearance_settings_v1.sql"),
  "utf8",
);
assert.match(sql, /APPLY_BLOCKED_UNTIL_OWNER_YES/);
assert.match(sql, /upsert_website_kompis_appearance_settings/);
assert.match(sql, /get_website_kompis_appearance_settings/);
assert.match(sql, /revoke all on function public\.get_website_kompis_appearance_settings/);
assert.doesNotMatch(sql, /^\s*grant\s+execute/im);

const shaFile = readFileSync(
  join(process.cwd(), "docs/platform/sql-candidates/website_kompis_appearance_settings_v1.sql.sha256"),
  "utf8",
).trim();
assert.match(shaFile, /^[a-f0-9]{64}(\s|$)/);

const frozenManifest = readFileSync(
  join(process.cwd(), "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
  "utf8",
);
assert.ok(frozenManifest.includes("sha256"));

console.log("operational-configuration.test.ts: ok");
