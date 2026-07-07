import assert from "node:assert/strict";
import {
  buildWebsiteKompisAskPayload,
  buildWebsiteKompisEmbedIframeSrc,
  buildWebsiteKompisMetadataRequestPath,
  buildWebsiteKompisScriptEmbedSnippet,
  escapeWebsiteKompisEmbedAttributeValue,
  normalizeWebsiteKompisEmbedDomain,
  normalizeWebsiteKompisEmbedInstallId,
  parseWebsiteKompisEmbedPageContextMessage,
  parseWebsiteKompisEmbedSearchParams,
  sanitizeWebsiteKompisEmbedLocale,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
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

const askPayloadWithPageContext = buildWebsiteKompisAskPayload({
  question: "Hva tilbyr dere?",
  locale: "no",
  domain: exampleDomain,
  installId: exampleInstallId,
  pageContext: {
    surface: "public",
    pathname: "/services",
    title: "Tjenester",
  },
});
assert.equal(askPayloadWithPageContext.pageContext?.title, "Tjenester");
assert.equal(askPayloadWithPageContext.pageContext?.surface, "public");

const parsedPageContextMessage = parseWebsiteKompisEmbedPageContextMessage({
  type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
  pageContext: {
    pathname: "/about",
    title: "About us",
    surface: "public",
    pageHtml: "<unsafe>",
  },
});
assert.equal(parsedPageContextMessage, undefined);

const validPageContextMessage = parseWebsiteKompisEmbedPageContextMessage({
  type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
  pageContext: {
    pathname: "/about",
    title: "About us",
    surface: "public",
    headings: [{ level: 1, text: "About us" }],
  },
});
assert.equal(validPageContextMessage?.title, "About us");
assert.equal(validPageContextMessage?.headings?.length, 1);

const snippet = buildWebsiteKompisScriptEmbedSnippet({
  installId: exampleInstallId,
  domain: exampleDomain,
  locale: "no",
});
assert.ok(snippet);
assert.match(snippet ?? "", /\/embed\/website-kompis\.js/);
assert.match(snippet ?? "", /data-install-id="/);
assert.match(snippet ?? "", /data-domain="/);
assert.match(snippet ?? "", /data-locale="/);
assert.match(snippet ?? "", /https:\/\/aipify\.ai\/embed\/website-kompis\.js/);
assert.match(snippet ?? "", /data-install-id="11111111-1111-4111-8111-111111111111"/);
assert.match(snippet ?? "", /data-domain="example-a\.test"/);
assert.match(snippet ?? "", /data-locale="no"/);

const defaultOriginSnippet = buildWebsiteKompisScriptEmbedSnippet({
  installId: exampleInstallId,
  domain: exampleDomain,
});
assert.match(defaultOriginSnippet ?? "", /https:\/\/aipify\.ai\/embed\/website-kompis\.js/);

const escapedSnippet = buildWebsiteKompisScriptEmbedSnippet({
  coreOrigin: 'https://aipify.ai?ref="beta"',
  installId: exampleInstallId,
  domain: exampleDomain,
});
assert.match(escapedSnippet ?? "", /src="https:\/\/aipify\.ai\?ref=&quot;beta&quot;\/embed\/website-kompis\.js"/);

assert.equal(
  escapeWebsiteKompisEmbedAttributeValue('a&b"c<d>e'),
  "a&amp;b&quot;c&lt;d&gt;e",
);

assert.equal(buildWebsiteKompisScriptEmbedSnippet({ installId: "", domain: exampleDomain }), null);
assert.equal(buildWebsiteKompisScriptEmbedSnippet({ installId: exampleInstallId, domain: "" }), null);

console.log("website-kompis-embed.test.ts: all assertions passed");
