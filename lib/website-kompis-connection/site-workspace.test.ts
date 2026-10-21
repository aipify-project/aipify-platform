/**
 * Synthetic tenants A and B. A owns A1 and A2. B owns B1.
 * No live customer data and no writes.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { filterWebsiteKompisFaqItemsForSiteContext } from "@/lib/website-kompis-site-context/filter";
import {
  buildConnectionSiteWorkspace,
  connectionDomainIsVerified,
  connectionDomainsForSelection,
} from "@/lib/website-kompis-connection/site-workspace";

const A1 = "11111111-1111-4111-8111-111111111111";
const A2 = "22222222-2222-4222-8222-222222222222";
const B1 = "33333333-3333-4333-8333-333333333333";

const tenantA = [
  {
    installId: A1,
    domain: "a1.example",
    verificationStatus: "verified",
    domainStatus: "active",
  },
  {
    installId: A2,
    domain: "a2.example",
    verificationStatus: "verified",
    domainStatus: "active",
  },
];

const faq = [
  { id: "a1", installId: A1, title: "A1 only" },
  { id: "a2", installId: A2, title: "A2 only" },
  { id: "b1", installId: B1, title: "B1 must never appear" },
  { id: "legacy", installId: null, title: "Legacy shared" },
];

const domainRows = [
  { domainId: "d1", domain: "a1.example", hasInstallId: true },
  { domainId: "d2", domain: "a2.example", hasInstallId: true },
  { domainId: "pending", domain: "pending.example", hasInstallId: false },
];

{
  const empty = buildConnectionSiteWorkspace({ sites: [], requestedInstallId: null });
  assert.equal(empty.state, "no_sites");
  assert.equal(empty.snippet, null);
  assert.equal(empty.snippetBlock, "no_sites");
  assert.equal(empty.selected, null);
}

{
  const first = buildConnectionSiteWorkspace({ sites: tenantA, requestedInstallId: null, locale: "sv" });
  assert.equal(first.state, "choose_site");
  assert.equal(first.selected, null);
  assert.equal(first.snippet, null);
  assert.equal(first.faqScope.selectedInstallId, null);
  assert.deepEqual(filterWebsiteKompisFaqItemsForSiteContext(faq, first.faqScope), []);

  const a2 = buildConnectionSiteWorkspace({ sites: tenantA, requestedInstallId: A2, locale: "se" });
  assert.equal(a2.state, "selected");
  assert.equal(a2.selected?.installId, A2);
  assert.equal(a2.selected?.domain, "a2.example");
  assert.match(a2.snippet ?? "", /data-install-id="22222222-2222-4222-8222-222222222222"/);
  assert.match(a2.snippet ?? "", /data-domain="a2.example"/);
  assert.match(a2.snippet ?? "", /data-locale="sv"/);
  assert.match(a2.snippet ?? "", /src="https:\/\/aipify.ai\/embed\/website-kompis.js"/);
  assert.equal((a2.snippet ?? "").match(/<script/g)?.length, 1);
  assert.deepEqual(
    filterWebsiteKompisFaqItemsForSiteContext(faq, a2.faqScope).map((row) => row.id),
    ["a2", "legacy"],
  );
  assert.deepEqual(
    connectionDomainsForSelection(domainRows, a2).map((row) => row.domainId),
    ["d2", "pending"],
  );

  const back = buildConnectionSiteWorkspace({ sites: tenantA, requestedInstallId: A1, locale: "no" });
  assert.equal(back.selected?.installId, A1);
  assert.match(back.snippet ?? "", /data-install-id="11111111-1111-4111-8111-111111111111"/);
  assert.match(back.snippet ?? "", /data-locale="no"/);
  assert.deepEqual(
    filterWebsiteKompisFaqItemsForSiteContext(faq, back.faqScope).map((row) => row.id),
    ["a1", "legacy"],
  );
  assert.equal(back.snippet, buildConnectionSiteWorkspace({
    sites: tenantA,
    requestedInstallId: A1.toUpperCase(),
    locale: "nb",
  }).snippet);
}

{
  const foreign = buildConnectionSiteWorkspace({
    sites: tenantA,
    requestedInstallId: B1,
    locale: "en",
  });
  assert.equal(foreign.state, "rejected");
  assert.equal(foreign.selected, null);
  assert.equal(foreign.snippet, null);
  const rendered = JSON.stringify(foreign);
  assert.equal(rendered.includes(B1), false);
  assert.equal(rendered.includes("B1 must never appear"), false);
  assert.deepEqual(filterWebsiteKompisFaqItemsForSiteContext(faq, foreign.faqScope), []);
}

{
  const pending = buildConnectionSiteWorkspace({
    sites: [
      {
        installId: A1,
        domain: "https://A1.Example/path",
        verificationStatus: "pending",
        domainStatus: "active",
      },
    ],
    locale: "dk",
  });
  assert.equal(pending.state, "selected");
  assert.equal(pending.selected?.verified, false);
  assert.equal(connectionDomainIsVerified(pending.selected!), false);
  assert.equal(pending.snippet, null);
  assert.equal(pending.snippetBlock, "unverified");
  assert.equal(pending.selected?.normalizedDomain, "a1.example");
}

{
  const primaryIsNotVerification = buildConnectionSiteWorkspace({
    sites: [
      {
        installId: A1,
        domain: "primary.example",
        verificationStatus: "pending",
        domainStatus: "pending",
      },
    ],
  });
  assert.equal(primaryIsNotVerification.selected?.verified, false);
  assert.equal(primaryIsNotVerification.snippet, null);
}

{
  const collision = buildConnectionSiteWorkspace({
    sites: [
      { installId: A1, domain: "WWW.Shared.Example", verificationStatus: "verified", domainStatus: "active" },
      { installId: A2, domain: "www.shared.example", verificationStatus: "verified", domainStatus: "active" },
    ],
    requestedInstallId: A1,
    locale: "da",
  });
  assert.equal(collision.state, "selected");
  assert.equal(collision.snippet, null);
  assert.equal(collision.snippetBlock, "duplicate_domain");
  assert.deepEqual(collision.duplicateDomains, ["www.shared.example"]);
}

{
  const distinct = buildConnectionSiteWorkspace({
    sites: [
      { installId: A1, domain: "example.com", verificationStatus: "verified", domainStatus: "active" },
      { installId: A2, domain: "www.example.com", verificationStatus: "verified", domainStatus: "active" },
    ],
    requestedInstallId: A2,
    locale: "en",
  });
  assert.equal(distinct.snippetBlock, "none");
  assert.match(distinct.snippet ?? "", /data-domain="www.example.com"/);
}

{
  const invalidHost = buildConnectionSiteWorkspace({
    sites: [
      {
        installId: A1,
        domain: "not a host",
        verificationStatus: "verified",
        domainStatus: "active",
      },
    ],
  });
  assert.equal(invalidHost.snippet, null);
  assert.equal(invalidHost.snippetBlock, "invalid_domain");
}

{
  const noManagePage = readFileSync(
    join(process.cwd(), "app/app/website-kompis/connection/page.tsx"),
    "utf8",
  );
  assert.match(noManagePage, /buildConnectionSiteWorkspace/);
  assert.match(noManagePage, /loadWebsiteKompisOwnedSites/);
  assert.doesNotMatch(noManagePage, /performDomainLicenseAction|create_domain|purchase_domain_license/);

  const panel = readFileSync(
    join(process.cwd(), "components/app/website-kompis/WebsiteKompisConnectionCenterPanel.tsx"),
    "utf8",
  );
  assert.match(panel, /copyScript/);
  assert.match(panel, /workspace\.snippet/);
  assert.doesNotMatch(panel, /method:\s*"POST"|create_domain/);
}

console.log("site-workspace.test.ts: OK");
