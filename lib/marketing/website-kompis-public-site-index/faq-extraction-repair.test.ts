/**
 * Job 37 — closed public FAQ Q→A must survive extract → chunk → evidence.
 * Neutral topics only (no owner LIVE wording as runtime fixtures).
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

function buildClosedFaqPageHtml(input: {
  pairs: Array<{ question: string; answer: string }>;
  openIndex?: number;
  includeScriptJson?: boolean;
  lang?: string;
}): string {
  const openIndex = input.openIndex ?? -1;
  const buttons = input.pairs
    .map((pair, index) => {
      const open = index === openIndex;
      const answerBlock = open
        ? `<div class="faq-answer pb-4">${pair.answer}</div>`
        : "";
      return `<button type="button" aria-expanded="${open ? "true" : "false"}">${pair.question} ${
        open ? "−" : "+"
      }</button>${answerBlock}`;
    })
    .join("\n");

  const scriptJson = input.includeScriptJson === false
    ? ""
    : `<script>self.__next_f.push([1,${JSON.stringify(
        JSON.stringify(
          input.pairs.map((pair, i) => ({
            id: `page.desk.item_${i}`,
            faq_key: `page.desk.item_${i}`,
            question: pair.question,
            answer: pair.answer,
          })),
        ),
      )}])</script>`;

  // Escaped FAQ records as seen in many public Next payloads (inside script).
  const escapedRecords = input.pairs
    .map(
      (pair) =>
        `{\\"question\\":\\"${pair.question.replace(/"/g, '\\"')}\\",\\"answer\\":\\"${pair.answer.replace(
          /"/g,
          '\\"',
        )}\\"}`,
    )
    .join(",");
  const escapedScript = `<script type="application/json">{"faq":[${escapedRecords}]}</script>`;

  return `<!doctype html><html lang="${input.lang ?? "no"}"><head>
<title>FAQ — hjelp og svar</title>
<meta name="description" content="Offentlige svar" />
</head><body>
<main>
<h1>Ofte stilte spørsmål</h1>
${buttons}
</main>
${scriptJson}
${escapedScript}
<input type="hidden" name="csrf" value="secret-token-should-not-index" />
<script>var api_key="sk_live_should_not_index_1234567890";</script>
</body></html>`;
}

async function main() {
  const {
    extractPublicFaqPairsFromHtml,
    extractPublicPageFromHtml,
    looksLikeHydrationOrScriptBlob,
    isIndexableExtractedPage,
    stripNonContentMarkup,
  } = await import("./extract");
  const { buildWebsiteKompisEvidencePack } = await import(
    "../website-kompis-grounded-answer"
  );
  const { isRelevantPublicSiteIndexResult, buildPublicSiteIndexAnswer } = await import(
    "./answer"
  );

  const pairs = [
    {
      question: "Hva skjer med Desk Pass når abonnementet utløper?",
      answer:
        "Når Desk Pass-abonnementet utløper, pauses publiserte desk-annonser. Nye desk-annonser krever aktiv tilgang.",
    },
    {
      question: "Kan jeg pause en Desk Pass-annonse og åpne den igjen?",
      answer:
        "Ja. Du kan pause en publisert desk-annonse og åpne den igjen senere. Å åpne igjen krever fortsatt aktivt Desk Pass.",
    },
    {
      question: "Where do I activate Desk Pass?",
      answer: "Activate Desk Pass under Account → Subscriptions, then confirm before access opens.",
    },
    {
      question: "Hur pausar jag ett Desk Pass?",
      answer: "Du kan pausa en publicerad desk-annons och öppna den igen senare med aktiv tillgång.",
    },
  ];
  // Pad well past eight pairs; include a late pair that must survive hub packing.
  for (let i = 0; i < 40; i += 1) {
    pairs.push({
      question: `Hva dekker Desk Pass nivå ${i + 1}?`,
      answer: `Desk Pass nivå ${i + 1} gir offentlig beskrevne desk-fordeler uten private medlemsdata.`,
    });
  }
  pairs.push({
    question: "Hva skjer med late Desk Pass-oppføringer etter utløp?",
    answer:
      "Etter utløp pauses late Desk Pass-oppføringer til tilgangen er aktiv igjen.",
  });

  // --- Old bug: strip scripts → question titles only ---
  const closedHtml = buildClosedFaqPageHtml({ pairs, openIndex: -1 });
  const strippedOnly = stripNonContentMarkup(
    closedHtml.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? closedHtml,
  );
  assert.match(strippedOnly, /Hva skjer med Desk Pass/);
  assert.doesNotMatch(strippedOnly, /pauses publiserte desk-annonser/i);

  // --- Extract recovers closed Q→A from published FAQ records ---
  const extracted = extractPublicPageFromHtml(closedHtml, "no");
  assert.equal(extracted.locale, "no");
  assert.equal(isIndexableExtractedPage(extracted), true);
  assert.equal(looksLikeHydrationOrScriptBlob(extracted.bodyText), false);
  assert.doesNotMatch(extracted.bodyText, /sk_live_should_not_index|secret-token-should-not-index|__next_f/i);
  assert.match(extracted.bodyText, /pauses publiserte desk-annonser/i);
  assert.match(extracted.bodyText, /pause en publisert desk-annonse/i);
  assert.match(extracted.bodyText, /late Desk Pass-oppføringer/i);
  assert.ok(extracted.chunks.some((c) => /pauses publiserte desk-annonser/i.test(c)));
  assert.ok(extracted.chunks.some((c) => /åpne den igjen senere/i.test(c)));
  assert.ok(extracted.chunks.some((c) => /late Desk Pass-oppføringer/i.test(c)));
  assert.ok(extractPublicFaqPairsFromHtml(closedHtml).length >= 8);

  // Open panel still works and does not duplicate badly.
  const openHtml = buildClosedFaqPageHtml({ pairs: pairs.slice(0, 3), openIndex: 1 });
  const openExtracted = extractPublicPageFromHtml(openHtml, "no");
  assert.match(openExtracted.bodyText, /pause en publisert desk-annonse/i);

  // details/summary path
  const detailsHtml = `<html lang="en"><body><main>
<details><summary>How do I renew Desk Pass?</summary><p>Renew Desk Pass from Account → Subscriptions before the period ends.</p></details>
</main></body></html>`;
  const detailsExtracted = extractPublicPageFromHtml(detailsHtml, "en");
  assert.match(detailsExtracted.bodyText, /Renew Desk Pass from Account/i);

  // --- Transport: extract chunks → evidence pack → paraphrase retrieval ---
  const q = "Kan jeg pause en Desk Pass-annonse og aktivere den senere?";
  const hitChunks = extracted.chunks.filter((c) => /desk/i.test(c));
  assert.ok(hitChunks.length >= 1);
  const siteIndexHits = hitChunks.slice(0, 5).map((chunkContent, index) => ({
    documentId: "doc-faq",
    chunkId: `chunk-${index}`,
    title: "FAQ — hjelp og svar",
    canonicalUrl: "https://www.customer.example/no/faq",
    pathname: "/no/faq",
    locale: "no",
    excerpt: chunkContent.slice(0, 120),
    chunkContent,
    score: 40 - index,
    matchedReason: "public_site_index" as const,
    crawledAt: null,
  }));

  assert.equal(isRelevantPublicSiteIndexResult(siteIndexHits, q), true);
  const pack = buildWebsiteKompisEvidencePack({
    question: q,
    locale: "no",
    siteIndexHits,
  });
  assert.ok(pack.evidence.length >= 1);
  assert.ok(
    pack.evidence.some((item) => /pause en publisert desk-annonse|åpne den igjen/i.test(item.text)),
    "evidence must carry answer prose, not only the FAQ title",
  );

  const composed = buildPublicSiteIndexAnswer(
    siteIndexHits,
    "no",
    "www.customer.example",
    q,
  );
  assert.ok(composed);
  assert.match(composed!.answer.directAnswer, /pause|åpne/i);
  assert.doesNotMatch(composed!.answer.directAnswer, /finner ikke et konkret/i);

  // Negatives: credential-like answers and hidden field values stay out of FAQ harvest
  assert.equal(
    extractPublicFaqPairsFromHtml(
      `<script>{"question":"Hva koster X?","answer":"api_key=sk_live_abcdefghijklmnop"}</script>`,
    ).length,
    0,
  );
  assert.doesNotMatch(
    extractPublicPageFromHtml(
      `<html><body><main><p>Offentlig desk-info.</p></main>
       <input type="hidden" value="session_id=abc123secrettoken" />
       <script>{"question":"Hva er Desk Pass?","answer":"Bearer eyJhbGciOiJIUzI1NiJ9.payloadsig"}</script>
       </body></html>`,
      "no",
    ).bodyText,
    /session_id=|Bearer eyJ|sk_live_/i,
  );

  console.log("faq-extraction-repair.test.ts: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
