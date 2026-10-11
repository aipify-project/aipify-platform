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

async function main() {
  installServerOnlyShim();

  const {
    dedupeCompanionSourcesByRoute,
    isProductOrPriceVisitorQuestion,
    looksLikeFaqQuestionList,
    textLooksLikePublishedPrice,
  } = await import("@/lib/marketing/website-kompis-answer-relevance");
  const {
    buildPublicCompanionTenantFaqResponse,
    faqQuestionHasContentOverlap,
    isRelevantPublicCompanionTenantFaqResult,
  } = await import("@/lib/marketing/public-companion-tenant-faq");
  const { siteLabelFromDomain } = await import("@/lib/marketing/website-kompis-site-label");
  const { tryBuildWebsiteKompisCurrentPublicPageAnswer } = await import(
    "@/lib/marketing/website-kompis-public-page-context"
  );
  const { WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX } = await import(
    "@/lib/marketing/website-kompis-embed"
  );

  assert.equal(siteLabelFromDomain("www.example.com"), "Example");
  assert.equal(siteLabelFromDomain("www.unonight.com"), "Unonight");
  assert.notEqual(siteLabelFromDomain("www.unonight.com"), "Www");
  assert.equal(siteLabelFromDomain("www"), null);

  const hubDump =
    "Hva gjør jeg dersom leveringslenken ikke virker?\nHvordan bestiller jeg?\nNår får jeg leveransen?\nKan jeg endre adressen?";
  assert.equal(looksLikeFaqQuestionList(hubDump), true);

  const realNameFaq = {
    item_id: "faq-real-name",
    title: "Kan jeg bruke ekte navn?",
    answer:
      "Du kan bruke et kallenavn eller pseudonym. Ekte navn er ikke påkrevd for offentlig profil.",
    category: "profil",
    content_type: "faq",
    locale: "no",
    source_url: "https://example.com/faq#ekte-navn",
    score: 42,
    matched_reason: "semantic" as const,
  };

  assert.equal(faqQuestionHasContentOverlap("Må jeg bruke ekte navn?", realNameFaq), true);
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([realNameFaq], "Må jeg bruke ekte navn?"),
    true,
  );

  const hubRow = {
    ...realNameFaq,
    item_id: "faq-hub",
    title: "FAQ",
    answer: hubDump,
    score: 55,
  };
  assert.equal(isRelevantPublicCompanionTenantFaqResult([hubRow], "Hva er ledig nå?"), false);

  const faqResponse = buildPublicCompanionTenantFaqResponse(
    [
      {
        ...realNameFaq,
        source_url: "https://example.com/faq#ekte-navn",
      },
      {
        ...realNameFaq,
        item_id: "faq-dup",
        title: "Kan jeg bruke ekte navn?",
        source_url: "https://example.com/faq#ekte-navn",
      },
    ],
    "no",
  );
  assert.equal(faqResponse.sources.length, 1);
  assert.match(faqResponse.answer.directAnswer, /pseudonym|kallenavn|Ekte navn/i);
  assert.doesNotMatch(faqResponse.answer.directAnswer, /leveringslenken/i);

  const ledigFaq = {
    item_id: "faq-ledig",
    title: "Hva er Ledig Nå?",
    answer:
      "Ledig Nå viser om en modell er tilgjengelig for kontakt i et begrenset tidsvindu.",
    category: "funksjoner",
    content_type: "faq",
    locale: "no",
    source_url: "https://example.com/faq#ledig-na",
    score: 48,
    matched_reason: "semantic" as const,
  };
  assert.equal(faqQuestionHasContentOverlap("Hva er ledig nå?", ledigFaq), true);
  assert.equal(isRelevantPublicCompanionTenantFaqResult([ledigFaq], "Hva er ledig nå?"), true);

  assert.equal(isProductOrPriceVisitorQuestion("Hvor mye koster Template upgrade?"), true);
  assert.equal(
    textLooksLikePublishedPrice("Template Upgrade – Premium Profile Design 5 000,00 kr"),
    true,
  );

  const bioOnly = tryBuildWebsiteKompisCurrentPublicPageAnswer({
    question: "Hvor mye koster Template upgrade?",
    pageContext: {
      pathname: "/modell/admin",
      title: "Admin",
      metaDescription: "Official Admin account for platform operations and demos.",
      surface: "public",
      textSnippets: ["Official Admin account for platform operations and demos."],
    },
    locale: "no",
  });
  assert.equal(bioOnly, null);

  const priced = tryBuildWebsiteKompisCurrentPublicPageAnswer({
    question: "Hvor mye koster Template upgrade?",
    pageContext: {
      pathname: "/modell/admin",
      title: "Admin",
      metaDescription: "Official Admin account for platform operations and demos.",
      surface: "public",
      textSnippets: [
        "Official Admin account for platform operations and demos.",
        "Template Upgrade – Premium Profile Design 5 000,00 kr Levering 1 dag",
      ],
    },
    locale: "no",
  });
  assert.ok(priced);
  assert.match(priced!.answer.directAnswer, /5\s*000/);
  assert.match(priced!.answer.directAnswer, /Template Upgrade/i);
  assert.doesNotMatch(priced!.answer.directAnswer, /Official Admin account/i);

  const giftCardGap = tryBuildWebsiteKompisCurrentPublicPageAnswer({
    question: "hva er prisen på gavekortene til bruker admin?",
    pageContext: {
      pathname: "/modell/admin",
      title: "Admin",
      metaDescription: "Official Admin account for platform operations and demos.",
      surface: "public",
      textSnippets: [
        "Template Upgrade – Premium Profile Design 5 000,00 kr Levering 1 dag",
      ],
    },
    locale: "no",
  });
  assert.equal(giftCardGap, null);

  const deduped = dedupeCompanionSourcesByRoute([
    { title: "FAQ", route: "https://example.com/faq" },
    { title: "FAQ again", route: "https://example.com/faq/" },
    { title: "Guide", route: "https://example.com/guides/travel" },
  ]);
  assert.equal(deduped.length, 2);

  assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX, 720);

  console.log("website-kompis-context-faq-answer-repair-02.test.ts: all assertions passed");
}

void main();
