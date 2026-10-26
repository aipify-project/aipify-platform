import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import Module from "node:module";
import { join } from "node:path";
import { CORE_LOCALES } from "@/lib/i18n/config";
import {
  KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED,
  KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES,
  proposePublicContentLocale,
} from "@/lib/kompis-content-languages/proposed-public-locale";
import { buildWebsiteKompisMissingConcreteCostGapAnswer } from "@/lib/marketing/website-kompis-public-answer-policy";
import {
  buildWebsiteKompisAskPayload,
  sanitizeWebsiteKompisEmbedLocale,
  type WebsiteKompisEmbedLocale,
} from "@/lib/marketing/website-kompis-embed";
import { resolveWebsiteKompisEmbedUiLabels } from "@/lib/marketing/website-kompis-visitor-tone";
const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

assert.equal(KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED, true);
assert.equal(KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES.length, 30);
assert.equal(new Set(KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES).size, 30);
assert.deepEqual(KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES.slice(0, 6), ["no", "en", "sv", "da", "pl", "uk"]);
assert.deepEqual([...CORE_LOCALES], ["en", "no", "sv", "da", "pl", "uk"]);

const norwegian = JSON.parse(read("locales/no/customer-app/core.json")) as {
  websiteKompisFaq: { locales: Record<string, string> };
};
for (const code of KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES) {
  assert.equal(typeof norwegian.websiteKompisFaq.locales[code], "string");
  const selected = proposePublicContentLocale({ messageLocale: code, omittedFallback: "en" });
  assert.equal(selected.wired, true);
  assert.equal(selected.source, "message");
  assert.equal(selected.contentLocale, code);
  assert.equal(selected.responseLocale, code);
  assert.equal(selected.fallback, "none");
  assert.deepEqual(
    selected.retrievalLocales,
    code === "en"
      ? ["en"]
      : code === "sv"
        ? ["sv", "se", "en"]
        : code === "da"
          ? ["da", "dk", "en"]
          : [code, "en"],
  );
}

for (const [raw, code] of [
  ["de", "de"],
  ["de-AT", "de"],
  ["fr", "fr"],
  ["es", "es"],
  ["pt", "pt"],
  ["zh", "zh"],
  ["nb-NO", "no"],
  ["nn", "no"],
  ["ja", "ja"],
] as const) {
  assert.equal(proposePublicContentLocale({ pageLocale: raw, omittedFallback: "no" }).contentLocale, code);
}

for (const rejected of ["pt-BR", "pt-PT", "zh-Hans", "zh-Hant", "zh-CN", "zh-TW", "<script>", "x".repeat(40), "xx"]) {
  const plan = proposePublicContentLocale({ messageLocale: rejected, omittedFallback: "no" });
  assert.equal(plan.contentLocale, "en");
  assert.equal(plan.fallback, "unsupported_explicit_to_english");
  assert.notEqual(plan.contentLocale, "no");
}

assert.equal(proposePublicContentLocale({ omittedFallback: "no" }).contentLocale, "no");
assert.equal(proposePublicContentLocale({ omittedFallback: "en" }).contentLocale, "en");
assert.equal(proposePublicContentLocale({ pageLocale: "se", omittedFallback: "no" }).contentLocale, "sv");
assert.equal(proposePublicContentLocale({ pageLocale: "se-SE", omittedFallback: "no" }).contentLocale, "sv");
assert.equal(proposePublicContentLocale({ pageLocale: "dk", omittedFallback: "no" }).contentLocale, "da");
assert.equal(proposePublicContentLocale({ pageLocale: "sv-SE", omittedFallback: "no" }).contentLocale, "sv");
assert.equal(proposePublicContentLocale({ pageLocale: "se", omittedFallback: "no" }).fallback, "none");
assert.notEqual(proposePublicContentLocale({ pageLocale: "se", omittedFallback: "no" }).contentLocale, "no");
assert.equal(
  proposePublicContentLocale({
    messageLocale: "de",
    pageLocale: "fr",
    siteDefaultLocale: "es",
    omittedFallback: "en",
  }).contentLocale,
  "de",
);
assert.equal(
  proposePublicContentLocale({ pageLocale: "fr", siteDefaultLocale: "es", omittedFallback: "en" }).source,
  "page",
);

assert.equal(
  proposePublicContentLocale({ pageLocale: "xx", siteDefaultLocale: "de", omittedFallback: "en" }).contentLocale,
  "de",
);
assert.equal(
  proposePublicContentLocale({ pageLocale: "pt-BR", siteDefaultLocale: "de", omittedFallback: "no" }).contentLocale,
  "en",
);
assert.equal(
  proposePublicContentLocale({ messageLocale: " DE ", omittedFallback: "en" }).contentLocale,
  "de",
);

const exampleInstallId = "11111111-1111-4111-8111-111111111111";
const exampleDomain = "customer.example";
for (const code of ["no", "en", "de", "fr", "es", "pt", "zh", "ja", "ar", "he"] as const) {
  const payload = buildWebsiteKompisAskPayload({
    question: "Harmless public question",
    locale: "en",
    contentLocale: code,
    domain: exampleDomain,
    installId: exampleInstallId,
  });
  assert.equal(payload.locale, code);
}
assert.equal(
  buildWebsiteKompisAskPayload({
    question: "Harmless public question",
    locale: "en",
    contentLocale: "zh-Hans",
    domain: exampleDomain,
    installId: exampleInstallId,
  }).locale,
  "en",
);
assert.equal(
  buildWebsiteKompisAskPayload({
    question: "Harmless public question",
    locale: "no",
    contentLocale: null,
    domain: exampleDomain,
    installId: exampleInstallId,
  }).locale,
  undefined,
);
assert.equal(sanitizeWebsiteKompisEmbedLocale("de"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("ja"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("zh"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("nb-NO"), "no");
assert.equal(sanitizeWebsiteKompisEmbedLocale(""), "no");
assert.equal(resolveWebsiteKompisEmbedUiLabels({ locale: "en" }).open, "Open Kompis");
assert.equal(resolveWebsiteKompisEmbedUiLabels({ locale: "no" }).open, "Åpne Kompis");
assert.equal(
  resolveWebsiteKompisEmbedUiLabels({ locale: "de" as WebsiteKompisEmbedLocale }).open,
  "Open Kompis",
);
assert.match(
  buildWebsiteKompisMissingConcreteCostGapAnswer({ locale: "de" }).directAnswer,
  /cannot find a concrete price/i,
);
assert.match(
  buildWebsiteKompisMissingConcreteCostGapAnswer({ locale: "ja" }).directAnswer,
  /cannot find a concrete price/i,
);
assert.match(
  buildWebsiteKompisMissingConcreteCostGapAnswer({ locale: "no" }).directAnswer,
  /Jeg finner ikke et konkret poengtall/,
);
assert.match(
  buildWebsiteKompisMissingConcreteCostGapAnswer({ locale: "es" }).directAnswer,
  /Jeg finner ikke et konkret poengtall/,
);

const embed = read("lib/marketing/website-kompis-embed.ts");
assert.match(embed, /WEBSITE_KOMPIS_EMBED_LOCALES = \[\s*"en",\s*"no",\s*"sv",\s*"da",\s*"pl",\s*"uk",\s*\]/);
assert.match(embed, /proposePublicContentLocale/);
assert.match(embed, /sanitizeWebsiteKompisEmbedLocale/);
const installConfig = read("lib/marketing/website-kompis-install-config.ts");
assert.match(installConfig, /canonicalFaqContentLanguage/);
assert.doesNotMatch(installConfig, /new Set\(\["en", "no", "sv", "da", "pl", "uk", "es"\]\)/);
const ask = read("lib/marketing/public-companion-ask.ts");
assert.match(ask, /proposePublicContentLocale/);
assert.match(ask, /explicitContentLocale/);
assert.match(ask, /input\.searchTenantVisitorKnowledge\(\{[\s\S]{0,400}locale: input\.locale/);
const loader = read("public/embed/website-kompis.js");
assert.match(loader, /function readContentLocaleCandidate/);
assert.match(loader, /function resolveContentLocaleCandidate/);
assert.match(loader, /SUPPORTED_EMBED_LOCALES/);
assert.doesNotMatch(loader, /FAQ_CONTENT_LANGUAGE_CODES/);
assert.match(read("lib/marketing/website-kompis-public-answer-policy.ts"), /locale === "no" \|\| locale === "es"/);
assert.match(read("lib/marketing/website-kompis-visitor-tone.ts"), /EMBED_UI_SHELL\[locale\] \?\? EMBED_UI_SHELL\.en/);
assert.match(read("lib/marketing/website-kompis-visitor-tone.ts"), /function canonicalVisitorLocale/);
assert.match(read("lib/marketing/website-kompis-visitor-tone.ts"), /base === "se" \|\| base === "sv"/);
assert.match(read("components/embed/WebsiteKompisEmbedWidget.tsx"), /contentLocale: askPageContext/);
assert.match(read("components/embed/WebsiteKompisEmbedWidget.tsx"), /dir="auto"/);
assert.match(read("components/embed/WebsiteKompisEmbedWidget.tsx"), /sanitizeWebsiteKompisEmbedLocale\(nextPageContext\.locale\)/);

const retrieval = read("supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql");
assert.match(retrieval, /f\.status = 'published'/);
assert.match(retrieval, /f\.public_safe = true/);
assert.match(retrieval, /f\.locale in \(v_locale, 'en'\)/);
assert.match(retrieval, /f\.valid_until is null or f\.valid_until >= now\(\)/);
assert.match(retrieval, /s\.tenant_id = f\.tenant_id/);

const manifest = JSON.parse(read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")) as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
const REBASELINED_HOST_LOCALE_PATHS = new Set([
  "public/embed/website-kompis.js",
  "lib/marketing/website-kompis-embed.ts",
  "lib/marketing/website-kompis-visitor-tone.ts",
  "lib/marketing/website-kompis-public-site-index/locale-contract.ts",
  "lib/marketing/website-kompis-public-site-index/answer.ts",
]);
/** Manifest drift already present on origin/main before this language delta. Not edited here. */
const PREEXISTING_MANIFEST_DRIFT = new Set([
  "components/embed/WebsiteKompisEmbedWidget.tsx",
  "lib/marketing/public-companion-ask.ts",
  "lib/marketing/website-kompis-answer-feedback-server.ts",
  "lib/marketing/website-kompis-install-config.ts",
  "lib/marketing/website-kompis-public-answer-policy.ts",
]);
assert.equal(manifest.protectedRuntimeFiles.length, 46);
const observedDrift: string[] = [];
for (const entry of manifest.protectedRuntimeFiles) {
  assert.notEqual(entry.path, "lib/kompis-content-languages/proposed-public-locale.ts");
  const digest = createHash("sha256").update(readFileSync(join(root, entry.path))).digest("hex");
  if (REBASELINED_HOST_LOCALE_PATHS.has(entry.path)) {
    assert.equal(digest, entry.sha256, entry.path);
    continue;
  }
  if (digest !== entry.sha256) observedDrift.push(entry.path);
}
assert.deepEqual(observedDrift.sort(), [...PREEXISTING_MANIFEST_DRIFT].sort());

const APPROVED_SOURCE_SELECTION_SHA256: Record<string, string> = {
  "lib/marketing/public-companion-ask.ts": "0fdb705237747f0c6be089e388f4558aa63a431f7c66b7531cb22aeef083fe3a",
  "lib/marketing/public-companion-tenant-faq.ts": "2aff5fc9b817b74f62e5eb2c9e18d430a5a633a8b7cdc0a6f0f21e635892f8ae",
  "lib/marketing/website-kompis-public-page-context.ts": "998c6297826e264681dc5cefc1e52231a5a561bd644e9cb5145836c03f0bd01b",
  "lib/marketing/website-kompis-grounded-answer.ts": "e5ae1f56289c7892d93bd5d729038ed153c2fd4a1ac09c31ad8d0782daed6c82",
  "lib/marketing/website-kompis-public-boundary.ts": "33d11e807f80f2458d23b82b26aa9fdb793c5a6a56051923f2f2ca1e14ff79ca",
};
/** Delivered Evidence Gate hash. The 2026-10-24 map above stays the older baseline. */
const EVIDENCE_GATE_DELIVERED_PATH = "lib/marketing/website-kompis-grounded-answer.ts";
const EVIDENCE_GATE_DELIVERED_SHA256 =
  "aa8a0ed816cfac3bccb0beb97595a905b5eafa8e04044092b888a6dfb818932f";
const EVIDENCE_GATE_DELIVERED_PATCH_SHA256 =
  "19eb6f4104e9d98c532abcb653595f66e24a08c5f95e7ba17d177de48d158b19";
const EVIDENCE_GATE_DELIVERED_DIFF_SHA256 =
  "1d43f5ad36200c5638ab945c7cd631bfebe68fda1fc1e3058f043655b5d5305b";
/** Live Context Evidence file. The Evidence Gate record stays the older closed candidate. */
const CONTEXT_EVIDENCE_LIVE_SHA256 =
  "23275200aa4fa298d86a04223cf5ae0bab2819ace50ba5c21a9087aacd40ce26";
const CONTEXT_EVIDENCE_LIVE_PATCH_SHA256 =
  "1490dc6991082886c7e7ef1693e6d7615a91031ea272f28962470b5ebca16456";
const CONTEXT_EVIDENCE_LIVE_DIFF_SHA256 =
  "d763b6c670fa13e399c571533a98a111e3869790803c2f51363446b3e128eeec";
/** Prepared Safety Intent hashes. Context Evidence stays the previous live baseline. */
const SAFETY_INTENT_RETRIEVAL_PATH = "lib/marketing/website-kompis-retrieval-intent.ts";
const SAFETY_INTENT_PREPARED_RETRIEVAL_SHA256 =
  "ae945bfcb4c8292ab103bbb54ed6b8f0023f2bd50feb6c03892f31b3529fd8c9";
const SAFETY_INTENT_PREPARED_GROUNDED_SHA256 =
  "ad156f3d5edde47e684def3d3b0434502d0174c4e4eaac2cfbba33390f2c5391";
const SAFETY_INTENT_PRODUCT_PATCH_SHA256 =
  "f1687308908056cbc3175bb6ec6a2bbf7a29aa27cee2f9ed6dfba7987235a21b";
const manifestByPath = Object.fromEntries(manifest.protectedRuntimeFiles.map((entry) => [entry.path, entry.sha256]));
for (const [filePath, approvedSha] of Object.entries(APPROVED_SOURCE_SELECTION_SHA256)) {
  const digest = createHash("sha256").update(read(filePath)).digest("hex");
  if (filePath === EVIDENCE_GATE_DELIVERED_PATH) {
    assert.equal(approvedSha, "e5ae1f56289c7892d93bd5d729038ed153c2fd4a1ac09c31ad8d0782daed6c82", filePath);
    assert.notEqual(digest, approvedSha, filePath);
    assert.notEqual(digest, EVIDENCE_GATE_DELIVERED_SHA256, filePath);
    assert.notEqual(digest, CONTEXT_EVIDENCE_LIVE_SHA256, filePath);
    assert.equal(digest, SAFETY_INTENT_PREPARED_GROUNDED_SHA256, filePath);
    assert.equal(manifestByPath[filePath], SAFETY_INTENT_PREPARED_GROUNDED_SHA256, filePath);
    continue;
  }
  assert.equal(digest, approvedSha, filePath);
  if (filePath === "lib/marketing/public-companion-ask.ts") {
    assert.equal(manifestByPath[filePath], "4ec48ee373ab7dc11bf39f07abff0317708c89df265513517499988ae9575682");
  } else {
    assert.equal(manifestByPath[filePath], approvedSha, filePath);
  }
}
assert.equal(
  createHash("sha256").update(read(SAFETY_INTENT_RETRIEVAL_PATH)).digest("hex"),
  SAFETY_INTENT_PREPARED_RETRIEVAL_SHA256,
);
assert.equal(manifestByPath[SAFETY_INTENT_RETRIEVAL_PATH], SAFETY_INTENT_PREPARED_RETRIEVAL_SHA256);
const driftLedger = JSON.parse(read("docs/integrations/website-kompis-public-chain-observed-drift.json")) as {
  pendingOwnerCandidate?: { status: string };
  contextEvidencePreparation?: { live?: boolean };
  pendingSafetyIntentCandidate?: {
    status: string;
    names: string;
    live: boolean;
    filesArrayUnchanged: boolean;
    runtimeFiles: string[];
    baselineSha256: Record<string, string>;
    proposedSha256: Record<string, string>;
    productPatchSha256: string;
    ownerApproval?: string;
    pullRequest?: string;
    productionDeployment?: string;
  };
  closedContextEvidenceCandidate?: {
    status: string;
    file: string;
    baselineSha256: string;
    proposedSha256: string;
    productPatchSha256: string;
    combinedDiffSha256: string;
    preparationApproval: string;
    ownerApproval: string;
    pullRequest: string;
    mergeCommit: string;
    productionDeployment: string;
    productionAlias: string;
    productionReadyState: string;
    filesArrayUnchanged: boolean;
    live?: boolean;
    publicQa: {
      questions: string[];
      verifiedRoutes: string[];
      membershipFollowUpAlsoReturned: string;
      isolatedPriceQuestionSourceCount: number;
      inventedPrice: boolean;
      answerPath: string;
      visualWidgetQa: string;
    };
  };
  closedOwnerCandidate?: {
    status: string;
    file: string;
    baselineSha256: string;
    proposedSha256: string;
    productPatchSha256: string;
    combinedDiffSha256: string;
    pullRequest: string;
    mergeCommit: string;
    productionDeployment: string;
    productionAlias: string;
    productionReadyState: string;
    publicQa: { questions: string[]; verifiedRoutes: string[] };
  };
  sourceSelectionApproval: { productPatchSha256: string };
  files: Array<{ path: string; manifestSha256: string; observedSha256: string; previousObservedSha256?: string }>;
};
assert.equal(driftLedger.pendingOwnerCandidate, undefined);
assert.equal(driftLedger.pendingSafetyIntentCandidate?.status, "pending exact owner approval");
assert.equal(driftLedger.pendingSafetyIntentCandidate?.names, "Website Kompis Public Chain");
assert.equal(driftLedger.pendingSafetyIntentCandidate?.live, false);
assert.equal(driftLedger.pendingSafetyIntentCandidate?.filesArrayUnchanged, true);
assert.equal(driftLedger.pendingSafetyIntentCandidate?.ownerApproval, undefined);
assert.equal(driftLedger.pendingSafetyIntentCandidate?.pullRequest, undefined);
assert.equal(driftLedger.pendingSafetyIntentCandidate?.productionDeployment, undefined);
assert.deepEqual(driftLedger.pendingSafetyIntentCandidate?.runtimeFiles, [
  SAFETY_INTENT_RETRIEVAL_PATH,
  EVIDENCE_GATE_DELIVERED_PATH,
]);
assert.equal(
  driftLedger.pendingSafetyIntentCandidate?.baselineSha256[SAFETY_INTENT_RETRIEVAL_PATH],
  "b37d7558f9a5903da6cb73c742870ce07457d1bb02bc02a2928378d342f29940",
);
assert.equal(
  driftLedger.pendingSafetyIntentCandidate?.baselineSha256[EVIDENCE_GATE_DELIVERED_PATH],
  CONTEXT_EVIDENCE_LIVE_SHA256,
);
assert.equal(
  driftLedger.pendingSafetyIntentCandidate?.proposedSha256[SAFETY_INTENT_RETRIEVAL_PATH],
  SAFETY_INTENT_PREPARED_RETRIEVAL_SHA256,
);
assert.equal(
  driftLedger.pendingSafetyIntentCandidate?.proposedSha256[EVIDENCE_GATE_DELIVERED_PATH],
  SAFETY_INTENT_PREPARED_GROUNDED_SHA256,
);
assert.equal(
  driftLedger.pendingSafetyIntentCandidate?.productPatchSha256,
  SAFETY_INTENT_PRODUCT_PATCH_SHA256,
);
assert.equal(
  driftLedger.files.some((file) => file.path === SAFETY_INTENT_RETRIEVAL_PATH),
  false,
);
assert.equal(driftLedger.contextEvidencePreparation, undefined);
assert.equal(driftLedger.closedContextEvidenceCandidate?.status, "owner approved and live");
assert.equal(driftLedger.closedContextEvidenceCandidate?.file, EVIDENCE_GATE_DELIVERED_PATH);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.baselineSha256,
  EVIDENCE_GATE_DELIVERED_SHA256,
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.proposedSha256,
  CONTEXT_EVIDENCE_LIVE_SHA256,
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.productPatchSha256,
  CONTEXT_EVIDENCE_LIVE_PATCH_SHA256,
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.combinedDiffSha256,
  CONTEXT_EVIDENCE_LIVE_DIFF_SHA256,
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.preparationApproval,
  "AIPIFY_KOMPIS_CORE_CONTEXT_EVIDENCE_V1_APPROVED_PREP_AND_BUILD_20261026",
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.ownerApproval,
  "AIPIFY_KOMPIS_CORE_CONTEXT_EVIDENCE_V1_APPROVED_RELEASE_LIVE_20261026",
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.pullRequest,
  "https://github.com/aipify-project/aipify-platform/pull/326",
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.mergeCommit,
  "73679611fc50aacb4094808f2aaa8ec7eabcd85d",
);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.productionDeployment,
  "dpl_7CSrWyAHWH9WhWnvjVvEweAwHpMg",
);
assert.equal(driftLedger.closedContextEvidenceCandidate?.productionAlias, "aipify.ai");
assert.equal(driftLedger.closedContextEvidenceCandidate?.productionReadyState, "READY");
assert.equal(driftLedger.closedContextEvidenceCandidate?.live, undefined);
assert.equal(driftLedger.closedContextEvidenceCandidate?.filesArrayUnchanged, true);
assert.deepEqual(driftLedger.closedContextEvidenceCandidate?.publicQa.questions, [
  "Hva er medlemskap?",
  "Hva koster den?",
  "Hvordan gir jeg en presang?",
  "presang",
]);
assert.deepEqual(driftLedger.closedContextEvidenceCandidate?.publicQa.verifiedRoutes, [
  "/no/premium",
  "/no/membership-guide",
  "/no/gift-guide",
  "/no/how-gifting-works",
]);
assert.equal(
  driftLedger.closedContextEvidenceCandidate?.publicQa.membershipFollowUpAlsoReturned,
  "/no/faq/marketplace-listing-push",
);
assert.equal(driftLedger.closedContextEvidenceCandidate?.publicQa.isolatedPriceQuestionSourceCount, 0);
assert.equal(driftLedger.closedContextEvidenceCandidate?.publicQa.inventedPrice, false);
assert.equal(driftLedger.closedContextEvidenceCandidate?.publicQa.answerPath, "NOT_MEASURED");
assert.equal(driftLedger.closedContextEvidenceCandidate?.publicQa.visualWidgetQa, "BROWSER_BLOCKED");
assert.equal(driftLedger.closedOwnerCandidate?.status, "owner approved and live");
assert.equal(driftLedger.closedOwnerCandidate?.file, EVIDENCE_GATE_DELIVERED_PATH);
assert.equal(
  driftLedger.closedOwnerCandidate?.baselineSha256,
  APPROVED_SOURCE_SELECTION_SHA256[EVIDENCE_GATE_DELIVERED_PATH],
);
assert.equal(driftLedger.closedOwnerCandidate?.proposedSha256, EVIDENCE_GATE_DELIVERED_SHA256);
assert.equal(driftLedger.closedOwnerCandidate?.productPatchSha256, EVIDENCE_GATE_DELIVERED_PATCH_SHA256);
assert.equal(driftLedger.closedOwnerCandidate?.combinedDiffSha256, EVIDENCE_GATE_DELIVERED_DIFF_SHA256);
assert.equal(
  driftLedger.closedOwnerCandidate?.pullRequest,
  "https://github.com/aipify-project/aipify-platform/pull/324",
);
assert.equal(driftLedger.closedOwnerCandidate?.mergeCommit, "4e730cc33c508e60f70fedeaf7e040eb0a795142");
assert.equal(driftLedger.closedOwnerCandidate?.productionDeployment, "dpl_J7mup54A4Nxhv9wbeEDdZcgyWuFb");
assert.equal(driftLedger.closedOwnerCandidate?.productionAlias, "aipify.ai");
assert.equal(driftLedger.closedOwnerCandidate?.productionReadyState, "READY");
assert.deepEqual(driftLedger.closedOwnerCandidate?.publicQa.questions, [
  "Hvordan gir jeg en presang?",
  "presang",
]);
assert.deepEqual(driftLedger.closedOwnerCandidate?.publicQa.verifiedRoutes, [
  "/no/gift-guide",
  "/no/how-gifting-works",
]);
assert.equal(
  driftLedger.sourceSelectionApproval.productPatchSha256,
  "ebfe937e840e230b84cbbba1b96744070199862080a991ae7f1f696d85d40e12",
);
assert.deepEqual(
  driftLedger.files.map((file) => file.path),
  [
    "components/embed/WebsiteKompisEmbedWidget.tsx",
    "lib/marketing/public-companion-ask.ts",
    "lib/marketing/website-kompis-public-answer-policy.ts",
    "lib/marketing/website-kompis-install-config.ts",
    "lib/marketing/website-kompis-answer-feedback-server.ts",
  ],
);
assert.equal(driftLedger.files.some((file) => file.path === EVIDENCE_GATE_DELIVERED_PATH), false);
const askDrift = driftLedger.files.find((file) => file.path === "lib/marketing/public-companion-ask.ts");
assert.equal(askDrift?.observedSha256, APPROVED_SOURCE_SELECTION_SHA256["lib/marketing/public-companion-ask.ts"]);
assert.equal(askDrift?.previousObservedSha256, "ea6f4ec0250339b24a63313d5c87b5c8179b4862e14e31e1964bf9f215f52928");
assert.equal(askDrift?.manifestSha256, "4ec48ee373ab7dc11bf39f07abff0317708c89df265513517499988ae9575682");

async function proveAskRouteLocale() {
  const require = createRequire(join(root, "lib/kompis-content-languages/proposed-public-locale.contract.test.ts"));
  const moduleWithResolve = Module as unknown as {
    _resolveFilename: (request: string, parent: unknown, isMain: boolean, options: unknown) => string;
  };
  const originalResolve = moduleWithResolve._resolveFilename;
  moduleWithResolve._resolveFilename = function resolveWithServerOnlyStub(
    request: string,
    parent: unknown,
    isMain: boolean,
    options: unknown,
  ) {
    if (request === "server-only") return require.resolve("./server-only-empty.cjs");
    return originalResolve.call(this, request, parent, isMain, options);
  };

  const askModule = await import("@/lib/marketing/public-companion-ask");
  const installModule = await import("@/lib/marketing/website-kompis-install-config");

assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "de" }).defaultLocale, "de");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "de" }).explicitContentLocale, "de");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "de-AT" }).defaultLocale, "de");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "nb-NO" }).defaultLocale, "no");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "pt-BR" }).explicitContentLocale, null);
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "pt-BR" }).defaultLocale, "no");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "zh-Hans" }).defaultLocale, "no");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "zh-Hant" }).defaultLocale, "no");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "zh-CN" }).defaultLocale, "no");
assert.equal(installModule.normalizeWebsiteKompisInstallConfig({ defaultLocale: "zh-TW" }).defaultLocale, "no");

assert.throws(
  () =>
    askModule.validatePublicCompanionAskRequest({
      question: "Harmless public question",
      locale: "de",
      tenantId: "other-tenant",
    }),
  /Invalid request field/,
);

const capturedSearches: Array<{ locale: string; installId: string | null; domain: string | null }> = [];

async function expectSearchLocale(input: {
  locale?: string;
  messageLocale?: string;
  pageLocale?: string;
  installId?: string;
  domain?: string;
  siteDefault?: string | null;
}) {
  const installId = input.installId ?? exampleInstallId;
  const domain = input.domain ?? exampleDomain;
  await assert.rejects(
    () =>
      askModule.askPublicPlatformCompanion(
        {
          question: "Harmless public question about opening hours",
          locale: input.locale,
          messageLocale: input.messageLocale,
          domain,
          installId,
          pageContext: input.pageLocale
            ? { pathname: "/help", surface: "public", locale: input.pageLocale }
            : undefined,
        },
        {
          loadInstallConfig: async () => ({
            enabled: true,
            defaultLocale: input.siteDefault ?? undefined,
            sources: {
              faq: true,
              currentPage: false,
              publicSiteIndex: false,
              aipifyPublic: false,
            },
          }),
          resolveLicensedAvailability: async () => ({ available: true, reason: "available" as const }),
          searchTenantVisitorKnowledge: async (query) => {
            capturedSearches.push({
              locale: query.locale,
              installId: query.installId ?? null,
              domain: query.domain ?? null,
            });
            throw new Error("stop-after-locale");
          },
        },
      ),
    /stop-after-locale/,
  );
}

for (const code of KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES) {
  const before = capturedSearches.length;
  await expectSearchLocale({ messageLocale: code, siteDefault: "en" });
  assert.equal(capturedSearches.at(-1)?.locale, code, code);
  assert.equal(capturedSearches.length, before + 1);
}

await expectSearchLocale({ pageLocale: "de", siteDefault: "fr" });
assert.equal(capturedSearches.at(-1)?.locale, "de");
await expectSearchLocale({ messageLocale: "ja", pageLocale: "de", siteDefault: "fr" });
assert.equal(capturedSearches.at(-1)?.locale, "ja");
await expectSearchLocale({ siteDefault: "de" });
assert.equal(capturedSearches.at(-1)?.locale, "de");
await expectSearchLocale({ messageLocale: "pt-BR", siteDefault: "de" });
assert.equal(capturedSearches.at(-1)?.locale, "en");
await expectSearchLocale({ messageLocale: "zh-Hans", siteDefault: "de" });
assert.equal(capturedSearches.at(-1)?.locale, "en");
await expectSearchLocale({ messageLocale: "<script>alert(1)</script>", siteDefault: "de" });
assert.equal(capturedSearches.at(-1)?.locale, "en");
await expectSearchLocale({});
assert.equal(capturedSearches.at(-1)?.locale, "no");

const otherInstallId = "22222222-2222-4222-8222-222222222222";
await expectSearchLocale({
  messageLocale: "de",
  installId: otherInstallId,
  domain: "other.example",
});
assert.equal(capturedSearches.at(-1)?.installId, otherInstallId);
assert.equal(capturedSearches.at(-1)?.domain, "other.example");
assert.equal(capturedSearches.at(-2)?.installId, exampleInstallId);
  assert.notEqual(capturedSearches.at(-1)?.installId, capturedSearches.at(-2)?.installId);
}

void proveAskRouteLocale().then(
  () => {
    console.log("proposed-public-locale.contract.test.ts: ok");
  },
  (error: unknown) => {
    console.error(error);
    process.exit(1);
  },
);
