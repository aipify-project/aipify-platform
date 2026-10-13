import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  annotateWebsiteKompisFaqScope,
  filterWebsiteKompisFaqItemsForSiteContext,
  requireInstallIdForFaqWrite,
  resolveWebsiteKompisSiteContextState,
} from "./filter";
import type { WebsiteKompisOwnedSite } from "./types";
import { WEBSITE_KOMPIS_SITE_SCOPE_FUTURE_SQL_CHANGESET } from "./contract";

const siteA: WebsiteKompisOwnedSite = {
  installId: "11111111-1111-4111-8111-111111111111",
  domain: "www.example.com",
  verificationStatus: "verified",
  domainStatus: "active",
  isPrimaryCandidate: true,
};
const siteB: WebsiteKompisOwnedSite = {
  installId: "22222222-2222-4222-8222-222222222222",
  domain: "shop.example.com",
  verificationStatus: "verified",
  domainStatus: "active",
  isPrimaryCandidate: false,
};

const items = [
  { id: "1", installId: siteA.installId, title: "A only" },
  { id: "2", installId: siteB.installId, title: "B only" },
  { id: "3", installId: null, title: "Legacy shared" },
];

// single site auto-select
{
  const ctx = resolveWebsiteKompisSiteContextState([siteA], null);
  assert.equal(ctx.state, "single_site");
  assert.equal(ctx.selectedInstallId, siteA.installId);
  const filtered = filterWebsiteKompisFaqItemsForSiteContext(items, ctx);
  assert.deepEqual(
    filtered.map((i) => i.id),
    ["1", "3"],
  );
}

// multi site without selection — fail closed
{
  const ctx = resolveWebsiteKompisSiteContextState([siteA, siteB], null);
  assert.equal(ctx.state, "multi_site");
  assert.equal(ctx.selectedInstallId, null);
  assert.deepEqual(filterWebsiteKompisFaqItemsForSiteContext(items, ctx), []);
}

// multi site with selection — site + legacy only
{
  const ctx = resolveWebsiteKompisSiteContextState([siteA, siteB], siteB.installId);
  assert.equal(ctx.selectedInstallId, siteB.installId);
  const filtered = filterWebsiteKompisFaqItemsForSiteContext(items, ctx);
  assert.deepEqual(
    filtered.map((i) => i.id),
    ["2", "3"],
  );
}

// wrong install rejected
{
  const ctx = resolveWebsiteKompisSiteContextState(
    [siteA, siteB],
    "33333333-3333-4333-8333-333333333333",
  );
  assert.equal(ctx.state, "invalid_selection");
  assert.equal(ctx.selectionRejected, true);
  assert.deepEqual(filterWebsiteKompisFaqItemsForSiteContext(items, ctx), []);
}

// same title on different sites remains distinct rows
{
  const twins = [
    { id: "a", installId: siteA.installId, title: "Hours" },
    { id: "b", installId: siteB.installId, title: "Hours" },
  ];
  const ctx = resolveWebsiteKompisSiteContextState([siteA, siteB], siteA.installId);
  const filtered = filterWebsiteKompisFaqItemsForSiteContext(twins, ctx);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]!.id, "a");
}

// write require install on multi-site create
{
  const denied = requireInstallIdForFaqWrite({
    sites: [siteA, siteB],
    requestedInstallId: null,
    isUpdate: false,
    existingInstallId: null,
  });
  assert.equal(denied.ok, false);

  const ok = requireInstallIdForFaqWrite({
    sites: [siteA, siteB],
    requestedInstallId: siteA.installId,
    isUpdate: false,
    existingInstallId: null,
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.installId, siteA.installId);
    assert.equal(ok.domain, siteA.domain);
  }
}

// preserve legacy NULL on update without reassignment
{
  const preserved = requireInstallIdForFaqWrite({
    sites: [siteA, siteB],
    requestedInstallId: null,
    isUpdate: true,
    existingInstallId: null,
  });
  assert.equal(preserved.ok, true);
  if (preserved.ok) assert.equal(preserved.installId, null);
}

// cross-tenant style: not owned
{
  const denied = requireInstallIdForFaqWrite({
    sites: [siteA],
    requestedInstallId: siteB.installId,
    isUpdate: false,
    existingInstallId: null,
  });
  assert.equal(denied.ok, false);
}

{
  const ann = annotateWebsiteKompisFaqScope({ installId: null }, siteA.installId);
  assert.equal(ann.isLegacyTenantGlobal, true);
  assert.equal(ann.scopeKind, "legacy_tenant_global");
}

assert.equal(WEBSITE_KOMPIS_SITE_SCOPE_FUTURE_SQL_CHANGESET.status, "blocked_until_owner_auth");

// frozen public chain untouched by this module
{
  const frozen = JSON.parse(
    readFileSync(
      join(process.cwd(), "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
      "utf8",
    ),
  ) as { protectedRuntimeFiles: string[] };
  assert.equal(frozen.protectedRuntimeFiles.length, 46);

  const faqRoute = readFileSync(
    join(process.cwd(), "app/api/website-kompis/faq/route.ts"),
    "utf8",
  );
  assert.match(faqRoute, /resolveWebsiteKompisSiteContextForRequest|filterWebsiteKompisFaqItemsForSiteContext/);
  assert.doesNotMatch(faqRoute, /employee_knowledge|eke_/i);
}

console.log("website-kompis-site-context/site-context.test.ts: all assertions passed");
