import assert from "node:assert/strict";
import {
  buildWebsiteKompisAskPayload,
  buildWebsiteKompisEmbedIframeSrc,
  buildWebsiteKompisMetadataRequestPath,
  normalizeWebsiteKompisEmbedDomain,
  normalizeWebsiteKompisEmbedInstallId,
  parseWebsiteKompisEmbedSearchParams,
  sanitizeWebsiteKompisEmbedLocale,
} from "@/lib/marketing/website-kompis-embed";

const exampleInstallId = "11111111-1111-4111-8111-111111111111";
const exampleDomain = "example-a.test";

assert.equal(sanitizeWebsiteKompisEmbedLocale(undefined), "no");
assert.equal(sanitizeWebsiteKompisEmbedLocale("sv"), "sv");
assert.equal(sanitizeWebsiteKompisEmbedLocale("xx"), "no");

assert.equal(normalizeWebsiteKompisEmbedDomain("HTTPS://EXAMPLE-A.TEST/path"), exampleDomain);
assert.equal(normalizeWebsiteKompisEmbedDomain("bad..domain"), null);

assert.equal(
  normalizeWebsiteKompisEmbedInstallId(exampleInstallId.toUpperCase()),
  exampleInstallId,
);
assert.equal(normalizeWebsiteKompisEmbedInstallId("not-a-uuid"), null);

const parsed = parseWebsiteKompisEmbedSearchParams(
  new URLSearchParams({
    installId: exampleInstallId,
    domain: exampleDomain,
    locale: "da",
  }),
);
assert.equal(parsed.ok, true);
if (parsed.ok) {
  assert.equal(parsed.params.installId, exampleInstallId);
  assert.equal(parsed.params.domain, exampleDomain);
  assert.equal(parsed.params.locale, "da");
}

const missingDomain = parseWebsiteKompisEmbedSearchParams(
  new URLSearchParams({ installId: exampleInstallId }),
);
assert.equal(missingDomain.ok, false);

const iframeSrc = buildWebsiteKompisEmbedIframeSrc({
  coreOrigin: "https://aipify.ai",
  installId: exampleInstallId,
  domain: exampleDomain,
  locale: "no",
});
assert.match(iframeSrc, /\/embed\/website-kompis\?/);
assert.match(iframeSrc, /installId=11111111-1111-4111-8111-111111111111/);
assert.match(iframeSrc, /domain=example-a\.test/);
assert.match(iframeSrc, /locale=no/);

const metadataPath = buildWebsiteKompisMetadataRequestPath({
  installId: exampleInstallId,
  domain: exampleDomain,
});
assert.match(metadataPath, /^\/api\/embed\/companion\/launcher-icon\?/);
assert.match(metadataPath, /installId=11111111-1111-4111-8111-111111111111/);
assert.match(metadataPath, /domain=example-a\.test/);

const askPayload = buildWebsiteKompisAskPayload({
  question: "Hvilke tjenester tilbyr NETTSTED_NAVN?",
  locale: "no",
  domain: exampleDomain,
  installId: exampleInstallId,
  recentContext: [{ role: "user", text: "Hei" }],
});
assert.equal(askPayload.question, "Hvilke tjenester tilbyr NETTSTED_NAVN?");
assert.equal(askPayload.locale, "no");
assert.equal(askPayload.domain, exampleDomain);
assert.equal(askPayload.installId, exampleInstallId);
assert.equal(askPayload.recentContext?.length, 1);

console.log("website-kompis-embed.test.ts: all assertions passed");
