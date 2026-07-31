import assert from "node:assert/strict";
import {
  assertStatusLabelCapitalized,
  buildSeoFindingDedupeKey,
  dedupeWebsiteSeoFindings,
  presentWebsiteDraftRows,
  resolveContentLocaleLabel,
  resolveKompisResultSummary,
  resolveKompisWebsiteStatusLabel,
  resolvePublishCapabilityPresentation,
  resolveRuntimeBusinessStatus,
  shortenTechnicalId,
} from "./website-presentation";

const NO_STATUSES: Record<string, string> = {
  active: "Aktiv",
  completed: "Fullført",
  failed: "Mislyktes",
  awaitingApproval: "Venter på godkjenning",
  ready: "Klar",
  draft: "Utkast",
  published: "Publisert",
  superseded: "Erstattet",
  unknown: "Ukjent status",
};

const NO_LOCALES: Record<string, string> = {
  english: "Engelsk",
  norwegian: "Norsk",
  unknown: "Ukjent språk",
};

function run() {
  const cases: Array<[string, string]> = [
    ["active", "Aktiv"],
    ["completed", "Fullført"],
    ["failed", "Mislyktes"],
    ["awaiting_approval", "Venter på godkjenning"],
    ["ready", "Klar"],
    ["draft", "Utkast"],
    ["published", "Publisert"],
    ["superseded", "Erstattet"],
  ];
  for (const [raw, expected] of cases) {
    const label = resolveKompisWebsiteStatusLabel(raw, NO_STATUSES, NO_STATUSES.unknown);
    assert.equal(label, expected);
    assert.equal(assertStatusLabelCapitalized(label), true);
    assert.notEqual(label, raw);
  }

  assert.equal(resolveContentLocaleLabel("en", NO_LOCALES, NO_LOCALES.unknown), "Engelsk");
  assert.equal(resolveContentLocaleLabel("no", NO_LOCALES, NO_LOCALES.unknown), "Norsk");

  const rows = presentWebsiteDraftRows([
    { id: "a", title: "QA", locale: "en", status: "draft", version: 1 },
    { id: "a", title: "QA", locale: "en", status: "draft", version: 1 },
    { id: "b", title: "QA", locale: "en", status: "draft", version: 2 },
  ]);
  assert.equal(rows.length, 2);

  const findings = dedupeWebsiteSeoFindings([
    {
      code: "missing_meta_description",
      severity: "warning",
      pageId: "p1",
      locale: "en",
      revision: 1,
      dedupeKey: buildSeoFindingDedupeKey({
        code: "missing_meta_description",
        pageId: "p1",
        locale: "en",
        revision: 1,
      }),
    },
    {
      code: "missing_meta_description",
      severity: "warning",
      pageId: "p1",
      locale: "en",
      revision: 1,
      dedupeKey: buildSeoFindingDedupeKey({
        code: "missing_meta_description",
        pageId: "p1",
        locale: "en",
        revision: 1,
      }),
    },
  ]);
  assert.equal(findings.length, 1);

  const ready = resolvePublishCapabilityPresentation({
    organizationReady: true,
    appAccessValid: true,
    websiteKompisEntitled: true,
    canonicalDeliveryValid: true,
    websiteExists: true,
    domainInstallationValid: true,
    hasMountedPath: true,
    publishToolAllowed: true,
    cmsPublishContractAvailable: true,
    conflictingOperation: false,
    expectedCurrentVersionAvailable: true,
    approvalContractAvailable: true,
    coreApprovalRequired: true,
  });
  assert.equal(ready.code, "publish_requires_approval");

  assert.equal(
    resolveRuntimeBusinessStatus({
      websiteProvisioned: true,
      mountedPaths: ["/aipify-cms-qa"],
      activeVersionNumber: 1,
      acknowledgementStatus: "verified",
      httpStatus: "verified",
      fullyVerified: true,
    }),
    "fully_verified",
  );

  const id = "180c9d31-3340-4633-b210-3b64edf1e1be";
  assert.notEqual(shortenTechnicalId(id), id);

  const knowledge = resolveKompisResultSummary(
    "knowledge_search_failed",
    {
      knowledge_search_failed:
        "Kompis fikk ikke tilgang til en autorisert kunnskapskilde. Kontroller at kilden er aktiv og prøv på nytt.",
    },
    "fallback",
  );
  assert.match(knowledge, /kunnskapskilde/i);
  assert.notEqual(knowledge, "Task stopped before all steps completed.");

  console.log("website-authoritative-presentation.test.ts: ok");
}

run();
