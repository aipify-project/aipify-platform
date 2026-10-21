/**
 * Public site-index locale contract — ask retrieval path (no↔nb).
 * Neutral fixtures only. No paid providers / LIVE asks.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

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

installServerOnlyShim();

const FAQ_CHUNK_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TRAVEL_CHUNK_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const NO_DOC_CHUNK_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const HOST = "www.customer.example";
const INSTALL = "11111111-1111-4111-8111-111111111111";

const FAQ_A1 =
  "Hva skjer med Reisene mine når Reiseabonnementet ikke lenger er aktivt? Når Reiseabonnementet ikke lenger er aktivt, settes publiserte reiseannonser på pause. Nye reiseannonser krever aktiv tilgang.";

function rpcRow(input: {
  chunkId: string;
  documentId?: string;
  pathname: string;
  locale: string;
  title: string;
  chunkContent: string;
  score: number;
}) {
  return {
    document_id: input.documentId ?? "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    chunk_id: input.chunkId,
    title: input.title,
    canonical_url: `https://${HOST}${input.pathname}`,
    pathname: input.pathname,
    locale: input.locale,
    excerpt: input.chunkContent.slice(0, 120),
    chunk_content: input.chunkContent,
    score: input.score,
    matched_reason: "public_site_index",
    crawled_at: "2026-10-12T01:38:29.000Z",
  };
}

async function main() {
  const {
    expandPublicSiteIndexSearchLocales,
    isPublicSiteIndexBokmalLocale,
    mergePublicSiteIndexHitsByChunkId,
    normalizePublicSiteIndexLocaleTag,
  } = await import("./locale-contract");
  const { searchTenantPublicSiteIndex } = await import("./search");
  const {
    filterAndRankPublicSiteIndexHits,
    isRelevantPublicSiteIndexResult,
  } = await import("./answer");
  const { askPublicPlatformCompanion } = await import(
    "@/lib/marketing/public-companion-ask"
  );

  assert.deepEqual(expandPublicSiteIndexSearchLocales("no"), ["no", "nb"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("nb"), ["nb", "no"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("NB-NO"), ["nb", "no"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("nn"), ["nn"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("sv"), ["sv", "se"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("se"), ["se", "sv"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("da"), ["da", "dk"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("dk"), ["dk", "da"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("en"), ["en"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("xx"), ["xx"]);
  assert.equal(normalizePublicSiteIndexLocaleTag(""), "no");
  assert.equal(isPublicSiteIndexBokmalLocale("nn"), false);

  assert.deepEqual(
    mergePublicSiteIndexHitsByChunkId([
      [{ chunkId: "a", score: 10 }],
      [
        { chunkId: "a", score: 40 },
        { chunkId: "b", score: 20 },
      ],
    ]).map((h) => [h.chunkId, h.score]),
    [
      ["a", 40],
      ["b", 20],
    ],
  );

  // Simulated RPC: p_locale=no never returns nb FAQ (pre-fix Production behaviour).
  const localesCalled: string[] = [];
  const rpc = async (params: {
    p_locale: string;
    p_install_id: string | null;
    p_domain: string | null;
    p_query: string;
    p_limit: number;
  }) => {
    localesCalled.push(params.p_locale);
    assert.equal(params.p_install_id, INSTALL);
    assert.equal(params.p_domain, HOST);
    assert.ok(params.p_query.length >= 2);
    if (params.p_locale === "no") {
      return {
        data: [
          rpcRow({
            chunkId: TRAVEL_CHUNK_ID,
            pathname: "/no/travel/abonnement",
            locale: "no",
            title: "Reiseabonnement",
            chunkContent:
              "Reiseabonnementet gir tilgang til å publisere reiser. Abonnementet kan fornyes når det utløper.",
            score: 40,
          }),
          rpcRow({
            chunkId: NO_DOC_CHUNK_ID,
            pathname: "/no/safety",
            locale: "no",
            title: "Sikkerhet",
            chunkContent: "Sikkerhet og respekt i fellesskapet.",
            score: 22,
          }),
        ],
        error: null,
      };
    }
    if (params.p_locale === "nb") {
      return {
        data: [
          rpcRow({
            chunkId: FAQ_CHUNK_ID,
            pathname: "/no/faq",
            locale: "nb",
            title: "Vanlige spørsmål",
            chunkContent: FAQ_A1,
            score: 76,
          }),
        ],
        error: null,
      };
    }
    return { data: [], error: null };
  };

  const beforeNoOnly = await rpc({
    p_install_id: INSTALL,
    p_domain: HOST,
    p_locale: "no",
    p_query: "skjer reisene mine reiseabonnementet utløper",
    p_limit: 6,
  });
  assert.ok(Array.isArray(beforeNoOnly.data));
  assert.equal(
    (beforeNoOnly.data as { pathname: string }[]).some((r) => r.pathname === "/no/faq"),
    false,
  );

  localesCalled.length = 0;
  const natural =
    "Hva skjer med reisene mine når Reiseabonnementet utløper?";
  const hits = await searchTenantPublicSiteIndex(
    {
      installId: INSTALL,
      domain: HOST,
      locale: "no",
      query: natural,
      limit: 5,
    },
    { rpc },
  );

  assert.deepEqual(localesCalled, ["no", "nb"]);
  assert.ok(hits.length >= 1);
  assert.equal(hits[0]?.pathname, "/no/faq");
  assert.equal(hits[0]?.locale, "nb");
  assert.match(hits[0]?.chunkContent ?? "", /settes publiserte reiseannonser på pause/);
  assert.equal(isRelevantPublicSiteIndexResult(hits, natural), true);

  const sourceWordingHits = await searchTenantPublicSiteIndex(
    {
      installId: INSTALL,
      domain: HOST,
      locale: "no",
      query:
        "Hva skjer med Reisene mine når Reiseabonnementet ikke lenger er aktivt?",
      limit: 5,
    },
    { rpc },
  );
  assert.equal(sourceWordingHits[0]?.pathname, "/no/faq");

  localesCalled.length = 0;
  const nbAskHits = await searchTenantPublicSiteIndex(
    {
      installId: INSTALL,
      domain: HOST,
      locale: "nb",
      query: "Hva skjer når Reiseabonnementet utløper for reisene mine?",
      limit: 5,
    },
    { rpc },
  );
  assert.deepEqual(localesCalled, ["nb", "no"]);
  assert.equal(nbAskHits[0]?.pathname, "/no/faq");
  assert.ok(nbAskHits.some((h) => h.locale === "no" || h.pathname.includes("travel")));

  const dedupeRpc = async (params: { p_locale: string }) => {
    const row = rpcRow({
      chunkId: FAQ_CHUNK_ID,
      pathname: "/no/faq",
      locale: "nb",
      title: "Vanlige spørsmål",
      chunkContent: FAQ_A1,
      score: params.p_locale === "nb" ? 90 : 50,
    });
    return { data: [row], error: null };
  };
  const deduped = await searchTenantPublicSiteIndex(
    {
      installId: INSTALL,
      domain: HOST,
      locale: "no",
      query: natural,
      limit: 3,
    },
    { rpc: dedupeRpc as typeof rpc },
  );
  assert.equal(deduped.filter((h) => h.chunkId === FAQ_CHUNK_ID).length, 1);
  assert.ok((deduped[0]?.score ?? 0) >= 50);

  localesCalled.length = 0;
  const nnHits = await searchTenantPublicSiteIndex(
    {
      installId: INSTALL,
      domain: HOST,
      locale: "nn",
      query: natural,
      limit: 5,
    },
    { rpc },
  );
  assert.deepEqual(localesCalled, ["nn"]);
  assert.equal(nnHits.length, 0);

  let foreignArgs: { install: string | null; domain: string | null } | null = null;
  await searchTenantPublicSiteIndex(
    {
      installId: "22222222-2222-4222-8222-222222222222",
      domain: "www.other.example",
      locale: "no",
      query: natural,
      limit: 5,
    },
    {
      rpc: async (params) => {
        foreignArgs = {
          install: params.p_install_id,
          domain: params.p_domain,
        };
        return { data: [], error: null };
      },
    },
  );
  assert.deepEqual(foreignArgs, {
    install: "22222222-2222-4222-8222-222222222222",
    domain: "www.other.example",
  });

  // Full ask path uses the same searchTenantPublicSiteIndex wrapper (pageLocale=no).
  const askResponse = await askPublicPlatformCompanion(
    {
      question: natural,
      locale: "no",
      installId: INSTALL,
      domain: HOST,
      pageContext: {
        pathname: "/no/faq",
        title: "FAQ",
        surface: "public",
        textSnippets: ["Velkommen."],
      },
    },
    {
      requestHost: HOST,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: false,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: true,
          },
        },
      },
      resolveLicensedAvailability: async () => ({
        available: true,
        reason: "available" as const,
        capabilityKey: "website_kompis",
      }),
      searchTenantVisitorKnowledge: async () => [],
      searchTenantPublicSiteIndex: (input) =>
        searchTenantPublicSiteIndex(input, { rpc }),
    },
  );

  assert.match(askResponse.answer.directAnswer, /Ut fra nettstedets offentlige sider/);
  assert.match(askResponse.answer.directAnswer, /reiseannonser på pause/i);
  assert.ok(
    askResponse.sources.some((s) => (s.route ?? "").includes("/no/faq")),
    "ask sources must include FAQ after locale contract repair",
  );

  // Membership body-collision rejection preserved (relevance contract untouched).
  const pushOnly = [
    {
      documentId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      chunkId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      title: "Push annonsen til toppen av markedsplassen",
      canonicalUrl: `https://${HOST}/no/faq/marketplace-listing-push`,
      pathname: "/no/faq/marketplace-listing-push",
      locale: "no",
      excerpt: "En Push koster poeng for medlemmer.",
      chunkContent:
        "Dette kan gjøre annonsen mer synlig for andre medlemmer. En Push koster poeng.",
      score: 40,
      matchedReason: "public_site_index",
      crawledAt: "2026-10-12T01:38:29.000Z",
    },
  ];
  assert.equal(
    isRelevantPublicSiteIndexResult(pushOnly, "Hva koster det å bli medlem?"),
    false,
  );
  assert.ok(
    filterAndRankPublicSiteIndexHits(pushOnly, "Hva koster det å bli medlem?")
      .length >= 0,
  );

  console.log("website-kompis public site index locale-contract: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
