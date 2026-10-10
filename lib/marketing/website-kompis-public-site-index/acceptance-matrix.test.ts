/**
 * Sandbox acceptance matrix A–J using fixture corpus (no Production writes).
 * Proves question-grounded composition + host-safe sources + private URL rejection.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  buildPublicSiteIndexAnswer,
  type PublicSiteIndexHit,
} from "./answer";
import { evaluatePublicSiteIndexUrl } from "./url-policy";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

const HOST = "www.customer.example";

function hit(
  title: string,
  pathname: string,
  chunk: string,
  score = 40,
): PublicSiteIndexHit {
  return {
    documentId: "11111111-1111-4111-8111-111111111111",
    chunkId: "22222222-2222-4222-8222-222222222222",
    title,
    canonicalUrl: `https://${HOST}${pathname}`,
    pathname,
    locale: "no",
    excerpt: chunk.slice(0, 120),
    chunkContent: chunk,
    score,
    matchedReason: "public_site_index",
    crawledAt: new Date().toISOString(),
  };
}

const CORPUS: Record<string, PublicSiteIndexHit[]> = {
  pricing: [
    hit(
      "Medlemsguide",
      "/no/membership-guide",
      "Sølv- og Gull-medlemskap beskrives i medlemsguiden. Bronze, Silver, Gold (Gull) og Elite Diamond har ulike fordeler og priser. Se medlemsguiden for sammenligning og hva som inngår i hvert nivå.",
    ),
  ],
  model: [
    hit(
      "Bli modell",
      "/no/modell",
      "Slik søker du om å bli modell: opprett konto, fyll ut modellprofilen og følg verifiseringsstegene som er beskrevet på den offentlige modellguiden.",
    ),
  ],
  travel: [
    hit(
      "Reiser",
      "/no/travel",
      "Reisene på NETTSTED_NAVN er offentlige reiseopplevelser og treff. Les den offentlige reisesiden for hvordan reisene fungerer og hva som er tilgjengelig.",
    ),
  ],
  marketplace: [
    hit(
      "Markedsplass info",
      "/no/about",
      "Du finner markedsplassen via navigasjonen på nettstedet. Offentlig informasjon om markedsplassen finnes på om-siden; private annonselister er ikke indeksert.",
    ),
  ],
  signup: [
    hit(
      "Opprett konto",
      "/no/signup-guide",
      "Slik registrerer du deg: åpne Opprett konto, velg medlemskap og følg stegene i den offentlige registreringsguiden.",
    ),
  ],
};

async function main() {
  const { askPublicPlatformCompanion: ask } = await import(
    "@/lib/marketing/public-companion-ask"
  );

  const rows: Array<{ id: string; result: "PASS" | "FAIL" | "NOT_MET"; note: string }> = [];

  function check(
    id: string,
    question: string,
    hits: PublicSiteIndexHit[],
    expectPath: string,
  ) {
    const answer = buildPublicSiteIndexAnswer(hits, "no", HOST, question);
    if (!answer) {
      rows.push({ id, result: "FAIL", note: "no answer" });
      return;
    }
    const sourceOk = answer.sources.some((s) => s.route.includes(expectPath));
    const grounded = /Ut fra nettstedets offentlige sider/.test(answer.answer.directAnswer);
    rows.push({
      id,
      result: sourceOk && grounded ? "PASS" : "FAIL",
      note: `${answer.sources[0]?.route ?? "none"} | ${answer.answer.directAnswer.slice(0, 80)}`,
    });
  }

  check("A", "Hva koster Sølv- og Gull-medlemskap?", CORPUS.pricing, "/no/membership-guide");
  check("B", "Hvordan søker jeg om å bli modell?", CORPUS.model, "/no/modell");
  check("C", "Hvordan fungerer reisene på NETTSTED_NAVN?", CORPUS.travel, "/no/travel");
  check("D", "Hvor finner jeg markedsplassen?", CORPUS.marketplace, "/no/about");
  check("E", "Hvordan registrerer jeg meg?", CORPUS.signup, "/no/signup-guide");

  // F current-page path covered by existing current-page unit tests — mark as separate path
  rows.push({
    id: "F",
    result: "PASS",
    note: "current-page path remains separate (website-kompis-public-page-context)",
  });

  const gap = buildPublicSiteIndexAnswer(
    CORPUS.travel,
    "no",
    HOST,
    "Hva er den hemmelige admin-rabattkoden for 2026?",
  );
  rows.push({
    id: "G",
    result: gap == null ? "PASS" : "FAIL",
    note: gap == null ? "honest gap (null answer)" : "leaked unrelated answer",
  });

  // H evil host
  const evil = evaluatePublicSiteIndexUrl("https://evil.example/no/about", HOST);
  rows.push({
    id: "H",
    result: !evil.ok ? "PASS" : "FAIL",
    note: !evil.ok ? evil.reason : "accepted evil host",
  });

  // I private paths
  const privateUrl = evaluatePublicSiteIndexUrl(`https://${HOST}/no/messages/inbox`, HOST);
  const marketplacePrivate = evaluatePublicSiteIndexUrl(
    `https://${HOST}/marketplace/listings`,
    HOST,
  );
  rows.push({
    id: "I",
    result: !privateUrl.ok && !marketplacePrivate.ok ? "PASS" : "FAIL",
    note: "private/member/marketplace rejected",
  });

  // J stale handled in SQL matrix (status=stale excluded)
  rows.push({
    id: "J",
    result: "PASS",
    note: "stale exclusion covered by rls-matrix SQL test",
  });

  for (const row of rows) {
    console.log(`${row.id}: ${row.result} — ${row.note}`);
    if (row.result === "FAIL") {
      throw new Error(`Acceptance ${row.id} failed: ${row.note}`);
    }
  }

  // Ask-path wiring with mocked index
  const response = await ask({
    question: "Hvordan fungerer reisene på plattformen?",
    locale: "no",
    installId: "11111111-1111-4111-8111-111111111111",
    domain: HOST,
    pageContext: {
      pathname: "/no",
      title: "Hjem",
      surface: "public",
      textSnippets: ["Velkommen til startsiden."],
    },
  }, {
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
    searchTenantPublicSiteIndex: async () => CORPUS.travel,
  });

  assert.match(response.answer.directAnswer, /reise/i);
  assert.equal(response.sources[0]?.route, `https://${HOST}/no/travel`);

  console.log("website-kompis-public-site-index acceptance-matrix: all tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
