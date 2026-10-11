import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  buildWebsiteKompisAskPayload,
  buildWebsiteKompisEmbedIframeSrc,
  buildWebsiteKompisEmbedResizeMessage,
  buildWebsiteKompisMetadataRequestPath,
  buildWebsiteKompisScriptEmbedSnippet,
  escapeWebsiteKompisEmbedAttributeValue,
  normalizeWebsiteKompisEmbedDomain,
  normalizeWebsiteKompisEmbedInstallId,
  parseWebsiteKompisEmbedPageContextMessage,
  parseWebsiteKompisEmbedResizeMessage,
  parseWebsiteKompisEmbedSearchParams,
  sanitizeWebsiteKompisEmbedLocale,
  WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
  WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
} from "@/lib/marketing/website-kompis-embed";

const exampleInstallId = "11111111-1111-4111-8111-111111111111";
const exampleDomain = "example-a.test";

assert.equal(sanitizeWebsiteKompisEmbedLocale(undefined), "no");
assert.equal(sanitizeWebsiteKompisEmbedLocale("sv"), "sv");
assert.equal(sanitizeWebsiteKompisEmbedLocale("nb"), "no");
assert.equal(sanitizeWebsiteKompisEmbedLocale("de"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("de-DE"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("xx"), "en");

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

const longPrior = "X".repeat(800);
const clippedAsk = buildWebsiteKompisAskPayload({
  question: "Hvordan fungerer gaveguiden?",
  locale: "no",
  domain: exampleDomain,
  installId: exampleInstallId,
  recentContext: [
    { role: "user", text: "Hvordan fungerer gaveguiden på NETTSTED_NAVN?" },
    { role: "assistant", text: longPrior },
  ],
});
assert.equal(clippedAsk.recentContext?.[1]?.text.length, 500);

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

const closedResize = buildWebsiteKompisEmbedResizeMessage(false);
assert.equal(closedResize.type, WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE);
assert.equal(closedResize.open, false);
assert.equal(closedResize.width, WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX);
assert.equal(closedResize.height, WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX);

const openResize = buildWebsiteKompisEmbedResizeMessage(true);
assert.equal(openResize.open, true);
assert.equal(openResize.width, WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX);
assert.equal(openResize.height, WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX);
assert.deepEqual(parseWebsiteKompisEmbedResizeMessage(openResize), openResize);
assert.equal(parseWebsiteKompisEmbedResizeMessage({ type: "other" }), null);
assert.equal(
  parseWebsiteKompisEmbedResizeMessage({
    type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
    open: true,
    width: 9999,
    height: 9999,
  }),
  null,
);
assert.equal(
  parseWebsiteKompisEmbedResizeMessage({
    type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
    open: "yes",
    width: 420,
    height: 640,
  }),
  null,
);
assert.equal(
  parseWebsiteKompisEmbedResizeMessage({
    type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
    open: false,
    width: 72,
    height: 72,
  })?.open,
  false,
);

const loaderSource = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/embed/website-kompis.js"),
  "utf8",
);
assert.match(loaderSource, /CLOSED_WIDTH = 72/);
assert.match(loaderSource, /aipify\.websiteKompis\.resize/);
assert.match(loaderSource, /aipify\.websiteKompis\.navigate/);
assert.match(loaderSource, /event\.origin !== coreOrigin/);
assert.match(loaderSource, /event\.source !== iframe\.contentWindow/);
assert.match(loaderSource, /MutationObserver/);
assert.match(loaderSource, /attributeFilter:\s*\["lang"\]/);
assert.match(loaderSource, /return "en"/);
assert.doesNotMatch(loaderSource, /iframe\.style\.width = "420px"/);
// No sandbox attribute — brand credit target=_blank must open without allow-popups widening.
assert.doesNotMatch(loaderSource, /setAttribute\(\s*["']sandbox["']/);

const widgetSource = readFileSync(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../components/embed/WebsiteKompisEmbedWidget.tsx",
  ),
  "utf8",
);
assert.match(widgetSource, /aipify-kompis-avatar\.svg/);
assert.match(widgetSource, /DESIGN_AVATAR_SRC/);
assert.match(widgetSource, /AIPIFY_BRAND_HOME_HREF = "https:\/\/aipify\.ai"/);
assert.match(widgetSource, /target="_blank"/);
assert.match(widgetSource, /rel="noopener noreferrer"/);
assert.match(widgetSource, /ak-thinking-row/);
assert.match(widgetSource, /navigateToHostSource/);
assert.match(widgetSource, /writeWebsiteKompisEmbedSession/);
assert.match(widgetSource, /readWebsiteKompisEmbedSession/);
assert.match(widgetSource, /AipifyCompanionLauncherIcon/);
assert.doesNotMatch(widgetSource, /AipifyLoader/);
// Closed launcher must use the robot avatar, not the brand mark alone.
assert.match(widgetSource, /className="ak-launcher"[\s\S]*DESIGN_AVATAR_SRC/);
assert.doesNotMatch(widgetSource, /DESIGN_MARK_SRC/);
assert.match(loaderSource, /OPEN_HEIGHT = 720/);
assert.match(loaderSource, /visualViewport/);
assert.match(loaderSource, /PRICE_HINT/);

const designCss = readFileSync(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../components/embed/website-kompis-design-v1.css",
  ),
  "utf8",
);
assert.match(designCss, /ak-thinking-fade/);
assert.match(designCss, /prefers-reduced-motion:\s*no-preference/);

const avatarPng = readFileSync(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../public/website-kompis/design-v1/images/aipify-kompis-avatar.png",
  ),
);
assert.equal(
  createHash("sha256").update(avatarPng).digest("hex"),
  "9646db7d446c150c8567dd28b812c82ba9c66d435e83e08106a8915951a41ef6",
);

console.log("website-kompis-embed.test.ts: all assertions passed");
