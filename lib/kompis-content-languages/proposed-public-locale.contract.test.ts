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
