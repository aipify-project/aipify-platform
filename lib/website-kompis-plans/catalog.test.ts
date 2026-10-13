import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  WEBSITE_KOMPIS_PLAN_CATALOG,
  WEBSITE_KOMPIS_USAGE_METER_AVAILABLE,
  getWebsiteKompisPlan,
} from "./catalog";
import { WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES } from "./communication-templates";
import { WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES } from "./upgrade-readiness-contract";

assert.equal(WEBSITE_KOMPIS_PLAN_CATALOG.length, 3);
assert.equal(getWebsiteKompisPlan("free").answerQuota, 150);
assert.equal(getWebsiteKompisPlan("free").quotaKind, "lifetime_total");
assert.equal(getWebsiteKompisPlan("free").requiresCard, false);
assert.equal(getWebsiteKompisPlan("standard").answerQuota, 2500);
assert.equal(getWebsiteKompisPlan("pro").answerQuota, 10000);
assert.equal(getWebsiteKompisPlan("standard").monthlyPrice?.amountDisplay, "599");
assert.equal(getWebsiteKompisPlan("standard").annualPrice?.amountDisplay, "5 990");
assert.equal(getWebsiteKompisPlan("pro").monthlyPrice?.amountDisplay, "1 199");
assert.equal(getWebsiteKompisPlan("pro").annualPrice?.amountDisplay, "11 990");
assert.equal(getWebsiteKompisPlan("standard").annualPrice?.yearEquivalentMonthsPaid, 10);
assert.equal(getWebsiteKompisPlan("standard").annualRenewsAnswersMonthly, true);
assert.equal(getWebsiteKompisPlan("standard").checkoutEnabled, false);
assert.equal(getWebsiteKompisPlan("pro").offerStatus, "planned");
assert.equal(WEBSITE_KOMPIS_USAGE_METER_AVAILABLE, false);
assert.ok(WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES.every((t) => t.deliveryStatus === "draft_preview_only"));
assert.ok(WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.A_ledger_sql_and_frozen_ask_reopen);

const panel = readFileSync(
  join(process.cwd(), "components/app/website-kompis/WebsiteKompisPlansPanel.tsx"),
  "utf8"
);
assert.doesNotMatch(panel, /create-checkout-session|STRIPE_|70\/150|fake/i);
assert.match(panel, /usageUnavailable|plannedBadge|checkoutEnabled/);

const frozen = JSON.parse(
  readFileSync(
    join(process.cwd(), "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
    "utf8"
  )
) as { protectedRuntimeFiles: string[] };
assert.equal(frozen.protectedRuntimeFiles.length, 46);

console.log("website-kompis-plans/catalog.test.ts: all assertions passed");
