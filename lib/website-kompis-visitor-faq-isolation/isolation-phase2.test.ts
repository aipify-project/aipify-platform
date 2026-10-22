import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  WEBSITE_KOMPIS_VISITOR_FAQ_CURRENT_LEAK_SQL_FRAGMENT,
  WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_STATUS,
  WEBSITE_KOMPIS_VISITOR_FAQ_LEGACY_NULL_POLICY,
  shouldIncludeFaqRowForVisitor,
} from "./policy";
import { WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_REOPEN_REQUEST } from "./controlled-reopen-request";
import { filterWebsiteKompisFaqItemsForSiteContext } from "@/lib/website-kompis-site-context/filter";

const ROOT = process.cwd();

// Target policy: single-site keeps legacy NULL
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: null,
    resolvedInstallId: "11111111-1111-4111-8111-111111111111",
    tenantActiveVerifiedInstallCount: 1,
    contextTrusted: true,
  }),
  true,
);

// Target policy: multi-site denies legacy NULL bleed
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: null,
    resolvedInstallId: "11111111-1111-4111-8111-111111111111",
    tenantActiveVerifiedInstallCount: 2,
    contextTrusted: true,
  }),
  false,
);

// Exact install match always allowed when trusted
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: "22222222-2222-4222-8222-222222222222",
    resolvedInstallId: "22222222-2222-4222-8222-222222222222",
    tenantActiveVerifiedInstallCount: 2,
    contextTrusted: true,
  }),
  true,
);

// Other install denied
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: "11111111-1111-4111-8111-111111111111",
    resolvedInstallId: "22222222-2222-4222-8222-222222222222",
    tenantActiveVerifiedInstallCount: 2,
    contextTrusted: true,
  }),
  false,
);

// Untrusted / missing install fail closed
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: null,
    resolvedInstallId: null,
    tenantActiveVerifiedInstallCount: 1,
    contextTrusted: false,
  }),
  false,
);

assert.equal(
  WEBSITE_KOMPIS_VISITOR_FAQ_LEGACY_NULL_POLICY.multiActiveInstall,
  "deny_when_tenant_has_multiple_active_installs",
);
assert.equal(WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_STATUS.coreVisitorIsolation, "live_exact_one_null");
assert.equal(
  shouldIncludeFaqRowForVisitor({
    faqInstallId: null,
    resolvedInstallId: "11111111-1111-4111-8111-111111111111",
    tenantActiveVerifiedInstallCount: 0,
    contextTrusted: true,
  }),
  false,
);
assert.equal(
  WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_REOPEN_REQUEST.title,
  "Website Kompis Public Chain — visitor FAQ isolation Phase 2",
);

// Migration evidence: current leak fragment still present
{
  const widen = readFileSync(
    join(ROOT, "supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql"),
    "utf8",
  );
  assert.match(widen, new RegExp(WEBSITE_KOMPIS_VISITOR_FAQ_CURRENT_LEAK_SQL_FRAGMENT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(widen, /employee_knowledge/i);
}

// Frozen chain still protects ask + tenant FAQ retrieval
{
  const manifest = JSON.parse(
    readFileSync(join(ROOT, "docs/integrations/website-kompis-public-chain-frozen-manifest.json"), "utf8"),
  ) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
  assert.equal(manifest.protectedRuntimeFiles.length, 46);
  const byPath = Object.fromEntries(manifest.protectedRuntimeFiles.map((f) => [f.path, f.sha256]));
  const faqPath = "lib/marketing/public-companion-tenant-faq.ts";
  const askPath = "lib/marketing/public-companion-ask.ts";
  assert.ok(byPath[faqPath]);
  assert.ok(byPath[askPath]);

  const faqHash = createHash("sha256").update(readFileSync(join(ROOT, faqPath))).digest("hex");
  const askHash = createHash("sha256").update(readFileSync(join(ROOT, askPath))).digest("hex");
  assert.equal(faqHash, byPath[faqPath]);
  assert.equal(askHash, byPath[askPath]);
}

// Phase 1 APP filter still fail-closed for multi-site (not re-implemented here)
{
  const items = [
    { id: "a", installId: "11111111-1111-4111-8111-111111111111" },
    { id: "b", installId: "22222222-2222-4222-8222-222222222222" },
    { id: "legacy", installId: null },
  ];
  assert.deepEqual(
    filterWebsiteKompisFaqItemsForSiteContext(items, {
      state: "multi_site",
      selectedInstallId: null,
    }),
    [],
  );
  const forA = filterWebsiteKompisFaqItemsForSiteContext(items, {
    state: "multi_site",
    selectedInstallId: "11111111-1111-4111-8111-111111111111",
  });
  assert.deepEqual(
    forA.map((i) => i.id),
    ["a"],
  );
  const single = filterWebsiteKompisFaqItemsForSiteContext(items, {
    state: "single_site",
    selectedInstallId: "11111111-1111-4111-8111-111111111111",
  });
  assert.deepEqual(
    single.map((i) => i.id),
    ["a", "legacy"],
  );
}

// This phase must not touch frozen runtime files
{
  const reopenTs = readFileSync(
    join(ROOT, "lib/website-kompis-visitor-faq-isolation/controlled-reopen-request.ts"),
    "utf8",
  );
  assert.match(reopenTs, /awaiting_owner_authorization/);
  assert.match(reopenTs, /sql_only_rpc_body_change/);
}

console.log("website-kompis-visitor-faq-isolation/isolation-phase2.test.ts: all assertions passed");
