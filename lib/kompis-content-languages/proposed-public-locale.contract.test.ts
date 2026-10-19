import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CORE_LOCALES } from "@/lib/i18n/config";
import {
  KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED,
  KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES,
  proposePublicContentLocale,
} from "@/lib/kompis-content-languages/proposed-public-locale";
const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

assert.equal(KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED, false);
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
  assert.equal(selected.wired, false);
  assert.equal(selected.source, "message");
  assert.equal(selected.contentLocale, code);
  assert.equal(selected.responseLocale, code);
  assert.equal(selected.fallback, "none");
  assert.deepEqual(
    selected.retrievalLocales,
    code === "en" ? ["en"] : [code, "en"],
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

const embed = read("lib/marketing/website-kompis-embed.ts");
assert.match(embed, /WEBSITE_KOMPIS_EMBED_LOCALES = \[\s*"en",\s*"no",\s*"sv",\s*"da",\s*"pl",\s*"uk",\s*\]/);
assert.match(embed, /WEBSITE_KOMPIS_EMBED_UNSUPPORTED_FALLBACK_LOCALE = "en"/);
assert.match(embed, /Explicit but unsupported selection \(de, fr, es-only hosts, unknown\) → English/);
assert.match(embed, /if \(base === "nb" \|\| base === "nn"\) return "no"/);
const installConfig = read("lib/marketing/website-kompis-install-config.ts");
assert.match(installConfig, /new Set\(\["en", "no", "sv", "da", "pl", "uk", "es"\]\)/);
assert.match(installConfig, /return CORE_LOCALES\.has\(normalized\) \? normalized : fallback/);
const askLocales = read("lib/marketing/public-companion-ask.ts");
assert.match(askLocales, /PUBLIC_COMPANION_ASK_LOCALES = \["en", "no", "sv", "da", "pl", "uk", "es"\]/);
assert.doesNotMatch(askLocales, /PUBLIC_COMPANION_ASK_LOCALES = \[[^\]]*"de"/);

const ask = read("lib/marketing/public-companion-ask.ts");
assert.match(ask, /function resolvePublicCompanionLocale/);
assert.match(ask, /isPublicFooterEnabledLocale/);
assert.doesNotMatch(ask, /proposePublicContentLocale/);
assert.doesNotMatch(read("public/embed/website-kompis.js"), /proposePublicContentLocale/);
assert.match(read("public/embed/website-kompis.js"), /SUPPORTED_EMBED_LOCALES/);
assert.match(read("lib/marketing/website-kompis-public-answer-policy.ts"), /Jeg finner ikke et konkret poengtall/);
assert.match(read("lib/marketing/website-kompis-visitor-tone.ts"), /EMBED_UI_SHELL\[input\.locale\] \?\? EMBED_UI_SHELL\.no/);

const retrieval = read("supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql");
assert.match(retrieval, /f\.status = 'published'/);
assert.match(retrieval, /f\.public_safe = true/);
assert.match(retrieval, /f\.locale in \(v_locale, 'en'\)/);
assert.match(retrieval, /f\.valid_until is null or f\.valid_until >= now\(\)/);
assert.match(retrieval, /s\.tenant_id = f\.tenant_id/);

const manifest = JSON.parse(read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")) as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
assert.equal(manifest.protectedRuntimeFiles.length, 46);
for (const entry of manifest.protectedRuntimeFiles) {
  assert.notEqual(entry.path, "lib/kompis-content-languages/proposed-public-locale.ts");
  const digest = createHash("sha256").update(readFileSync(join(root, entry.path))).digest("hex");
  assert.equal(digest, entry.sha256, entry.path);
}

console.log("proposed-public-locale.contract.test.ts: ok");
