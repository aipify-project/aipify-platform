import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { APP_PORTAL_NAV } from "@/lib/app-portal/nav-config";
import {
  ACCEPTANCE_QUESTION_ARTICLE_MAP,
  PLATFORM_KNOWLEDGE_CORPUS,
  PLATFORM_ROUTE_REGISTRY,
  buildPlatformAnswer,
  getCanonicalPricingSource,
  getPublishedPlanPrices,
  resetUnansweredQuestionBufferForTests,
  resolveArticleIdForQuery,
  resolvePlatformCorpus,
  searchPlatformKnowledge,
} from "@/lib/companion-platform-knowledge";
import { createTranslator } from "@/lib/i18n/translate";

const ROOT = process.cwd();
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

const NORWEGIAN_ACCEPTANCE_QUESTIONS = [
  "Hva er Aipify?",
  "Hva kan Aipify hjelpe meg med?",
  "Hvordan fungerer APP-panelet?",
  "Hvordan legger jeg til ansatte?",
  "Hvordan endrer jeg roller?",
  "Hvordan oppgraderer jeg?",
  "Hva koster abonnementet?",
  "Hvilket abonnement har jeg?",
  "Hvor finner jeg fakturaen?",
  "Hvor finner jeg kvitteringen?",
  "Hvordan kobler jeg til Shopify?",
  "Hvordan aktiverer jeg 2FA?",
  "Hvordan installerer jeg Aipify Web App?",
  "Hvordan kontakter jeg support?",
  "Hvor holder Aipify Group AS til?",
  "Hva er et Business Pack?",
  "Hvordan ser jeg hva som har skjedd siden sist?",
  "Hva er et API?",
  "Hvor finner jeg API-nøkkelen?",
  "Hvordan kan Aipify hjelpe meg?",
  "Hvor finner jeg fakturaene mine?",
  "Hvordan oppgraderer jeg abonnementet?",
  "Hva får Aipify tilgang til?",
  "Hvordan kobler jeg til en nettbutikk?",
  "Hvordan oppretter jeg en API-nøkkel?",
  "Hvordan kobler jeg et system til Aipify?",
] as const;

const ENGLISH_ACCEPTANCE_QUESTIONS = [
  "What is Aipify?",
  "How do I upgrade?",
  "Where are my invoices?",
  "How do I enable 2FA?",
  "How do I contact support?",
] as const;

function loadSplit(locale: string) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
}

function getSearchTermsArray(customerApp: Record<string, unknown>, key: string): string[] {
  const pathParts = key.replace(/^customerApp\./, "").split(".");
  let current: unknown = customerApp;
  for (const part of pathParts) {
    if (!current || typeof current !== "object") return [];
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") return current.split("|").map((s) => s.trim()).filter(Boolean);
  return [];
}

function makeSearchOptions(locale: string) {
  const split = loadSplit(locale);
  const dict = { customerApp: split };
  const t = createTranslator(dict);
  return {
    t,
    locale,
    ctx: { locale, userRole: "owner" as const },
    getSearchTermsArray: (key: string) => getSearchTermsArray(split, key),
    subscriptionRaw: {
      subscription: { plan_key: "business", plan_name: "Business", status: "active" },
    },
  };
}

async function runTests() {
  const capabilityHelpCases = [
    "Hva kan Aipify hjelpe meg med?",
    "Hva kan Aipify Companion hjelpe Nordic Example AS med?",
    "What can Aipify help me with?",
    "How can Aipify Companion help Acme?",
  ] as const;

  for (const question of capabilityHelpCases) {
    assert.equal(
      resolveArticleIdForQuery(question),
      "aipify-capabilities",
      `capability help article for: ${question}`,
    );
    const locale = question.startsWith("Hva") || question.includes("Nordic") ? "no" : "en";
    const result = await searchPlatformKnowledge(question, makeSearchOptions(locale));
    assert.equal(
      result.matchedArticleId,
      "aipify-capabilities",
      `capability help search for: ${question}`,
    );
    assert.ok(result.answer.directAnswer.length > 20, `empty capability help answer for: ${question}`);
    assert.doesNotMatch(
      result.answer.directAnswer,
      /Jeg er her med deg/i,
      `capability help must not use lightweight fallback for: ${question}`,
    );
  }

  assert.ok(PLATFORM_ROUTE_REGISTRY.length >= 50, "route registry should cover nav-config");
  for (const route of PLATFORM_ROUTE_REGISTRY) {
    const navItem = APP_PORTAL_NAV.find((n) => n.id === route.routeKey);
    assert.ok(navItem, `missing nav item for ${route.routeKey}`);
    assert.equal(route.href, navItem.href, `href mismatch for ${route.routeKey}`);
  }

  assert.equal(getCanonicalPricingSource(), "lib/marketing/public-pricing.ts");
  assert.ok(getPublishedPlanPrices().starter.amount > 0);
  assert.equal(PLATFORM_KNOWLEDGE_CORPUS.length, 31);

  for (const locale of LOCALES) {
    const split = loadSplit(locale);
    assert.ok(split.companionPlatformKnowledge, `missing split in ${locale}`);
    const articles = (split.companionPlatformKnowledge as Record<string, unknown>).articles;
    assert.ok(articles && typeof articles === "object", `missing articles in ${locale}`);
  }

  resetUnansweredQuestionBufferForTests();

  for (const question of NORWEGIAN_ACCEPTANCE_QUESTIONS) {
    const normalized = question.toLowerCase().replace(/[?!.]+$/, "");
    const expectedId = ACCEPTANCE_QUESTION_ARTICLE_MAP[normalized];
    assert.ok(expectedId, `no article map for: ${question}`);

    const resolved = resolveArticleIdForQuery(question);
    assert.equal(resolved, expectedId, `resolveArticleIdForQuery failed for: ${question}`);

    const result = await searchPlatformKnowledge(question, makeSearchOptions("no"));
    assert.ok(result.answer.directAnswer.length > 20, `empty answer for: ${question}`);
    assert.notEqual(result.answer.directAnswer.toLowerCase(), "no approved knowledge found");
    assert.ok(result.answer.actions.length > 0, `no actions for: ${question}`);
    assert.ok(result.answer.sources.length > 0, `no sources for: ${question}`);

    if (question.toLowerCase().includes("hva er et api")) {
      assert.equal(result.matchedArticleId, "what-is-api", `wrong intent for: ${question}`);
      assert.ok(
        !result.answer.actions.some((a) => a.routeKey === "apiAccess"),
        `definition should not route to API Access for: ${question}`,
      );
    }

    for (const action of result.answer.actions) {
      assert.ok(action.href.startsWith("/app/"), `invalid href ${action.href} for: ${question}`);
      const navMatch = APP_PORTAL_NAV.some((n) => n.href === action.href);
      assert.ok(navMatch, `href not in nav-config: ${action.href} for: ${question}`);
    }
  }

  for (const question of ENGLISH_ACCEPTANCE_QUESTIONS) {
    const result = await searchPlatformKnowledge(question, makeSearchOptions("en"));
    assert.ok(result.answer.directAnswer.length > 20, `empty EN answer for: ${question}`);
    assert.ok(result.answer.actions.length >= 1, `no EN actions for: ${question}`);
  }

  const noSplit = loadSplit("no");
  const t = createTranslator({ customerApp: noSplit });
  const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, t, (key) =>
    getSearchTermsArray(noSplit, key),
  );
  const upgradeArticle = corpus.find((a) => a.id === "upgrade-subscription");
  assert.ok(upgradeArticle);
  const ownerAnswer = buildPlatformAnswer(upgradeArticle, t, { userRole: "owner" }, {
    source: "platform_corpus",
    confidence: "high",
  });
  const staffAnswer = buildPlatformAnswer(upgradeArticle, t, { userRole: "staff" }, {
    source: "platform_corpus",
    confidence: "high",
    restrictedNote: "restricted",
  });
  assert.ok(ownerAnswer.actions.some((a) => a.routeKey === "upgradeOptions"));
  assert.equal(staffAnswer.actions.some((a) => a.routeKey === "upgradeOptions"), false);

  console.log("companion-platform-knowledge.acceptance-tests.ts: all assertions passed");
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
