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
  refreshWebsiteKompisEmbedPageContextFromParent,
  sanitizeWebsiteKompisEmbedLocale,
  WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MIN_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX,
  WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX,
  resolveWebsiteKompisEmbedHostOpenSize,
  resolveWebsiteKompisEmbedOpenHeightPx,
  resolveWebsiteKompisEmbedPreferredHostOpenSize,
  WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE,
  WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
} from "@/lib/marketing/website-kompis-embed";
import {
  sanitizeWebsiteKompisPublicPageContext,
  type WebsiteKompisPublicPageContext,
} from "@/lib/marketing/website-kompis-public-page-context";

/** Mirrors buildWebsiteKompisPageEvidence join (avoid server-only grounded-answer import here). */
function joinCurrentPageEvidenceText(pageContext: WebsiteKompisPublicPageContext | undefined): string {
  if (!pageContext) return "";
  return [
    pageContext.title,
    pageContext.metaDescription,
    ...(pageContext.headings ?? []).map((heading) => heading.text),
    ...(pageContext.textSnippets ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .slice(0, 8)
    .join("\n");
}

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
const expectedOpenHost = resolveWebsiteKompisEmbedHostOpenSize({
  panelWidth: WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
  panelHeight: WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX,
});
assert.equal(openResize.width, expectedOpenHost.width);
assert.equal(openResize.height, expectedOpenHost.height);
assert.equal(openResize.width, WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX + WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX * 2);
// Spacious desktop 1440×1000: preferred panel 450×800 → host outer 474×824.
assert.equal(resolveWebsiteKompisEmbedOpenHeightPx(1000), 800);
assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX, 450);
assert.deepEqual(
  resolveWebsiteKompisEmbedHostOpenSize({
    panelWidth: WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
    panelHeight: 800,
  }),
  { width: 474, height: 824 },
);
// Undersized iframe-like viewport must not be used by the embed widget path
// (widget posts preferred size; host clamps). Helper still documents host clamp.
assert.equal(resolveWebsiteKompisEmbedOpenHeightPx(72), 560);
const shortViewportResize = buildWebsiteKompisEmbedResizeMessage(true, 640);
assert.ok(shortViewportResize.height <= 640);
assert.ok(
  shortViewportResize.height >=
    560 + WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX * 2 ||
    shortViewportResize.height >= 560,
);
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
assert.match(loaderSource, /OPEN_WIDTH = 450/);
assert.match(loaderSource, /OPEN_HEIGHT = 800/);
assert.match(loaderSource, /OPEN_HEIGHT_MAX = 900/);
assert.match(loaderSource, /OPEN_FRAME_OUTSET = 12/);
assert.match(loaderSource, /OPEN_EDGE_INSET = 12/);
assert.match(loaderSource, /height >= host\.height/);
assert.match(loaderSource, /reclampOpenFromHostViewport/);
assert.match(loaderSource, /markShellReady/);

const desktop1440 = resolveWebsiteKompisEmbedPreferredHostOpenSize(1440, 1000);
assert.equal(desktop1440.panelWidth, 450);
assert.equal(desktop1440.panelHeight, 800);
assert.equal(desktop1440.width, 474);
assert.equal(desktop1440.height, 824);
const mobile390 = resolveWebsiteKompisEmbedPreferredHostOpenSize(390, 844);
assert.ok(mobile390.width <= 390 - WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX);
assert.ok(mobile390.height <= 844 - WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX);
assert.ok(mobile390.panelHeight >= WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MIN_PX);
assert.match(loaderSource, /opacity = "0"/);
assert.match(loaderSource, /visualViewport/);
assert.match(loaderSource, /width >= host\.width/);
// Embed must not clamp open size to the iframe's own viewport height.
assert.doesNotMatch(widgetSource, /readViewportHeightPx/);
assert.match(widgetSource, /buildWebsiteKompisEmbedResizeMessage\(open\)/);
assert.match(loaderSource, /PRICE_HINT/);
assert.match(loaderSource, /details\[open\]/);
assert.match(loaderSource, /aria-expanded/);
assert.match(loaderSource, /collectOpenDisclosureSnippets/);
assert.match(loaderSource, /faq-answer/);
assert.match(loaderSource, /isElementVisiblyOpen/);
assert.match(loaderSource, /scheduleDisclosurePageContextRefresh/);
assert.match(loaderSource, /attributeFilter:\s*\[[^\]]*aria-expanded/);
assert.match(widgetSource, /refreshWebsiteKompisEmbedPageContextFromParent/);
// Universal public surface contract — Core owns activation from host access adapter.
assert.match(loaderSource, /aipify\.websiteKompis\.surface/);
assert.match(loaderSource, /data-aipify-kompis-access/);
assert.match(loaderSource, /readHostAccessClass/);
assert.match(loaderSource, /applyAccessClass/);
assert.match(loaderSource, /attributeFilter:\s*\[[^\]]*ACCESS_DATA_ATTR/);
assert.doesNotMatch(loaderSource, /"\/login"/);
assert.doesNotMatch(loaderSource, /"\/register"/);
assert.match(widgetSource, /parseWebsiteKompisEmbedSurfaceMessage/);

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

// Transport: stale snapshot vs refresh-before-ask → current-page evidence (no provider).
const stalePageContext = sanitizeWebsiteKompisPublicPageContext({
  pathname: "/help/venue",
  title: "Partner venue help",
  metaDescription: "Logistics for partner venues.",
  surface: "public",
  headings: [{ level: 1, text: "Partner venue help" }],
  textSnippets: ["This help center explains workshop logistics for partner venues."],
});
assert.ok(stalePageContext);
const staleEvidenceText = joinCurrentPageEvidenceText(stalePageContext);
assert.ok(staleEvidenceText.length > 0);
assert.doesNotMatch(staleEvidenceText, /photo ID verification/i);

const openPanelPageContext = sanitizeWebsiteKompisPublicPageContext({
  pathname: "/help/venue",
  title: "Partner venue help",
  metaDescription: "Logistics for partner venues.",
  surface: "public",
  headings: [{ level: 1, text: "Partner venue help" }],
  textSnippets: [
    "How are desk passes issued?: Desk passes are issued at reception after photo ID verification on weekdays before 16:00.",
    "Visitor lounge hours: weekdays 09:00-17:00 with prior appointment on weekends.",
  ],
});
assert.ok(openPanelPageContext);

async function assertPageContextRefreshTransport() {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const parent = {
    postMessage(message: unknown) {
      assert.equal(
        (message as { type?: string }).type,
        WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE,
      );
      queueMicrotask(() => {
        for (const listener of listeners) {
          listener({
            data: {
              type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
              pageContext: openPanelPageContext,
            },
            source: parent,
          } as unknown as MessageEvent);
        }
      });
    },
  };
  const win = {
    parent,
    addEventListener(_type: "message", listener: (event: MessageEvent) => void) {
      listeners.push(listener);
    },
    removeEventListener(_type: "message", listener: (event: MessageEvent) => void) {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    },
    setTimeout(handler: () => void, timeout: number) {
      return setTimeout(handler, timeout);
    },
    clearTimeout(handle: unknown) {
      clearTimeout(handle as NodeJS.Timeout);
    },
  };

  const refreshed = await refreshWebsiteKompisEmbedPageContextFromParent({
    timeoutMs: 200,
    win,
  });
  assert.ok(refreshed);
  assert.ok(refreshed?.textSnippets?.some((snippet) => /photo ID verification/i.test(snippet)));

  const askPayload = buildWebsiteKompisAskPayload({
    question: "How are desk passes issued at the venue?",
    locale: "en",
    domain: exampleDomain,
    installId: exampleInstallId,
    pageContext: refreshed ?? stalePageContext,
  });
  assert.ok(askPayload.pageContext);
  const evidenceText = joinCurrentPageEvidenceText(
    askPayload.pageContext as WebsiteKompisPublicPageContext,
  );
  assert.match(evidenceText, /photo ID verification/i);
  assert.match(evidenceText, /Visitor lounge hours/i);

  // Second panel switch: refresh replaces prior open-panel snippets in ask payload.
  const switchedPanel = sanitizeWebsiteKompisPublicPageContext({
    pathname: "/help/venue",
    title: "Partner venue help",
    surface: "public",
    textSnippets: [
      "Can partners bring guests?: Guest badges require a named host and same-day check-in at reception.",
    ],
  });
  assert.ok(switchedPanel);
  const switchListeners: Array<(event: MessageEvent) => void> = [];
  const switchParent = {
    postMessage() {
      queueMicrotask(() => {
        for (const listener of switchListeners) {
          listener({
            data: {
              type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE,
              pageContext: switchedPanel,
            },
            source: switchParent,
          } as unknown as MessageEvent);
        }
      });
    },
  };
  const switched = await refreshWebsiteKompisEmbedPageContextFromParent({
    timeoutMs: 200,
    win: {
      parent: switchParent,
      addEventListener(_type: "message", listener: (event: MessageEvent) => void) {
        switchListeners.push(listener);
      },
      removeEventListener(_type: "message", listener: (event: MessageEvent) => void) {
        const index = switchListeners.indexOf(listener);
        if (index >= 0) switchListeners.splice(index, 1);
      },
      setTimeout(handler: () => void, timeout: number) {
        return setTimeout(handler, timeout);
      },
      clearTimeout(handle: unknown) {
        clearTimeout(handle as NodeJS.Timeout);
      },
    },
  });
  assert.ok(switched?.textSnippets?.some((snippet) => /Guest badges require a named host/i.test(snippet)));
  const switchedEvidenceText = joinCurrentPageEvidenceText(switched);
  assert.match(switchedEvidenceText, /Guest badges require a named host/i);
  assert.doesNotMatch(switchedEvidenceText, /photo ID verification/i);
}

async function assertPageContextRefreshTimeoutFallback() {
  const timedOut = await refreshWebsiteKompisEmbedPageContextFromParent({
    timeoutMs: 40,
    win: {
      parent: { postMessage() {} },
      addEventListener() {},
      removeEventListener() {},
      setTimeout(handler: () => void, timeout: number) {
        return setTimeout(handler, timeout);
      },
      clearTimeout(handle: unknown) {
        clearTimeout(handle as NodeJS.Timeout);
      },
    },
  });
  assert.equal(timedOut, undefined);
}

void Promise.all([assertPageContextRefreshTransport(), assertPageContextRefreshTimeoutFallback()])
  .then(() => {
    console.log("website-kompis-embed.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
