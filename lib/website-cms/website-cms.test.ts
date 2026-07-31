import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function runSchemaTests() {
  const {
    WEBSITE_CMS_BLOCK_TYPES,
    isWebsiteCmsBlockType,
    containsForbiddenWebsiteMarkup,
    validateWebsiteCmsPath,
    validateWebsiteCmsLocale,
    validateWebsiteCmsContentInput,
    validateWebsiteCmsDraftIds,
  } = await import("./schema");

  assert.ok(WEBSITE_CMS_BLOCK_TYPES.includes("heading"));
  assert.equal(isWebsiteCmsBlockType("heading"), true);
  assert.equal(isWebsiteCmsBlockType("video"), false);

  assert.equal(containsForbiddenWebsiteMarkup("<script>alert(1)</script>"), true);
  assert.equal(containsForbiddenWebsiteMarkup("<iframe src=x></iframe>"), true);
  assert.equal(containsForbiddenWebsiteMarkup('<img onerror="alert(1)">'), true);
  assert.equal(containsForbiddenWebsiteMarkup("javascript:alert(1)"), true);
  assert.equal(containsForbiddenWebsiteMarkup("Plain welcome text about our company."), false);

  assert.equal(validateWebsiteCmsPath("/about").ok, true);
  assert.equal(validateWebsiteCmsPath("about").ok, false);
  assert.equal(validateWebsiteCmsPath("/../secret").ok, false);
  assert.equal(validateWebsiteCmsPath("/<script>").ok, false);
  assert.equal(validateWebsiteCmsPath("/x".repeat(150)).ok, false);
  assert.equal(validateWebsiteCmsPath("").ok, false);
  assert.equal(validateWebsiteCmsPath(null).ok, false);

  assert.equal(validateWebsiteCmsLocale("en", ["en", "no"]).ok, true);
  assert.equal(validateWebsiteCmsLocale("zz", ["en", "no"]).ok, false);
  assert.equal(validateWebsiteCmsLocale("", ["en"]).ok, false);

  assert.equal(
    validateWebsiteCmsContentInput({ title: "About us", text: "We build things." }).ok,
    true,
  );
  assert.equal(
    validateWebsiteCmsContentInput({ title: "About", text: '<script>bad()</script>' }).ok,
    false,
  );
  assert.equal(
    validateWebsiteCmsContentInput({ metaDescription: '<iframe src="evil"></iframe>' }).ok,
    false,
  );
  assert.equal(validateWebsiteCmsContentInput({}).ok, true);

  assert.equal(validateWebsiteCmsDraftIds(["a"]).ok, true);
  assert.equal(validateWebsiteCmsDraftIds([]).ok, false);
  assert.equal(validateWebsiteCmsDraftIds(Array.from({ length: 51 }, (_, i) => `d${i}`)).ok, false);
  assert.equal(validateWebsiteCmsDraftIds(["", "b"]).ok, false);
  assert.equal(validateWebsiteCmsDraftIds("not-an-array").ok, false);

  console.log("website-cms schema: all tests passed");
}

async function runChecksumTests() {
  const { canonicalStringify, fingerprint, fingerprintContent, fingerprintsMatch } = await import(
    "./checksum"
  );

  assert.equal(
    canonicalStringify({ b: 1, a: 2 }),
    canonicalStringify({ a: 2, b: 1 }),
  );
  assert.equal(
    canonicalStringify({ a: { d: 1, c: 2 }, b: [3, 2, 1] }),
    canonicalStringify({ b: [3, 2, 1], a: { c: 2, d: 1 } }),
  );
  assert.notEqual(canonicalStringify({ a: 1 }), canonicalStringify({ a: 2 }));

  assert.equal(fingerprint("hello"), fingerprint("hello"));
  assert.notEqual(fingerprint("hello"), fingerprint("world"));
  assert.match(fingerprint("hello"), /^[0-9a-f]{8}$/);

  const fpA = fingerprintContent({ title: "About" }, { metaDescription: "x" });
  const fpB = fingerprintContent({ title: "About" }, { metaDescription: "x" });
  const fpC = fingerprintContent({ title: "About us" }, { metaDescription: "x" });
  assert.equal(fpA, fpB);
  assert.notEqual(fpA, fpC);

  assert.equal(fingerprintsMatch(fpA, fpB), true);
  assert.equal(fingerprintsMatch(fpA, fpC), false);
  assert.equal(fingerprintsMatch(null, fpA), false);
  assert.equal(fingerprintsMatch(undefined, undefined), false);

  console.log("website-cms checksum: all tests passed");
}

async function runLabelsTests() {
  const {
    websiteCmsStatusLabelKey,
    websiteCmsVersionStatusLabelKey,
    websiteCmsOperationStatusLabelKey,
    websiteCmsVersionStatusTone,
    websiteCmsOperationStatusTone,
    websiteCmsWebsiteStatusTone,
  } = await import("./labels");

  assert.equal(websiteCmsStatusLabelKey("ready"), "statusReady");
  assert.equal(websiteCmsStatusLabelKey("attention"), "statusAttention");
  assert.equal(websiteCmsStatusLabelKey("archived"), "statusArchived");
  assert.equal(websiteCmsStatusLabelKey("provisioned"), "statusProvisioned");
  assert.equal(websiteCmsStatusLabelKey("unknown"), "statusProvisioned");

  assert.equal(websiteCmsVersionStatusLabelKey("published"), "versionStatusPublished");
  assert.equal(websiteCmsVersionStatusLabelKey("superseded"), "versionStatusSuperseded");
  assert.equal(websiteCmsVersionStatusLabelKey("failed"), "versionStatusFailed");
  assert.equal(websiteCmsVersionStatusLabelKey("candidate"), "versionStatusCandidate");

  assert.equal(websiteCmsOperationStatusLabelKey("active"), "operationStatusActive");
  assert.equal(websiteCmsOperationStatusLabelKey("attention"), "operationStatusAttention");
  assert.equal(websiteCmsOperationStatusLabelKey("failed"), "operationStatusFailed");
  assert.equal(websiteCmsOperationStatusLabelKey("pending_verification"), "operationStatusPendingVerification");
  assert.equal(websiteCmsOperationStatusLabelKey("pending_runtime"), "operationStatusPendingRuntime");

  assert.equal(websiteCmsVersionStatusTone("published"), "success");
  assert.equal(websiteCmsVersionStatusTone("failed"), "danger");
  assert.equal(websiteCmsVersionStatusTone("superseded"), "muted");
  assert.equal(websiteCmsVersionStatusTone("candidate"), "info");

  assert.equal(websiteCmsOperationStatusTone("active"), "success");
  assert.equal(websiteCmsOperationStatusTone("failed"), "danger");
  assert.equal(websiteCmsOperationStatusTone("attention"), "warning");
  assert.equal(websiteCmsOperationStatusTone("pending_verification"), "warning");
  assert.equal(websiteCmsOperationStatusTone("pending_runtime"), "warning");

  assert.equal(websiteCmsWebsiteStatusTone("ready"), "success");
  assert.equal(websiteCmsWebsiteStatusTone("attention"), "warning");
  assert.equal(websiteCmsWebsiteStatusTone("archived"), "muted");
  assert.equal(websiteCmsWebsiteStatusTone("provisioned"), "info");

  console.log("website-cms labels: all tests passed");
}

async function runV4AdapterTests() {
  const { mergeWebsiteCmsIntoV4Context } = await import("./v4-adapter");
  const { emptyWebsiteCmsContext } = await import("./context");

  const base = {
    deliveryActive: true,
    acknowledgementOk: true,
    draftCapability: true,
    previewCapability: true,
  };

  const noWebsite = mergeWebsiteCmsIntoV4Context(emptyWebsiteCmsContext(), base);
  assert.equal(noWebsite.authoritativePageModel, false);
  assert.equal(noWebsite.publishCapability, false);
  assert.equal(noWebsite.rollbackCapability, false);
  assert.match(String(noWebsite.publishUnavailableReason), /no_authoritative_website_cms_publish_path_v4/);
  assert.match(String(noWebsite.rollbackUnavailableReason), /no_authoritative_website_version_rollback_path_v4/);

  const readyWithHistory = {
    available: true,
    organizationId: "org-1",
    domain: "example.com",
    installationId: "inst-1",
    acknowledgementOk: true,
    website: {
      id: "web-1",
      status: "ready" as const,
      domainId: "dom-1",
      installationId: "inst-1",
      defaultLocale: "en",
      activeLocales: ["en"],
      currentVersionId: "ver-1",
      createdAt: null,
      updatedAt: null,
    },
    currentVersion: {
      id: "ver-1",
      versionNumber: 2,
      status: "published" as const,
      contentChecksum: "abc",
      manifestChecksum: "def",
      changeSummary: null,
      previewVerifiedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    capabilities: {
      authoritativePageModel: true,
      draftCapability: true,
      previewCapability: true,
      publishCapability: true,
      rollbackCapability: true,
    },
  };

  const ready = mergeWebsiteCmsIntoV4Context(readyWithHistory, base);
  assert.equal(ready.authoritativePageModel, true);
  assert.equal(ready.publishCapability, true);
  assert.equal(ready.rollbackCapability, true);
  assert.equal(ready.publishUnavailableReason, null);
  assert.equal(ready.rollbackUnavailableReason, null);
  assert.equal(ready.currentVersion, "ver-1");
  assert.equal(ready.lastPublishAt, "2026-01-01T00:00:00.000Z");

  const noDelivery = mergeWebsiteCmsIntoV4Context(readyWithHistory, {
    ...base,
    deliveryActive: false,
  });
  assert.equal(noDelivery.publishCapability, false);
  assert.equal(noDelivery.rollbackCapability, false);
  assert.equal(noDelivery.publishUnavailableReason, "delivery_or_acknowledgement_not_ready");

  const noPublishedVersionYet = {
    ...readyWithHistory,
    website: { ...readyWithHistory.website, currentVersionId: null },
    currentVersion: null,
  };
  const firstPublishPending = mergeWebsiteCmsIntoV4Context(noPublishedVersionYet, base);
  assert.equal(firstPublishPending.authoritativePageModel, true);
  assert.equal(firstPublishPending.rollbackCapability, false);
  assert.equal(firstPublishPending.rollbackUnavailableReason, "no_published_version_to_rollback");

  console.log("website-cms v4-adapter: all tests passed");
}

async function runRendererTests() {
  const {
    normalizeRenderPath,
    findManifestPage,
    resolveRenderRobotsMode,
    robotsHeaderValue,
    resolvePublicRenderResult,
  } = await import("./renderer");

  assert.equal(normalizeRenderPath(null), "/");
  assert.equal(normalizeRenderPath(""), "/");
  assert.equal(normalizeRenderPath("/"), "/");
  assert.equal(normalizeRenderPath("about"), "/about");
  assert.equal(normalizeRenderPath("/about/"), "/about");

  const manifest = {
    pages: [
      {
        pageId: "p1",
        path: "/about",
        locale: "en",
        revisionNumber: 1,
        title: "About",
        content: {},
        seo: {},
        contentChecksum: "c1",
      },
      {
        pageId: "p1",
        path: "/about",
        locale: "no",
        revisionNumber: 1,
        title: "Om oss",
        content: {},
        seo: {},
        contentChecksum: "c2",
      },
    ],
    extras: [],
    locales: ["en", "no"],
    defaultLocale: "en",
    generatedAt: null,
  };

  const enPage = findManifestPage(manifest, "/about", "en");
  assert.equal(enPage?.title, "About");
  const noPage = findManifestPage(manifest, "/about/", "no");
  assert.equal(noPage?.title, "Om oss");
  const fallbackPage = findManifestPage(manifest, "/about", "sv");
  assert.equal(fallbackPage?.title, "About");
  const missing = findManifestPage(manifest, "/missing", "en");
  assert.equal(missing, null);
  assert.equal(findManifestPage(null, "/about", "en"), null);

  assert.equal(resolveRenderRobotsMode({ isPreview: true, resolved: { ok: true } }), "noindex");
  assert.equal(resolveRenderRobotsMode({ isPreview: false, resolved: { ok: true } }), "index");
  assert.equal(resolveRenderRobotsMode({ isPreview: false, resolved: { ok: false } }), "noindex");
  assert.equal(robotsHeaderValue("noindex"), "noindex, nofollow");
  assert.equal(robotsHeaderValue("index"), "index, follow");

  const okResolved = {
    ok: true,
    domain: "example.com",
    websiteId: "web-1",
    versionId: "ver-1",
    versionNumber: 3,
    defaultLocale: "en",
    activeLocales: ["en", "no"],
    manifest,
    contentChecksum: "c",
    manifestChecksum: "m",
    publishedAt: "2026-01-01T00:00:00.000Z",
  };
  const rendered = resolvePublicRenderResult(okResolved, "/about", "no");
  assert.equal(rendered.ok, true);
  if (rendered.ok) {
    assert.equal(rendered.locale, "no");
    assert.equal(rendered.page.title, "Om oss");
    assert.equal(rendered.versionNumber, 3);
  }

  const notFoundResolved = { ok: false, reason: "domain_not_found" };
  const renderedMissing = resolvePublicRenderResult(notFoundResolved, "/about", "en");
  assert.equal(renderedMissing.ok, false);
  if (!renderedMissing.ok) {
    assert.equal(renderedMissing.reason, "domain_not_found");
  }

  console.log("website-cms renderer: all tests passed");
}

async function runIdempotencyAndCandidateValidationTests() {
  const { isValidWebsiteCmsIdempotencyKey, createWebsitePublishIdempotencyKey, createWebsiteRollbackIdempotencyKey } =
    await import("./publish");
  const { validateBuildCandidateInput } = await import("./candidate");
  const { isPreviewActive } = await import("./preview");

  assert.equal(isValidWebsiteCmsIdempotencyKey("wcp-abcdefgh"), true);
  assert.equal(isValidWebsiteCmsIdempotencyKey("short"), false);
  assert.equal(isValidWebsiteCmsIdempotencyKey("x".repeat(200)), false);
  assert.equal(isValidWebsiteCmsIdempotencyKey(123 as unknown as string), false);

  const publishKey = createWebsitePublishIdempotencyKey();
  assert.match(publishKey, /^wcp-/);
  assert.equal(isValidWebsiteCmsIdempotencyKey(publishKey), true);
  const rollbackKey = createWebsiteRollbackIdempotencyKey();
  assert.match(rollbackKey, /^wcr-/);
  assert.notEqual(publishKey, createWebsitePublishIdempotencyKey());

  assert.equal(validateBuildCandidateInput({ draftIds: ["d1"], locales: ["en"] }).ok, true);
  assert.equal(validateBuildCandidateInput({ draftIds: [], locales: ["en"] }).ok, false);
  assert.equal(validateBuildCandidateInput({ draftIds: ["d1"], locales: [] }).ok, false);

  const now = new Date("2026-01-01T12:00:00.000Z");
  assert.equal(isPreviewActive("2026-01-01T13:00:00.000Z", now), true);
  assert.equal(isPreviewActive("2026-01-01T11:00:00.000Z", now), false);
  assert.equal(isPreviewActive("not-a-date", now), false);

  console.log("website-cms idempotency + candidate validation: all tests passed");
}

async function runContextDefaultsTest() {
  const { emptyWebsiteCmsContext } = await import("./context");
  const empty = emptyWebsiteCmsContext();
  assert.equal(empty.available, false);
  assert.equal(empty.website, null);
  assert.equal(empty.capabilities.publishCapability, false);
  assert.equal(empty.capabilities.rollbackCapability, false);
}

async function runMigrationAndSourceGuardTests() {
  const root = process.cwd();
  const migrationOne = readFileSync(
    join(root, "supabase/migrations/20261935500000_platform_website_cms_core_v1.sql"),
    "utf8",
  );
  const migrationTwo = readFileSync(
    join(root, "supabase/migrations/20261935600000_platform_website_publish_versioning_rollback_v1.sql"),
    "utf8",
  );

  for (const migration of [migrationOne, migrationTwo]) {
    assert.doesNotMatch(migration, /unonight/i);
    assert.match(migration, /search_path = public/);
  }

  assert.match(migrationOne, /customer_websites/);
  assert.match(migrationOne, /customer_website_pages/);
  assert.match(migrationOne, /customer_website_page_revisions/);
  assert.match(migrationOne, /customer_website_versions/);
  assert.match(migrationOne, /customer_website_previews/);
  assert.match(migrationOne, /customer_website_operations/);
  assert.match(migrationOne, /get_public_website_active_version/);

  assert.match(migrationTwo, /build_customer_website_candidate_from_drafts/);
  assert.match(migrationTwo, /publish_customer_website_candidate/);
  assert.match(migrationTwo, /rollback_customer_website_version/);
  assert.match(migrationTwo, /reconcile_customer_website_publish/);

  const sourceFiles = [
    "lib/website-cms/schema.ts",
    "lib/website-cms/types.ts",
    "lib/website-cms/labels.ts",
    "lib/website-cms/checksum.ts",
    "lib/website-cms/context.ts",
    "lib/website-cms/candidate.ts",
    "lib/website-cms/preview.ts",
    "lib/website-cms/publish.ts",
    "lib/website-cms/rollback.ts",
    "lib/website-cms/reconcile.ts",
    "lib/website-cms/renderer.ts",
    "lib/website-cms/v4-adapter.ts",
  ].map((file) => readFileSync(join(root, file), "utf8"));

  assert.doesNotMatch(sourceFiles.join("\n"), /unonight/i);

  console.log("website-cms migration + source guards: all tests passed");
}

async function main() {
  installServerOnlyShim();
  await runSchemaTests();
  await runChecksumTests();
  await runLabelsTests();
  await runV4AdapterTests();
  await runRendererTests();
  await runIdempotencyAndCandidateValidationTests();
  await runContextDefaultsTest();
  await runMigrationAndSourceGuardTests();
  console.log("website-cms: all tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
