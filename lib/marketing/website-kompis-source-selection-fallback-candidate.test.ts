import assert from "node:assert/strict";
import { createRequire } from "node:module";
import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";
import type { WebsiteKompisPublicPageContext } from "@/lib/marketing/website-kompis-public-page-context";

const require = createRequire(import.meta.url);
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

const HOST = "https://customer.example";

function faq(
  partial: Partial<PublicCompanionTenantFaqRow> &
    Pick<PublicCompanionTenantFaqRow, "item_id" | "title" | "answer">,
): PublicCompanionTenantFaqRow {
  return {
    category: "public",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 40,
    matched_reason: "token_match",
    ...partial,
  };
}

function profilePage(name: string, slug: string): WebsiteKompisPublicPageContext {
  return {
    pathname: `/profiles/${slug}`,
    title: name,
    canonicalUrl: `${HOST}/profiles/${slug}`,
    surface: "public",
    locale: "no",
    headings: [{ level: 1, text: name }],
    textSnippets: [`${name} is the public profile on this page.`],
  };
}

async function main() {
  const { buildPublicCompanionTenantFaqResponse, isRelevantPublicCompanionTenantFaqResult } =
    await import("@/lib/marketing/public-companion-tenant-faq");
  const { buildWebsiteKompisEvidencePack } = await import(
    "@/lib/marketing/website-kompis-grounded-answer"
  );
  const { buildWebsiteKompisSafeFallbackResponse } = await import(
    "@/lib/marketing/website-kompis-public-boundary"
  );
  const {
    isWebsiteKompisExplicitCurrentPageQuestion,
    tryBuildWebsiteKompisCurrentPublicPageAnswer,
    websiteKompisPublicPageSourceRoute,
  } = await import("@/lib/marketing/website-kompis-public-page-context");
  const { mapWebsiteCompanionApiResponse } = await import(
    "@/lib/marketing/website-companion-chat"
  );

  function widgetSources(sources: Array<{ title: string; route: string }>, directAnswer: string) {
    return mapWebsiteCompanionApiResponse({
      answer: { directAnswer, explanation: null, steps: [] },
      actions: [],
      sources,
    }).sources;
  }

  const countryFaq = faq({
    item_id: "11111111-1111-4111-8111-111111111111",
    title: "Model function by country",
    answer:
      "Model-funksjonen kan brukes i alle land. Model-funktionen kan bruges i alle lande. The model function can be used in all countries.",
    source_url: `${HOST}/faq/model-countries`,
    locale: "no",
    score: 48,
  });

  const imageFaq = faq({
    item_id: "22222222-2222-4222-8222-222222222222",
    title: "Nakenbilder",
    answer: "Nakenbilder av modellen kan deles med alle.",
    source_url: `${HOST}/faq/images`,
    locale: "no",
    score: 16,
  });

  const consentFaq = faq({
    item_id: "33333333-3333-4333-8333-333333333333",
    title: "Samtykke og rettigheter",
    answer: "Regler som gjelder for samtykke og rettigheter står på denne siden.",
    source_url: `${HOST}/faq/consent`,
    locale: "no",
    score: 44,
  });

  const unrelatedModelFaq = faq({
    item_id: "44444444-4444-4444-8444-444444444444",
    title: "Hvilken modell ser jeg på nå?",
    answer: "Denne siden viser modellen.",
    source_url: `${HOST}/faq/which-model`,
    locale: "no",
    score: 35,
  });

  const otherTenantFaq = faq({
    item_id: "55555555-5555-4555-8555-555555555555",
    title: "Other tenant notice",
    answer: "This row belongs to another tenant and does not mention consent or countries.",
    source_url: "https://other.example/faq/notice",
    locale: "en",
    score: 99,
  });

  const angel = profilePage("Angel", "angel");
  const connie = profilePage("Connie", "connie");

  const angelAnswer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
    question: "Who is Angel?",
    pageContext: angel,
    locale: "en",
  });
  assert.ok(angelAnswer);
  assert.match(angelAnswer!.answer.directAnswer, /Angel/);
  const angelCards = widgetSources(angelAnswer!.sources, angelAnswer!.answer.directAnswer);
  assert.equal(angelCards.length, 1);
  assert.equal(angelCards[0]?.href, `${HOST}/profiles/angel`);
  assert.equal(angelCards[0]?.title, "Angel");

  const connieAnswer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
    question: "Hvem er Connie?",
    pageContext: connie,
    locale: "da",
  });
  assert.ok(connieAnswer);
  assert.match(connieAnswer!.answer.directAnswer, /Connie/);
  const connieCards = widgetSources(connieAnswer!.sources, connieAnswer!.answer.directAnswer);
  assert.equal(connieCards[0]?.href, `${HOST}/profiles/connie`);
  assert.notEqual(connieCards[0]?.href, angelCards[0]?.href);

  const profileQuestions = [
    { question: "Hvilken modell ser jeg på nå?", page: angel, name: "Angel", locale: "no" },
    { question: "Hvilken model kigger jeg på nu?", page: connie, name: "Connie", locale: "da" },
    { question: "Which model am I looking at now?", page: angel, name: "Angel", locale: "en" },
  ];
  for (const item of profileQuestions) {
    assert.equal(isWebsiteKompisExplicitCurrentPageQuestion(item.question), true);
    const answer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
      question: item.question,
      pageContext: item.page,
      locale: item.locale,
      verifiedHost: "customer.example",
    });
    assert.ok(answer);
    assert.match(answer!.answer.directAnswer, new RegExp(item.name));
    assert.notEqual(answer!.sources[0]?.route, "website-kompis-current-page");
    const cards = widgetSources(answer!.sources, answer!.answer.directAnswer);
    assert.equal(cards[0]?.href, item.page.canonicalUrl);
    const pack = buildWebsiteKompisEvidencePack({
      question: item.question,
      locale: item.locale,
      faqRows: [imageFaq, countryFaq, unrelatedModelFaq, otherTenantFaq],
      pageContext: item.page,
      verifiedHost: "customer.example",
    });
    assert.equal(pack.evidence.some((entry) => entry.title === "Nakenbilder"), false);
    assert.ok(pack.evidence.some((entry) => entry.kind === "current-page" && entry.url === item.page.canonicalUrl));
  }
  assert.equal(
    websiteKompisPublicPageSourceRoute({
      canonicalUrl: "javascript:alert(1)",
      pathname: "/profiles/angel",
    }),
    "/profiles/angel",
  );
  assert.equal(
    websiteKompisPublicPageSourceRoute({
      canonicalUrl: "website-kompis-current-page",
      pathname: "/profiles/angel",
    }),
    "/profiles/angel",
  );

  assert.equal(
    websiteKompisPublicPageSourceRoute(
      {
        canonicalUrl: "https://other.example/profiles/angel",
        pathname: "/profiles/angel",
      },
      "customer.example",
    ),
    "/profiles/angel",
  );
  assert.equal(
    websiteKompisPublicPageSourceRoute(
      {
        canonicalUrl: "//other.example/profiles/angel",
        pathname: "/profiles/angel",
      },
      "customer.example",
    ),
    "/profiles/angel",
  );
  assert.equal(
    websiteKompisPublicPageSourceRoute(
      {
        canonicalUrl: `${HOST}/admin/users`,
        pathname: "/profiles/angel",
      },
      "customer.example",
    ),
    "/profiles/angel",
  );
  assert.equal(
    tryBuildWebsiteKompisCurrentPublicPageAnswer({
      question: "Hvilken modell ser jeg på nå?",
      pageContext: { ...angel, pathname: "/admin/users", canonicalUrl: `${HOST}/admin/users` },
      locale: "no",
      verifiedHost: "customer.example",
    }),
    null,
  );
  assert.equal(
    buildPublicCompanionTenantFaqResponse(
      [faq({ ...countryFaq, source_url: "https://other.example/faq/model-countries" })],
      "no",
      "customer.example",
    ).sources.length,
    0,
  );
  assert.equal(
    buildPublicCompanionTenantFaqResponse(
      [faq({ ...countryFaq, source_url: "javascript:alert(1)" })],
      "no",
      "customer.example",
    ).sources.length,
    0,
  );
  assert.equal(
    buildPublicCompanionTenantFaqResponse(
      [faq({ ...countryFaq, source_url: `${HOST}/admin/users` })],
      "no",
      "customer.example",
    ).sources.length,
    0,
  );

  const priceFaq = faq({
    item_id: "66666666-6666-4666-8666-666666666666",
    title: "Pris for medlemskap",
    answer: "Medlemskapet koster 100 kroner i måneden.",
    source_url: `${HOST}/faq/price`,
    score: 42,
  });
  const priceQuestion = "Hva koster medlemskapet?";
  assert.equal(isRelevantPublicCompanionTenantFaqResult([imageFaq], priceQuestion), false);
  assert.equal(isRelevantPublicCompanionTenantFaqResult([priceFaq], priceQuestion), true);
  const pricePack = buildWebsiteKompisEvidencePack({
    question: priceQuestion,
    locale: "no",
    verifiedHost: "customer.example",
    faqRows: [imageFaq, countryFaq, priceFaq],
    pageContext: angel,
  });
  assert.equal(pricePack.evidence.some((entry) => entry.title === "Nakenbilder"), false);
  assert.ok(pricePack.evidence.some((entry) => entry.url === priceFaq.source_url));

  const followPack = buildWebsiteKompisEvidencePack({
    question: "Og der?",
    locale: "no",
    verifiedHost: "customer.example",
    recentContext: [{ role: "user", text: "Kan Model-funksjonen brukes i alle land?" }],
    faqRows: [imageFaq, countryFaq],
    pageContext: connie,
  });
  assert.equal(followPack.evidence.some((entry) => entry.title === "Nakenbilder"), false);
  assert.ok(followPack.evidence.some((entry) => entry.url === countryFaq.source_url));

  const norwegianOnly = faq({
    item_id: "77777777-7777-4777-8777-777777777777",
    title: "Funksjonen",
    answer: "Funksjonen brukes her.",
    source_url: `${HOST}/faq/function`,
    score: 40,
  });
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([norwegianOnly], "Kan funktionen bruges i Danmark?"),
    false,
  );
  const stemOnly = faq({
    item_id: "88888888-8888-4888-8888-888888888888",
    title: "Modellen",
    answer: "Modellen vises her.",
    source_url: `${HOST}/faq/stem`,
    score: 40,
  });
  assert.equal(isRelevantPublicCompanionTenantFaqResult([stemOnly], "Which model is this?"), false);

  const consentQuestion = "Hvilke regler gjelder for samtykke og rettigheter?";
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([unrelatedModelFaq, otherTenantFaq], consentQuestion),
    false,
  );
  const consentGap = buildWebsiteKompisSafeFallbackResponse("da", "customer.example");
  assert.match(consentGap.answer.directAnswer, /offentliggjort|tilstrekkelig|nok/i);
  assert.equal(consentGap.sources.length, 0);
  assert.deepEqual(widgetSources(consentGap.sources, consentGap.answer.directAnswer), []);
  const consentPack = buildWebsiteKompisEvidencePack({
    question: consentQuestion,
    locale: "da",
    faqRows: [unrelatedModelFaq, otherTenantFaq, imageFaq],
    pageContext: angel,
  });
  assert.equal(
    consentPack.evidence.some((item) => item.title === "Nakenbilder" || item.title.includes("modell")),
    false,
  );

  const countryQuestions = [
    "Kan Model-funksjonen brukes i alle land?",
    "Kan Model-funktionen bruges i alle lande?",
    "Can the model function be used in all countries?",
  ];
  for (const question of countryQuestions) {
    assert.equal(isWebsiteKompisExplicitCurrentPageQuestion(question), false);
    assert.equal(isRelevantPublicCompanionTenantFaqResult([imageFaq], question), false);
    assert.equal(isRelevantPublicCompanionTenantFaqResult([countryFaq], question), true);
    const pack = buildWebsiteKompisEvidencePack({
      question,
      locale: question.includes("bruges") ? "da" : question.includes("Can") ? "en" : "no",
      faqRows: [imageFaq, countryFaq, otherTenantFaq],
      pageContext: connie,
    });
    assert.equal(pack.evidence.some((item) => item.title === "Nakenbilder"), false);
    assert.equal(pack.evidence.some((item) => item.title === "Other tenant notice"), false);
    assert.ok(pack.evidence.some((item) => item.url === countryFaq.source_url));
  }

  const internationalFaq = faq({
    item_id: "55555555-5555-4555-8555-555555555555",
    title: "Internasjonale leveranser",
    answer: "Vi sender internasjonale leveranser til registrerte land.",
    source_url: `${HOST}/faq/international`,
  });
  const membershipFaq = faq({
    item_id: "66666666-6666-4666-8666-666666666666",
    title: "Medlemskap og priser",
    answer: "Medlemskap fornyes årlig.",
    source_url: `${HOST}/faq/membership`,
  });
  const imageStemFaq = faq({
    item_id: "77777777-7777-4777-8777-777777777777",
    title: "Nakenbilde",
    answer: "Regler for ett nakenbilde på egen profil.",
    source_url: `${HOST}/faq/image-stem`,
  });
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([internationalFaq], "Hvordan kobler jeg til internett?"),
    false,
  );
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([membershipFaq], "Hvor mange medlemmer kan jeg invitere?"),
    false,
  );
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([imageStemFaq], "Hva gjelder for nakenbilder?"),
    true,
  );
  assert.equal(
    isRelevantPublicCompanionTenantFaqResult(
      [faq({ ...countryFaq, title: "Modell", answer: "En modell er et eksempel." })],
      "Which model is used?",
    ),
    false,
  );

  const imageQuestion = "Hva gjelder for nakenbilder?";
  assert.equal(isRelevantPublicCompanionTenantFaqResult([imageFaq], imageQuestion), true);
  assert.equal(isRelevantPublicCompanionTenantFaqResult([countryFaq], imageQuestion), false);
  const imagePack = buildWebsiteKompisEvidencePack({
    question: imageQuestion,
    locale: "no",
    faqRows: [imageFaq, countryFaq, otherTenantFaq],
    pageContext: angel,
  });
  assert.ok(imagePack.evidence.some((entry) => entry.url === imageFaq.source_url));
  assert.equal(imagePack.evidence.some((entry) => entry.url === countryFaq.source_url), false);
  const imageCards = widgetSources(
    [{ title: imageFaq.title, route: imageFaq.source_url! }],
    imageFaq.answer,
  );
  assert.equal(imageCards[0]?.href, `${HOST}/faq/images`);

  const danishQuestion = "Kan Model-funktionen bruges i alle lande?";
  assert.equal(countryFaq.locale, "no");
  assert.equal(isRelevantPublicCompanionTenantFaqResult([countryFaq], danishQuestion), true);

  const positive = buildPublicCompanionTenantFaqResponse([countryFaq], "no");
  const positiveCards = widgetSources(positive.sources, positive.answer.directAnswer);
  assert.equal(positiveCards.length, 1);
  assert.equal(positiveCards[0]?.href, `${HOST}/faq/model-countries`);
  assert.match(positive.answer.directAnswer, /land/);

  const consentPositive = buildPublicCompanionTenantFaqResponse([consentFaq], "no");
  assert.equal(
    widgetSources(consentPositive.sources, consentPositive.answer.directAnswer)[0]?.href,
    `${HOST}/faq/consent`,
  );

  const noUrl = buildPublicCompanionTenantFaqResponse([faq({ ...countryFaq, source_url: null })], "no");
  assert.equal(noUrl.sources.length, 0);
  assert.equal(
    widgetSources([{ title: "nettstedet", route: "website-kompis-safe-fallback" }], "gap").length,
    0,
  );
  assert.equal(isRelevantPublicCompanionTenantFaqResult([otherTenantFaq], countryQuestions[0]!), false);
}

main();
