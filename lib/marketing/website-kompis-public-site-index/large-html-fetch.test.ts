import assert from "node:assert/strict";
import {
  extractPublicPageFromHtml,
  isIndexableExtractedPage,
  looksLikeHydrationOrScriptBlob,
  resolveExtractedLocale,
  stripNonContentMarkup,
} from "./extract";
import { readResponseBodyCapped } from "./fetch-safe";
import {
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  evaluatePublicSiteIndexUrl,
} from "./url-policy";

assert.equal(WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES, 2 * 1024 * 1024);

function streamFromChunks(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(chunks[i]);
      i += 1;
    },
  });
}

function responseFromBytes(
  bytes: Uint8Array[],
  headers?: Record<string, string>,
): Response {
  return new Response(streamFromChunks(bytes), {
    status: 200,
    headers: headers ?? { "content-type": "text/html; charset=utf-8" },
  });
}

function buildLargePublicHtml(opts: {
  visibleBytes: number;
  scriptPadBytes: number;
  lang: string;
  title: string;
  mainText: string;
}): string {
  const scriptPad = "x".repeat(Math.max(0, opts.scriptPadBytes));
  const visiblePad = " Public copy. ".repeat(
    Math.ceil(opts.visibleBytes / " Public copy. ".length),
  );
  return `<!doctype html><html lang="${opts.lang}"><head>
<title>${opts.title}</title>
<meta name="description" content="Public membership guide for NETTSTED_NAVN." />
<script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"secret":"do-not-index-${scriptPad.slice(0, 32)}"}}}</script>
<script>self.__next_f.push([1,"$Sreact.fragment${scriptPad}"]);</script>
<style>.x{color:red}</style>
</head><body>
<header><nav>Login Menu</nav></header>
<main>
<h1>${opts.title}</h1>
<p>${opts.mainText}</p>
<p>${visiblePad.slice(0, opts.visibleBytes)}</p>
</main>
<footer>© NETTSTED_NAVN</footer>
</body></html>`;
}

async function main() {
  // --- Streaming byte gate (decoded body) ---
  const underCap = Buffer.alloc(300_000, 0x61); // 300 KiB of 'a' — was rejected at 256 KiB
  const okUnder = await readResponseBodyCapped(
    responseFromBytes([underCap]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(okUnder.ok, true);
  if (okUnder.ok) {
    assert.equal(okUnder.decodedBytes, 300_000);
    assert.equal(okUnder.body.length, 300_000);
  }

  const overCap = Buffer.alloc(WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES + 1, 0x62);
  const tooLarge = await readResponseBodyCapped(
    responseFromBytes([overCap]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(tooLarge.ok, false);
  if (!tooLarge.ok) assert.equal(tooLarge.reason, "body_too_large");

  // Chunk overflow across boundary (no partial accept)
  const half = Math.floor(WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES / 2) + 10;
  const chunkOverflow = await readResponseBodyCapped(
    responseFromBytes([Buffer.alloc(half, 0x63), Buffer.alloc(half, 0x64)]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(chunkOverflow.ok, false);
  if (!chunkOverflow.ok) assert.equal(chunkOverflow.reason, "body_too_large");

  // Content-Length early reject hint
  const clReject = await readResponseBodyCapped(
    responseFromBytes([Buffer.from("tiny")], {
      "content-type": "text/html",
      "content-length": String(WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES + 50),
    }),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(clReject.ok, false);
  if (!clReject.ok) assert.equal(clReject.reason, "body_too_large");

  // Lying small Content-Length must still stream-count (accept when under cap)
  const lyingCl = await readResponseBodyCapped(
    responseFromBytes([Buffer.alloc(12_000, 0x65)], {
      "content-type": "text/html",
      "content-length": "10",
    }),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(lyingCl.ok, true);
  if (lyingCl.ok) assert.equal(lyingCl.decodedBytes, 12_000);

  // Missing body → fail closed
  const noBody = await readResponseBodyCapped(
    new Response(null, { status: 200, headers: { "content-type": "text/html" } }),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(noBody.ok, false);
  if (!noBody.ok) assert.equal(noBody.reason, "body_unavailable");

  // UTF-8 multibyte across chunk boundary (æ = C3 A6)
  const utf8 = Buffer.from("æøå", "utf8");
  const split = await readResponseBodyCapped(
    responseFromBytes([utf8.subarray(0, 1), utf8.subarray(1)]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(split.ok, true);
  if (split.ok) {
    assert.equal(split.body, "æøå");
    assert.equal(split.decodedBytes, utf8.byteLength);
  }

  // Character length ≠ byte length: 200k chars of "ø" ≈ 400k bytes, still under 2 MiB
  const wide = Buffer.from("ø".repeat(200_000), "utf8");
  assert.ok(wide.byteLength > 200_000);
  const wideOk = await readResponseBodyCapped(
    responseFromBytes([wide]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(wideOk.ok, true);

  // --- Large Next.js-like page extraction (~700 KiB total) ---
  const largeHtml = buildLargePublicHtml({
    visibleBytes: 40_000,
    scriptPadBytes: 650_000,
    lang: "en",
    title: "Membership levels",
    mainText:
      "NETTSTED_NAVN offers Bronze Silver Gold and Elite Diamond plans with clear public benefits for members.",
  });
  assert.ok(Buffer.byteLength(largeHtml, "utf8") > 256_000);
  assert.ok(Buffer.byteLength(largeHtml, "utf8") < WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES);

  const largeBody = await readResponseBodyCapped(
    responseFromBytes([Buffer.from(largeHtml, "utf8")]),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  );
  assert.equal(largeBody.ok, true);

  const extracted = extractPublicPageFromHtml(largeHtml, "no");
  assert.equal(extracted.locale, "en"); // html lang wins over localeHint "no"
  assert.equal(extracted.noindex, false);
  assert.match(extracted.bodyText, /Bronze Silver Gold/);
  assert.equal(extracted.bodyText.includes("do-not-index"), false);
  assert.equal(extracted.bodyText.includes("__NEXT_DATA__"), false);
  assert.equal(extracted.bodyText.includes("self.__next_f"), false);
  assert.equal(looksLikeHydrationOrScriptBlob(extracted.bodyText), false);
  assert.equal(isIndexableExtractedPage(extracted), true);
  assert.ok(extracted.chunks.length >= 1);

  // Synthetic second customer host fixture (generic, not UnoNight-specific)
  const otherHostHtml = buildLargePublicHtml({
    visibleBytes: 8_000,
    scriptPadBytes: 280_000,
    lang: "sv",
    title: "Om WEBSITE_NAME",
    mainText:
      "WEBSITE_NAME hjälper medlemmar att jämföra nivåer och offentliga fördelar utan inloggning.",
  });
  const other = extractPublicPageFromHtml(otherHostHtml, "no");
  assert.equal(other.locale, "sv");
  assert.match(other.bodyText, /WEBSITE_NAME/);
  assert.equal(isIndexableExtractedPage(other), true);
  assert.equal(
    evaluatePublicSiteIndexUrl("https://www.other-customer.example/sv/about", "www.other-customer.example")
      .ok,
    true,
  );

  // Hydration-only blob must not be indexable
  const blob = stripNonContentMarkup(
    `<html><body><main>${'{"props":'.repeat(80)}${"x".repeat(500)}</main></body></html>`,
  );
  assert.equal(looksLikeHydrationOrScriptBlob(blob) || blob.length < 80, true);

  // locale resolution
  assert.equal(
    resolveExtractedLocale('<html lang="en-GB"><body></body></html>', "no"),
    "en",
  );
  assert.equal(resolveExtractedLocale("<html><body></body></html>", "no"), "no");

  // noindex still wins on large pages
  const noindexLarge = largeHtml.replace(
    'name="description"',
    'name="robots" content="noindex" /><meta name="description"',
  );
  const noindexPage = extractPublicPageFromHtml(noindexLarge, "en");
  assert.equal(noindexPage.noindex, true);
  assert.equal(isIndexableExtractedPage(noindexPage), false);

  console.log("large-html-fetch.test.ts: ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
